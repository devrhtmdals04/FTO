use crate::params::{DT, PITCH_H, PITCH_W, R_BODY};
use crate::physics::collisions::separate_overlap;
use crate::state::{World, N_PLAYERS};
use crate::types::Vec2;

pub fn step_players(world: &mut World) {
    let dt = DT;
    for idx in 0..N_PLAYERS {
        integrate_player(world, idx, dt);
    }
    resolve_player_collisions(world);
}

fn integrate_player(world: &mut World, idx: usize, dt: f32) {
    let params = world.p_params[idx];
    let cmd = world.pcommand[idx];

    let mut vel = world.player_vel(idx);
    let desired = cmd.target_vel.clamp_norm(params.v_max);
    let delta = desired - vel;
    let max_delta = params.a_max * dt;
    let delta_step = clamp_vector(delta, max_delta);
    vel += delta_step;
    vel = vel.clamp_norm(params.v_max);

    let mut pos = world.player_pos(idx);
    pos += vel * dt;
    clamp_to_pitch(&mut pos);

    world.set_player_pos(idx, pos);
    world.set_player_vel(idx, vel);

    update_facing(world, idx, vel, params.omega_max, dt);
    update_stamina(world, idx, vel.norm(), params);
}

fn clamp_vector(vec: Vec2, max_len: f32) -> Vec2 {
    let len = vec.norm();
    if len > max_len && len > 1e-5 {
        vec * (max_len / len)
    } else {
        vec
    }
}

fn clamp_to_pitch(pos: &mut Vec2) {
    let half_w = PITCH_W * 0.5 - R_BODY;
    let half_h = PITCH_H * 0.5 - R_BODY;
    pos.x = pos.x.clamp(-half_w, half_w);
    pos.y = pos.y.clamp(-half_h, half_h);
}

fn update_facing(world: &mut World, idx: usize, vel: Vec2, omega_max: f32, dt: f32) {
    let speed = vel.norm();
    if speed < 0.1 {
        return;
    }
    let current = world.pfacing[idx];
    let desired = vel.y.atan2(vel.x);
    let delta = normalize_angle(desired - current);
    let max_step = omega_max * dt;
    let applied = delta.clamp(-max_step, max_step);
    world.pfacing[idx] = normalize_angle(current + applied);
}

fn update_stamina(world: &mut World, idx: usize, speed: f32, params: crate::types::PlayerParams) {
    if params.stamina_max > 0.0 {
        let cost_per_second = speed * params.stamina_move_cost;
        let recovery_per_second = params.stamina_recovery;

        let stamina_change = (recovery_per_second - cost_per_second) * DT;
        let current_stamina_points = world.pstamina[idx] * params.stamina_max;
        let new_stamina_points = (current_stamina_points + stamina_change).clamp(0.0, params.stamina_max);

        world.pstamina[idx] = new_stamina_points / params.stamina_max;
    }
}

fn normalize_angle(angle: f32) -> f32 {
    let mut a = angle;
    while a > core::f32::consts::PI {
        a -= 2.0 * core::f32::consts::PI;
    }
    while a < -core::f32::consts::PI {
        a += 2.0 * core::f32::consts::PI;
    }
    a
}

fn resolve_player_collisions(world: &mut World) {
    for i in 0..N_PLAYERS {
        for j in (i + 1)..N_PLAYERS {
            let pos_i = world.player_pos(i);
            let pos_j = world.player_pos(j);
            let (resolved_i, resolved_j) = separate_overlap(pos_i, pos_j, R_BODY * 2.0);
            world.set_player_pos(i, resolved_i);
            world.set_player_pos(j, resolved_j);
        }
    }
}
