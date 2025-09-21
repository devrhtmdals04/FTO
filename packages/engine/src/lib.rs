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
use serde_json;

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
}
