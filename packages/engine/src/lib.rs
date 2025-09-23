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

const VIEW_VERSION: u8 = 2;

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
    pub fn view_copy(&self, ptr_out: *mut u8, max_len: usize) -> usize {
        let world = &self.inner.world;
        let mut cursor = 0;

        let write_u8 = |ptr: *mut u8, val: u8, at: &mut usize| unsafe {
            if *at < max_len {
                *ptr.add(*at) = val;
                *at += 1;
            }
        };
        let write_u32 = |ptr: *mut u8, val: u32, at: &mut usize| unsafe {
            let bytes = val.to_le_bytes();
            if *at + bytes.len() <= max_len {
                std::ptr::copy_nonoverlapping(bytes.as_ptr(), ptr.add(*at), bytes.len());
                *at += bytes.len();
            }
        };
        let write_f32 = |ptr: *mut u8, val: f32, at: &mut usize| unsafe {
            let bytes = val.to_le_bytes();
            if *at + bytes.len() <= max_len {
                std::ptr::copy_nonoverlapping(bytes.as_ptr(), ptr.add(*at), bytes.len());
                *at += bytes.len();
            }
        };

        // Version
        write_u8(ptr_out, VIEW_VERSION, &mut cursor);
        cursor += 3; // Padding to align to 4 bytes

        // Tick
        write_u32(ptr_out, world.tick, &mut cursor);

        // Ball
        write_f32(ptr_out, world.bx, &mut cursor);
        write_f32(ptr_out, world.by, &mut cursor);
        write_f32(ptr_out, world.bz, &mut cursor);

        // Players
        for i in 0..N_PLAYERS {
            let params = &world.p_params[i];
            let (vis_y, vis_xz) = vis_from_params(params.height_m, params.bmi);

            write_f32(ptr_out, world.px[i], &mut cursor); // x
            write_f32(ptr_out, world.py[i], &mut cursor); // y
            write_f32(ptr_out, world.pfacing[i].cos(), &mut cursor); // hx
            write_f32(ptr_out, world.pfacing[i].sin(), &mut cursor); // hy
            write_f32(ptr_out, params.vis_scale, &mut cursor); // vis (legacy)
            write_f32(ptr_out, vis_y, &mut cursor); // vis_y
            write_f32(ptr_out, vis_xz, &mut cursor); // vis_xz
            write_u8(ptr_out, world.p_team[i], &mut cursor); // team
            cursor += 3; // Padding
        }

        cursor
    }
}
