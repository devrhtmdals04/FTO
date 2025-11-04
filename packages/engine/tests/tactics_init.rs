use engine::ai::Role;
use engine::engine::Engine;
use engine::state::{N_PER_TEAM, N_PLAYERS};

#[test]
fn test_engine_creation_with_tactics() {
    let engine = Engine::new(0);
    let default_tactics = engine::ai::QuantifiedTactics::default();

    assert_eq!(default_tactics.version, 0);
    assert!(default_tactics.phase_directives.is_empty());

    assert_eq!(engine.world.tactics[0].version, 1);
    assert!(!engine.world.tactics[0].phase_directives.is_empty());
    assert_eq!(engine.world.tactics[1].version, 1);
    assert!(!engine.world.tactics[1].phase_directives.is_empty());

    assert_eq!(
        engine.team_tactic(engine::types::TeamId::Home).roles().len(),
        N_PER_TEAM
    );
}

#[test]
fn test_player_class_creation() {
    let engine = Engine::new(0);
    for i in 0..N_PER_TEAM {
        assert_ne!(engine.home_team_ctx.players[i].role, Role::default());
        assert_ne!(engine.away_team_ctx.players[i].role, Role::default());
    }
}

/*
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
*/
