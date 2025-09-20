use crate::params::{INTERCEPT_SAMPLES, INTERCEPT_TOPK};
use std::vec::Vec;

pub fn pass_success_probability(
    dist: f32,
    angle: f32,
    pressure: f32,
    interceptors: &[f32],
) -> f32 {
    let angle_deg = angle.to_degrees().abs();
    let density_penalty = interceptors.iter().fold(0.0_f32, |acc, v| acc.max(*v));

    let z = 3.2 - 0.045 * dist - 0.015 * angle_deg - 1.1 * pressure - 1.3 * density_penalty;
    sigmoid(z)
}

pub fn intercept_scores(
    distances: &[f32; INTERCEPT_SAMPLES],
    top_speed: f32,
    reaction_ms: f32,
) -> [f32; INTERCEPT_SAMPLES] {
    let reaction = reaction_ms.max(0.0) / 1000.0;
    let mut out = [0.0; INTERCEPT_SAMPLES];
    let speed = top_speed.max(0.1);
    for (i, dist) in distances.iter().enumerate() {
        let travel_time = dist / speed;
        let arrival = reaction + travel_time;
        let pressure = 1.0 - (arrival / 2.0).clamp(0.0, 1.0);
        out[i] = pressure;
    }
    out
}

pub fn select_topk(scores: &[f32; INTERCEPT_SAMPLES]) -> [f32; INTERCEPT_TOPK] {
    let mut indexed: Vec<(usize, f32)> = scores
        .iter()
        .copied()
        .enumerate()
        .collect();
    indexed.sort_by(|a, b| b.1.partial_cmp(&a.1).unwrap_or(core::cmp::Ordering::Equal));
    let mut out = [0.0; INTERCEPT_TOPK];
    for (i, (_idx, value)) in indexed.into_iter().take(INTERCEPT_TOPK).enumerate() {
        out[i] = value;
    }
    out
}

pub fn utility_move(x_t: f32, pressure: f32, stamina_cost: f32) -> f32 {
    1.2 * x_t - 0.8 * pressure - 0.3 * stamina_cost
}

pub fn utility_pass(target_xt: f32, pass_probability: f32) -> f32 {
    target_xt * pass_probability
}

pub fn utility_shoot(p_shot: f32) -> f32 {
    2.0 * p_shot
}

fn sigmoid(z: f32) -> f32 {
    1.0 / (1.0 + (-z).exp())
}
