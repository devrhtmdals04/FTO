use serde::{de::Deserializer, Deserialize, Serialize};

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case", tag = "type")]
pub enum MarkingDirective {
    Zonal,
    Man { target_player_index: u8 },
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum PressTrigger {
    Always,
    NearBall,
    OnTouch,
}

#[derive(Clone, Copy, Debug, Serialize, Deserialize)]
pub struct PressingDirective {
    pub intensity: f32,
    pub trigger: PressTrigger,
}

#[derive(Clone, Debug, Serialize, Deserialize)]
#[serde(rename_all = "snake_case", tag = "type")]
pub enum PositioningDirective {
    HoldZone { x: f32, y: f32 },
    StayWide,
    CutInside,
    Overlap,
    Underlap,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerDirectiveSet {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub marking: Option<MarkingDirective>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub pressing: Option<PressingDirective>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub positioning: Option<PositioningDirective>,
}

impl PlayerDirectiveSet {
    pub fn clamp(mut self) -> Self {
        if let Some(mut pressing) = self.pressing {
            pressing.intensity = pressing.intensity.clamp(0.0, 1.0);
            self.pressing = Some(pressing);
        }
        self
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerInstruction {
    pub player_index: u8,
    #[serde(default)]
    pub directives: PlayerDirectiveSet,
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct PlayerSelectionEntry {
    pub slot_index: u8,
    pub player_name: String,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub player_number: Option<u16>,
}

#[derive(Deserialize)]
#[serde(untagged)]
enum PlayerSelectionCompat {
    List(Vec<PlayerSelectionEntry>),
    Map {
        #[serde(default, rename = "Attacking")]
        attacking: Vec<PlayerSelectionEntry>,
        #[serde(default, rename = "Deffending")]
        deffending: Vec<PlayerSelectionEntry>,
    },
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Tactics {
    pub formation: u32,
    pub line_height: f32,
    pub press_intensity: f32,
    pub team_width: f32,
    pub build_up: f32,
    pub counter_press: f32,
    pub long_ball_bias: f32,
    pub overlap_fullbacks: f32,
    pub compactness: f32,
    #[serde(default)]
    pub player_instructions: Vec<PlayerInstruction>,
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
        self.player_instructions = self
            .player_instructions
            .into_iter()
            .map(|mut instruction| {
                instruction.directives = instruction.directives.clamp();
                instruction
            })
            .collect();
        self
    }
}

impl Default for Tactics {
    fn default() -> Self {
        Self {
            formation: 442,
            line_height: 0.5,
            press_intensity: 0.5,
            team_width: 0.5,
            build_up: 0.5,
            counter_press: 0.5,
            long_ball_bias: 0.5,
            overlap_fullbacks: 0.5,
            compactness: 0.5,
            player_instructions: Vec::new(),
        }
    }
}

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UiCustomFormationSlot {
    pub role: String,
    pub x: f32,
    pub y: f32,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub grid_column: Option<u8>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub grid_row: Option<u8>,
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

pub type UiPlayerInstruction = PlayerInstruction;

#[derive(Serialize, Deserialize, Clone, Debug)]
pub struct UiTactic {
    pub id: String,
    pub label: String,
    #[serde(rename = "Attacking")]
    pub attacking: UiInPossessionTactic,
    #[serde(rename = "Deffending")]
    pub deffending: UiOutOfPossessionTactic,
    pub transition: UiTransitionTactic,
    #[serde(rename = "playerInstructions")]
    #[serde(default)]
    pub player_instructions: Vec<UiPlayerInstruction>,
    #[serde(rename = "playerSelection")]
    #[serde(default)]
    #[serde(deserialize_with = "deserialize_player_selection")]
    pub player_selection: Vec<PlayerSelectionEntry>,
}

fn deserialize_player_selection<'de, D>(
    deserializer: D,
) -> Result<Vec<PlayerSelectionEntry>, D::Error>
where
    D: Deserializer<'de>,
{
    match PlayerSelectionCompat::deserialize(deserializer)? {
        PlayerSelectionCompat::List(list) => Ok(list),
        PlayerSelectionCompat::Map { attacking, .. } => Ok(attacking),
    }
}
