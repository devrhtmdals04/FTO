use crate::params::{DT, PITCH_H, PITCH_W, R_BODY};
use crate::player_data::get_baseline_player;
use crate::tactics::Tactics;
use crate::types::{
    BallMode, Foot, MatchPhase, PlayerCommandState, PlayerParams, PlayerRole, RoleOverrideState,
    TeamId, Vec2,
};
use serde::Serialize;

// Constants for the number of players and teams.
pub const N_PLAYERS: usize = 22;
pub const N_PER_TEAM: usize = 11;
pub const N_TEAMS: usize = 2;

/// Represents a player's base attributes on a 1-20 scale.
/// These are the "raw stats" that are used to compute the final physics parameters.
#[repr(C)]
#[derive(Clone, Copy, Serialize)]
pub struct PlayerInput20 {
    pub name: &'static str,
    pub pace: u8,         // Top speed
    pub accel: u8,        // Acceleration
    pub agility: u8,      // Turning ability
    pub stamina: u8,      // Endurance
    pub strength: u8,     // Physical strength
    pub first_touch: u8,  // Ball control
    pub passing: u8,      // Passing accuracy
    pub vision: u8,       // Field awareness for passing
    pub finishing: u8,    // Shooting accuracy
    pub shot_power: u8,   // Shot power
    pub tackling: u8,     // Tackling ability
    pub interception: u8, // Ability to intercept passes
    pub heading: u8,      // Heading accuracy and power
    pub jumping: u8,      // Jumping height
    pub height_cm: u16,   // Player height in centimeters
    pub weight_kg: u16,   // Player weight in kilograms
    pub foot: Foot,       // Preferred foot (Left/Right)
    pub weak_foot: u8,    // Weak foot ability (1-5 scale)
}

/// The main struct holding the entire state of the simulation world.
#[repr(C)]
pub struct World {
    // --- Simulation Time ---
    pub tick: u32, // Current simulation tick.
    pub ms: u32,   // Current simulation time in milliseconds.
    pub seed: u64, // Seed for the random number generator.

    // --- Ball State ---
    pub bx: f32,    // Ball position (x-coordinate).
    pub by: f32,    // Ball position (y-coordinate).
    pub bvx: f32,   // Ball velocity (x-component).
    pub bvy: f32,   // Ball velocity (y-component).
    pub bz: f32,    // Ball height (z-coordinate).
    pub bvz: f32,   // Ball vertical velocity (z-component).
    pub bmode: u8,  // Current mode of the ball (Ground, Air).
    pub bspin: f32, // Ball spin (not currently used).

    // --- Match State ---
    pub match_phase: MatchPhase, // Current phase of the match (e.g., Kickoff, InPlay).
    pub home_score: u16,
    pub away_score: u16,
    pub possession: i8, // Which team has possession (-1 for none, 0 for Home, 1 for Away).

    // --- Team and Player Data ---
    pub tactics: [Tactics; N_TEAMS], // Tactical settings for each team.

    pub p_team: [u8; N_PLAYERS],             // Team ID for each player.
    pub p_role: [PlayerRole; N_PLAYERS],     // Tactical role for each player.
    pub p_params: [PlayerParams; N_PLAYERS], // Computed physics parameters for each player.

    // --- Player Physics State ---
    pub px: [f32; N_PLAYERS],       // Player position (x-coordinate).
    pub py: [f32; N_PLAYERS],       // Player position (y-coordinate).
    pub pvx: [f32; N_PLAYERS],      // Player velocity (x-component).
    pub pvy: [f32; N_PLAYERS],      // Player velocity (y-component).
    pub pfacing: [f32; N_PLAYERS],  // Player facing angle in radians.
    pub pstamina: [f32; N_PLAYERS], // Player stamina (0.0 to 1.0).

    // --- Player AI and Command State ---
    pub pcommand: [PlayerCommandState; N_PLAYERS], // Current command for each player (e.g., target velocity).
    pub prole_override: [RoleOverrideState; N_PLAYERS], // Temporary role overrides.
    pub plast_eval_tick: [u32; N_PLAYERS], // The tick when the player's AI last made a decision.
}

impl Default for World {
    fn default() -> Self {
        Self::new(0)
    }
}

