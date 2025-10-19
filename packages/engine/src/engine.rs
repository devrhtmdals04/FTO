use crate::ai::fsm::TeamState;
use crate::ai::scheduler::Scheduler;
use crate::commands::{parse_command, Cmd, CommandBuffer, CommandError, ParseError};
use crate::physics::{ball::step_ball, player::step_players, PhysicsContext};
use crate::player_class::PlayerClass;
use crate::rng::DeterministicRng;
use crate::rules::{offside::check_offside, referee::update_referee, restarts::handle_restarts};
use crate::snapshot::{self, DeltaBuffer, HashGuard, QuantizedWorld, SnapshotBuffer};
use crate::state::{World, N_PER_TEAM, N_PLAYERS};
use crate::tactics::{load_tactic_from_json, quantify};
use crate::types::{BallMode, Tactic, TeamId, Vec2};
use log::info;

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
}

impl Engine {
    pub fn new(seed: u64) -> Self {
        let mut world = World::new(seed);

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

        let home_tactic: Tactic = load_tactic_from_json(dummy_tactic_json).unwrap();
        let away_tactic: Tactic = load_tactic_from_json(dummy_tactic_json).unwrap(); // Using same for now

        world.initialize_params(&home_tactic.lineup, &away_tactic.lineup);

        let home_quantified = quantify(&home_tactic);
        let away_quantified = quantify(&away_tactic);

        world.tactics[TeamId::Home.index()] = home_quantified;
        world.tactics[TeamId::Away.index()] = away_quantified;

        let player_classes: Vec<PlayerClass> = (0..N_PLAYERS)
            .map(|i| {
                let team_id = TeamId::from_index(i / N_PER_TEAM);
                let (tactic, quantified) = if team_id == TeamId::Home {
                    (&home_tactic, &home_quantified)
                } else {
                    (&away_tactic, &away_quantified)
                };
                PlayerClass::new(&world, tactic, quantified, i)
            })
            .collect();

        info!("Player 5 Class: {:?}", player_classes[5]);
        info!("Player 10 Class: {:?}", player_classes[10]);

        let mut engine = Self {
            world,
            _rng: DeterministicRng::new(seed),
            commands: CommandBuffer::new(),
            scheduler: Scheduler::new(),
            physics: PhysicsContext::new(),
            player_classes,
            ai_active: vec![true; N_PLAYERS],
            last_hash: [0; 32],
            last_quantized: None,
        };
        engine.update_hash();
        engine
    }

    pub fn tick(&mut self) {
        self.world.tick();
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
        update_referee(&mut self.world);
        let _offside = check_offside(&self.world);
        self.update_hash();
        self.physics.rebuild_spatial(&self.world);
    }

    fn update_ai(&mut self) {
        let home_team_state = self.determine_team_state(TeamId::Home);
        let away_team_state = self.determine_team_state(TeamId::Away);

        for i in 0..N_PLAYERS {
            if self.scheduler.should_evaluate(i) && self.ai_active[i] {
                let team_state = if self.player_classes[i].team_id == TeamId::Home {
                    home_team_state
                } else {
                    away_team_state
                };

                if let Some(cmd) = self.player_classes[i].update_ai(&mut self.world, team_state) {
                    self.commands
                        .push(self.world.tick, self.world.tick + 1, cmd)
                        .ok();
                }
            }
        }
    }

    fn determine_team_state(&self, team_id: TeamId) -> TeamState {
        let possession_team = self.world.possession;
        if possession_team < 0 {
            return TeamState::Transition;
        }
        if possession_team == team_id.index() as i8 {
            return TeamState::Attacking;
        } else {
            return TeamState::Defending;
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
                Cmd::TacticsSet(tactics) => {
                    // TODO: This should also update player_classes
                    self.world.tactics[TeamId::Home.index()] = tactics;
                }
                Cmd::RoleOverride { pid, params, ttl } => {
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
                    self.apply_ball_command(
                        player_id,
                        Vec2::new(tx, ty),
                        14.0,
                        loft.clamp(0.0, 1.0) * 18.0,
                        true,
                    );
                }
                Cmd::GroundPass { player_id, tx, ty } => {
                    self.apply_ball_command(player_id, Vec2::new(tx, ty), 11.0, 0.0, false);
                }
                Cmd::Shoot {
                    player_id,
                    tx,
                    ty,
                    power,
                } => {
                    self.apply_ball_command(
                        player_id,
                        Vec2::new(tx, ty),
                        18.0 + 8.0 * power,
                        6.0 * power,
                        true,
                    );
                }
                Cmd::MovePlayerVelocity { pid, vx, vy } => {
                    if let Some(pcmd) = self.world.pcommand.get_mut(pid as usize) {
                        pcmd.target_vel = Vec2::new(vx, vy);
                    }
                }
                Cmd::MovePlayerTarget { pid, tx, ty } => {
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
