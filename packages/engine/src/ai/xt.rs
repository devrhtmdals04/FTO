use crate::params::{PITCH_H, PITCH_W};
use crate::types::Vec2;

pub const XT_COLS: usize = 12;
pub const XT_ROWS: usize = 8;

pub const XT_TABLE: [[f32; XT_COLS]; XT_ROWS] = [
    [0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.18, 0.24, 0.31, 0.38, 0.46, 0.55],
    [0.02, 0.03, 0.05, 0.08, 0.12, 0.18, 0.25, 0.33, 0.41, 0.49, 0.58, 0.66],
    [0.03, 0.05, 0.08, 0.12, 0.18, 0.25, 0.33, 0.42, 0.51, 0.60, 0.70, 0.80],
    [0.04, 0.07, 0.11, 0.17, 0.24, 0.32, 0.41, 0.51, 0.61, 0.71, 0.82, 0.92],
    [0.04, 0.07, 0.11, 0.17, 0.24, 0.32, 0.41, 0.51, 0.61, 0.71, 0.82, 0.92],
    [0.03, 0.05, 0.08, 0.12, 0.18, 0.25, 0.33, 0.42, 0.51, 0.60, 0.70, 0.80],
    [0.02, 0.03, 0.05, 0.08, 0.12, 0.18, 0.25, 0.33, 0.41, 0.49, 0.58, 0.66],
    [0.01, 0.02, 0.03, 0.05, 0.08, 0.12, 0.18, 0.24, 0.31, 0.38, 0.46, 0.55],
];

pub fn expected_threat(pos: Vec2) -> f32 {
    let x_norm = ((pos.x + 0.5 * PITCH_W) / PITCH_W).clamp(0.0, 1.0);
    let y_norm = ((pos.y + 0.5 * PITCH_H) / PITCH_H).clamp(0.0, 1.0);

    let fx = x_norm * (XT_COLS as f32 - 1.0);
    let fy = y_norm * (XT_ROWS as f32 - 1.0);

    let x0 = fx.floor() as usize;
    let x1 = (x0 + 1).min(XT_COLS - 1);
    let y0 = fy.floor() as usize;
    let y1 = (y0 + 1).min(XT_ROWS - 1);

    let sx = fx - x0 as f32;
    let sy = fy - y0 as f32;

    let v00 = XT_TABLE[y0][x0];
    let v10 = XT_TABLE[y0][x1];
    let v01 = XT_TABLE[y1][x0];
    let v11 = XT_TABLE[y1][x1];

    let vx0 = lerp(v00, v10, sx);
    let vx1 = lerp(v01, v11, sx);
    lerp(vx0, vx1, sy)
}

fn lerp(a: f32, b: f32, t: f32) -> f32 {
    a + (b - a) * t
}
