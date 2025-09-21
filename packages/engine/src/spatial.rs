use crate::params::{GRID_X, GRID_Y, PITCH_H, PITCH_W};
use crate::state::{World, N_PLAYERS};
use crate::types::Vec2;

const TOTAL_CELLS: usize = GRID_X * GRID_Y;

#[derive(Clone)]
pub struct SpatialHash {
    cells: [Vec<usize>; TOTAL_CELLS],
}

impl Default for SpatialHash {
    fn default() -> Self {
        Self::new()
    }
}

impl SpatialHash {
    pub fn new() -> Self {
        Self {
            cells: std::array::from_fn(|_| Vec::new()),
        }
    }

    pub fn clear(&mut self) {
        for cell in &mut self.cells {
            cell.clear();
        }
    }

    pub fn insert(&mut self, idx: usize, pos: Vec2) {
        if let Some(cell) = self.cell_mut(pos) {
            cell.push(idx);
        }
    }

    pub fn rebuild(&mut self, world: &World) {
        self.clear();
        for idx in 0..N_PLAYERS {
            self.insert(idx, world.player_pos(idx));
        }
    }

    pub fn neighbors(&self, pos: Vec2) -> &[usize] {
        let idx = self.index(pos).unwrap_or(0);
        &self.cells[idx]
    }

    fn cell_mut(&mut self, pos: Vec2) -> Option<&mut Vec<usize>> {
        let idx = self.index(pos)?;
        self.cells.get_mut(idx)
    }

    fn index(&self, pos: Vec2) -> Option<usize> {
        let gx = ((pos.x + 0.5 * PITCH_W) / PITCH_W * GRID_X as f32).floor() as isize;
        let gy = ((pos.y + 0.5 * PITCH_H) / PITCH_H * GRID_Y as f32).floor() as isize;
        if gx < 0 || gy < 0 || gx >= GRID_X as isize || gy >= GRID_Y as isize {
            return None;
        }
        Some((gy as usize) * GRID_X + gx as usize)
    }
}
