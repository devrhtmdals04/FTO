use crate::spatial::SpatialHash;
use crate::state::World;

pub mod ball;
pub mod collisions;
pub mod player;

pub struct PhysicsContext {
    pub spatial: SpatialHash,
}

impl PhysicsContext {
    pub fn new() -> Self {
        Self {
            spatial: SpatialHash::new(),
        }
    }

    pub fn rebuild_spatial(&mut self, world: &World) {
        self.spatial.clear();
        for idx in 0..crate::state::N_PLAYERS {
            self.spatial.insert(idx, world.player_pos(idx));
        }
    }
}

impl Default for PhysicsContext {
    fn default() -> Self {
        Self::new()
    }
}
