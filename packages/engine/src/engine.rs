use crate::ai::phase::evaluate_team_phase;
use crate::ai::tactics::TacticModel;
use crate::ai::{kickoff_positions, PhaseLayout, Scheduler};
use crate::commands::{parse_command, Cmd, CommandBuffer, CommandError, ParseError};
use crate::physics::{ball::step_ball, player::step_players, PhysicsContext};
use crate::player_class::PlayerClass;
use crate::rng::DeterministicRng;
use crate::rules::{offside::check_offside, referee::update_referee, restarts::handle_restarts};
use crate::snapshot::{self, DeltaBuffer, HashGuard, QuantizedWorld, SnapshotBuffer};
use crate::state::{World, N_PER_TEAM, N_PLAYERS, N_TEAMS};
use crate::types::{BallMode, Tactic, TeamId, Vec2};
use log::{info, warn};
use std::f32::consts::PI;

pub struct Engine {
    pub world: World,
    _rng: DeterministicRng,
    commands: CommandBuffer,
    scheduler: Scheduler,
    physics: PhysicsContext,
    player_classes: Vec<PlayerClass>,
    pub ai_active: Vec<bool>,
    last_hash: [u8; 32],
    last_quantized: Option<QuantizedWorld>,
    team_tactics: [TacticModel; N_TEAMS],
    kickoff_pass_dispatched: bool,
}

impl Engine {
    pub fn new(seed: u64) -> Self {
        let world = World::new(seed);

        // -- Tactics Initialization --
        let dummy_tactic_json = r#"
        {
          "offensive_formation": "4-3-3",
          "defensive_formation": "4-4-2",
          "roles": ["GK", "LB", "LCB", "RCB", "RB", "LCM", "RCM", "CAM", "LW", "RW", "ST"],
          "lineup": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          "team_tactic": {
            "team_attacking": {
              "buildup_formation": "4-3-3",
              "goalkeeper_engage": false,
              "pass_distance": 0.5,
              "final_third_formation": "2-1-7",
              "attack_preference": "center",
              "cross_frequency": 0.3,
              "over_underlapping_player": "fullbacks"
            },
            "team_transition": {
              "on_ball_gain": "InPosition",
              "on_ball_loose": "CounterPress"
            },
            "team_defending": {
              "defending_formation": "4-4-2",
              "high_block": "Pressing",
              "mid_block": "MakeBlock",
              "low_block": "BlockMiddle"
            },
            "team_set_piece": {
              "attack_corner": "default",
              "defence_corner": "default"
            }
          },
          "personal_instructions": {
            "5": {
              "risk_intensity": 0.3,
              "defense_participation": 0.8,
              "attacking_participation": 0.4,
              "mark_man_id": 9,
              "buildup_intensity": null,
              "cover_radius": null
            },
            "10": {
              "risk_intensity": 0.8,
              "defense_participation": 0.2,
              "attacking_participation": 0.9,
              "mark_man_id": null,
              "buildup_intensity": null,
              "cover_radius": null
            }
          }
        }
        "#;

        let home_model = TacticModel::parse_json(dummy_tactic_json).unwrap();
        let away_model = TacticModel::parse_json(dummy_tactic_json).unwrap(); // Using same for now

        let mut engine = Self {
            world,
            _rng: DeterministicRng::new(seed),
            commands: CommandBuffer::new(),
            scheduler: Scheduler::new(),
            physics: PhysicsContext::new(),
            player_classes: Vec::new(),
            ai_active: vec![true; N_PLAYERS],
            last_hash: [0; 32],
            last_quantized: None,
            team_tactics: [home_model.clone(), away_model.clone()],
            kickoff_pass_dispatched: false,
        };
        info!("[Engine] Rebuilding initial tactical state");
        engine.rebuild_tactical_state();

        if let Some(class) = engine.player_classes.get(5) {
            info!("Player 5 Class: {:?}", class);
        }
        if let Some(class) = engine.player_classes.get(10) {
            info!("Player 10 Class: {:?}", class);
        }
        engine.update_hash();
        engine
    }

    pub fn tick(&mut self) {
        self.world.tick();
        if self.world.tick % 50 == 0 {
            info!("[Engine] Tick {}", self.world.tick);
        }
        self.scheduler.step();
        self.world.advance_overrides();
        self.process_commands();
        self.update_ai();
        step_players(&mut self.world, &self.ai_active);
        step_ball(
            &mut self.world,
            &self.physics.spatial,
            &mut self._rng.as_mut(),
        );
        self.update_possession();
        handle_restarts(&mut self.world);
        self.sync_restart_layouts();
        update_referee(&mut self.world);
        let _offside = check_offside(&self.world);
        self.update_hash();
        self.physics.rebuild_spatial(&self.world);
    }

