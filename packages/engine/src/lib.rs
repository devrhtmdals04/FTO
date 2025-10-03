#![allow(clippy::missing_inline_in_public_items)]

use crate::state::compute_params_20;
use crate::state::PlayerInput20;
use serde::Serialize;
use wasm_bindgen::prelude::*;

// This function is called when the wasm module is loaded.
#[wasm_bindgen(start)]
pub fn start() {
    wasm_logger::init(wasm_logger::Config::default());
}

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

const VIEW_VERSION: u8 = 3;

#[derive(Serialize)]
struct PlayerProfileData {
    #[serde(flatten)]
    base: PlayerInput20,
    ctrl_radius: f32,
}

#[inline]
fn vis_from_params(height_m: f32, bmi: f32) -> (f32, f32) {
    const H_REF: f32 = 1.80;
    const BMI_REF: f32 = 22.0;

    let mut vis_y = height_m / H_REF;
    vis_y = vis_y.clamp(0.90, 1.15);

    let db = ((bmi - BMI_REF) / 8.0).clamp(-1.0, 1.0);
    let mut vis_xz = 1.0 + 0.10 * db;
    vis_xz = vis_xz.clamp(0.92, 1.12);

    (vis_y, vis_xz)
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

    pub fn set_ai_active(&mut self, player_index: usize, active: bool) {
        if let Some(is_active) = self.inner.ai_active.get_mut(player_index) {
            *is_active = active;
        }
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
        let mut all_players_data = Vec::new();
        for i in 0..11 {
            let base_stats = crate::player_data::get_baseline_player(i, 0);
            let params = compute_params_20(&base_stats);
            all_players_data.push(PlayerProfileData {
                base: base_stats,
                ctrl_radius: params.ctrl_radius,
            });
        }
        for i in 0..11 {
            let base_stats = crate::player_data::get_baseline_player(i, 1);
            let params = compute_params_20(&base_stats);
            all_players_data.push(PlayerProfileData {
                base: base_stats,
                ctrl_radius: params.ctrl_radius,
            });
        }
        serde_json::to_string(&all_players_data).unwrap_or_else(|_| "[]".to_string())
    }

    #[wasm_bindgen]
    pub fn view(&self) -> Vec<u8> {
        let world = &self.inner.world;
        let mut buffer = Vec::with_capacity(724);

        let write_u8 = |buf: &mut Vec<u8>, val: u8| {
            buf.push(val);
        };
        let write_u32 = |buf: &mut Vec<u8>, val: u32| {
            buf.extend_from_slice(&val.to_le_bytes());
        };
        let write_f32 = |buf: &mut Vec<u8>, val: f32| {
            buf.extend_from_slice(&val.to_le_bytes());
        };

        // Version
        write_u8(&mut buffer, VIEW_VERSION);
        buffer.extend_from_slice(&[0, 0, 0]); // Padding

        // Tick
        write_u32(&mut buffer, world.tick);

        // Ball
        write_f32(&mut buffer, world.bx);
        write_f32(&mut buffer, world.by);
        write_f32(&mut buffer, world.bz);

        // Players
        for i in 0..N_PLAYERS {
            let params = &world.p_params[i];
            let (vis_y, vis_xz) = vis_from_params(params.height_m, params.bmi);

            write_f32(&mut buffer, world.px[i]); // x
            write_f32(&mut buffer, world.py[i]); // y
            write_f32(&mut buffer, world.pfacing[i].cos()); // hx
            write_f32(&mut buffer, world.pfacing[i].sin()); // hy
            write_f32(&mut buffer, params.vis_scale); // vis (legacy)
            write_f32(&mut buffer, vis_y); // vis_y
            write_f32(&mut buffer, vis_xz); // vis_xz

            write_u8(&mut buffer, world.p_team[i]); // team
            write_u8(&mut buffer, if world.player_has_ball(i) { 1 } else { 0 });
            buffer.extend_from_slice(&[0, 0]); // Padding for alignment
        }

        buffer
    }
}
