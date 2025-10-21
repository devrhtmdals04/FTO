use crate::types::{BlockType, OnBallLoose, Tactic};
use log::info;
use serde::{Deserialize, Serialize};
use serde_json;

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct QuantifiedTactics {
    pub line_height: f32,
    pub press_intensity: f32,
    pub team_width: f32,
    pub build_up_patience: f32,
    pub counter_press_intensity: f32,
    pub long_ball_preference: f32,
    pub overlap_intensity: f32,
    pub compactness: f32,
}

impl QuantifiedTactics {
    pub fn clamp(mut self) -> Self {
        self.line_height = self.line_height.clamp(0.0, 1.0);
        self.press_intensity = self.press_intensity.clamp(0.0, 1.0);
        self.team_width = self.team_width.clamp(0.0, 1.0);
        self.build_up_patience = self.build_up_patience.clamp(0.0, 1.0);
        self.counter_press_intensity = self.counter_press_intensity.clamp(0.0, 1.0);
        self.long_ball_preference = self.long_ball_preference.clamp(0.0, 1.0);
        self.overlap_intensity = self.overlap_intensity.clamp(0.0, 1.0);
        self.compactness = self.compactness.clamp(0.0, 1.0);
        self
    }
}

pub fn load_tactic_from_json(json_data: &str) -> Result<Tactic, serde_json::Error> {
    serde_json::from_str(json_data)
}

pub fn quantify(tactic: &Tactic) -> QuantifiedTactics {
    info!(
        "[Tactics] Quantifying tactic {} / {}",
        tactic.offensive_formation, tactic.defensive_formation
    );
    let team_tactic = &tactic.team_tactic;
    let mut quantified = QuantifiedTactics::default();

    quantified.press_intensity = match team_tactic.team_defending.high_block {
        BlockType::Pressing => 0.8,
        BlockType::MakeBlock => 0.3,
    };
    quantified.press_intensity += match team_tactic.team_defending.mid_block {
        BlockType::Pressing => 0.1,
        BlockType::MakeBlock => -0.1,
    };

    quantified.counter_press_intensity = match team_tactic.team_transition.on_ball_loose {
        OnBallLoose::CounterPress => 0.8,
        OnBallLoose::BackPosition => 0.2,
    };

    quantified.long_ball_preference = 1.0 - team_tactic.team_attacking.pass_distance;
    quantified.build_up_patience = if team_tactic.team_attacking.goalkeeper_engage {
        0.7
    } else {
        0.4
    };

    quantified.clamp()
}