    fn update_ai(&mut self) {
        let home_phase = evaluate_team_phase(&self.world, TeamId::Home);
        let away_phase = evaluate_team_phase(&self.world, TeamId::Away);

        self.world.home_team_phase = home_phase.to_u8();
        self.world.away_team_phase = away_phase.to_u8();

        for i in 0..N_PLAYERS {
            if self.scheduler.should_evaluate(i) && self.ai_active[i] {
                let team_phase = if self.player_classes[i].team_id == TeamId::Home {
                    home_phase
                } else {
                    away_phase
                };

                if let Some(cmd) = self.player_classes[i].update_ai(&self.world, team_phase) {
                    self.commands
                        .push(self.world.tick, self.world.tick + 1, cmd)
                        .ok();
                }
            }
        }
    }

    fn update_possession(&mut self) {
        let mut closest_player_dist_sq = f32::MAX;
        let mut closest_player_id = -1;

        let ball_pos = self.world.ball_pos();

        for i in 0..N_PLAYERS {
            let player_pos = self.world.player_pos(i);
            let dist_sq = (player_pos - ball_pos).norm_squared();
            if dist_sq < closest_player_dist_sq {
                closest_player_dist_sq = dist_sq;
                closest_player_id = i as i32;
            }
        }

        if closest_player_id != -1 {
            let player_id = closest_player_id as usize;
            let params = self.world.p_params[player_id];
            if closest_player_dist_sq < (params.ctrl_radius * params.ctrl_radius) {
                self.world.possession = self.world.team_id(player_id) as i8;
            } else {
                self.world.possession = -1;
            }
        } else {
            self.world.possession = -1;
        }
    }

    pub fn state_hash(&self) -> [u8; 32] {
        self.last_hash
    }

    pub fn get_player_class(&self, player_id: usize) -> Option<&PlayerClass> {
        self.player_classes.get(player_id)
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
                Cmd::LoftedPass {
                    player_id,
                    tx,
                    ty,
                    loft,
                } => {
                    info!("[Engine] Lofted pass by pid {}", player_id);
                    self.apply_ball_command(
                        player_id,
                        Vec2::new(tx, ty),
                        14.0,
                        loft.clamp(0.0, 1.0) * 18.0,
                        true,
                    );
                }
                Cmd::GroundPass { player_id, tx, ty } => {
                    info!("[Engine] Ground pass by pid {}", player_id);
                    self.apply_ball_command(player_id, Vec2::new(tx, ty), 11.0, 0.0, false);
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
                    self.apply_ball_command(
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

        self.player_classes = (0..N_PLAYERS)
            .map(|i| {
                let team_id = TeamId::from_index(i / N_PER_TEAM);
                let model = if team_id == TeamId::Home {
                    home_model
                } else {
                    away_model
                };
                PlayerClass::new(&self.world, model, i)
            })
            .collect();

        self.align_players_for_kickoff();
        self.physics.rebuild_spatial(&self.world);
    }

    fn apply_ball_command(
        &mut self,
        player_id: u8,
        target: Vec2,
        base_speed: f32,
        loft: f32,
        airborne: bool,
    ) {
        if !self.world.player_has_ball(player_id as usize) {
            return;
        }

        let origin = self.world.player_pos(player_id as usize);
        let mut dir = (target - origin).normalize();
        if dir.norm() < 1e-4 {
            dir = Vec2::new(1.0, 0.0);
        }
        let speed = base_speed.max(0.0);
        self.world.bvx = dir.x * speed;
        self.world.bvy = dir.y * speed;
        if airborne {
            self.world.bvz = loft;
            self.world.set_ball_mode(BallMode::Air);
        } else {
            self.world.bvz = 0.0;
            self.world.set_ball_mode(BallMode::Ground);
        }
        self.world.possession = -1;
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
            &self.player_classes[0].quantified_tactics,
        );
        self.apply_team_layout(TeamId::Home, &home_layout);

        let away_layout = kickoff_positions(
            TeamId::Away,
            attacking_team == TeamId::Away,
            &self.player_classes[N_PER_TEAM].quantified_tactics,
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

        for slot in 0..N_PER_TEAM {
            let idx = base_index + slot;
            if let Some(class) = self.player_classes.get_mut(idx) {
                let anchor = self.world.player_pos(idx);
                class.reset_anchor(anchor);
            }
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
        self.apply_ball_command(kicker_idx as u8, target, 8.5, 0.0, false);
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
