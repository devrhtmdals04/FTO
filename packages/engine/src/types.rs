use core::ops::{Add, AddAssign, Div, Mul, Sub, SubAssign};
use serde::{Deserialize, Serialize};

pub type PlayerIndex = usize;
pub const HOME_TEAM_INDEX: usize = 0;
pub const AWAY_TEAM_INDEX: usize = 1;

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum TeamId {
    Home,
    Away,
}

impl TeamId {
    pub fn index(self) -> usize {
        match self {
            TeamId::Home => HOME_TEAM_INDEX,
            TeamId::Away => AWAY_TEAM_INDEX,
        }
    }

    pub fn opponent(self) -> TeamId {
        match self {
            TeamId::Home => TeamId::Away,
            TeamId::Away => TeamId::Home,
        }
    }

    pub fn all() -> [TeamId; 2] {
        [TeamId::Home, TeamId::Away]
    }
}

#[derive(Clone, Copy, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct Vec2 {
    pub x: f32,
    pub y: f32,
}

impl Vec2 {
    pub const ZERO: Vec2 = Vec2 { x: 0.0, y: 0.0 };

    pub fn new(x: f32, y: f32) -> Self {
        Self { x, y }
    }

    pub fn dot(self, other: Vec2) -> f32 {
        self.x * other.x + self.y * other.y
    }

    pub fn norm(self) -> f32 {
        self.dot(self).sqrt()
    }

    pub fn norm_squared(self) -> f32 {
        self.dot(self)
    }

    pub fn normalize(self) -> Vec2 {
        let n = self.norm();
        if n > 1e-5 {
            self / n
        } else {
            Vec2::ZERO
        }
    }

    pub fn clamp_norm(self, max: f32) -> Vec2 {
        let sq = self.norm_squared();
        if sq > max * max {
            self.normalize() * max
        } else {
            self
        }
    }

    pub fn distance(self, other: Vec2) -> f32 {
        (self - other).norm()
    }
}

impl Add for Vec2 {
    type Output = Vec2;

    fn add(self, rhs: Vec2) -> Vec2 {
        Vec2::new(self.x + rhs.x, self.y + rhs.y)
    }
}

impl AddAssign for Vec2 {
    fn add_assign(&mut self, rhs: Vec2) {
        self.x += rhs.x;
        self.y += rhs.y;
    }
}

impl Sub for Vec2 {
    type Output = Vec2;

    fn sub(self, rhs: Vec2) -> Vec2 {
        Vec2::new(self.x - rhs.x, self.y - rhs.y)
    }
}

impl SubAssign for Vec2 {
    fn sub_assign(&mut self, rhs: Vec2) {
        self.x -= rhs.x;
        self.y -= rhs.y;
    }
}

impl Mul<f32> for Vec2 {
    type Output = Vec2;

    fn mul(self, rhs: f32) -> Vec2 {
        Vec2::new(self.x * rhs, self.y * rhs)
    }
}

impl Div<f32> for Vec2 {
    type Output = Vec2;

    fn div(self, rhs: f32) -> Vec2 {
        Vec2::new(self.x / rhs, self.y / rhs)
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum Foot {
    L,
    R,
}

impl Default for Foot {
    fn default() -> Self {
        Foot::R
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum BallMode {
    Ground,
    Air,
}

impl BallMode {
    pub fn as_u8(self) -> u8 {
        match self {
            BallMode::Ground => 0,
            BallMode::Air => 1,
        }
    }

    pub fn from_u8(raw: u8) -> Self {
        match raw {
            0 => BallMode::Ground,
            _ => BallMode::Air,
        }
    }
}

#[derive(Clone, Copy, Debug, Default, PartialEq, Serialize, Deserialize)]
pub struct Aabb {
    pub min: Vec2,
    pub max: Vec2,
}

impl Aabb {
    pub fn contains(&self, p: Vec2) -> bool {
        p.x >= self.min.x && p.x <= self.max.x && p.y >= self.min.y && p.y <= self.max.y
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum MatchPhase {
    PreKickoff,
    InPlay,
    Restart,
}

impl Default for MatchPhase {
    fn default() -> Self {
        MatchPhase::PreKickoff
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
pub enum PlayerRole {
    Goalkeeper,
    Defender,
    Midfielder,
    Forward,
}

impl Default for PlayerRole {
    fn default() -> Self {
        PlayerRole::Midfielder
    }
}

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct RoleParams {
    pub speed: f32,
    pub aggression: f32,
}

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct PlayerParams {
    pub v_max: f32,
    pub a_max: f32,
    pub omega_max: f32,
    pub ctrl_radius: f32,
    pub ctrl_angle_deg: f32,
    pub pass_err_sigma: f32,
    pub shot_err_sigma: f32,
    pub pass_speed_max: f32,
    pub shot_speed_max: f32,
    pub tackle_len: f32,
    pub tackle_rad: f32,
    pub foul_base: f32,
    pub collision_push: f32,
    pub intercept_react_ms: f32,
    pub weak_acc_mult: f32,
    pub weak_power_mult: f32,
    pub foot: Foot,
    pub stamina_max: f32,
    pub stamina_recovery: f32,
    pub stamina_move_cost: f32,

    // New params
    pub height_m: f32,
    pub mass_kg: f32,
    pub bmi: f32,
    pub aerial_ctrl_rad: f32,
    pub jump_gain_m: f32,
    pub heading_err_sigma_deg: f32,
    pub heading_power_mult: f32,
    pub jump_fatigue_floor: f32,
    pub vis_scale: f32,
    pub collider_radius_opt: f32,
    pub heading: u8,
    pub strength: u8,
}

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct PlayerCommandState {
    pub target_vel: Vec2,
    pub target_omega: f32,
}

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct RoleOverrideState {
    pub ttl: u16,
    pub params: RoleParams,
}
