use crate::ai::debug as dbg;
use crate::ai::phase::evaluate_team_phase;
use crate::ai::{
    kickoff_positions, AiScheduler, BallView, EngineCmd, EngineCmdSink, EnginePlayerView,
    EngineView, Footed, PhaseLayout, PitchView, PlayerAgent, PlayerId, Role, TacticModel, TeamCtx,
    Vec3,
};
use crate::commands::{parse_command, Cmd, CommandBuffer, CommandError, ParseError};
use crate::logging_sink::LoggingSink;
use crate::params::{PITCH_H, PITCH_W};
use crate::physics::{ball::step_ball, interaction, player::step_players, PhysicsContext};
use crate::rng::DeterministicRng;
use crate::rules::{offside::check_offside, referee::update_referee, restarts::handle_restarts};
use crate::snapshot::{self, DeltaBuffer, HashGuard, QuantizedWorld, SnapshotBuffer};
use crate::state::{World, N_PER_TEAM, N_PLAYERS, N_TEAMS};
use crate::types::{DetailedPlayerRole, Foot, PlayerParams, Tactic, TeamId, Vec2};
use log::{info, warn};
use std::f32::consts::PI;

const TACTICS_TEMPLATE_JSON: &str = include_str!("config/tactics_template.json");

pub struct Engine {
    pub world: World,
    _rng: DeterministicRng,
    commands: CommandBuffer,
    physics: PhysicsContext,
    pub ai_active: Vec<bool>,
    last_hash: [u8; 32],
    last_quantized: Option<QuantizedWorld>,
    team_tactics: [TacticModel; N_TEAMS],
    kickoff_pass_dispatched: bool,

    // New AI System
    pub ai_scheduler: AiScheduler,
    pub home_team_ctx: TeamCtx,
    pub away_team_ctx: TeamCtx,
    player_views: Vec<EnginePlayerView>,
}

struct EngineViewState {
    tick: u64,
    pitch: PitchView,
    ball: BallView,
    players: [EnginePlayerView; N_PLAYERS],
}

impl EngineView for EngineViewState {
    fn tick(&self) -> u64 {
        self.tick
    }

    fn pitch(&self) -> PitchView {
        self.pitch
    }

    fn ball(&self) -> BallView {
        self.ball
    }

    fn players(&self) -> &[EnginePlayerView] {
        &self.players
    }
}

fn normalize_range(value: f32, min: f32, max: f32) -> f32 {
    if max <= min {
        return 0.0;
    }
    ((value - min) / (max - min)).clamp(0.0, 1.0)
}

fn normalize_inverse(value: f32, min: f32, max: f32) -> f32 {
    1.0 - normalize_range(value, min, max)
}

fn sync_agent_attributes(agent: &mut PlayerAgent, params: PlayerParams) {
    agent.execution.controllers.loco.max_speed = params.v_max;
    agent.execution.controllers.loco.accel = params.a_max;
    agent.execution.controllers.loco.turn_rate = params.omega_max;

    agent.execution.controllers.ball.first_touch_power = params.pass_speed_max;

    let attrs = &mut agent.ctx.attrs;
    attrs.speed = normalize_range(params.v_max, 6.0, 9.5);
    attrs.accel = normalize_range(params.a_max, 6.0, 9.0);
    attrs.pass = normalize_inverse(params.pass_err_sigma, 0.30, 1.20);
    attrs.dribble = normalize_range(params.ctrl_radius, 0.90, 1.50);
    attrs.stamina_max = normalize_range(params.stamina_max, 90.0, 140.0);
    attrs.height = params.height_m;
    attrs.weight = params.mass_kg;
    attrs.foot = match params.foot {
        Foot::L => Footed::Left,
        Foot::R => Footed::Right,
    };
}

#[derive(Default)]
struct EngineCmdQueue {
    items: Vec<EngineCmd>,
}

impl EngineCmdQueue {
    fn drain(self) -> Vec<EngineCmd> {
        self.items
    }
}

impl EngineCmdSink for EngineCmdQueue {
    fn push(&mut self, cmd: EngineCmd) {
        self.items.push(cmd);
    }
}

