use engine::engine::Engine;
use engine::state::N_PLAYERS;

#[test]
fn test_engine_creation_with_tactics() {
    let engine = Engine::new(0);
    let default_tactics = engine::tactics::QuantifiedTactics::default();

    // Check that home and away tactics are not the default ones
    assert_ne!(
        engine.world.tactics[0].press_intensity,
        default_tactics.press_intensity
    );
    assert_ne!(
        engine.world.tactics[1].press_intensity,
        default_tactics.press_intensity
    );
}

#[test]
fn test_player_class_creation() {
    let engine = Engine::new(0);
    for i in 0..N_PLAYERS {
        assert!(engine.get_player_class(i).is_some());
    }
}

#[test]
fn test_personal_instructions_applied() {
    let engine = Engine::new(0);
    let player_10_class = engine.get_player_class(10).unwrap();

    assert!(player_10_class.personal_instructions.is_some());
    if let Some(instr) = &player_10_class.personal_instructions {
        assert_eq!(instr.risk_intensity, 0.8);
        assert_eq!(instr.defense_participation, 0.2);
        assert_eq!(instr.attacking_participation, 0.9);
    }
}
