use engine::engine::Engine;

#[test]
fn deterministic_state_hash_matches() {
    let mut a = Engine::new(42);
    let mut b = Engine::new(42);

    for _ in 0..120 {
        a.tick();
        b.tick();
    }

    assert_eq!(a.state_hash(), b.state_hash());
}
