use engine::engine::Engine;
use engine::types::BallMode;

#[test]
fn ball_transitions_from_air_to_ground() {
    let mut engine = Engine::new(7);
    engine.world.set_ball_mode(BallMode::Air);
    engine.world.bz = 8.0;
    engine.world.bvz = 12.0;
    engine.world.bvx = 5.0;
    engine.world.bvy = 2.0;

    for _ in 0..300 {
        engine.tick();
    }

    assert_eq!(engine.world.ball_mode(), BallMode::Ground);
    assert!(engine.world.bz.abs() < 0.05);
    assert!(engine.world.bvx.abs() < 5.0);
}
