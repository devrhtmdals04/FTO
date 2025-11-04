// This module is responsible for physics-related interactions between players
// and the ball. Commands from the AI or engine flow through here to update the
// world state in a single place.

use crate::ai::debug as dbg;
use crate::ai::TeamCtx;
use crate::params::{PITCH_W};
use crate::spatial::SpatialHash;
use crate::state::{World, N_PER_TEAM, N_PLAYERS};
use crate::types::{BallMode, Vec2};
use core::f32::consts::PI;
use rand::Rng;
use rand_pcg::Pcg32;

const BALL_RELEASE_COOLDOWN_TICKS: u64 = 2;
// const DRIBBLING_ENABLED: bool = true;

pub fn execute_kick(
    world: &mut World,
    home_team_ctx: &mut TeamCtx,
    away_team_ctx: &mut TeamCtx,
    player_id: u8,
    target: Vec2,
    base_speed: f32,
    loft: f32,
    airborne: bool,
) {
    let origin = world.player_pos(player_id as usize);
    let mut dir = (target - origin).normalize();
    if dir.norm() < 1e-4 {
        dir = Vec2::new(1.0, 0.0);
    }

    let speed = base_speed.max(0.0);
    let params = world.p_params[player_id as usize];
    let release_offset = params.ctrl_radius + 0.05;

    world.bx = origin.x + dir.x * release_offset;
    world.by = origin.y + dir.y * release_offset;
    world.bvx = dir.x * speed;
    world.bvy = dir.y * speed;

    if airborne {
        world.bvz = loft;
        world.set_ball_mode(BallMode::Air);
    } else {
        world.bvz = 0.0;
        world.set_ball_mode(BallMode::Ground);
    }

    world.possession = -1;

    let tick = world.tick as u64;
    apply_last_kick_tick(home_team_ctx, away_team_ctx, player_id as usize, tick);

    let until = tick + BALL_RELEASE_COOLDOWN_TICKS;
    apply_ball_relinquish(home_team_ctx, away_team_ctx, player_id as usize, until);
}

pub fn update_possession(world: &mut World, home_team_ctx: &TeamCtx, away_team_ctx: &TeamCtx) {

    let old_player_with_ball = world.player_with_ball();



    let mut closest_player_dist_sq = f32::MAX;

    let mut closest_player_id = -1;

    let ball_pos = world.ball_pos();



    for i in 0..N_PLAYERS {

        let player_pos = world.player_pos(i);

        let dist_sq = (player_pos - ball_pos).norm_squared();

        if dist_sq < closest_player_dist_sq {

            closest_player_dist_sq = dist_sq;

            closest_player_id = i as i32;

        }

    }



    if closest_player_id != -1 {

        let player_id = closest_player_id as usize;

        let params = world.p_params[player_id];

        if closest_player_dist_sq < params.ctrl_radius * params.ctrl_radius

            && !player_relinquish_active(world, home_team_ctx, away_team_ctx, player_id)

        {

            world.possession = world.team_id(player_id) as i8;

        } else {

            world.possession = -1;

        }

    } else {

        world.possession = -1;

    }



    let new_player_with_ball = world.player_with_ball();



    if new_player_with_ball != old_player_with_ball {

        if let Some(pid_idx) = new_player_with_ball {

            dbg::alert(

                world.tick as u64,

                pid_idx as u16,

                dbg::ReasonCode::BP,

                &format!("BallPossession, has_ball=true"),

            );

        }

    }

}

fn player_relinquish_active(
    world: &World,
    home_team_ctx: &TeamCtx,
    away_team_ctx: &TeamCtx,
    player_idx: usize,
) -> bool {
    let tick = world.tick as u64;
    if player_idx < N_PER_TEAM {
        if let Some(agent) = home_team_ctx.players.get(player_idx) {
            return tick < agent.execution.ball_relinquish_until;
        }
    } else {
        let local_idx = player_idx - N_PER_TEAM;
        if let Some(agent) = away_team_ctx.players.get(local_idx) {
            return tick < agent.execution.ball_relinquish_until;
        }
    }
    false
}

