use crate::types::GamePhase;
use serde::{de::Deserializer, Deserialize, Serialize};
use std::collections::HashMap;

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

#[derive(Clone, Copy, Debug, PartialEq, Eq, Hash, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub enum EngineStateKey {
    BuildUp,
    Progression,
    Creation,
    HighBlock,
    MidBlock,
    LowBlock,
    AttackToDefense,
    DefenseToAttack,
    SetPlayAttack,
    SetPlayDefense,
}

impl EngineStateKey {
    pub fn from_game_phase(phase: GamePhase) -> Self {
        match phase {
            GamePhase::BuildUp => EngineStateKey::BuildUp,
            GamePhase::Progression => EngineStateKey::Progression,
            GamePhase::Creation => EngineStateKey::Creation,
            GamePhase::HighBlock => EngineStateKey::HighBlock,
            GamePhase::MidBlock => EngineStateKey::MidBlock,
            GamePhase::LowBlock => EngineStateKey::LowBlock,
            GamePhase::TransitionToAttack => EngineStateKey::DefenseToAttack,
            GamePhase::TransitionToDefense => EngineStateKey::AttackToDefense,
            GamePhase::SetPieceAttack => EngineStateKey::SetPlayAttack,
            GamePhase::SetPieceDefense => EngineStateKey::SetPlayDefense,
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub struct StateParams {
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub line_att: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub line_height: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub block_def: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub team_width: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub width: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub compact_v: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub compact_h: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub press_intensity: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub press_int: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub tempo: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub direct: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub risk: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub support_d: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub gk_build: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub trap_side: Option<TrapSide>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub counterpress: Option<CounterPressMode>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub counterattack: Option<CounterAttackMode>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub rest_def_shape: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub build_up: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub counter_press: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub long_ball_bias: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub overlap_fullbacks: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub compactness: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub box_runs: Option<f32>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub second_phase_ready: Option<bool>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub marking: Option<String>,
    #[serde(default, skip_serializing_if = "Option::is_none")]
    pub blocker_on_keeper: Option<bool>,
}

impl StateParams {
    pub fn clamp(&mut self) {
        fn clamp01(value: &mut Option<f32>) {
            if let Some(v) = value.as_mut() {
                *v = v.clamp(0.0, 1.0);
            }
        }

        clamp01(&mut self.line_att);
        clamp01(&mut self.line_height);
        clamp01(&mut self.block_def);
        clamp01(&mut self.team_width);
        clamp01(&mut self.width);
        clamp01(&mut self.compact_h);
        clamp01(&mut self.press_intensity);
        clamp01(&mut self.press_int);
        clamp01(&mut self.tempo);
        clamp01(&mut self.direct);
        clamp01(&mut self.risk);
        clamp01(&mut self.gk_build);
        clamp01(&mut self.build_up);
        clamp01(&mut self.counter_press);
        clamp01(&mut self.long_ball_bias);
        clamp01(&mut self.overlap_fullbacks);
        clamp01(&mut self.compactness);

        if let Some(v) = self.compact_v.as_mut() {
            *v = v.clamp(0.0, 50.0);
        }
        if let Some(v) = self.support_d.as_mut() {
            *v = v.clamp(0.0, 30.0);
        }
        if let Some(v) = self.box_runs.as_mut() {
            *v = v.max(0.0);
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
#[serde(rename_all = "camelCase")]
pub struct StatePreset {
    #[serde(default)]
    pub params: StateParams,
    #[serde(default, skip_serializing_if = "Vec::is_empty")]
    pub guidelines: Vec<String>,
}

pub type StatePresetMap = HashMap<EngineStateKey, StatePreset>;

fn default_state_presets() -> StatePresetMap {
    let mut map = HashMap::new();

    map.insert(
        EngineStateKey::BuildUp,
        StatePreset {
            params: StateParams {
                line_att: Some(0.25),
                width: Some(0.8),
                compact_v: Some(18.0),
                compact_h: Some(0.35),
                tempo: Some(0.55),
                direct: Some(0.3),
                risk: Some(0.35),
                support_d: Some(10.0),
                gk_build: Some(0.9),
                press_int: Some(0.1),
                trap_side: Some(TrapSide::Auto),
                counterpress: Some(CounterPressMode::Contain),
                counterattack: Some(CounterAttackMode::Secure),
                rest_def_shape: Some("2-3".to_string()),
                ..StateParams::default()
            },
            guidelines: vec![
                "GK 참여로 CB split(자연 발생), 6번 단차 확보.".to_string(),
                "1선 압박 유도 시 풀백/6번의 각도 있는 지원(8~12 m) 유지.".to_string(),
                "중앙 위험 시 리사이클 우선(tempo↑ 없이 width로 탈압박).".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::Progression,
        StatePreset {
            params: StateParams {
                line_att: Some(0.45),
                width: Some(0.75),
                compact_v: Some(16.0),
                compact_h: Some(0.4),
                tempo: Some(0.65),
                direct: Some(0.55),
                risk: Some(0.5),
                support_d: Some(11.0),
                gk_build: Some(0.4),
                press_int: Some(0.2),
                trap_side: Some(TrapSide::Auto),
                counterpress: Some(CounterPressMode::Contain),
                counterattack: Some(CounterAttackMode::Balanced),
                rest_def_shape: Some("2-3".to_string()),
                ..StateParams::default()
            },
            guidelines: vec![
                "하프스페이스 우선: 8번/10번의 내부-외부 언더·오버랩 빈도 중간.".to_string(),
                "스위치 플레이 가중치↑ (반대쪽 윙 페널티에어리어 에지까지 도달).".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::Creation,
        StatePreset {
            params: StateParams {
                line_att: Some(0.7),
                width: Some(0.7),
                compact_v: Some(14.0),
                compact_h: Some(0.45),
                tempo: Some(0.72),
                direct: Some(0.7),
                risk: Some(0.65),
                support_d: Some(9.0),
                gk_build: Some(0.1),
                press_int: Some(0.25),
                trap_side: Some(TrapSide::Auto),
                counterpress: Some(CounterPressMode::Hunt),
                counterattack: Some(CounterAttackMode::Fast),
                rest_def_shape: Some("3-2".to_string()),
                ..StateParams::default()
            },
            guidelines: vec![
                "박스 점유 4인 목표(ST+윙+역삼각 10번). 컷백/로우크로스 선호.".to_string(),
                "리스크↑ 허용하되 잔여 3-2로 역습 차단(풀백 동시 전진 금지).".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::HighBlock,
        StatePreset {
            params: StateParams {
                block_def: Some(0.75),
                width: Some(0.8),
                compact_v: Some(16.0),
                compact_h: Some(0.35),
                press_int: Some(0.85),
                tempo: Some(0.4),
                direct: Some(0.35),
                risk: Some(0.3),
                support_d: Some(10.0),
                trap_side: Some(TrapSide::Right),
                counterpress: Some(CounterPressMode::Hunt),
                counterattack: Some(CounterAttackMode::Fast),
                ..StateParams::default()
            },
            guidelines: vec![
                "트리거: GK→CB 패스, 백패스, 터치 미스 즉시 점프.".to_string(),
                "터치라인 트랩: 윙/풀백이 측면 그물 형성, 반대쪽 6/8은 커버.".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::MidBlock,
        StatePreset {
            params: StateParams {
                block_def: Some(0.55),
                width: Some(0.7),
                compact_v: Some(14.0),
                compact_h: Some(0.45),
                press_int: Some(0.55),
                tempo: Some(0.38),
                direct: Some(0.4),
                risk: Some(0.3),
                support_d: Some(11.0),
                trap_side: Some(TrapSide::Center),
                counterpress: Some(CounterPressMode::Contain),
                counterattack: Some(CounterAttackMode::Balanced),
                ..StateParams::default()
            },
            guidelines: vec![
                "중앙 압축 + 측면 유도(센터 트랩): 패스 각도 차단·커버 섀도.".to_string(),
                "10번은 앵커 스크린, 윙은 풀백 높이에 맞춘 반프레스.".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::LowBlock,
        StatePreset {
            params: StateParams {
                block_def: Some(0.35),
                width: Some(0.6),
                compact_v: Some(12.0),
                compact_h: Some(0.55),
                press_int: Some(0.3),
                tempo: Some(0.32),
                direct: Some(0.28),
                risk: Some(0.2),
                support_d: Some(12.0),
                trap_side: Some(TrapSide::Center),
                counterpress: Some(CounterPressMode::None),
                counterattack: Some(CounterAttackMode::Fast),
                ..StateParams::default()
            },
            guidelines: vec![
                "박스 수비 우선: 5레인 밀집, 크로스 차단 후 세컨볼 클리어.".to_string(),
                "탈압박은 직선 역습(ST 타깃, 윙 침투), 풀백은 하프라인 이하 유지.".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::AttackToDefense,
        StatePreset {
            params: StateParams {
                press_int: Some(0.7),
                trap_side: Some(TrapSide::Center),
                compact_v: Some(14.0),
                compact_h: Some(0.5),
                counterpress: Some(CounterPressMode::Hunt),
                support_d: Some(9.0),
                ..StateParams::default()
            },
            guidelines: vec![
                "잃은 지점 반경 12 m 내 3인 압박(볼 캐리어+근접 옵션 2인 차단).".to_string(),
                "6/CB는 즉시 골문 보호 삼각형 복구(세로 간격 12–14 m).".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::DefenseToAttack,
        StatePreset {
            params: StateParams {
                tempo: Some(0.8),
                direct: Some(0.75),
                risk: Some(0.55),
                width: Some(0.8),
                counterattack: Some(CounterAttackMode::Fast),
                support_d: Some(11.0),
                rest_def_shape: Some("2-3".to_string()),
                ..StateParams::default()
            },
            guidelines: vec![
                "첫 2패스 규칙: 전방/측면 우선, 반대 윙 스프린트 채널 개방.".to_string(),
                "전개 실패 시 3패스 이내 안정 전환(Progression으로 복귀).".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::SetPlayAttack,
        StatePreset {
            params: StateParams {
                risk: Some(0.65),
                tempo: Some(0.55),
                box_runs: Some(5.0),
                second_phase_ready: Some(true),
                rest_def_shape: Some("3-2".to_string()),
                ..StateParams::default()
            },
            guidelines: vec![
                "코너: 근-원 궤적 혼합 + 세컨페이즈 탑 오브 박스 점유.".to_string(),
                "프리킥 간접: 오프사이드 라인 타이밍에 맞춘 커브/컷백 패턴.".to_string(),
            ],
        },
    );

    map.insert(
        EngineStateKey::SetPlayDefense,
        StatePreset {
            params: StateParams {
                compact_v: Some(10.0),
                compact_h: Some(0.6),
                line_att: Some(0.15),
                marking: Some("zonal+2man".to_string()),
                blocker_on_keeper: Some(false),
                counterattack: Some(CounterAttackMode::Balanced),
                ..StateParams::default()
            },
            guidelines: vec![
                "혼합 마킹: 6야드 존 3인+키커 쪽 근포스트 1인, 2인은 타겟맨 추적.".to_string(),
                "걷어낸 뒤 세컨볼 8/10번 회수 루트 마련(측면으로 탈압박).".to_string(),
            ],
        },
    );

    map
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum TrapSide {
    Left,
    Right,
    Center,
    Auto,
}

impl Default for TrapSide {
    fn default() -> Self {
        TrapSide::Auto
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CounterPressMode {
    None,
    Contain,
    Hunt,
}

impl Default for CounterPressMode {
    fn default() -> Self {
        CounterPressMode::Contain
    }
}

#[derive(Clone, Copy, Debug, PartialEq, Eq, Serialize, Deserialize)]
#[serde(rename_all = "snake_case")]
pub enum CounterAttackMode {
    Secure,
    Balanced,
    Fast,
}

impl Default for CounterAttackMode {
    fn default() -> Self {
        CounterAttackMode::Balanced
    }
}

fn default_line_att() -> f32 {
    0.5
}

fn default_block_def() -> f32 {
    0.5
}

fn default_press_int() -> f32 {
    0.5
}

fn default_width() -> f32 {
    0.5
}

fn default_counterpress() -> CounterPressMode {
    CounterPressMode::Contain
}

fn default_counterattack() -> CounterAttackMode {
    CounterAttackMode::Balanced
}

fn default_compact_v() -> f32 {
    16.0
}

fn default_compact_h() -> f32 {
    0.4
}

fn default_tempo() -> f32 {
    0.5
}

fn default_direct() -> f32 {
    0.5
}

fn default_risk() -> f32 {
    0.4
}

fn default_support_d() -> f32 {
    11.0
}

fn default_gk_build() -> f32 {
    0.5
}

fn default_trap_side() -> TrapSide {
    TrapSide::Auto
}

fn default_rest_def_shape() -> String {
    "2-3".to_string()
}

#[derive(Clone, Debug, Serialize, Deserialize)]
pub struct Tactics {
    pub formation: u32,
    pub line_height: f32,
    #[serde(default = "default_line_att")]
    pub line_att: f32,
    #[serde(default = "default_block_def")]
    pub block_def: f32,
    pub press_intensity: f32,
    #[serde(default = "default_press_int")]
    pub press_int: f32,
    pub team_width: f32,
    #[serde(default = "default_width")]
    pub width: f32,
    pub build_up: f32,
    pub counter_press: f32,
    #[serde(default = "default_counterpress")]
    pub counterpress: CounterPressMode,
    #[serde(default = "default_counterattack")]
    pub counterattack: CounterAttackMode,
    pub long_ball_bias: f32,
    pub overlap_fullbacks: f32,
    pub compactness: f32,
    #[serde(default = "default_compact_v")]
    pub compact_v: f32,
    #[serde(default = "default_compact_h")]
    pub compact_h: f32,
    #[serde(default = "default_tempo")]
    pub tempo: f32,
    #[serde(default = "default_direct")]
    pub direct: f32,
    #[serde(default = "default_risk")]
    pub risk: f32,
    #[serde(default = "default_support_d")]
    pub support_d: f32,
    #[serde(default = "default_gk_build")]
    pub gk_build: f32,
    #[serde(default = "default_trap_side")]
    pub trap_side: TrapSide,
    #[serde(default = "default_rest_def_shape")]
    pub rest_def_shape: String,
    #[serde(default = "default_state_presets")]
    pub state_presets: StatePresetMap,
    #[serde(default)]
    pub player_instructions: Vec<PlayerInstruction>,
}

impl Tactics {
    pub fn clamp(mut self) -> Self {
        self.line_height = self.line_height.clamp(0.0, 1.0);
        self.line_att = self.line_att.clamp(0.0, 1.0);
        self.block_def = self.block_def.clamp(0.0, 1.0);
        self.press_intensity = self.press_intensity.clamp(0.0, 1.0);
        self.press_int = self.press_int.clamp(0.0, 1.0);
        self.team_width = self.team_width.clamp(0.0, 1.0);
        self.width = self.width.clamp(0.0, 1.0);
        self.build_up = self.build_up.clamp(0.0, 1.0);
        self.counter_press = self.counter_press.clamp(0.0, 1.0);
        self.tempo = self.tempo.clamp(0.0, 1.0);
        self.direct = self.direct.clamp(0.0, 1.0);
        self.risk = self.risk.clamp(0.0, 1.0);
        self.support_d = self.support_d.clamp(0.0, 30.0);
        self.gk_build = self.gk_build.clamp(0.0, 1.0);
        self.long_ball_bias = self.long_ball_bias.clamp(0.0, 1.0);
        self.overlap_fullbacks = self.overlap_fullbacks.clamp(0.0, 1.0);
        self.compactness = self.compactness.clamp(0.0, 1.0);
        self.compact_v = self.compact_v.clamp(0.0, 50.0);
        self.compact_h = self.compact_h.clamp(0.0, 1.0);
        for preset in self.state_presets.values_mut() {
            preset.params.clamp();
        }
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
            line_att: default_line_att(),
            block_def: default_block_def(),
            press_intensity: 0.5,
            press_int: default_press_int(),
            team_width: 0.5,
            width: default_width(),
            build_up: 0.5,
            counter_press: 0.5,
            counterpress: default_counterpress(),
            counterattack: default_counterattack(),
            long_ball_bias: 0.5,
            overlap_fullbacks: 0.5,
            compactness: 0.5,
            compact_v: default_compact_v(),
            compact_h: default_compact_h(),
            tempo: default_tempo(),
            direct: default_direct(),
            risk: default_risk(),
            support_d: default_support_d(),
            gk_build: default_gk_build(),
            trap_side: default_trap_side(),
            rest_def_shape: default_rest_def_shape(),
            state_presets: default_state_presets(),
            player_instructions: Vec::new(),
        }
    }
}

#[derive(Clone, Debug)]
pub struct ResolvedTactics {
    pub line_height: f32,
    pub line_att: f32,
    pub block_def: f32,
    pub press_intensity: f32,
    pub press_int: f32,
    pub team_width: f32,
    pub width: f32,
    pub build_up: f32,
    pub counter_press: f32,
    pub counterpress: CounterPressMode,
    pub counterattack: CounterAttackMode,
    pub long_ball_bias: f32,
    pub overlap_fullbacks: f32,
    pub compactness: f32,
    pub compact_v: f32,
    pub compact_h: f32,
    pub tempo: f32,
    pub direct: f32,
    pub risk: f32,
    pub support_d: f32,
    pub gk_build: f32,
    pub trap_side: TrapSide,
    pub rest_def_shape: String,
}

impl ResolvedTactics {
    pub fn from_base(base: &Tactics) -> Self {
        Self {
            line_height: base.line_height,
            line_att: base.line_att,
            block_def: base.block_def,
            press_intensity: base.press_intensity,
            press_int: base.press_int,
            team_width: base.team_width,
            width: base.width,
            build_up: base.build_up,
            counter_press: base.counter_press,
            counterpress: base.counterpress,
            counterattack: base.counterattack,
            long_ball_bias: base.long_ball_bias,
            overlap_fullbacks: base.overlap_fullbacks,
            compactness: base.compactness,
            compact_v: base.compact_v,
            compact_h: base.compact_h,
            tempo: base.tempo,
            direct: base.direct,
            risk: base.risk,
            support_d: base.support_d,
            gk_build: base.gk_build,
            trap_side: base.trap_side,
            rest_def_shape: base.rest_def_shape.clone(),
        }
    }

    pub fn from_phase(base: &Tactics, phase: GamePhase) -> Self {
        let mut resolved = Self::from_base(base);
        if let Some(preset) = base
            .state_presets
            .get(&EngineStateKey::from_game_phase(phase))
        {
            resolved.apply_params(&preset.params);
        }
        resolved
    }

    pub fn apply_params(&mut self, params: &StateParams) {
        if let Some(v) = params.line_height {
            self.line_height = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.line_att {
            self.line_att = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.block_def {
            self.block_def = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.team_width {
            self.team_width = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.width {
            let value = v.clamp(0.0, 1.0);
            self.width = value;
            self.team_width = value;
        }
        if let Some(v) = params.build_up {
            self.build_up = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.counter_press {
            self.counter_press = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.press_intensity {
            self.press_intensity = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.press_int {
            let clamped = v.clamp(0.0, 1.0);
            self.press_int = clamped;
            self.press_intensity = clamped;
            self.counter_press = clamped;
        }
        if let Some(v) = params.long_ball_bias {
            self.long_ball_bias = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.overlap_fullbacks {
            self.overlap_fullbacks = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.compactness {
            self.compactness = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.compact_v {
            self.compact_v = v.clamp(0.0, 50.0);
        }
        if let Some(v) = params.compact_h {
            self.compact_h = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.tempo {
            self.tempo = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.direct {
            self.direct = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.risk {
            self.risk = v.clamp(0.0, 1.0);
        }
        if let Some(v) = params.support_d {
            self.support_d = v.clamp(0.0, 30.0);
        }
        if let Some(v) = params.gk_build {
            self.gk_build = v.clamp(0.0, 1.0);
        }
        if let Some(value) = params.trap_side {
            self.trap_side = value;
        }
        if let Some(value) = params.counterpress {
            self.counterpress = value;
        }
        if let Some(value) = params.counterattack {
            self.counterattack = value;
        }
        if let Some(ref value) = params.rest_def_shape {
            self.rest_def_shape = value.clone();
        }
    }

    pub fn ease_towards(&mut self, target: &ResolvedTactics, alpha: f32) {
        fn ease(current: f32, target: f32, alpha: f32) -> f32 {
            current + (target - current) * alpha
        }

        self.line_height = ease(self.line_height, target.line_height, alpha);
        self.line_att = ease(self.line_att, target.line_att, alpha);
        self.block_def = ease(self.block_def, target.block_def, alpha);
        self.press_intensity = ease(self.press_intensity, target.press_intensity, alpha);
        self.press_int = ease(self.press_int, target.press_int, alpha);
        self.team_width = ease(self.team_width, target.team_width, alpha);
        self.width = ease(self.width, target.width, alpha);
        self.build_up = ease(self.build_up, target.build_up, alpha);
        self.counter_press = ease(self.counter_press, target.counter_press, alpha);
        self.long_ball_bias = ease(self.long_ball_bias, target.long_ball_bias, alpha);
        self.overlap_fullbacks = ease(self.overlap_fullbacks, target.overlap_fullbacks, alpha);
        self.compactness = ease(self.compactness, target.compactness, alpha);
        self.compact_v = ease(self.compact_v, target.compact_v, alpha);
        self.compact_h = ease(self.compact_h, target.compact_h, alpha);
        self.tempo = ease(self.tempo, target.tempo, alpha);
        self.direct = ease(self.direct, target.direct, alpha);
        self.risk = ease(self.risk, target.risk, alpha);
        self.support_d = ease(self.support_d, target.support_d, alpha);
        self.gk_build = ease(self.gk_build, target.gk_build, alpha);

        if self.trap_side != target.trap_side {
            self.trap_side = target.trap_side;
        }
        if self.counterpress != target.counterpress {
            self.counterpress = target.counterpress;
        }
        if self.counterattack != target.counterattack {
            self.counterattack = target.counterattack;
        }
        if self.rest_def_shape != target.rest_def_shape {
            self.rest_def_shape = target.rest_def_shape.clone();
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
    #[serde(rename = "engineStatePresets")]
    #[serde(default = "default_state_presets")]
    pub engine_state_presets: StatePresetMap,
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
