use crate::params::{PITCH_H, PITCH_W, R_BODY, TICKS_PER_SECOND};
use crate::player_data::get_baseline_player;
use crate::tactics::Tactics;
use crate::types::{
    BallMode, Foot, MatchPhase, PlayerCommandState, PlayerParams, PlayerRole, RoleOverrideState,
    TeamId, Vec2,
};
use serde::Serialize;

pub const N_PLAYERS: usize = 22;
pub const N_PER_TEAM: usize = 11;
pub const N_TEAMS: usize = 2;

#[repr(C)]
#[derive(Clone, Copy, Serialize)]
pub struct PlayerInput20 {
    pub name: &'static str,
    pub pace: u8,
    pub accel: u8,
    pub agility: u8,
    pub stamina: u8,
    pub strength: u8,
    pub first_touch: u8,
    pub passing: u8,
    pub vision: u8,
    pub finishing: u8,
    pub shot_power: u8,
    pub tackling: u8,
    pub interception: u8,
    pub heading: u8,
    pub jumping: u8,
    pub height_cm: u16,
    pub weight_kg: u16,
    pub foot: Foot,
    pub weak_foot: u8, // 1..5
}

#[repr(C)]
pub struct World {
    pub tick: u32,
    pub ms: u32,
    pub ms_subtick: u32,
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
            ms_subtick: 0,
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
            let team_idx = idx / N_PER_TEAM;
            let slot = idx % N_PER_TEAM;
            let input = get_baseline_player(slot, team_idx);
            self.p_params[idx] = compute_params_20(&input);
        }
    }

    pub fn reset_kickoff(&mut self) {
        self.match_phase = MatchPhase::PreKickoff;
        self.possession = TeamId::Home.index() as i8;
        self.ms_subtick = 0;
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
            self.pcommand[i] = PlayerCommandState::default();
        }
        self.arrange_default_positions();
    }

    fn arrange_default_positions(&mut self) {
        let spacing_x = 12.0;
        let spacing_y = 8.0;
        for i in 0..N_PLAYERS {
            let team = if i < N_PER_TEAM {
                TeamId::Home
            } else {
                TeamId::Away
            };
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
        const MS_BASE: u32 = 1000 / TICKS_PER_SECOND;
        const MS_REMAINDER: u32 = 1000 % TICKS_PER_SECOND;

        self.tick = self.tick.wrapping_add(1);
        self.ms = self.ms.wrapping_add(MS_BASE);
        self.ms_subtick += MS_REMAINDER;
        if self.ms_subtick >= TICKS_PER_SECOND {
            self.ms = self.ms.wrapping_add(1);
            self.ms_subtick -= TICKS_PER_SECOND;
        }
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

fn clamp_to_pitch(pos: &mut Vec2) {
    let half_w = PITCH_W * 0.5 - R_BODY;
    let half_h = PITCH_H * 0.5 - R_BODY;
    pos.x = pos.x.clamp(-half_w, half_w);
    pos.y = pos.y.clamp(-half_h, half_h);
}

#[inline]
fn shape(u: f32, g: f32) -> f32 {
    u.powf(g)
}
#[inline]
fn map_inc(s: u8, lo: f32, hi: f32, g: f32) -> f32 {
    let u = (s as f32).clamp(0.0, 20.0) / 20.0;
    lo + (hi - lo) * shape(u, g)
}
#[inline]
fn map_dec(s: u8, lo: f32, hi: f32, g: f32) -> f32 {
    let u = (s as f32).clamp(0.0, 20.0) / 20.0;
    hi - (hi - lo) * shape(u, g)
}
#[inline]
fn clampf(x: f32, lo: f32, hi: f32) -> f32 {
    x.max(lo).min(hi)
}

pub fn compute_params_20(inp: &PlayerInput20) -> PlayerParams {
    let height_m = inp.height_cm as f32 / 100.0;
    let mass_kg = inp.weight_kg as f32;
    let bmi = mass_kg / (height_m * height_m);
    let dh = clampf((height_m - 1.80) / 0.25, -1.0, 1.0);
    let dm = clampf((mass_kg - 75.0) / 30.0, -1.0, 1.0);
    let db = clampf((bmi - 24.0) / 8.0, -1.0, 1.0);

    let mut v_max = map_inc(inp.pace, 5.6, 7.6, 1.0);
    let mut a_max = map_inc(inp.accel, 3.0, 5.5, 1.0);
    let mut omega_max = map_inc(inp.agility, 4.0, 7.5, 1.1);
    let mut ctrl_radius = map_inc(inp.first_touch, 0.70, 1.30, 1.1);
    let ctrl_angle_deg = map_inc(inp.vision, 45.0, 120.0, 1.2);
    let pass_speed_max = map_inc(inp.shot_power, 16.0, 24.0, 1.0);
    let shot_speed_max = map_inc(inp.shot_power, 20.0, 32.0, 1.2);
    let mut tackle_len = map_inc(inp.tackling, 0.80, 1.40, 1.0);
    let mut tackle_rad = map_inc(inp.strength, 0.25, 0.45, 1.0);
    let mut collision_push = map_inc(inp.strength, 0.80, 1.20, 1.0);
    let mut stamina_max = map_inc(inp.stamina, 90.0, 140.0, 1.0);
    let stamina_recovery = map_inc(inp.stamina, 4.0, 9.0, 1.0);
    let pass_err_sigma = map_dec(inp.passing, 0.30, 1.20, 1.1);
    let shot_err_sigma = map_dec(inp.finishing, 0.40, 1.60, 1.2);
    let mut stamina_move_cost = map_dec(inp.stamina, 0.18, 0.30, 1.0);
    let intercept_react_ms = map_dec(inp.interception, 120.0, 320.0, 1.0);

    let jump_gain_m = map_inc(inp.jumping, 0.15, 0.60, 1.2);
    let mut aerial_ctrl_rad = map_inc(inp.heading, 0.32, 0.44, 1.0);
    let heading_err_sigma_deg = map_dec(inp.heading, 5.0, 18.0, 1.1);
    let heading_power_mult = map_inc(
        ((inp.heading as u16 + inp.strength as u16 + inp.jumping as u16) / 3) as u8,
        0.65,
        1.05,
        1.0,
    );
    let jump_fatigue_floor = 0.6;

    v_max *= clampf(1.00 + 0.06 * dh - 0.04 * dm, 0.92, 1.06);
    a_max *= clampf(1.00 - 0.10 * dm - 0.03 * dh, 0.85, 1.05);
    omega_max *= clampf(1.00 - 0.15 * dh - 0.05 * dm, 0.80, 1.05);
    stamina_max *= clampf(1.00 + 0.05 * dh - 0.08 * dm, 0.90, 1.10);
    stamina_move_cost *= clampf(1.00 + 0.20 * dm, 0.85, 1.25);
    ctrl_radius *= clampf(1.00 - 0.06 * db, 0.92, 1.06);
    tackle_len += clampf(0.02 * dh, -0.02, 0.02);
    tackle_rad += clampf(0.01 * dm, -0.01, 0.01);
    collision_push *= clampf(1.00 + 0.12 * dm + 0.03 * dh, 0.92, 1.15);
    aerial_ctrl_rad = clampf(
        aerial_ctrl_rad + clampf((height_m - 1.80) * 0.04, -0.02, 0.03),
        0.30,
        0.50,
    );
    let vis_scale = clampf(1.00 + 0.20 * dh + 0.05 * dm, 0.90, 1.15);

    #[cfg(feature = "body-size-from-bio")]
    let collider_radius_opt = R_BODY * clampf(1.00 + 0.04 * dh + 0.06 * dm, 0.92, 1.12);
    #[cfg(not(feature = "body-size-from-bio"))]
    let collider_radius_opt = -1.0;

    let weak_grade = inp.weak_foot.clamp(1, 5) as f32;
    let weak_scale = (weak_grade - 1.0) / 4.0;

    PlayerParams {
        v_max,
        a_max,
        omega_max,
        ctrl_radius,
        ctrl_angle_deg,
        pass_err_sigma,
        shot_err_sigma,
        pass_speed_max,
        shot_speed_max,
        tackle_len,
        tackle_rad,
        foul_base: 0.1, // Placeholder
        collision_push,
        intercept_react_ms,
        weak_acc_mult: 0.4 + 0.6 * weak_scale,
        weak_power_mult: 0.35 + 0.65 * weak_scale,
        foot: inp.foot,
        stamina_max,
        stamina_recovery,
        stamina_move_cost,
        height_m,
        mass_kg,
        bmi,
        aerial_ctrl_rad,
        jump_gain_m,
        heading_err_sigma_deg,
        heading_power_mult,
        jump_fatigue_floor,
        vis_scale,
        collider_radius_opt,
        heading: inp.heading,
        strength: inp.strength,
    }
}
