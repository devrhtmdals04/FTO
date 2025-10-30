#![allow(clippy::missing_inline_in_public_items)]

use crate::ai::{QuantifiedTactics, TeamPhase};
use crate::player_data::{get_baseline_player, get_baseline_player_by_id};
use crate::state::{compute_params_20, PlayerInput20, N_PER_TEAM};
use crate::types::TeamId;
use serde::Serialize;
use wasm_bindgen::prelude::*;

// This function is called when the wasm module is loaded.
#[wasm_bindgen(start)]
pub fn start() {
    wasm_logger::init(wasm_logger::Config::default());
}

#[macro_use]
pub mod ai;
pub mod commands;
pub mod engine;
pub mod logging_sink;
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

#[derive(Serialize)]
struct PlayerClassExport {
    index: usize,
    team: u8,
    player_id: u32,
    name: String,
    role: crate::types::DetailedPlayerRole,
    #[serde(rename = "role_id")]
    role_id: u8,
    quantified_tactics: QuantifiedTactics,
    personal_instructions: Option<crate::types::PlayerInstruction>,
    params: crate::types::PlayerParams,
    #[serde(rename = "base_stats")]
    base_stats: PlayerInput20,
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
        self.inner.set_ai_active(player_index, active);
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

    #[wasm_bindgen(js_name = getPlayerClassesJson)]
    pub fn get_player_classes_json(&self) -> String {
        let mut result = Vec::with_capacity(N_PLAYERS);
        for idx in 0..N_PLAYERS {
            let team_raw = self.inner.world.p_team[idx];
            let team = TeamId::from_index(team_raw as usize);
            let player_id = self.inner.world.p_player_id[idx];
            let base_stats = get_baseline_player_by_id(player_id)
                .unwrap_or_else(|| get_baseline_player(idx % N_PER_TEAM, team.index()));

            let tactic_model = self.inner.team_tactic(team);
            let quantified = self.inner.world.tactics[team.index()].clone();
            let lineup_slot = tactic_model
                .lineup_slot(player_id)
                .unwrap_or(idx % N_PER_TEAM);
            let role = tactic_model
                .role_for_slot(lineup_slot)
                .cloned()
                .unwrap_or(crate::types::DetailedPlayerRole::ST);
            let personal_instructions = tactic_model.personal_instruction(player_id).cloned();

            result.push(PlayerClassExport {
                index: idx,
                team: team_raw,
                player_id,
                name: base_stats.name.to_string(),
                role: role.clone(),
                role_id: role.to_u8(),
                quantified_tactics: quantified,
                personal_instructions,
                params: self.inner.world.p_params[idx],
                base_stats,
            });
        }

        serde_json::to_string(&result).unwrap_or_else(|_| "[]".to_string())
    }

    #[wasm_bindgen(js_name = getPlayerDataJson)]
    pub fn get_player_data_json(&self) -> String {
        let mut all_players_data = Vec::new();
        for i in 0..11 {
            let base_stats = crate::player_data::get_baseline_player(i, 0);
            all_players_data.push(PlayerProfileData {
                base: base_stats,
                ctrl_radius: compute_params_20(&base_stats).ctrl_radius,
            });
        }
        for i in 0..11 {
            let base_stats = crate::player_data::get_baseline_player(i, 1);
            all_players_data.push(PlayerProfileData {
                base: base_stats,
                ctrl_radius: compute_params_20(&base_stats).ctrl_radius,
            });
        }
        serde_json::to_string(&all_players_data).unwrap_or_else(|_| "[]".to_string())
    }

    #[wasm_bindgen(js_name = getXtMap)]
    pub fn get_xt_map(&self) -> JsValue {
        let xt_map_as_vec: Vec<Vec<f32>> = ai::utility::xt::XT_MAP
            .iter()
            .map(|row| row.to_vec())
            .collect();
        serde_wasm_bindgen::to_value(&xt_map_as_vec).unwrap()
    }

    fn player_role(&self, idx: usize) -> crate::types::DetailedPlayerRole {
        let team = TeamId::from_index(self.inner.world.p_team[idx] as usize);
        let player_id = self.inner.world.p_player_id[idx];
        let model = self.inner.team_tactic(team);
        let slot = model.lineup_slot(player_id).unwrap_or(idx % N_PER_TEAM);
        model
            .role_for_slot(slot)
            .cloned()
            .unwrap_or(crate::types::DetailedPlayerRole::ST)
    }

    #[wasm_bindgen]
    pub fn view(&self) -> Vec<u8> {
        let world = &self.inner.world;
        let mut buffer = Vec::with_capacity(726);

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

            // --- Calculate perception radius for visualization ---
            let player_id = world.p_player_id[i];
            let stats = get_baseline_player_by_id(player_id).unwrap();
            let vision_stat = stats.vision as f32;
            let normalized_vision = vision_stat / 20.0;
            let perception_radius = 10.0 + normalized_vision * 10.0;
            // --- End of calculation ---

            let role = self.player_role(i).to_u8();
            let team_id = TeamId::from_index(world.p_team[i] as usize);
            let team_phase_raw = if team_id == TeamId::Home {
                world.home_team_phase
            } else {
                world.away_team_phase
            };
            let team_phase = TeamPhase::from_u8(team_phase_raw);
            let has_ball = world.player_has_ball(i);
            let encoded_state = if has_ball {
                1u8
            } else if team_phase.is_attacking() {
                2u8
            } else {
                3u8
            };

            write_f32(&mut buffer, world.px[i]); // x
            write_f32(&mut buffer, world.py[i]); // y
            write_f32(&mut buffer, world.pfacing[i].cos()); // hx
            write_f32(&mut buffer, world.pfacing[i].sin()); // hy
            write_f32(&mut buffer, perception_radius); // vis (now perception_radius)
            write_f32(&mut buffer, vis_y); // vis_y
            write_f32(&mut buffer, vis_xz); // vis_xz

            write_u8(&mut buffer, world.p_team[i]); // team
            write_u8(&mut buffer, if has_ball { 1 } else { 0 });
            write_u8(&mut buffer, encoded_state); // simplified ai state
            write_u8(&mut buffer, role); // role
        }

        write_u8(&mut buffer, world.home_team_phase);
        write_u8(&mut buffer, world.away_team_phase);

        buffer
    }
}
