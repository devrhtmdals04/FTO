use crate::params::{DT, PITCH_H, PITCH_W, R_BODY};
use crate::physics::collisions::separate_overlap;
use crate::state::{World, N_PLAYERS};
use crate::types::Vec2;

pub fn step_players(world: &mut World, ai_active: &[bool]) {
    let dt = DT;
    for idx in 0..N_PLAYERS {
        let has_manual_input = world.pcommand[idx].target_vel.norm_squared() > 1e-6;
        if ai_active[idx] || has_manual_input {
            integrate_player(world, idx, dt);
        }
    }
    resolve_player_collisions(world);
}

fn integrate_player(world: &mut World, idx: usize, dt: f32) {
    let params = world.p_params[idx]; //1.선수별 파라미터 가져오기.
    let cmd = world.pcommand[idx];

    let mut vel = world.player_vel(idx);
    let desired = cmd.target_vel.clamp_norm(params.v_max); // 2. 선수의 v_max사용.
    let delta = desired - vel;
    let max_delta = params.a_max * dt; //3. 선수의 a_max사용.
    let delta_step = clamp_vector(delta, max_delta);
    vel += delta_step;
    vel = vel.clamp_norm(params.v_max); //4. 최종 속도를 선수의 v_max로 제한.

    let mut pos = world.player_pos(idx);
    pos += vel * dt;
    clamp_to_pitch(&mut pos);

    if world.player_has_ball(idx) {
        let player_heading = world.pfacing[idx];
        const R_BALL: f32 = 0.11; // Ball radius
        let control_dist = R_BODY + R_BALL;

        // Target for the ball is right in front of the player's new position
        let ball_target_pos = pos + Vec2::new(player_heading.cos(), player_heading.sin()) * control_dist;

        // Nudge the ball towards this target
        let current_ball_pos = world.ball_pos();
        let required_ball_vel = (ball_target_pos - current_ball_pos) / dt;

        // Don't make it too fast, should be related to player's speed
        let max_ball_speed = vel.norm() * 1.2 + 1.0; // A bit faster than player
        let final_ball_vel = required_ball_vel.clamp_norm(max_ball_speed);

        world.bvx = final_ball_vel.x;
        world.bvy = final_ball_vel.y;
    }

    world.set_player_pos(idx, pos);
    world.set_player_vel(idx, vel);

    update_facing(world, idx, vel, params.omega_max, dt); //5. 선수의 omege_max사용.
    update_stamina(world, idx, vel.norm(), params); //6. 선수의 스태미나 파라미터 사용.
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
    let half_goal_w = crate::params::GOAL_W * 0.5;

    // Clamp Y coordinate
    pos.y = pos.y.clamp(-half_h, half_h);

    // If player is within the Y-range of the goal, allow them to go behind the line
    if pos.y.abs() < half_goal_w {
        // Allow them to go, for example, 2m behind the goal line
        let goal_depth = 2.0;
        pos.x = pos.x.clamp(-half_w - goal_depth, half_w + goal_depth);
    } else {
        // Otherwise, clamp to the normal pitch width
        pos.x = pos.x.clamp(-half_w, half_w);
    }
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
        let new_stamina_points =
            (current_stamina_points + stamina_change).clamp(0.0, params.stamina_max);

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
