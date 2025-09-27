use engine::state::{compute_params_20, PlayerInput20};
use engine::types::Foot;

#[test]
fn test_reach_height() {
    let inp = PlayerInput20 {
        name: "Test Player",
        pace: 10,
        accel: 10,
        agility: 10,
        stamina: 10,
        strength: 10,
        first_touch: 10,
        passing: 10,
        vision: 10,
        finishing: 10,
        shot_power: 10,
        tackling: 10,
        interception: 10,
        heading: 10,
        jumping: 20,
        height_cm: 190,
        weight_kg: 78,
        foot: Foot::R,
        weak_foot: 3,
    };
    let params = compute_params_20(&inp);
    let head_reach_m = params.height_m + params.jump_gain_m;
    assert!(
        (head_reach_m - 2.45).abs() < 0.05,
        "head_reach_m is {}",
        head_reach_m
    );
}

#[test]
fn test_monotonicity() {
    let base_input = PlayerInput20 {
        name: "Test Player",
        pace: 10,
        accel: 10,
        agility: 10,
        stamina: 10,
        strength: 10,
        first_touch: 10,
        passing: 10,
        vision: 10,
        finishing: 10,
        shot_power: 10,
        tackling: 10,
        interception: 10,
        heading: 10,
        jumping: 10,
        height_cm: 180,
        weight_kg: 75,
        foot: Foot::R,
        weak_foot: 3,
    };

    let mut heavier_input = base_input;
    heavier_input.weight_kg = 95;

    let mut taller_input = base_input;
    taller_input.height_cm = 200;

    let base_params = compute_params_20(&base_input);
    let heavier_params = compute_params_20(&heavier_input);
    let taller_params = compute_params_20(&taller_input);

    assert!(heavier_params.stamina_move_cost > base_params.stamina_move_cost);
    assert!(heavier_params.collision_push > base_params.collision_push);

    assert!(taller_params.tackle_len > base_params.tackle_len);
    assert!(taller_params.omega_max < base_params.omega_max);
}