fn gaussian0_mean_sigma(sigma: f32, rng: &mut Pcg32) -> f32 {
    if sigma <= 0.0 {
        return 0.0;
    }
    let u1: f32 = rng.gen();
    let u2: f32 = rng.gen();
    let z0 = (-2.0 * u1.ln()).sqrt() * (2.0 * PI * u2).cos();
    z0 * sigma
}

fn choose_dir(world: &World, pid: usize) -> Vec2 {
    let team_id = world.p_team[pid];
    let goal_x = if team_id == 0 {
        PITCH_W / 2.0
    } else {
        -PITCH_W / 2.0
    };
    let goal_pos = Vec2::new(goal_x, 0.0);
    let player_pos = world.player_pos(pid);
    (goal_pos - player_pos).normalize()
}

fn rotate(vec: Vec2, angle: f32) -> Vec2 {
    let cos = angle.cos();
    let sin = angle.sin();
    Vec2::new(vec.x * cos - vec.y * sin, vec.x * sin + vec.y * cos)
}

pub fn handle_aerial_interactions(world: &mut World, _grid: &SpatialHash, rng: &mut Pcg32) {
    if world.ball_mode() != BallMode::Air {
        return;
    }

    let ball_pos = Vec2::new(world.bx, world.by);
    let ball_z = world.bz;

    let mut best_score = -1e9;
    let mut winner: Option<usize> = None;

    for pid in 0..N_PLAYERS {
        let params = world.p_params[pid];
        let head_reach_m = params.height_m + params.jump_gain_m;

        if ball_z <= head_reach_m + 0.02 {
            let player_pos = world.player_pos(pid);
            let dist_xy = player_pos.distance(ball_pos);

            if dist_xy < params.aerial_ctrl_rad {
                let score = 0.8 * (head_reach_m - ball_z) - 0.5 * dist_xy
                    + 0.02 * params.heading as f32
                    + 0.02 * params.strength as f32;

                if score > best_score {
                    best_score = score;
                    winner = Some(pid);
                }
            }
        }
    }

    if let Some(pid) = winner {
        let params = world.p_params[pid];
        let v_in = (world.bvx * world.bvx + world.bvy * world.bvy).sqrt();
        let v_out = (v_in * params.heading_power_mult).clamp(6.0, 28.0);
        let mut dir = choose_dir(world, pid);
        let theta_err = gaussian0_mean_sigma(params.heading_err_sigma_deg.to_radians(), rng);
        let normalized = rotate(dir, theta_err).normalize();
        dir.x = normalized.x;
        dir.y = normalized.y;

        world.bvx = v_out * dir.x;
        world.bvy = v_out * dir.y;
        world.bvz = (world.bvz * 0.3).max(0.0);
    }
}

fn apply_last_kick_tick(
    home_team_ctx: &mut TeamCtx,
    away_team_ctx: &mut TeamCtx,
    idx: usize,
    tick: u64,
) {
    if idx < N_PER_TEAM {
        if let Some(agent) = home_team_ctx.players.get_mut(idx) {
            agent.execution.controllers.ball.last_kick_tick = tick;
        }
    } else {
        let local_idx = idx - N_PER_TEAM;
        if let Some(agent) = away_team_ctx.players.get_mut(local_idx) {
            agent.execution.controllers.ball.last_kick_tick = tick;
        }
    }
}

fn apply_ball_relinquish(
    home_team_ctx: &mut TeamCtx,
    away_team_ctx: &mut TeamCtx,
    idx: usize,
    until: u64,
) {
    if idx < N_PER_TEAM {
        if let Some(agent) = home_team_ctx.players.get_mut(idx) {
            agent.execution.ball_relinquish_until =
                agent.execution.ball_relinquish_until.max(until);
        }
    } else {
        let local_idx = idx - N_PER_TEAM;
        if let Some(agent) = away_team_ctx.players.get_mut(local_idx) {
            agent.execution.ball_relinquish_until =
                agent.execution.ball_relinquish_until.max(until);
        }
    }
}