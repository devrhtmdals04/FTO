use engine::rules::offside::check_offside;
use engine::state::World;
use engine::types::{MatchPhase, TeamId};

#[test]
fn detects_basic_offside_scenario() {
    let mut world = World::new(1);
    world.match_phase = MatchPhase::InPlay;
    world.possession = TeamId::Home.index() as i8;
    world.bx = 0.0;
    world.by = 0.0;

    for idx in World::team_slice(TeamId::Away) {
        world.px[idx] = (idx as f32 - 15.0) * 0.5;
    }
    for idx in World::team_slice(TeamId::Home) {
        world.px[idx] = -10.0 + idx as f32;
    }

    let striker_idx = World::team_slice(TeamId::Home).end - 1;
    world.px[striker_idx] = 15.0;

    assert!(check_offside(&world));

    world.px[striker_idx] = -1.0;
    assert!(!check_offside(&world));
}