impl Engine {
    pub fn new(seed: u64) -> Self {
        let world = World::new(seed);

        // -- Tactics Initialization --
        let home_model = TacticModel::parse_json(TACTICS_TEMPLATE_JSON)
            .expect("failed to parse default tactics template");
        if let Some(mask) = home_model.raw().debug_mask {
            dbg::set_mask(mask);
        }
        let away_model = TacticModel::parse_json(TACTICS_TEMPLATE_JSON)
            .expect("failed to parse default tactics template");

        let mut engine = Self {
            world,
            _rng: DeterministicRng::new(seed),
            commands: CommandBuffer::new(),
            physics: PhysicsContext::new(),
            ai_active: vec![true; N_PLAYERS],
            last_hash: [0; 32],
            last_quantized: None,
            team_tactics: [home_model.clone(), away_model.clone()],
            kickoff_pass_dispatched: false,
            // New AI
            ai_scheduler: AiScheduler::new(),
            home_team_ctx: TeamCtx::default(),
            away_team_ctx: TeamCtx::default(),
            player_views: vec![EnginePlayerView::default(); N_PLAYERS],
        };
        info!("[Engine] Rebuilding initial tactical state");
        engine.rebuild_tactical_state();
        engine.update_hash();
        engine
    }

    fn build_engine_view_state(&self) -> EngineViewState {
        EngineViewState {
            tick: self.world.tick as u64,
            pitch: self.build_pitch_view(),
            ball: self.build_ball_view(),
            players: std::array::from_fn(|idx| self.build_player_view(idx)),
        }
    }

    fn build_pitch_view(&self) -> PitchView {
        PitchView {
            length: PITCH_W,
            width: PITCH_H,
            our_goal: Vec2::new(-PITCH_W * 0.5, 0.0),
            their_goal: Vec2::new(PITCH_W * 0.5, 0.0),
        }
    }

    fn build_ball_view(&self) -> BallView {
        BallView {
            pos: Vec3 {
                x: self.world.bx,
                y: self.world.by,
                z: self.world.bz,
            },
            vel: Vec3 {
                x: self.world.bvx,
                y: self.world.bvy,
                z: self.world.bvz,
            },
        }
    }

    fn build_player_view(&self, idx: usize) -> EnginePlayerView {
        EnginePlayerView {
            id: idx as PlayerId,
            team: self.world.p_team[idx],
            pos: Vec2::new(self.world.px[idx], self.world.py[idx]),
            vel: Vec2::new(self.world.pvx[idx], self.world.pvy[idx]),
            body_angle: self.world.pfacing[idx],
            has_ball: self.world.player_has_ball(idx),
        }
    }

    fn collect_execution_commands<S: EngineCmdSink>(
        team_ctx: &mut TeamCtx,
        tick: u64,
        ai_active: &[bool],
        sink: &mut S,
    ) {
        if team_ctx.comm_broker.inboxes.len() < team_ctx.players.len() {
            team_ctx
                .comm_broker
                .inboxes
                .resize(team_ctx.players.len(), crate::ai::comm::Inbox::default());
        }
        for (local_idx, player) in team_ctx.players.iter_mut().enumerate() {
            player.perception.local_index = local_idx;
            let global_id = player.id as usize;
            if ai_active.get(global_id).copied().unwrap_or(true) {
                player.execution.substep(tick, player.id, sink);
            }
        }
    }

    fn sync_agent_activity(&mut self) {
        for agent in &mut self.home_team_ctx.players {
            let idx = agent.id as usize;
            agent.enabled = self.ai_active.get(idx).copied().unwrap_or(true);
        }
        for agent in &mut self.away_team_ctx.players {
            let idx = agent.id as usize;
            agent.enabled = self.ai_active.get(idx).copied().unwrap_or(true);
        }
    }

    fn refresh_team_contexts(&mut self) {
        let home_quant = &self.world.tactics[TeamId::Home.index()];
        self.home_team_ctx.team_id = TeamId::Home.index() as u8;
        self.home_team_ctx.tactics = Self::tactics_view_from_quant(home_quant);

        let away_quant = &self.world.tactics[TeamId::Away.index()];
        self.away_team_ctx.team_id = TeamId::Away.index() as u8;
        self.away_team_ctx.tactics = Self::tactics_view_from_quant(away_quant);
    }

