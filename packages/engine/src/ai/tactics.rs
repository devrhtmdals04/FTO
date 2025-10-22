use std::collections::HashMap;

use crate::ai::TeamPhase;
use crate::types::{
    BlockType, DetailedPlayerRole, LowBlockType, OnBallLoose, PlayerInstruction, Tactic,
};
use serde::{Deserialize, Serialize};

#[derive(Clone, Copy, Debug, Default, Serialize, Deserialize)]
pub struct PhaseFocus {
    pub width: f32,
    pub depth: f32,
    pub tempo: f32,
    pub pressure: f32,
}

impl PhaseFocus {
    pub fn new(width: f32, depth: f32, tempo: f32, pressure: f32) -> Self {
        Self {
            width: clamp01(width),
            depth: clamp01(depth),
            tempo: clamp01(tempo),
            pressure: clamp01(pressure),
        }
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct PhaseDirective {
    pub shape: Option<String>,
    pub focus: PhaseFocus,
    pub notes: Option<String>,
}

impl PhaseDirective {
    fn from_shape(shape: Option<String>) -> Self {
        Self {
            shape,
            focus: PhaseFocus::default(),
            notes: None,
        }
    }

    fn with_focus(mut self, focus: PhaseFocus) -> Self {
        self.focus = focus;
        self
    }
}

#[derive(Clone, Debug, Default, Serialize, Deserialize)]
pub struct QuantifiedTactics {
    pub version: u8,
    pub base_attacking_shape: Option<String>,
    pub base_defending_shape: Option<String>,
    pub set_piece_attack_shape: Option<String>,
    pub set_piece_defence_shape: Option<String>,
    pub phase_directives: HashMap<String, PhaseDirective>,
    pub meta: HashMap<String, f32>,
}

impl QuantifiedTactics {
    pub fn directive_for_phase(&self, phase: TeamPhase) -> Option<&PhaseDirective> {
        let key = match phase {
            TeamPhase::KickoffAttack => "kickoff_attack",
            TeamPhase::KickoffDefense => "set_piece_defence",
            TeamPhase::SetPieceAttack => "set_piece_attack",
            TeamPhase::SetPieceDefense => "set_piece_defence",
            TeamPhase::BuildUp => "build_up",
            TeamPhase::Progression => "progression",
            TeamPhase::FinalThird => "final_third",
            TeamPhase::HighBlock => "high_block",
            TeamPhase::MidBlock => "mid_block",
            TeamPhase::LowBlock => "low_block",
            TeamPhase::Neutral => return None,
        };
        self.phase_directives.get(key)
    }

    pub fn meta_value(&self, key: &str) -> Option<f32> {
        self.meta.get(key).copied()
    }
}

fn quantify(tactic: &Tactic) -> QuantifiedTactics {
    let team_tactic = &tactic.team_tactic;
    let mut qt = QuantifiedTactics {
        version: 1,
        base_attacking_shape: Some(tactic.offensive_formation.clone()),
        base_defending_shape: Some(tactic.defensive_formation.clone()),
        set_piece_attack_shape: Some(team_tactic.team_set_piece.attack_corner.clone()),
        set_piece_defence_shape: Some(team_tactic.team_set_piece.defence_corner.clone()),
        phase_directives: HashMap::new(),
        meta: HashMap::new(),
    };

    // Meta metrics remain simple floats so future tuning can replace them easily.
    qt.meta.insert(
        "pass_distance".to_string(),
        clamp01(team_tactic.team_attacking.pass_distance),
    );
    qt.meta.insert(
        "cross_frequency".to_string(),
        clamp01(team_tactic.team_attacking.cross_frequency),
    );
    qt.meta.insert(
        "goalkeeper_engage".to_string(),
        if team_tactic.team_attacking.goalkeeper_engage {
            1.0
        } else {
            0.0
        },
    );
    qt.meta.insert(
        "counter_press_bias".to_string(),
        match team_tactic.team_transition.on_ball_loose {
            OnBallLoose::CounterPress => 1.0,
            OnBallLoose::BackPosition => 0.2,
        },
    );

    // Attacking phases
    let attack_shape = Some(team_tactic.team_attacking.buildup_formation.clone());
    let attack_pref = width_from_preference(&team_tactic.team_attacking.attack_preference);
    let overlap_bias = overlap_bias(&team_tactic.team_attacking.over_underlapping_player);
    let pass_distance = clamp01(team_tactic.team_attacking.pass_distance);
    let cross_frequency = clamp01(team_tactic.team_attacking.cross_frequency);

    let width_build_up = clamp01((attack_pref + overlap_bias) * 0.5);
    let depth_build_up = clamp01(0.35 + pass_distance * 0.45);
    let tempo_build_up = clamp01(0.4 + pass_distance * 0.4);

    qt.phase_directives.insert(
        "kickoff_attack".to_string(),
        PhaseDirective::from_shape(attack_shape.clone()).with_focus(PhaseFocus::new(
            width_build_up,
            depth_build_up,
            tempo_build_up,
            0.25,
        )),
    );
    qt.phase_directives.insert(
        "build_up".to_string(),
        PhaseDirective::from_shape(attack_shape.clone()).with_focus(PhaseFocus::new(
            width_build_up,
            depth_build_up,
            tempo_build_up,
            0.3,
        )),
    );

    let progression_width = clamp01((attack_pref * 0.6) + (overlap_bias * 0.4));
    let progression_depth = clamp01(0.45 + pass_distance * 0.4);
    qt.phase_directives.insert(
        "progression".to_string(),
        PhaseDirective::from_shape(attack_shape.clone()).with_focus(PhaseFocus::new(
            progression_width,
            progression_depth,
            clamp01(tempo_build_up + 0.1),
            0.35,
        )),
    );

    let final_shape = Some(team_tactic.team_attacking.final_third_formation.clone());
    qt.phase_directives.insert(
        "final_third".to_string(),
        PhaseDirective::from_shape(final_shape).with_focus(PhaseFocus::new(
            clamp01((attack_pref * 0.5) + (cross_frequency * 0.5)),
            clamp01(0.6 + pass_distance * 0.3),
            clamp01(0.5 + cross_frequency * 0.4),
            0.45,
        )),
    );

    // Defensive phases share the base defensive shape.
    let defence_shape = Some(team_tactic.team_defending.defending_formation.clone());
    let high_pressure = block_pressure(&team_tactic.team_defending.high_block);
    let mid_pressure = block_pressure(&team_tactic.team_defending.mid_block);
    let low_pressure = low_block_pressure(&team_tactic.team_defending.low_block);

    qt.phase_directives.insert(
        "high_block".to_string(),
        PhaseDirective::from_shape(defence_shape.clone()).with_focus(PhaseFocus::new(
            clamp01(0.4 + high_pressure * 0.3),
            0.35,
            0.35,
            high_pressure,
        )),
    );
    qt.phase_directives.insert(
        "mid_block".to_string(),
        PhaseDirective::from_shape(defence_shape.clone()).with_focus(PhaseFocus::new(
            0.4,
            0.4,
            0.3,
            mid_pressure,
        )),
    );
    qt.phase_directives.insert(
        "low_block".to_string(),
        PhaseDirective::from_shape(defence_shape.clone()).with_focus(PhaseFocus::new(
            clamp01(0.35 + low_pressure * 0.2),
            clamp01(0.25 + low_pressure * 0.4),
            0.25,
            low_pressure,
        )),
    );

    qt.phase_directives.insert(
        "set_piece_attack".to_string(),
        PhaseDirective::from_shape(qt.set_piece_attack_shape.clone()).with_focus(PhaseFocus::new(
            clamp01(0.5 + cross_frequency * 0.3),
            0.6,
            clamp01(0.5 + cross_frequency * 0.4),
            0.3,
        )),
    );
    qt.phase_directives.insert(
        "set_piece_defence".to_string(),
        PhaseDirective::from_shape(qt.set_piece_defence_shape.clone()).with_focus(PhaseFocus::new(
            0.35,
            0.3,
            0.25,
            clamp01(mid_pressure + 0.1),
        )),
    );

    qt
}

#[derive(Clone, Debug)]
pub struct TacticModel {
    raw: Tactic,
    quantified: QuantifiedTactics,
    lineup_index: HashMap<u32, usize>,
}

impl TacticModel {
    pub fn from_tactic(tactic: Tactic) -> Self {
        let quantified = quantify(&tactic);
        let lineup_index = tactic
            .lineup
            .iter()
            .enumerate()
            .map(|(idx, &pid)| (pid, idx))
            .collect();
        Self {
            raw: tactic,
            quantified,
            lineup_index,
        }
    }

    pub fn parse_json(json: &str) -> Result<Self, serde_json::Error> {
        let tactic: Tactic = serde_json::from_str(json)?;
        Ok(Self::from_tactic(tactic))
    }

    pub fn quantified(&self) -> QuantifiedTactics {
        self.quantified.clone()
    }

    pub fn raw(&self) -> &Tactic {
        &self.raw
    }

    pub fn lineup(&self) -> &[u32] {
        &self.raw.lineup
    }

    pub fn roles(&self) -> &[DetailedPlayerRole] {
        &self.raw.roles
    }

    pub fn lineup_slot(&self, player_id: u32) -> Option<usize> {
        self.lineup_index.get(&player_id).copied()
    }

    pub fn role_for_slot(&self, slot: usize) -> Option<&DetailedPlayerRole> {
        self.raw.roles.get(slot)
    }

    pub fn personal_instruction(&self, player_id: u32) -> Option<&PlayerInstruction> {
        self.raw.personal_instructions.get(&player_id)
    }

    pub fn attacking_formation(&self) -> &str {
        &self.raw.offensive_formation
    }

    pub fn defensive_formation(&self) -> &str {
        &self.raw.defensive_formation
    }

    pub fn kickoff_formation(&self) -> &str {
        &self.raw.team_tactic.team_attacking.buildup_formation
    }
}

fn block_pressure(block: &BlockType) -> f32 {
    match block {
        BlockType::Pressing => 0.8,
        BlockType::MakeBlock => 0.35,
    }
}

fn low_block_pressure(block: &LowBlockType) -> f32 {
    match block {
        LowBlockType::BlockMiddle => 0.45,
        LowBlockType::BlockSide => 0.3,
    }
}

fn width_from_preference(pref: &str) -> f32 {
    match pref.to_ascii_lowercase().as_str() {
        "center" => 0.35,
        "halfspace" => 0.55,
        "wide" | "flanks" => 0.75,
        _ => 0.5,
    }
}

fn overlap_bias(overlap: &str) -> f32 {
    match overlap.to_ascii_lowercase().as_str() {
        "fullbacks" => 0.7,
        "wingers" => 0.6,
        "mixed" => 0.55,
        _ => 0.5,
    }
}

fn clamp01(value: f32) -> f32 {
    value.clamp(0.0, 1.0)
}
