use engine::physics::ball::aerial_interactions;
use engine::spatial::SpatialHash;
use engine::state::{compute_params_20, PlayerInput20, World};
use engine::types::{BallMode, Foot, Vec2};
use rand::SeedableRng;
use rand_pcg::Pcg32;

fn create_world(seed: u64) -> World {
    let mut world = World::new(seed);
    world.set_ball_mode(BallMode::Air);
    world.bz = 2.0;
    world
}

#[test]
fn test_aerial_determinism() {
    let mut world1 = create_world(123);
    let mut world2 = create_world(123);

    let mut grid1 = SpatialHash::new();
    grid1.rebuild(&world1);
    let mut rng1 = Pcg32::seed_from_u64(456);

    let mut grid2 = SpatialHash::new();
    grid2.rebuild(&world2);
    let mut rng2 = Pcg32::seed_from_u64(456);

    aerial_interactions(&mut world1, &grid1, &mut rng1);
    let ball_vel1 = (world1.bvx, world1.bvy, world1.bvz);

    aerial_interactions(&mut world2, &grid2, &mut rng2);
    let ball_vel2 = (world2.bvx, world2.bvy, world2.bvz);

    assert!((ball_vel1.0 - ball_vel2.0).abs() < 1e-6);
    assert!((ball_vel1.1 - ball_vel2.1).abs() < 1e-6);
    assert!((ball_vel1.2 - ball_vel2.2).abs() < 1e-6);
}

#[test]
fn test_heading_accuracy() {
    let mut world_low_heading = create_world(123);
    let mut world_high_heading = create_world(123);

    let mut input_low = baseline_player_20_test(0);
    input_low.heading = 5;

    let mut input_high = baseline_player_20_test(0);
    input_high.heading = 20;

    world_low_heading.p_params[0] = compute_params_20(&input_low);
    world_high_heading.p_params[0] = compute_params_20(&input_high);

    // Place player 0 right under the ball
    world_low_heading.set_player_pos(0, Vec2::new(world_low_heading.bx, world_low_heading.by));
    world_high_heading.set_player_pos(0, Vec2::new(world_high_heading.bx, world_high_heading.by));

    let mut grid = SpatialHash::new();
    let mut rng = Pcg32::seed_from_u64(1234);

    grid.rebuild(&world_low_heading);
    aerial_interactions(&mut world_low_heading, &grid, &mut rng);

    grid.rebuild(&world_high_heading);
    aerial_interactions(&mut world_high_heading, &grid, &mut rng);

    let ideal_dir = Vec2::new(1.0, 0.0); // Assuming goal is to the right
    let vel_low = Vec2::new(world_low_heading.bvx, world_low_heading.bvy).normalize();
    let vel_high = Vec2::new(world_high_heading.bvx, world_high_heading.bvy).normalize();

    let error_low = vel_low.distance(ideal_dir);
    let error_high = vel_high.distance(ideal_dir);

    assert!(error_high < error_low);
}

// Test helper
fn baseline_player_20_test(slot: usize) -> PlayerInput20 {
    let (
        pace,
        accel,
        agility,
        stamina,
        strength,
        first_touch,
        passing,
        vision,
        finishing,
        shot_power,
        tackling,
        interception,
        heading,
        jumping,
    ) = match slot {
        0 => (8, 8, 10, 12, 14, 9, 10, 10, 4, 11, 8, 8, 8, 10), // GK
        _ => (12, 11, 11, 14, 15, 11, 10, 10, 7, 11, 13, 13, 12, 12), // DEF
    };
    PlayerInput20 {
        name: "Test Player",
        pace,
        accel,
        agility,
        stamina,
        strength,
        first_touch,
        passing,
        vision,
        finishing,
        shot_power,
        tackling,
        interception,
        heading,
        jumping,
        height_cm: 180,
        weight_kg: 75,
        foot: if slot % 5 == 0 { Foot::L } else { Foot::R },
        weak_foot: 3,
    }
}
