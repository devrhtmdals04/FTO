use crate::params::{DT, E_Z, G, MU_AIR, MU_BOUNCE, MU_GROUND, PITCH_H, PITCH_W, VZ_MIN};
use crate::physics::collisions::reflect;
use crate::spatial::SpatialHash;
use crate::state::{World, N_PLAYERS};
use crate::types::{BallMode, Vec2};
use rand::Rng;
use rand_pcg::Pcg32;

pub fn step_ball(world: &mut World, grid: &SpatialHash, rng: &mut Pcg32) {
    match world.ball_mode() {
        BallMode::Ground => step_ground_ball(world),
        BallMode::Air => step_air_ball(world, grid, rng),
    }
    clamp_within_pitch(world);
}

fn step_ground_ball(world: &mut World) {
    let dt = DT;
    let mut vx = world.bvx;
    let mut vy = world.bvy;
    let speed = (vx * vx + vy * vy).sqrt();
    if speed > 0.0 {
        let friction = MU_GROUND * dt;
        let damping = (1.0 - friction).clamp(0.0, 1.0);
        vx *= damping;
        vy *= damping;
        if vx.abs() < 0.02 {
            vx = 0.0;
        }
        if vy.abs() < 0.02 {
            vy = 0.0;
        }
    }

    world.bx += vx * dt;
    world.by += vy * dt;
    world.bvx = vx;
    world.bvy = vy;
    world.bz = 0.0;
    world.bvz = 0.0;
}

fn step_air_ball(world: &mut World, grid: &SpatialHash, rng: &mut Pcg32) {
    aerial_interactions(world, grid, rng);

    let dt = DT;
    world.bvz -= G * dt;
    world.bvz *= 1.0 - MU_AIR * dt;
    world.bvx *= 1.0 - MU_AIR * dt;
    world.bvy *= 1.0 - MU_AIR * dt;

    world.bx += world.bvx * dt;
    world.by += world.bvy * dt;
    world.bz += world.bvz * dt;

    if world.bz <= 0.0 {
        world.bz = 0.0;
        if world.bvz.abs() > VZ_MIN {
            world.bvz = -world.bvz * E_Z;
            world.bvx *= 1.0 - MU_BOUNCE;
            world.bvy *= 1.0 - MU_BOUNCE;
        } else {
            world.bvz = 0.0;
            world.set_ball_mode(BallMode::Ground);
        }
    }
}

fn gaussian0_mean_sigma(sigma: f32, rng: &mut Pcg32) -> f32 {
    if sigma <= 0.0 {
        return 0.0;
    }
    let u1: f32 = rng.gen::<f32>().max(std::f32::EPSILON);
    let u2: f32 = rng.gen();
    let z0 = (-2.0 * u1.ln()).sqrt() * (2.0 * std::f32::consts::PI * u2).cos();
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

pub fn aerial_interactions(world: &mut World, _grid: &SpatialHash, rng: &mut Pcg32) {
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
                    + 0.02 * (params.heading as f32)
                    + 0.02 * (params.strength as f32);

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

fn clamp_within_pitch(world: &mut World) {
    let half_w = PITCH_W * 0.5;
    let half_h = PITCH_H * 0.5;
    if world.bx.abs() > half_w {
        let normal = if world.bx > 0.0 { -1.0 } else { 1.0 };
        world.bx = world.bx.clamp(-half_w, half_w);
        let reflected = reflect(Vec2::new(world.bvx, world.bvy), Vec2::new(normal, 0.0));
        world.bvx = reflected.x;
        world.bvy = reflected.y;
    }
    if world.by.abs() > half_h {
        let normal = if world.by > 0.0 { -1.0 } else { 1.0 };
        world.by = world.by.clamp(-half_h, half_h);
        let reflected = reflect(Vec2::new(world.bvx, world.bvy), Vec2::new(0.0, normal));
        world.bvx = reflected.x;
        world.bvy = reflected.y;
    }
}
