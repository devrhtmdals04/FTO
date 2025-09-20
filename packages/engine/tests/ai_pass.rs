use engine::ai::utility::pass_success_probability;

#[test]
fn pass_probability_decreases_with_distance_and_pressure() {
    let base = pass_success_probability(12.0, 0.0, 0.2, &[]);
    let long = pass_success_probability(32.0, 0.0, 0.2, &[]);
    let pressured = pass_success_probability(12.0, 0.0, 1.2, &[]);
    assert!(long < base);
    assert!(pressured < base);
}

#[test]
fn pass_probability_penalizes_interceptors() {
    let no_block = pass_success_probability(18.0, 0.1, 0.4, &[0.1, 0.2]);
    let heavy_block = pass_success_probability(18.0, 0.1, 0.4, &[0.8, 0.6]);
    assert!(heavy_block < no_block);
}
