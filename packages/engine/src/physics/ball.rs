use crate::params::{
    DT, E_Z, G, MU_AIR, MU_BOUNCE, MU_GROUND, PITCH_H, PITCH_W, VZ_MIN,
};
use crate::physics::collisions::reflect;
use crate::state::World;
use crate::types::{BallMode, Vec2};

pub fn step_ball(world: &mut World) {
    match world.ball_mode() {
        BallMode::Ground => step_ground_ball(world),
        BallMode::Air => step_air_ball(world),
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

fn step_air_ball(world: &mut World) {
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
