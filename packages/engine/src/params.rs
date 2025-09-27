// Simulation time step, in seconds. (e.g., 0.05 for 20Hz)

pub const DT: f32 = 0.05; // 20Hz
// Number of simulation ticks per second.
pub const TICKS_PER_SECOND: u32 = 20;

// --- Pitch and Goal Dimensions (in meters) ---
// Pitch length (along the x-axis).
pub const PITCH_W: f32 = 105.0;
// Pitch width (along the y-axis).
pub const PITCH_H: f32 = 68.0;
// Width of the goal.
pub const GOAL_W: f32 = 7.32;
// Height of the goal.
pub const GOAL_HEIGHT: f32 = 2.44;
// Approximate radius of a player's body for collision.
pub const R_BODY: f32 = 0.35;

// --- Player Physics ---
// Maximum player speed in meters/second.
pub const PLAYER_VMAX: f32 = 10.0;
// Maximum player acceleration in meters/second^2.
pub const PLAYER_AMAX: f32 = 8.0;
// Maximum angular velocity (turning speed) in radians/second.
pub const OMEGA_MAX: f32 = 8.0;

// --- Ball Physics ---
// Gravitational acceleration in meters/second^2.
pub const G: f32 = 9.81;
// Coefficient of air resistance for the ball.
pub const MU_AIR: f32 = 0.01;
// Coefficient of ground friction for the ball.
pub const MU_GROUND: f32 = 0.1;
// Coefficient of friction during a bounce.
pub const MU_BOUNCE: f32 = 0.10;
// Coefficient of restitution for bounces (how bouncy the ball is).
pub const E_Z: f32 = 0.55;
// Minimum vertical velocity to trigger a bounce.
pub const VZ_MIN: f32 = 1.0;

// --- Spatial Hashing Grid for AI ---
// Number of grid cells along the x-axis.
pub const GRID_X: usize = 8;
// Number of grid cells along the y-axis.
pub const GRID_Y: usize = 6;
// Number of neighbors to consider in spatial hash queries.
pub const NEIGHBORS: usize = 6;

// --- AI Behavior ---
// How often (in ticks) an AI player re-evaluates their strategy.
pub const AI_REEVAL_PERIOD: u32 = 2;
// Number of future ball positions to sample for interception checks.
pub const INTERCEPT_SAMPLES: usize = 12;
// Number of best interception points to consider.
pub const INTERCEPT_TOPK: usize = 3;

// --- Snapshot Scaling (for data compression) ---
// Scaling factor for position data in snapshots.
pub const SNAPSHOT_POS_SCALE: f32 = 1.0 / 0.05; // 0.05m
// Scaling factor for velocity data in snapshots.
pub const SNAPSHOT_VEL_SCALE: f32 = 1.0 / 0.02; // 0.02m/s

// --- Tactics ---
// Cooldown period (in ticks) for tactical changes.
pub const TACTICS_COOLDOWN_TICKS: u32 = 10;
