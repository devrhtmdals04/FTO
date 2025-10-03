use crate::ai::xt;
use crate::params::{PITCH_H, PITCH_W};
use crate::state::{World, N_PER_TEAM, N_PLAYERS};
use crate::types::{TeamId, Vec2};

// The data structures for AI perception.
// These are defined here and used by other AI modules.

#[derive(Clone)]
pub enum Role {
    Gk,
    Df,
    Mf,
    Fw,
}

#[derive(Clone)]
pub struct PlayerObs {
    pub id: u32,
    pub team_id: u32,
    pub pos: Vec2,
    pub vel: Vec2,
    pub has_ball: bool,
    pub stamina: f32,
    pub role: Role,
}

#[derive(Clone)]
pub struct BallObs {
    pub pos: Vec2,
    pub vel: Vec2,
}

#[derive(Clone)]
pub struct GoalObs {
    pub center: Vec2,
    pub left_post: Vec2,
    pub right_post: Vec2,
}

#[derive(Clone)]
pub struct PassTarget {
    pub mate: PlayerObs,
    pub lane_open: f32,
    pub tti_receiver: f32,
    pub tti_opponent: f32,
    pub xt_gain: f32,
    pub risk: f32,
}

#[derive(Clone)]
pub struct Perception {
    pub me: PlayerObs,
    pub teammates: Vec<PlayerObs>,
    pub opponents: Vec<PlayerObs>,
    pub ball: BallObs,
    pub own_goal: GoalObs,
    pub opp_goal: GoalObs,
    pub tick: u32,

    // Pre-computed features
    pub dist_to_goal: f32,
    pub angle_to_goal: f32,
    pub nearest_opponent_dist: f32,
    pub open_lane_to_goal: f32,
    pub open_pass_targets: Vec<PassTarget>,
    pub free_forward_space: f32,
    pub target_pos: Vec2,
}

// --- Helper Functions for Perception Calculation ---

/// Estimates the time for a player to intercept a point on the pitch.
fn time_to_intercept(op_pos: Vec2, point: Vec2) -> f32 {
    let dist = (op_pos - point).norm();
    const MAX_SPEED: f32 = 6.5; // m/s, a reasonable average top speed.
    dist / MAX_SPEED
}

/// Calculates how open a lane is between two points, considering opponents.
fn lane_open(p0: Vec2, p1: Vec2, opponents: &[PlayerObs]) -> f32 {
    const N_SAMPLES: i32 = 10;
    let mut risk = 0.0;
    for k in 1..N_SAMPLES {
        let s = p0.lerp(p1, k as f32 / N_SAMPLES as f32);
        let min_tti = opponents
            .iter()
            .map(|op| time_to_intercept(op.pos, s))
            .fold(f32::INFINITY, f32::min);

        // If an opponent can intercept the mid-point of the pass in under 0.4s, it's risky.
        if min_tti < 0.4 {
            risk += 1.0;
        }
    }
    (1.0 - risk / (N_SAMPLES - 1) as f32).max(0.0)
}

// --- Main Perception Building Function ---