    fn tactics_view_from_quant(
        quant: &crate::ai::QuantifiedTactics,
    ) -> crate::ai::coach::TacticsView {
        let mut view = crate::ai::coach::TacticsView::default();
        if let Some(pass) = quant.meta_value("pass_distance") {
            view.pass_risk_max = pass;
        }
        if let Some(press) = quant.meta_value("counter_press_bias") {
            view.press_intensity = press;
        }
        if let Some(width) = quant.meta_value("cross_frequency") {
            view.width = (view.width * 0.5) + (width * 0.5);
        }
        view
    }

    fn apply_engine_cmd(&mut self, cmd: EngineCmd) {
        match cmd {
            EngineCmd::RunTo {
                id,
                point,
                max_speed,
            } => {
                let idx = id as usize;
                if idx >= N_PLAYERS {
                    return;
                }
                let origin = Vec2::new(self.world.px[idx], self.world.py[idx]);
                let mut dir = (point - origin).normalize();
                if dir.norm_squared() < 1e-6 {
                    dir = Vec2::new(1.0, 0.0);
                }
                let speed = max_speed.max(0.0);
                self.world.pcommand[idx].target_vel = dir * speed;
            }
            EngineCmd::FaceTo { id, dir } => {
                let idx = id as usize;
                if idx >= N_PLAYERS {
                    return;
                }
                if dir.norm_squared() > 1e-6 {
                    self.world.pfacing[idx] = dir.y.atan2(dir.x);
                }
            }
            EngineCmd::Shield { .. } => {
                // TODO: integrate shield behaviour with physics command state.
            }
            EngineCmd::GroundPass {
                from,
                to,
                lead,
                pace,
            } => {
                let idx = from as usize;
                let recv_idx = to as usize;
                if idx >= N_PLAYERS || recv_idx >= N_PLAYERS {
                    return;
                }
                let receiver_pos = self.world.player_pos(recv_idx);
                let target = receiver_pos + lead;
                interaction::execute_kick(
                    &mut self.world,
                    &mut self.home_team_ctx,
                    &mut self.away_team_ctx,
                    from as u8,
                    target,
                    pace,
                    0.0,
                    false,
                );
            }
            EngineCmd::LoftedPass {
                from,
                to,
                apex,
                pace,
            } => {
                let idx = from as usize;
                let recv_idx = to as usize;
                if idx >= N_PLAYERS || recv_idx >= N_PLAYERS {
                    return;
                }
                let target = self.world.player_pos(recv_idx);
                interaction::execute_kick(
                    &mut self.world,
                    &mut self.home_team_ctx,
                    &mut self.away_team_ctx,
                    from as u8,
                    target,
                    pace,
                    apex,
                    true,
                );
            }
            EngineCmd::ThroughBall {
                from,
                to,
                lead,
                pace,
            } => {
                let recv_idx = to as usize;
                if recv_idx >= N_PLAYERS {
                    return;
                }
                let target = self.world.player_pos(recv_idx) + lead;
                interaction::execute_kick(
                    &mut self.world,
                    &mut self.home_team_ctx,
                    &mut self.away_team_ctx,
                    from as u8,
                    target,
                    pace,
                    0.0,
                    false,
                );
            }
            EngineCmd::Cross { from, zone, pace } => {
                let idx = from as usize;
                if idx >= N_PLAYERS {
                    return;
                }
                let side = if self.world.p_team[idx] == TeamId::Home.index() as u8 {
                    1.0
                } else {
                    -1.0
                };
                let base_x = side * (PITCH_W * 0.5 - 6.0);
                let target = match zone {
                    crate::ai::CrossZone::Near => Vec2::new(base_x, 3.0),
                    crate::ai::CrossZone::PenaltySpot => Vec2::new(side * 0.0, 0.0),
                    crate::ai::CrossZone::Far => Vec2::new(base_x, -3.0),
                    crate::ai::CrossZone::Cutback => Vec2::new(side * (PITCH_W * 0.5 - 12.0), 0.0),
                };
                interaction::execute_kick(
                    &mut self.world,
                    &mut self.home_team_ctx,
                    &mut self.away_team_ctx,
                    from as u8,
                    target,
                    pace,
                    8.0,
                    true,
                );
            }
            EngineCmd::Shoot { from, aim, power } => {
                interaction::execute_kick(
                    &mut self.world,
                    &mut self.home_team_ctx,
                    &mut self.away_team_ctx,
                    from as u8,
                    aim,
                    18.0 + power * 6.0,
                    6.0 * power,
                    true,
                );
            }
            EngineCmd::Tackle { .. } => {
                // TODO: tackle integration with physics system.
            }
        }
    }

