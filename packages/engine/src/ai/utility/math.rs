
#[inline] pub fn clamp(x: f32, lo: f32, hi: f32) -> f32 { x.max(lo).min(hi) }
#[inline] pub fn quant_u16_01(x: f32) -> f32 { (clamp(x,0.0,1.0) * 512.0).round() / 512.0 }
#[inline] pub fn quant_angle_rad(x: f32) -> f32 { // ~0.5° 스텝
    let step = std::f32::consts::PI / 360.0;
    (x / step).round() * step
}
pub const PASS_THETA_TOL: f32 = 8.0_f32.to_radians();
pub const PASS_D_IMPACT: f32 = 0.70; // m
pub const REPLAN_MIN_SUBTICKS: u64 = 2; // 100ms