pub fn build_perception(world: &World, player_index: usize) -> Perception {
    let me_pos = world.player_pos(player_index);
    let me_team_id = world.team_id(player_index);

    let mut teammates = Vec::new();
    let mut opponents = Vec::new();

    // 1. Categorize all other players into teammates and opponents.
    for i in 0..N_PLAYERS {
        if i == player_index {
            continue;
        }

        let player = PlayerObs {
            id: i as u32,
            team_id: world.team_id(i) as u32,
            pos: world.player_pos(i),
            vel: world.player_vel(i),
            has_ball: world.player_has_ball(i),
            stamina: 1.0,   // Placeholder
            role: Role::Mf, // Placeholder
        };

        if player.team_id == me_team_id as u32 {
            teammates.push(player);
        } else {
            opponents.push(player);
        }
    }

    let me = PlayerObs {
        id: player_index as u32,
        team_id: me_team_id as u32,
        pos: me_pos,
        vel: world.player_vel(player_index),
        has_ball: world.player_has_ball(player_index),
        stamina: 1.0,   // Placeholder
        role: Role::Mf, // Placeholder
    };

    // 2. Calculate pre-computed features.
    let opp_goal_center = if me_team_id == TeamId::Home as u8 {
        Vec2::new(52.5, 0.0)
    } else {
        Vec2::new(-52.5, 0.0)
    };
    let own_goal_center = if me_team_id == TeamId::Home as u8 {
        Vec2::new(-52.5, 0.0)
    } else {
        Vec2::new(52.5, 0.0)
    };

    let opp_goal = GoalObs {
        center: opp_goal_center,
        left_post: opp_goal_center - Vec2::new(0.0, 3.66),
        right_post: opp_goal_center + Vec2::new(0.0, 3.66),
    };
    let own_goal = GoalObs {
        center: own_goal_center,
        left_post: own_goal_center - Vec2::new(0.0, 3.66),
        right_post: own_goal_center + Vec2::new(0.0, 3.66),
    };

    let dist_to_goal = (opp_goal.center - me_pos).norm();

    let to_left_post = opp_goal.left_post - me_pos;
    let to_right_post = opp_goal.right_post - me_pos;
    let angle_to_goal = to_left_post.angle_between(to_right_post).abs();

    let nearest_opponent_dist = opponents
        .iter()
        .map(|op| (op.pos - me_pos).norm())
        .fold(f32::INFINITY, f32::min);

    let open_lane_to_goal = lane_open(me_pos, opp_goal.center, &opponents);

    // 3. Analyze potential pass targets.
    let open_pass_targets = teammates
        .iter()
        .map(|mate| {
            let lane_open_score = lane_open(me_pos, mate.pos, &opponents);

            // Simplified TTI calculation for now.
            let tti_receiver = (mate.pos - world.ball_pos()).norm() / 6.0;
            let tti_opponent = opponents
                .iter()
                .map(|op| time_to_intercept(op.pos, mate.pos))
                .fold(f32::INFINITY, f32::min);

            let xt_gain = xt::expected_threat(mate.pos) - xt::expected_threat(me_pos);

            PassTarget {
                mate: mate.clone(),
                lane_open: lane_open_score,
                tti_receiver,
                tti_opponent,
                xt_gain,
                risk: 1.0 - lane_open_score, // Simplified risk, inverse of lane openness.
            }
        })
        .collect();

    let ball_pos = world.ball_pos();
    let ball_vel = world.ball_vel();
    let team_id = TeamId::from_index(me_team_id as usize);
    let slot_in_team = player_index % N_PER_TEAM;
    let lateral_band = (slot_in_team as f32 - 5.0) * 1.0;
    let forward_bias = match team_id {
        TeamId::Home => -6.0,
        TeamId::Away => 6.0,
    };

    let possession_team = world.possession;
    let player_params = world.p_params[player_index];
    let max_speed = player_params.v_max.max(0.1);
    let pursue_ball = possession_team != me_team_id as i8;

    let mut target_pos = if pursue_ball {
        let to_ball = ball_pos - me_pos;
        let distance = to_ball.norm();
        let travel_time = (distance / max_speed).clamp(0.0, 2.0);
        let predicted_ball = ball_pos + ball_vel * travel_time;
        predicted_ball
    } else {
        Vec2::new(ball_pos.x + forward_bias, ball_pos.y + lateral_band)
    };

    let half_w = PITCH_W * 0.5;
    let half_h = PITCH_H * 0.5;
    target_pos.x = target_pos.x.clamp(-half_w, half_w);
    target_pos.y = target_pos.y.clamp(-half_h, half_h);

    // 4. Assemble the final Perception object.
    Perception {
        me,
        teammates,
        opponents,
        ball: BallObs {
            pos: ball_pos,
            vel: ball_vel,
        },
        own_goal,
        opp_goal,
        tick: world.tick,
        dist_to_goal,
        angle_to_goal,
        nearest_opponent_dist,
        open_lane_to_goal,
        open_pass_targets,
        free_forward_space: 10.0, // Placeholder, requires more complex geometry calculation.
        target_pos,
    }
}