    pub fn set_ai_active(&mut self, player_index: usize, active: bool) {
        if let Some(slot) = self.ai_active.get_mut(player_index) {
            *slot = active;
        }
        self.sync_agent_activity();
    }

    pub fn team_tactic(&self, team: TeamId) -> &TacticModel {
        &self.team_tactics[team.index()]
    }

    fn update_player_views(&mut self) {
        if self.player_views.len() != N_PLAYERS {
            self.player_views = vec![EnginePlayerView::default(); N_PLAYERS];
        }
        for idx in 0..N_PLAYERS {
            self.player_views[idx] = self.build_player_view(idx);
        }
    }

    fn map_role(role: &DetailedPlayerRole) -> Role {
        match role {
            DetailedPlayerRole::GK => Role::GK,
            DetailedPlayerRole::LB => Role::LB,
            DetailedPlayerRole::LCB | DetailedPlayerRole::CB => Role::LCB,
            DetailedPlayerRole::RCB => Role::RCB,
            DetailedPlayerRole::RB => Role::RB,
            DetailedPlayerRole::LM | DetailedPlayerRole::LF | DetailedPlayerRole::LW => Role::LW,
            DetailedPlayerRole::LCM => Role::LCM,
            DetailedPlayerRole::RCM | DetailedPlayerRole::CAM => Role::RCM,
            DetailedPlayerRole::RM | DetailedPlayerRole::RF | DetailedPlayerRole::RW => Role::RW,
            DetailedPlayerRole::CDM => Role::CDM,
            DetailedPlayerRole::ST => Role::ST,
        }
    }

    pub fn tick(&mut self) {
        self.world.tick();
        let tick = self.world.tick as u64;

        if self.world.tick % 50 == 0 {
            info!("[Engine] Tick {}", self.world.tick);
        }
        self.world.advance_overrides();
        self.process_commands();

        // --- AI ---
        let home_phase = evaluate_team_phase(&self.world, TeamId::Home);
        let away_phase = evaluate_team_phase(&self.world, TeamId::Away);
        self.world.home_team_phase = home_phase.to_u8();
        self.world.away_team_phase = away_phase.to_u8();
        self.sync_agent_activity();
        self.refresh_team_contexts();

        // 1. ai.execution_substep_20hz(tick, sink);
        let mut cmd_queue = EngineCmdQueue::default();
        {
            let mut logging_sink = LoggingSink {
                inner: &mut cmd_queue,
                tick,
            };
            Self::collect_execution_commands(
                &mut self.home_team_ctx,
                tick,
                &self.ai_active,
                &mut logging_sink,
            );
            Self::collect_execution_commands(
                &mut self.away_team_ctx,
                tick,
                &self.ai_active,
                &mut logging_sink,
            );
        }
        for cmd in cmd_queue.drain() {
            self.apply_engine_cmd(cmd);
        }

        // 2. engine.physics_step();
        step_players(&mut self.world, &self.ai_active);
        step_ball(
            &mut self.world,
            &self.physics.spatial,
            &mut self._rng.as_mut(),
        );

        // Possession update before perception so snapshots see latest control state.
        interaction::update_possession(&mut self.world, &mut self.home_team_ctx, &mut self.away_team_ctx);
        if dbg::mode().as_u8() >= dbg::LogMode::Kpi.as_u8() {
            if let Some(owner_idx) = (0..N_PLAYERS).find(|&idx| self.world.player_has_ball(idx)) {
                dbg::note_has_ball(tick, owner_idx as PlayerId);
            }
        }

        // 3. if tick % 2 == 0 { ai.ai_tick_10hz(tick, engine, sink); }
        if tick % 2 == 0 {
            let engine_view = self.build_engine_view_state();
            self.ai_scheduler
                .tick(tick, &mut self.home_team_ctx, &engine_view);
            self.ai_scheduler
                .tick(tick, &mut self.away_team_ctx, &engine_view);
        }

        // Other stuff
        handle_restarts(&mut self.world);
        self.sync_restart_layouts();
        update_referee(&mut self.world);
        let _offside = check_offside(&self.world);
        self.update_hash();
        self.physics.rebuild_spatial(&self.world);
        self.update_player_views();
    }

