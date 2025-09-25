use crate::ai::scheduler::Scheduler;
use crate::commands::{parse_command, Cmd, CommandBuffer, CommandError, ParseError};
use crate::params::{PITCH_W, PLAYER_VMAX, R_BODY};
use crate::physics::{ball::step_ball, player::step_players, PhysicsContext};
use crate::rng::DeterministicRng;
use crate::rules::{offside::check_offside, referee::update_referee, restarts::handle_restarts};
use crate::snapshot::{self, DeltaBuffer, HashGuard, QuantizedWorld, SnapshotBuffer};
use crate::state::World;
use crate::types::{BallMode, TeamId, Vec2};

pub struct Engine {
    pub world: World,
    _rng: DeterministicRng,
    commands: CommandBuffer,
    scheduler: Scheduler,
    physics: PhysicsContext,
    last_hash: [u8; 32],
    last_quantized: Option<QuantizedWorld>,
    actions_enabled: bool,
}

impl Engine {
    pub fn new(seed: u64) -> Self {
        let mut engine = Self {
            world: World::new(seed),
            _rng: DeterministicRng::new(seed),
            commands: CommandBuffer::new(),
            scheduler: Scheduler::new(),
            physics: PhysicsContext::new(),
            last_hash: [0; 32],
            last_quantized: None,
            actions_enabled: true,
        };
        engine.update_hash(); // Re-enabled
        engine
    }

    pub fn tick(&mut self) {
        self.world.tick();
        self.scheduler.step();
        self.world.advance_overrides();
        self.process_commands();
        self.update_ai();
        step_players(&mut self.world);
        step_ball(
            &mut self.world,
            &self.physics.spatial,
            &mut self._rng.as_mut(),
        );
        handle_restarts(&mut self.world);
        update_referee(&mut self.world);
        let _offside = check_offside(&self.world);
        self.update_hash();
        self.physics.rebuild_spatial(&self.world);
    }

    fn update_ai(&mut self) {
        if !self.actions_enabled {
            self.basic_chase_ai();
            return;
        }

        let holder = self.identify_ball_holder();
        let mut ball_control = holder;

        if let Some(pid) = holder {
            let team = self.team_for_player(pid);
            self.world.possession = team.index() as i8;

            if self.try_shoot(pid, team) {
                ball_control = None;
            } else if self.try_pass(pid, team) {
                ball_control = None;
            } else {
                self.execute_dribble(pid, team);
                ball_control = Some(pid);
            }
        }

        if let Some(new_holder) = self.try_tackle(holder) {
            ball_control = Some(new_holder);
        }

        self.update_player_movements(ball_control);
    }

    pub fn state_hash(&self) -> [u8; 32] {
        self.last_hash
    }

    fn process_commands(&mut self) {
        for cmd in self.commands.drain_ready(self.world.tick) {
            let team_hint = self.command_team_hint(&cmd);
            match cmd {
                Cmd::TacticsSet(tactics) => {
                    self.world.tactics[TeamId::Home.index()] = tactics;
                }
                Cmd::RoleOverride { pid, params, ttl } => {
                    if let Some(slot) = self.world.prole_override.get_mut(pid as usize) {
                        slot.params = params;
                        slot.ttl = ttl;
                    }
                }
                Cmd::LoftedPass { tx, ty, loft } => {
                    self.apply_ball_command(
                        Vec2::new(tx, ty),
                        20.0,
                        loft.clamp(0.0, 1.0) * 18.0,
                        true,
                        team_hint,
                    );
                }
                Cmd::GroundPass { tx, ty } => {
                    self.apply_ball_command(Vec2::new(tx, ty), 16.0, 0.0, false, team_hint);
                }
                Cmd::Shoot { tx, ty, power } => {
                    self.apply_ball_command(
                        Vec2::new(tx, ty),
                        24.0 + 8.0 * power,
                        6.0 * power,
                        true,
                        team_hint,
                    );
                }
            }
        }
    }

    fn apply_ball_command(
        &mut self,
        target: Vec2,
        base_speed: f32,
        loft: f32,
        airborne: bool,
        team: TeamId,
    ) {
        let origin = Vec2::new(self.world.bx, self.world.by);
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
        self.world.possession = team.index() as i8;
    }

    fn command_team_hint(&self, cmd: &Cmd) -> TeamId {
        match cmd {
            Cmd::RoleOverride { pid, .. } => {
                TeamId::from_index(self.world.p_team[*pid as usize]).unwrap_or(TeamId::Home)
            }
            _ => match self.world.possession {
                1 => TeamId::Away,
                _ => TeamId::Home,
            },
        }
    }

    fn team_for_player(&self, pid: usize) -> TeamId {
        TeamId::from_index(self.world.p_team[pid]).unwrap_or(TeamId::Home)
    }

