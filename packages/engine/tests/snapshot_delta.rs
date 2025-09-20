use engine::engine::Engine;
use engine::snapshot::{DeltaBuffer, SnapshotBuffer};

#[test]
fn delta_is_smaller_when_no_changes() {
    let mut engine = Engine::new(5);
    let mut snapshot = SnapshotBuffer::default();
    engine.write_snapshot(&mut snapshot);
    let snapshot_bytes = snapshot.into_bytes();

    let mut delta = DeltaBuffer::default();
    engine.write_delta(&mut delta);
    let delta_bytes = delta.into_bytes();

    assert!(delta_bytes.len() <= snapshot_bytes.len());
}