    pub fn state_hash(&self) -> [u8; 32] {
        self.last_hash
    }

    fn process_commands(&mut self) {
        let commands_to_process: Vec<Cmd> = self.commands.drain_ready(self.world.tick).collect();
        for cmd in commands_to_process {
            match cmd {
                Cmd::TacticsSet { team, tactic } => {
                    self.apply_tactic_update(team, tactic);
                }
                Cmd::RoleOverride { pid, params, ttl } => {
                    info!("[Engine] Applying role_override pid {} ttl {}", pid, ttl);
                    if let Some(slot) = self.world.prole_override.get_mut(pid as usize) {
                        slot.params = params;
                        slot.ttl = ttl;
                    }
                }
                Cmd::DebugSetMask { mask } => {
                    info!("[Engine] Setting debug_mask to {}", mask);
                    dbg::set_mask(mask);
                }
                Cmd::LoftedPass {
                    player_id,
                    tx,
                    ty,
                    loft,
                } => {
                    info!("[Engine] Lofted pass by pid {}", player_id);
                    interaction::execute_kick(
                        &mut self.world,
                        &mut self.home_team_ctx,
                        &mut self.away_team_ctx,
                        player_id,
                        Vec2::new(tx, ty),
                        14.0,
                        loft.clamp(0.0, 1.0) * 18.0,
                        true,
                    );
                }
                Cmd::GroundPass { player_id, tx, ty } => {
                    info!("[Engine] Ground pass by pid {}", player_id);
                    interaction::execute_kick(
                        &mut self.world,
                        &mut self.home_team_ctx,
                        &mut self.away_team_ctx,
                        player_id,
                        Vec2::new(tx, ty),
                        11.0,
                        0.0,
                        false,
                    );
                }
                Cmd::Shoot {
                    player_id,
                    tx,
                    ty,
                    power,
                } => {
                    info!(
                        "[Engine] Shoot command pid {} power {:.2}",
                        player_id, power
                    );
                    interaction::execute_kick(
                        &mut self.world,
                        &mut self.home_team_ctx,
                        &mut self.away_team_ctx,
                        player_id,
                        Vec2::new(tx, ty),
                        18.0 + 8.0 * power,
                        6.0 * power,
                        true,
                    );
                }
                Cmd::MovePlayerVelocity { pid, vx, vy } => {
                    info!("[Engine] Move velocity command pid {}", pid);
                    if let Some(pcmd) = self.world.pcommand.get_mut(pid as usize) {
                        pcmd.target_vel = Vec2::new(vx, vy);
                    }
                }
                Cmd::MovePlayerTarget { pid, tx, ty } => {
                    //info!("[Engine] Move target command pid {}", pid);
                    if let Some(pcmd) = self.world.pcommand.get_mut(pid as usize) {
                        let player_pos =
                            Vec2::new(self.world.px[pid as usize], self.world.py[pid as usize]);
                        let target_pos = Vec2::new(tx, ty);
                        let direction = (target_pos - player_pos).normalize();
                        let player_params = self.world.p_params[pid as usize];
                        pcmd.target_vel = direction * player_params.v_max;
                    }
                }
            }
        }
    }

    fn apply_tactic_update(&mut self, team: TeamId, tactic: Tactic) {
        info!("[Engine] Updating tactics for {:?}", team);
        if tactic.lineup.len() != N_PER_TEAM {
            warn!(
                "Ignored tactics update for {:?}: lineup length {} does not match {}",
                team,
                tactic.lineup.len(),
                N_PER_TEAM
            );
            return;
        }
        if tactic.roles.len() != N_PER_TEAM {
            warn!(
                "Ignored tactics update for {:?}: roles length {} does not match {}",
                team,
                tactic.roles.len(),
                N_PER_TEAM
            );
            return;
        }

        if let Some(mask) = tactic.debug_mask {
            dbg::set_mask(mask);
        }

        let model = TacticModel::from_tactic(tactic);
        self.team_tactics[team.index()] = model;
        self.rebuild_tactical_state();
    }