    fn goal_position(&self, team: TeamId) -> Vec2 {
        let sign = if matches!(team, TeamId::Home) {
            1.0
        } else {
            -1.0
        };
        Vec2::new(PITCH_W * 0.5 * sign, 0.0)
    }

    fn attack_direction(&self, team: TeamId) -> Vec2 {
        let sign = if matches!(team, TeamId::Home) {
            1.0
        } else {
            -1.0
        };
        Vec2::new(sign, 0.0)
    }

    fn identify_ball_holder(&self) -> Option<usize> {
        if matches!(self.world.ball_mode(), BallMode::Air) {
            return None;
        }
        let ball_speed = Vec2::new(self.world.bvx, self.world.bvy).norm();
        if ball_speed > 10.0 {
            return None;
        }
        let ball_pos = Vec2::new(self.world.bx, self.world.by);
        let mut best: Option<(usize, f32)> = None;
        for pid in 0..crate::state::N_PLAYERS {
            let params = self.world.p_params[pid];
            let pos = self.world.player_pos(pid);
            let dist = pos.distance(ball_pos);
            if dist <= params.ctrl_radius + 0.25 {
                match best {
                    Some((_, best_dist)) if dist >= best_dist => {}
                    _ => best = Some((pid, dist)),
                }
            }
        }
        best.map(|(pid, _)| pid)
    }

    fn execute_dribble(&mut self, holder: usize, team: TeamId) {
        let params = self.world.p_params[holder];
        let holder_pos = self.world.player_pos(holder);
        let dir = self.attack_direction(team);
        let target = holder_pos + dir * 5.0;
        let desired_dir = (target - holder_pos).normalize();
        let speed = (params.v_max.min(PLAYER_VMAX) * 0.75).min(4.2);

        self.world.pcommand[holder].target_vel = desired_dir * speed;
        self.world.pcommand[holder].target_omega = 0.0;

        let offset = desired_dir * params.ctrl_radius.min(0.8);
        self.world.bx = holder_pos.x + offset.x;
        self.world.by = holder_pos.y + offset.y;
        self.world.bvx = desired_dir.x * speed;
        self.world.bvy = desired_dir.y * speed;
        self.world.bvz = 0.0;
        self.world.set_ball_mode(BallMode::Ground);
        self.world.possession = team.index() as i8;
    }

    fn try_shoot(&mut self, holder: usize, team: TeamId) -> bool {
        let holder_pos = self.world.player_pos(holder);
        let goal = self.goal_position(team);
        let distance = holder_pos.distance(goal);
        if distance < 22.0 && self.nearest_opponent_distance(holder) > 3.5 {
            self.apply_ball_command(goal, 28.0, 6.0, true, team);
            self.world.possession = team.index() as i8;
            true
        } else {
            false
        }
    }

    fn try_pass(&mut self, holder: usize, team: TeamId) -> bool {
        if let Some(target) = self.select_pass_target(holder, team) {
            self.apply_ball_command(target, 18.0, 0.0, false, team);
            self.world.possession = team.index() as i8;
            true
        } else {
            false
        }
    }

    fn select_pass_target(&self, holder: usize, team: TeamId) -> Option<Vec2> {
        let holder_pos = self.world.player_pos(holder);
        let attack_dir = self.attack_direction(team);
        let forward_sign = attack_dir.x.signum();
        let mut best_score = f32::MIN;
        let mut best_target = None;

        for idx in World::team_slice(team) {
            if idx == holder {
                continue;
            }
            let target_pos = self.world.player_pos(idx);
            let to_target = target_pos - holder_pos;
            let distance = to_target.norm();
            if distance < 3.0 || distance > 32.0 {
                continue;
            }
            let forward_progress = forward_sign * to_target.x;
            if forward_progress <= -2.0 {
                continue;
            }
            let openness = self
                .nearest_opponent_distance_to_point(team.opponent(), target_pos)
                .min(15.0);
            let score = forward_progress * 1.5 + openness * 0.5 - distance * 0.3;
            if score > best_score {
                best_score = score;
                best_target = Some(target_pos);
            }
        }

        best_target
    }

    fn nearest_opponent_distance(&self, pid: usize) -> f32 {
        let team = self.team_for_player(pid);
        let pos = self.world.player_pos(pid);
        self.nearest_opponent_distance_to_point(team.opponent(), pos)
    }

    fn nearest_opponent_distance_to_point(&self, opponent_team: TeamId, point: Vec2) -> f32 {
        let mut best = f32::MAX;
        for idx in World::team_slice(opponent_team) {
            let opp_pos = self.world.player_pos(idx);
            let dist = opp_pos.distance(point);
            if dist < best {
                best = dist;
            }
        }
        best
    }

