use crate::params::{DT, PITCH_H, PITCH_W, R_BODY};
use crate::players::{compute_params, FootPreference, PlayerInput};
use crate::tactics::Tactics;
use crate::types::{
    BallMode, MatchPhase, PlayerCommandState, PlayerParams, PlayerRole, RoleOverrideState, TeamId,
    Vec2,
};

pub const N_PLAYERS: usize = 22;
pub const N_PER_TEAM: usize = 11;
pub const N_TEAMS: usize = 2;

#[repr(C)]
pub struct World {
    pub tick: u32,
    pub ms: u32,
    pub seed: u64,

    pub bx: f32,
    pub by: f32,
    pub bvx: f32,
    pub bvy: f32,
    pub bz: f32,
    pub bvz: f32,
    pub bmode: u8,
    pub bspin: f32,

    pub match_phase: MatchPhase,
    pub home_score: u16,
    pub away_score: u16,
    pub possession: i8,

    pub tactics: [Tactics; N_TEAMS],

    pub p_team: [u8; N_PLAYERS],
    pub p_role: [PlayerRole; N_PLAYERS],
    pub p_params: [PlayerParams; N_PLAYERS],

    pub px: [f32; N_PLAYERS],
    pub py: [f32; N_PLAYERS],
    pub pvx: [f32; N_PLAYERS],
    pub pvy: [f32; N_PLAYERS],
    pub pfacing: [f32; N_PLAYERS],
    pub pstamina: [f32; N_PLAYERS],
    pub pfatigue: [f32; N_PLAYERS],
    pub pcommand: [PlayerCommandState; N_PLAYERS],
    pub prole_override: [RoleOverrideState; N_PLAYERS],
    pub plast_eval_tick: [u32; N_PLAYERS],
}

impl Default for World {
    fn default() -> Self {
        Self::new(0)
    }
}

impl World {
    pub fn new(seed: u64) -> Self {
        let mut world = Self {
            tick: 0,
            ms: 0,
            seed,
            bx: 0.0,
            by: 0.0,
            bvx: 0.0,
            bvy: 0.0,
            bz: 0.0,
            bvz: 0.0,
            bmode: BallMode::Ground.as_u8(),
            bspin: 0.0,
            match_phase: MatchPhase::PreKickoff,
            home_score: 0,
            away_score: 0,
            possession: TeamId::Home.index() as i8,
            tactics: [Tactics::default(); N_TEAMS],
            p_team: [0; N_PLAYERS],
            p_role: [PlayerRole::default(); N_PLAYERS],
            p_params: [PlayerParams::default(); N_PLAYERS],
            px: [0.0; N_PLAYERS],
            py: [0.0; N_PLAYERS],
            pvx: [0.0; N_PLAYERS],
            pvy: [0.0; N_PLAYERS],
            pfacing: [0.0; N_PLAYERS],
            pstamina: [1.0; N_PLAYERS],
            pfatigue: [0.0; N_PLAYERS],
            pcommand: [PlayerCommandState::default(); N_PLAYERS],
            prole_override: [RoleOverrideState::default(); N_PLAYERS],
            plast_eval_tick: [0; N_PLAYERS],
        };
        world.initialize_params();
        world.reset_kickoff();
        world
    }

    fn initialize_params(&mut self) {
        for idx in 0..N_PLAYERS {
            let slot = idx % N_PER_TEAM;
            let input = baseline_player(slot);
            self.p_params[idx] = compute_params(&input);
        }
    }

    pub fn reset_kickoff(&mut self) {
        self.match_phase = MatchPhase::PreKickoff;
        self.possession = TeamId::Home.index() as i8;
        self.bx = 0.0;
        self.by = 0.0;
        self.bvx = 0.0;
        self.bvy = 0.0;
        self.bz = 0.0;
        self.bvz = 0.0;
        self.bmode = BallMode::Ground.as_u8();
        for i in 0..N_PLAYERS {
            self.pvx[i] = 0.0;
            self.pvy[i] = 0.0;
            self.pfacing[i] = 0.0;
            self.pstamina[i] = 1.0;
            self.pfatigue[i] = 0.0;
            self.pcommand[i] = PlayerCommandState::default();
        }
        self.arrange_default_positions();
    }