    fn rebuild_tactical_state(&mut self) {
        info!("[Engine] Rebuilding tactical state");
        let home_model = &self.team_tactics[TeamId::Home.index()];
        let away_model = &self.team_tactics[TeamId::Away.index()];

        if home_model.lineup().len() != N_PER_TEAM || away_model.lineup().len() != N_PER_TEAM {
            warn!("Cannot rebuild tactical state: invalid lineup length");
            return;
        }
        if home_model.roles().len() != N_PER_TEAM || away_model.roles().len() != N_PER_TEAM {
            warn!("Cannot rebuild tactical state: invalid roles length");
            return;
        }

        self.world
            .initialize_params(home_model.lineup(), away_model.lineup());

        self.world.tactics[TeamId::Home.index()] = home_model.quantified();
        self.world.tactics[TeamId::Away.index()] = away_model.quantified();

        self.rebuild_ai_agents();
        self.refresh_team_contexts();
        self.align_players_for_kickoff();
        self.physics.rebuild_spatial(&self.world);
    }

    fn rebuild_ai_agents(&mut self) {
        let home_model = &self.team_tactics[TeamId::Home.index()];
        let away_model = &self.team_tactics[TeamId::Away.index()];

        self.home_team_ctx.team_id = TeamId::Home.index() as u8;
        self.home_team_ctx.seed = self.world.seed;
        self.home_team_ctx.tactics = crate::ai::coach::TacticsView::default();
        self.home_team_ctx.xt_grid = crate::ai::coach::XtGrid::default();
        self.home_team_ctx.players = (0..N_PER_TEAM)
            .map(|slot| {
                let role = home_model
                    .role_for_slot(slot)
                    .map(Self::map_role)
                    .unwrap_or(Role::Unknown);
                PlayerAgent {
                    id: slot as u16,
                    role,
                    slot_mask: (slot % 2) as u8,
                    ..Default::default()
                }
            })
            .collect();
        self.home_team_ctx.comm_broker.inboxes =
            vec![crate::ai::comm::Inbox::default(); N_PER_TEAM];
        for (idx, agent) in self.home_team_ctx.players.iter_mut().enumerate() {
            agent.perception.local_index = idx;
            let params = self.world.p_params[idx];
            sync_agent_attributes(agent, params);
        }

        self.away_team_ctx.team_id = TeamId::Away.index() as u8;
        self.away_team_ctx.seed = self.world.seed ^ 0x9E3779B97F4A7C15;
        self.away_team_ctx.tactics = crate::ai::coach::TacticsView::default();
        self.away_team_ctx.xt_grid = crate::ai::coach::XtGrid::default();
        self.away_team_ctx.players = (0..N_PER_TEAM)
            .map(|slot| {
                let role = away_model
                    .role_for_slot(slot)
                    .map(Self::map_role)
                    .unwrap_or(Role::Unknown);
                PlayerAgent {
                    id: (slot + N_PER_TEAM) as u16,
                    role,
                    slot_mask: (slot % 2) as u8,
                    ..Default::default()
                }
            })
            .collect();
        self.away_team_ctx.comm_broker.inboxes =
            vec![crate::ai::comm::Inbox::default(); N_PER_TEAM];
        for (idx, agent) in self.away_team_ctx.players.iter_mut().enumerate() {
            agent.perception.local_index = idx;
            let params = self.world.p_params[agent.id as usize];
            sync_agent_attributes(agent, params);
        }

        self.sync_agent_activity();
    }

    fn update_hash(&mut self) {
        let mut guard = HashGuard::new();
        guard.update(&self.world.tick.to_le_bytes());
        guard.update(&self.world.ms.to_le_bytes());
        guard.update(&self.world.home_score.to_le_bytes());
        guard.update(&self.world.away_score.to_le_bytes());
        guard.update(&self.world.bx.to_le_bytes());
        guard.update(&self.world.by.to_le_bytes());
        guard.update(&self.world.bvx.to_le_bytes());
        guard.update(&self.world.bvy.to_le_bytes());
        for idx in 0..crate::state::N_PLAYERS {
            guard.update(&self.world.px[idx].to_le_bytes());
            guard.update(&self.world.py[idx].to_le_bytes());
        }
        self.last_hash = guard.finalize();
    }

    fn align_players_for_kickoff(&mut self) {
        let attacking_team = if self.world.possession >= 0 {
            TeamId::from_index(self.world.possession as usize)
        } else {
            TeamId::Home
        };

        let home_layout = kickoff_positions(
            TeamId::Home,
            attacking_team == TeamId::Home,
            &self.world.tactics[TeamId::Home.index()],
        );
        self.apply_team_layout(TeamId::Home, &home_layout);

        let away_layout = kickoff_positions(
            TeamId::Away,
            attacking_team == TeamId::Away,
            &self.world.tactics[TeamId::Away.index()],
        );
        self.apply_team_layout(TeamId::Away, &away_layout);
    }

