use super::formations;
use super::perception::LegacyPerceptionSnapshot as PerceptionSnapshot;
use super::phase::TeamPhase;
use crate::ai::utility::xt::XT_MAP;
use crate::ai::QuantifiedTactics;
use crate::state::N_PER_TEAM;
use crate::types::{TeamId, Vec2};

// --- Constants ---
const PITCH_W: f32 = 105.0;
const PITCH_H: f32 = 68.0;
const XT_GRID_COLS: i32 = 16;
const XT_GRID_ROWS: i32 = 12;

const SEARCH_RADIUS: f32 = 15.0;
const SEARCH_STEP: f32 = 3.0;

// --- Helper Structs ---
#[derive(Clone, Copy)]
pub struct GridIndex {
    pub col: i32,
    pub row: i32,
}

#[derive(Clone, Copy)]
pub struct PositioningWeights {
    pub w_xt: f32,
    pub w_formation: f32,
    pub w_space: f32,
}

impl Default for PositioningWeights {
    fn default() -> Self {
        Self {
            w_xt: 1.0,
            w_formation: 0.02,
            w_space: 0.5,
        }
    }
}

pub struct PositioningContext<'a> {
    pub anchor: Vec2,
    pub player_index: usize,
    pub team_phase: TeamPhase,
    pub perception: &'a PerceptionSnapshot,
    pub tactics: &'a QuantifiedTactics,
    pub weights: PositioningWeights,
    pub noise_bias: f32,
}

//공을 가진 선수를 기준으로 '이동하는 박스'를 만들어 그 공간을 기준으로 포지션 선정으로 개선할 예정.
// =======================================================
// 1. Main Positioning Module
// =======================================================
pub fn compute_best_position(ctx: &PositioningContext) -> Vec2 {
    let my_player_pos = ctx.perception.player_position;
    let mut best_position = my_player_pos;
    let mut best_score = -std::f32::INFINITY;

    let ideal_layout = formations::ideal_layout_for_phase(
        ctx.perception.team_id,
        ctx.team_phase,
        ctx.tactics,
    );
    let player_index_in_team = ctx.player_index % N_PER_TEAM;
    let home_pos = ideal_layout.positions[player_index_in_team];

    let weights = ctx.weights;

    let start_x = my_player_pos.x - SEARCH_RADIUS;
    let end_x = my_player_pos.x + SEARCH_RADIUS;
    let start_y = my_player_pos.y - SEARCH_RADIUS;
    let end_y = my_player_pos.y + SEARCH_RADIUS;

    let mut x = start_x;
    while x <= end_x {
        let mut y = start_y;
        while y <= end_y {
            let candidate_pos = Vec2::new(x, y);

            if !is_on_pitch(candidate_pos) {
                y += SEARCH_STEP;
                continue;
            }

            let score_xt = calculate_normalized_xt_score(candidate_pos, ctx.perception.team_id);
            let score_formation = calculate_normalized_formation_score(candidate_pos, home_pos);
            let _score_space = calculate_normalized_space_score(candidate_pos, ctx.perception);

            let total_score = (weights.w_xt * score_xt) + (weights.w_formation * score_formation);
            // + (weights.w_space * score_space);

            if total_score > best_score {
                best_score = total_score;
                best_position = candidate_pos;
            }
            y += SEARCH_STEP;
        }
        x += SEARCH_STEP;
    }

    best_position
}

// =======================================================
// 2. Score Calculation Modules
// =======================================================
pub fn calculate_normalized_xt_score(pos: Vec2, team_id: TeamId) -> f32 {
    let x = if team_id == TeamId::Home {
        pos.x
    } else {
        -pos.x
    };

    let x_ratio = (x + PITCH_W * 0.5) / PITCH_W;
    let y_ratio = (pos.y + PITCH_H * 0.5) / PITCH_H;

    let col_f = x_ratio * (XT_GRID_COLS as f32);
    let row_f = y_ratio * (XT_GRID_ROWS as f32);

    let col = (col_f as i32).clamp(0, XT_GRID_COLS - 1);
    let row = (row_f as i32).clamp(0, XT_GRID_ROWS - 1);

    XT_MAP[col as usize][row as usize]
}

fn calculate_normalized_formation_score(pos: Vec2, home_pos: Vec2) -> f32 {
    let dist = pos.distance(home_pos);
    // MAX_DEVIATION is a placeholder for the max distance a player can be from their formation position
    const MAX_DEVIATION: f32 = 30.0;
    1.0 - (dist / MAX_DEVIATION).clamp(0.0, 1.0)
}

fn calculate_normalized_space_score(pos: Vec2, perception: &PerceptionSnapshot) -> f32 {
    if let Some(opponent) = perception.closest_opponent {
        let dist = pos.distance(opponent.position);
        // MAX_SPACE is a placeholder for the ideal distance to an opponent
        const MAX_SPACE: f32 = 20.0;
        (dist / MAX_SPACE).clamp(0.0, 1.0)
    } else {
        1.0
    }
}

// =======================================================
// 3. Utility Functions
// =======================================================
fn is_on_pitch(pos: Vec2) -> bool {
    pos.x.abs() <= PITCH_W * 0.5 && pos.y.abs() <= PITCH_H * 0.5
}