impl World {
    /// Creates a new World instance with a given seed.
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
            pcommand: [PlayerCommandState::default(); N_PLAYERS],
            prole_override: [RoleOverrideState::default(); N_PLAYERS],
            plast_eval_tick: [0; N_PLAYERS],
        };
        world.initialize_params();
        world.reset_kickoff();
        world
    }

    /// Initializes the physics parameters for all players based on their baseline stats.
    fn initialize_params(&mut self) {
        for idx in 0..N_PLAYERS {
            let team_idx = idx / N_PER_TEAM;
            let slot = idx % N_PER_TEAM;
            let input = get_baseline_player(slot, team_idx);
            self.p_params[idx] = compute_params_20(&input);
        }
    }

    /// Resets the ball and player positions for a kickoff.
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
            self.pcommand[i] = PlayerCommandState::default();
        }
        self.arrange_default_positions();
    }

    /// Arranges players in a default formation.
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

    /// Advances the simulation time by one tick.
    pub fn tick(&mut self) {
        self.tick = self.tick.wrapping_add(1);
        self.ms = self.ms.wrapping_add((DT * 1000.0) as u32);
    }

    // --- Getters and Setters for World State ---

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

    pub fn team_id(&self, idx: usize) -> u8 {
        self.p_team[idx]
    }

    pub fn ball_pos(&self) -> Vec2 {
        Vec2::new(self.bx, self.by)
    }

    pub fn ball_vel(&self) -> Vec2 {
        Vec2::new(self.bvx, self.bvy)
    }

    /// Checks if a specific player is the closest on their team to the ball.
    pub fn player_has_ball(&self, idx: usize) -> bool {
        if self.possession != self.p_team[idx] as i8 {
            return false;
        }
        let player_pos = self.player_pos(idx);
        let ball_pos = self.ball_pos();
        let dist_sq = (player_pos - ball_pos).norm_squared();

        if dist_sq > 1.5 * 1.5 {
            // Must be within 1.5 meters
            return false;
        }

        let team_range = Self::team_slice(TeamId::from_index(self.p_team[idx] as usize));
        for i in team_range {
            if i == idx {
                continue;
            }
            let other_pos = self.player_pos(i);
            if (other_pos - ball_pos).norm_squared() < dist_sq {
                return false; // Another teammate is closer
            }
        }
        true
    }

    /// Returns a range of player indices for a given team.
    pub fn team_slice(team: TeamId) -> core::ops::Range<usize> {
        match team {
            TeamId::Home => 0..N_PER_TEAM,
            TeamId::Away => N_PER_TEAM..N_PLAYERS,
        }
    }

    /// Decrements the time-to-live (TTL) for any active role overrides.
    pub fn advance_overrides(&mut self) {
        for override_state in &mut self.prole_override {
            if override_state.ttl > 0 {
                override_state.ttl -= 1;
            }
        }
    }
}

/// Assigns a default role to a player based on their slot index (0-10).
fn default_role(slot: usize) -> PlayerRole {
    match slot {
        0 => PlayerRole::Goalkeeper,
        1 | 2 | 3 | 4 => PlayerRole::Defender,
        5 | 6 | 7 => PlayerRole::Midfielder,
        _ => PlayerRole::Forward,
    }
}

/// Clamps a player's position to be within the pitch boundaries.
fn clamp_to_pitch(pos: &mut Vec2) {
    let half_w = PITCH_W * 0.5 - R_BODY;
    let half_h = PITCH_H * 0.5 - R_BODY;
    pos.x = pos.x.clamp(-half_w, half_h);
    pos.y = pos.y.clamp(-half_h, half_h);
}

// --- Attribute Mapping Functions ---

/// Applies a power curve to a normalized (0-1) attribute value.
#[inline]
fn shape(u: f32, g: f32) -> f32 {
    u.powf(g)
}

/// Maps a 1-20 attribute to a physics value range, with higher attributes giving higher values.
/// `s`: The 1-20 attribute score.
/// `lo`: The minimum output value (for a score of 1).
/// `hi`: The maximum output value (for a score of 20).
/// `g`: A gamma factor to control the curve (1.0 for linear).
#[inline]
fn map_inc(s: u8, lo: f32, hi: f32, g: f32) -> f32 {
    let u = (s as f32).clamp(0.0, 20.0) / 20.0;
    lo + (hi - lo) * shape(u, g)
}