    fn apply_team_layout(&mut self, team: TeamId, layout: &PhaseLayout) {
        let base_index = match team {
            TeamId::Home => 0,
            TeamId::Away => N_PER_TEAM,
        };
        let facing = if team == TeamId::Home { 0.0 } else { PI };

        for (slot, position) in layout.positions.iter().enumerate() {
            let idx = base_index + slot;
            self.world.set_player_pos(idx, *position);
            self.world.set_player_vel(idx, Vec2::ZERO);
            self.world.pfacing[idx] = facing;
            self.world.pcommand[idx].target_vel = Vec2::ZERO;
        }
    }

    fn sync_restart_layouts(&mut self) {
        use crate::types::MatchPhase;
        match self.world.match_phase {
            MatchPhase::PreKickoff | MatchPhase::Kickoff => {
                self.align_players_for_kickoff();
                self.maybe_issue_kickoff_pass();
            }
            _ => {
                self.kickoff_pass_dispatched = false;
            }
        }
    }

    fn maybe_issue_kickoff_pass(&mut self) {
        use crate::types::MatchPhase;

        if self.kickoff_pass_dispatched {
            return;
        }

        if !matches!(
            self.world.match_phase,
            MatchPhase::PreKickoff | MatchPhase::Kickoff
        ) {
            self.kickoff_pass_dispatched = false;
            return;
        }

        if self.world.ball_vel().norm_squared() > 1e-4 {
            self.kickoff_pass_dispatched = true;
            return;
        }

        let possession = self.world.possession;
        if possession < 0 {
            return;
        }
        let team = TeamId::from_index((possession as usize).min(1));
        let base = match team {
            TeamId::Home => 0,
            TeamId::Away => N_PER_TEAM,
        };

        let kicker_idx = base + (N_PER_TEAM - 1);
        let receiver_idx = base + (N_PER_TEAM - 2);
        if kicker_idx >= N_PLAYERS || receiver_idx >= N_PLAYERS {
            return;
        }

        if !self.world.player_has_ball(kicker_idx) {
            return;
        }

        let target = self.world.player_pos(receiver_idx);
        let before_vel = self.world.ball_vel();
        interaction::execute_kick(
            &mut self.world,
            &mut self.home_team_ctx,
            &mut self.away_team_ctx,
            kicker_idx as u8,
            target,
            8.5,
            0.0,
            false,
        );
        let after_vel = self.world.ball_vel();

        if after_vel.norm_squared() > before_vel.norm_squared() + 1e-4 {
            self.kickoff_pass_dispatched = true;
        }
    }

    pub fn write_snapshot(&mut self, buf: &mut SnapshotBuffer) {
        let quant = snapshot::write_full_snapshot(&self.world, buf);
        self.last_quantized = Some(quant);
    }

    pub fn write_delta(&mut self, buf: &mut DeltaBuffer) {
        let current = snapshot::quantize_world(&self.world);
        if let Some(prev) = &self.last_quantized {
            snapshot::write_delta(prev, &current, buf);
        } else {
            let mut tmp = SnapshotBuffer::default();
            let quant = snapshot::write_full_snapshot(&self.world, &mut tmp);
            buf.write(&tmp.into_bytes());
            self.last_quantized = Some(quant);
            return;
        }
        self.last_quantized = Some(current);
    }

    pub fn enqueue_command(&mut self, js_value: wasm_bindgen::JsValue) {
        match parse_command(js_value) {
            Ok(parsed) => {
                if let Err(err) = self
                    .commands
                    .push(self.world.tick, parsed.apply_tick, parsed.cmd)
                {
                    log_command_error(err);
                }
            }
            Err(err) => log_parse_error(err),
        }
    }
}

fn log_command_error(err: CommandError) {
    #[cfg(not(target_arch = "wasm32"))]
    eprintln!("command rejected: {:?}", err);
    let _ = err;
}

fn log_parse_error(err: ParseError) {
    #[cfg(not(target_arch = "wasm32"))]
    eprintln!("command parse error: {:?}", err);
    let _ = err;
}