    fn arrange_default_positions(&mut self) {
        let spacing_x = 12.0;
        let spacing_y = 8.0;
        for i in 0..N_PLAYERS {
            let team = if i < N_PER_TEAM { TeamId::Home } else { TeamId::Away };
            self.p_team[i] = team.index() as u8;
            self.p_role[i] = default_role(i % N_PER_TEAM);
            let slot = i % N_PER_TEAM;
            let row = slot / 4;
            let col = slot % 4;
            let base_x = match team {
                TeamId::Home => -PITCH_W * 0.25,
                TeamId::Away => PITCH_W * 0.25,
            };
            let offset_x = (col as f32 - 1.5) * spacing_x;
            let offset_y = (row as f32 - 1.0) * spacing_y;
            let mut pos = Vec2::new(base_x + offset_x, offset_y);
            clamp_to_pitch(&mut pos);
            self.set_player_pos(i, pos);
        }
    }

    pub fn tick(&mut self) {
        self.tick = self.tick.wrapping_add(1);
        self.ms = self.ms.wrapping_add((DT * 1000.0) as u32);
    }

    pub fn ball_mode(&self) -> BallMode {
        BallMode::from_u8(self.bmode)
    }

    pub fn set_ball_mode(&mut self, mode: BallMode) {
        self.bmode = mode.as_u8();
    }

    pub fn player_pos(&self, idx: usize) -> Vec2 {
        Vec2::new(self.px[idx], self.py[idx])
    }

    pub fn set_player_pos(&mut self, idx: usize, pos: Vec2) {
        self.px[idx] = pos.x;
        self.py[idx] = pos.y;
    }

    pub fn player_vel(&self, idx: usize) -> Vec2 {
        Vec2::new(self.pvx[idx], self.pvy[idx])
    }

    pub fn set_player_vel(&mut self, idx: usize, vel: Vec2) {
        self.pvx[idx] = vel.x;
        self.pvy[idx] = vel.y;
    }

    pub fn team_slice(team: TeamId) -> core::ops::Range<usize> {
        match team {
            TeamId::Home => 0..N_PER_TEAM,
            TeamId::Away => N_PER_TEAM..N_PLAYERS,
        }
    }

    pub fn advance_overrides(&mut self) {
        for override_state in &mut self.prole_override {
            if override_state.ttl > 0 {
                override_state.ttl -= 1;
            }
        }
    }
}

fn default_role(slot: usize) -> PlayerRole {
    match slot {
        0 => PlayerRole::Goalkeeper,
        1 | 2 | 3 | 4 => PlayerRole::Defender,
        5 | 6 | 7 => PlayerRole::Midfielder,
        _ => PlayerRole::Forward,
    }
}

fn baseline_player(slot: usize) -> PlayerInput {
    let (pace, accel, agility, stamina, strength, first_touch, passing, vision, finishing, shot_power, tackling, interception) =
        match slot {
            0 => (45, 48, 52, 70, 78, 50, 55, 52, 20, 65, 45, 40),
            1 | 2 | 3 | 4 => (60, 58, 55, 78, 80, 58, 55, 52, 38, 62, 70, 68),
            5 | 6 | 7 => (68, 64, 68, 82, 68, 70, 72, 74, 55, 70, 58, 66),
            _ => (80, 76, 74, 78, 70, 68, 66, 62, 78, 88, 45, 58),
        };
    PlayerInput {
        pace,
        accel,
        agility,
        stamina,
        strength,
        first_touch,
        passing,
        vision,
        finishing,
        shot_power,
        tackling,
        interception,
        height_cm: 180,
        weight_kg: 75,
        foot: if slot % 5 == 0 {
            FootPreference::Left
        } else {
            FootPreference::Right
        },
        weak_foot: 3,
    }
}

fn clamp_to_pitch(pos: &mut Vec2) {
    let half_w = PITCH_W * 0.5 - R_BODY;
    let half_h = PITCH_H * 0.5 - R_BODY;
    pos.x = pos.x.clamp(-half_w, half_w);
    pos.y = pos.y.clamp(-half_h, half_h);
}
