use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct Tactics {
    pub line_height: f32,
    pub press_intensity: f32,
    pub team_width: f32,
    pub build_up: f32,
    pub counter_press: f32,
    pub long_ball_bias: f32,
    pub overlap_fullbacks: f32,
    pub compactness: f32,
}

impl Tactics {
    pub fn clamp(mut self) -> Self {
        self.line_height = self.line_height.clamp(0.0, 1.0);
        self.press_intensity = self.press_intensity.clamp(0.0, 1.0);
        self.team_width = self.team_width.clamp(0.0, 1.0);
        self.build_up = self.build_up.clamp(0.0, 1.0);
        self.counter_press = self.counter_press.clamp(0.0, 1.0);
        self.long_ball_bias = self.long_ball_bias.clamp(0.0, 1.0);
        self.overlap_fullbacks = self.overlap_fullbacks.clamp(0.0, 1.0);
        self.compactness = self.compactness.clamp(0.0, 1.0);
        self
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UiCustomFormationSlot {
    pub role: String,
    pub x: f32,
    pub y: f32,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UiInPossessionTactic {
    pub formation: String,
    pub style: String,
    #[serde(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_formation: Option<Vec<UiCustomFormationSlot>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UiOutOfPossessionTactic {
    pub formation: String,
    pub style: String,
    #[serde(default)]
    #[serde(skip_serializing_if = "Option::is_none")]
    pub custom_formation: Option<Vec<UiCustomFormationSlot>>,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
#[serde(rename_all = "camelCase")]
pub struct UiTransitionTactic {
    pub on_loss: String,
    pub on_win: String,
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UiTactic {
    pub id: String,
    pub label: String,
    #[serde(rename = "Attacking")]
    pub attacking: UiInPossessionTactic,
    #[serde(rename = "Deffending")]
    pub deffending: UiOutOfPossessionTactic,
    pub transition: UiTransitionTactic,
}