    fn try_tackle(&mut self, holder: Option<usize>) -> Option<usize> {
        if holder.is_none() || matches!(self.world.ball_mode(), BallMode::Air) {
            return None;
        }
        let holder_pid = holder.unwrap();
        let holder_team = self.team_for_player(holder_pid);
        let opponent_team = holder_team.opponent();
        let ball_pos = Vec2::new(self.world.bx, self.world.by);

        let mut best_candidate = None;
        let mut best_dist = f32::MAX;
        for idx in World::team_slice(opponent_team) {
            let pos = self.world.player_pos(idx);
            let dist = pos.distance(ball_pos);
            if dist < best_dist {
                best_dist = dist;
                best_candidate = Some(idx);
            }
        }

        if let Some(defender) = best_candidate {
            let params = self.world.p_params[defender];
            if best_dist < params.tackle_rad + R_BODY {
                let def_pos = self.world.player_pos(defender);
                self.world.bx = def_pos.x;
                self.world.by = def_pos.y;
                self.world.bvx = 0.0;
                self.world.bvy = 0.0;
                self.world.bvz = 0.0;
                self.world.set_ball_mode(BallMode::Ground);
                self.world.possession = opponent_team.index() as i8;
                return Some(defender);
            }
        }

        None
    }

    fn update_player_movements(&mut self, holder: Option<usize>) {
        let ball_pos = Vec2::new(self.world.bx, self.world.by);
        let holder_team = holder.map(|pid| self.team_for_player(pid));

        for pid in 0..crate::state::N_PLAYERS {
            if Some(pid) == holder {
                continue;
            }
            if !self.scheduler.should_evaluate(pid) {
                continue;
            }

            let team = self.team_for_player(pid);
            let params = self.world.p_params[pid];
            let max_speed = params.v_max.min(PLAYER_VMAX);

            let desired_vel = if let Some(holder_team) = holder_team {
                if team == holder_team {
                    let support_point = ball_pos + self.attack_direction(team) * 8.0;
                    (support_point - self.world.player_pos(pid)).normalize() * max_speed * 0.6
                } else {
                    (ball_pos - self.world.player_pos(pid)).normalize() * max_speed
                }
            } else {
                (ball_pos - self.world.player_pos(pid)).normalize() * max_speed * 0.8
            };

            self.world.pcommand[pid].target_vel = desired_vel;
            self.world.pcommand[pid].target_omega = 0.0;
        }
    }

    fn basic_chase_ai(&mut self) {
        let ball_pos = Vec2::new(self.world.bx, self.world.by);

        for i in 0..crate::state::N_PLAYERS {
            if self.scheduler.should_evaluate(i) {
                let player_pos = self.world.player_pos(i);
                let desired_dir = (ball_pos - player_pos).normalize();
                let desired_vel = desired_dir * PLAYER_VMAX * 0.7;

                self.world.pcommand[i].target_vel = desired_vel;
                self.world.pcommand[i].target_omega = 0.0;
            }
        }
    }

    fn update_hash(&mut self) {
        let mut guard = HashGuard::new();

        let mut snapshot_buf = SnapshotBuffer::default();
        snapshot::write_full_snapshot(&self.world, &mut snapshot_buf);
        let snapshot_bytes = snapshot_buf.into_bytes();
        guard.update(&snapshot_bytes);

        guard.update(&self.world.seed.to_le_bytes());
        guard.update(&(self.world.possession as i8).to_le_bytes());
        guard.update(&self.world.bspin.to_le_bytes());

        for tactic in &self.world.tactics {
            guard.update(&tactic.line_height.to_le_bytes());
            guard.update(&tactic.press_intensity.to_le_bytes());
            guard.update(&tactic.team_width.to_le_bytes());
            guard.update(&tactic.build_up.to_le_bytes());
            guard.update(&tactic.counter_press.to_le_bytes());
            guard.update(&tactic.long_ball_bias.to_le_bytes());
            guard.update(&tactic.overlap_fullbacks.to_le_bytes());
            guard.update(&tactic.compactness.to_le_bytes());
        }

        guard.update(&self.world.p_team);
        for role in &self.world.p_role {
            guard.update(&role.as_u8().to_le_bytes());
        }

        for facing in &self.world.pfacing {
            guard.update(&facing.to_le_bytes());
        }

        for cmd in &self.world.pcommand {
            guard.update(&cmd.target_vel.x.to_le_bytes());
            guard.update(&cmd.target_vel.y.to_le_bytes());
            guard.update(&cmd.target_omega.to_le_bytes());
        }

        for override_state in &self.world.prole_override {
            guard.update(&override_state.ttl.to_le_bytes());
            guard.update(&override_state.params.speed.to_le_bytes());
            guard.update(&override_state.params.aggression.to_le_bytes());
        }

        for eval_tick in &self.world.plast_eval_tick {
            guard.update(&eval_tick.to_le_bytes());
        }

        self.last_hash = guard.finalize();
    }

    pub fn set_actions_enabled(&mut self, enabled: bool) {
        self.actions_enabled = enabled;
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