/// Maps a 1-20 attribute to a physics value range, with higher attributes giving lower values (e.g., for error).
#[inline]
fn map_dec(s: u8, lo: f32, hi: f32, g: f32) -> f32 {
    let u = (s as f32).clamp(0.0, 20.0) / 20.0;
    hi - (hi - lo) * shape(u, g)
}

/// Clamps a float value between a min and max.
#[inline]
fn clampf(x: f32, lo: f32, hi: f32) -> f32 {
    x.max(lo).min(hi)
}

/// Computes the final physics and skill parameters for a player based on their 1-20 attributes.
pub fn compute_params_20(inp: &PlayerInput20) -> PlayerParams {
    // --- Biomechanical Factors ---
    // Calculate height, mass, and BMI, and their deviation from an average player.
    let height_m = inp.height_cm as f32 / 100.0;
    let mass_kg = inp.weight_kg as f32;
    let bmi = mass_kg / (height_m * height_m);
    let dh = clampf((height_m - 1.80) / 0.25, -1.0, 1.0); // Height deviation
    let dm = clampf((mass_kg - 75.0) / 30.0, -1.0, 1.0); // Mass deviation
    let db = clampf((bmi - 24.0) / 8.0, -1.0, 1.0); // BMI deviation

    // --- Initial Parameter Mapping ---
    // Map base 1-20 attributes to initial physics values.
    let mut v_max = map_inc(inp.pace, 6.0, 9.0, 0.8);
    let mut a_max = map_inc(inp.accel, 6.0, 9.0, 0.8);
    let mut omega_max = map_inc(inp.agility, 6.0, 9.5, 1.1);
    let mut ctrl_radius = map_inc(inp.first_touch, 0.70, 1.30, 1.1);
    let ctrl_angle_deg = map_inc(inp.vision, 45.0, 120.0, 1.2);
    let pass_speed_max = map_inc(inp.shot_power, 16.0, 24.0, 1.0);
    let shot_speed_max = map_inc(inp.shot_power, 20.0, 32.0, 1.2);
    let mut tackle_len = map_inc(inp.tackling, 0.80, 1.40, 1.0);
    let mut tackle_rad = map_inc(inp.strength, 0.25, 0.45, 1.0);
    let mut collision_push = map_inc(inp.strength, 0.80, 1.20, 1.0);
    let mut stamina_max = map_inc(inp.stamina, 90.0, 140.0, 1.0);
    let stamina_recovery = map_inc(inp.stamina, 4.0, 9.0, 1.0);
    let pass_err_sigma = map_dec(inp.passing, 0.30, 1.20, 1.1); // Higher passing = lower error
    let shot_err_sigma = map_dec(inp.finishing, 0.40, 1.60, 1.2); // Higher finishing = lower error
    let mut stamina_move_cost = map_dec(inp.stamina, 0.18, 0.30, 1.0); // Higher stamina = lower cost
    let intercept_react_ms = map_dec(inp.interception, 120.0, 320.0, 1.0); // Higher interception = lower reaction time

    // --- Aerial Ability ---
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

    // --- Biomechanical Adjustments ---
    // Modify the initial parameters based on height, mass, and BMI.
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

    // Optional feature to scale player collider size based on their biometrics.
    #[cfg(feature = "body-size-from-bio")]
    let collider_radius_opt = R_BODY * clampf(1.00 + 0.04 * dh + 0.06 * dm, 0.92, 1.12);
    #[cfg(not(feature = "body-size-from-bio"))]
    let collider_radius_opt = -1.0;

    // --- Weak Foot Scaling ---
    let weak_grade = inp.weak_foot.clamp(1, 5) as f32;
    let weak_scale = (weak_grade - 1.0) / 4.0; // Normalize 1-5 scale to 0-1

    // Construct the final PlayerParams struct.
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
        weak_acc_mult: 0.4 + 0.6 * weak_scale, // Accuracy multiplier for weak foot
        weak_power_mult: 0.35 + 0.65 * weak_scale, // Power multiplier for weak foot
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
