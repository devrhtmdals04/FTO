use engine::engine::Engine;
use engine::params::TICKS_PER_SECOND;
use engine::types::BallMode;

#[test]
fn ball_transitions_from_air_to_ground() {
    let mut engine = Engine::new(7);
    engine.set_actions_enabled(false);
    engine.world.set_ball_mode(BallMode::Air);
    engine.world.bz = 8.0;
    engine.world.bvz = 12.0;
    engine.world.bvx = 5.0;
    engine.world.bvy = 2.0;

    for _ in 0..(15 * TICKS_PER_SECOND as usize) {
        engine.tick();
    }

    assert_eq!(engine.world.ball_mode(), BallMode::Ground);
    assert!(engine.world.bz.abs() < 0.05);
    assert!(engine.world.bvx.abs() < 5.0);
}
