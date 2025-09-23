#![allow(clippy::missing_inline_in_public_items)]

use wasm_bindgen::prelude::*;

pub mod ai;
pub mod commands;
pub mod engine;
pub mod params;
pub mod physics;
pub mod player_data;
pub mod rng;
pub mod rules;
pub mod snapshot;
pub mod spatial;
pub mod state;
pub mod tactics;
pub mod types;

use crate::engine::Engine;
use crate::snapshot::{DeltaBuffer, SnapshotBuffer};
use crate::state::N_PLAYERS;
use serde_json;

#[repr(C)]
#[derive(Clone, Copy, Default)]
pub struct PlayerView {
    pub x: f32,
    pub y: f32,
    pub hx: f32,
    pub hy: f32,
    pub vis_scale: f32,
    pub team_id: u8,
    _padding: [u8; 3],
}

#[repr(C)]
#[derive(Clone, Copy, Default)]
pub struct BallView {
    pub x: f32,
    pub y: f32,
    pub z: f32,
}

#[repr(C)]
pub struct SimView {
    pub tick: u32,
    pub ball: BallView,
    pub players: [PlayerView; N_PLAYERS],
}

#[cfg(feature = "console_error_panic_hook")]
fn set_panic_hook() {
    console_error_panic_hook::set_once();
}

#[cfg(not(feature = "console_error_panic_hook"))]
fn set_panic_hook() {}

#[wasm_bindgen]
pub struct WasmEngine {
    inner: Engine,
}

#[wasm_bindgen]
impl WasmEngine {
    #[wasm_bindgen(constructor)]
    pub fn new(seed: u64) -> Self {
        set_panic_hook();
        Self {
            inner: Engine::new(seed),
        }
    }

    pub fn tick(&mut self) {
        self.inner.tick();
    }

    pub fn snapshot(&mut self) -> Vec<u8> {
        let mut buf = SnapshotBuffer::default();
        self.inner.write_snapshot(&mut buf);
        buf.into_bytes()
    }

    pub fn delta(&mut self) -> Vec<u8> {
        let mut buf = DeltaBuffer::default();
        self.inner.write_delta(&mut buf);
        buf.into_bytes()
    }

    pub fn command(&mut self, cmd: JsValue) {
        self.inner.enqueue_command(cmd);
    }

    #[wasm_bindgen(js_name = getPlayerDataJson)]
    pub fn get_player_data_json(&self) -> String {
        let mut all_players = Vec::new();
        for i in 0..11 {
            all_players.push(crate::player_data::get_baseline_player(i, 0));
        }
        for i in 0..11 {
            all_players.push(crate::player_data::get_baseline_player(i, 1));
        }
        serde_json::to_string(&all_players).unwrap_or_else(|_| "[]".to_string())
    }

    #[wasm_bindgen]
    pub fn view_copy(&self, buffer: &mut [u8]) -> usize {
        let world = &self.inner.world;
        let view = SimView {
            tick: world.tick,
            ball: BallView {
                x: world.bx,
                y: world.by,
                z: world.bz,
            },
            players: {
                let mut players = [PlayerView::default(); N_PLAYERS];
                for i in 0..N_PLAYERS {
                    players[i] = PlayerView {
                        x: world.px[i],
                        y: world.py[i],
                        hx: world.pfacing[i].cos(),
                        hy: world.pfacing[i].sin(),
                        vis_scale: world.p_params[i].vis_scale,
                        team_id: world.p_team[i],
                        _padding: [0; 3],
                    };
                }
                players
            },
        };

        let view_size = std::mem::size_of::<SimView>();
        if buffer.len() < view_size {
            return 0;
        }

        unsafe {
            let view_ptr = &view as *const SimView as *const u8;
            buffer[..view_size].copy_from_slice(std::slice::from_raw_parts(view_ptr, view_size));
        }

        view_size
    }
}
