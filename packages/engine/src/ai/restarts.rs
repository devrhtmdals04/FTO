use super::formations::{layout_from_directive, PhaseLayout};
use crate::ai::tactics::{PhaseFocus, QuantifiedTactics};
use crate::ai::TeamPhase;
use crate::params::PITCH_W;
use crate::state::N_PER_TEAM;
use crate::types::{TeamId, Vec2};

const CENTER_CIRCLE_RADIUS: f32 = 9.15;

pub fn kickoff_positions(
    team: TeamId,
    attacking: bool,
    tactics: &QuantifiedTactics,
) -> PhaseLayout {
    let phase = if attacking {
        TeamPhase::KickoffAttack
    } else {
        TeamPhase::KickoffDefense
    };

    let mut layout = if let Some(directive) = tactics.directive_for_phase(phase) {
        layout_from_directive(team, directive.focus, directive.shape.as_deref())
    } else {
        layout_from_directive(team, PhaseFocus::new(0.5, 0.45, 0.4, 0.4), None)
    };
    apply_kickoff_rules(&mut layout.positions, team, attacking);
    layout
}

pub fn set_piece_positions(
    team: TeamId,
    attacking: bool,
    tactics: &QuantifiedTactics,
) -> PhaseLayout {
    let phase = if attacking {
        TeamPhase::SetPieceAttack
    } else {
        TeamPhase::SetPieceDefense
    };
    let directive = tactics.directive_for_phase(phase);
    let focus = directive
        .map(|d| d.focus)
        .unwrap_or_else(|| default_focus(attacking));
    let shape = directive.and_then(|d| d.shape.as_deref());

    let mut layout = layout_from_directive(team, focus, shape);
    if attacking {
        pull_forwards_towards_box(&mut layout.positions, team);
    } else {
        compress_defensive_block(&mut layout.positions, team, focus);
    }
    layout
}

fn apply_kickoff_rules(positions: &mut [Vec2; N_PER_TEAM], team: TeamId, attacking: bool) {
    let side = if team == TeamId::Home { -1.0 } else { 1.0 };
    if attacking {
        positions[10] = Vec2::ZERO; // 한 명의 선수를 정확히 중앙에 배치
        positions[9] = Vec2::new(9.5 * side, 0.0); // 두 번째 선수를 약간 뒤로 이동
    } else {
        for pos in positions.iter_mut() {
            if pos.x * side < CENTER_CIRCLE_RADIUS {
                pos.x = side * CENTER_CIRCLE_RADIUS;
            }
        }
    }
}

fn pull_forwards_towards_box(positions: &mut [Vec2; N_PER_TEAM], team: TeamId) {
    let side = if team == TeamId::Home { 1.0 } else { -1.0 };
    let target_x = side * (PITCH_W * 0.5 - 18.0);

    for pos in positions.iter_mut().rev().take(3) {
        pos.x = target_x;
    }
}

fn compress_defensive_block(positions: &mut [Vec2; N_PER_TEAM], team: TeamId, focus: PhaseFocus) {
    let side = if team == TeamId::Home { -1.0 } else { 1.0 };
    let anchor = side * (-CENTER_CIRCLE_RADIUS - 5.0 - focus.pressure * 6.0);
    for pos in positions.iter_mut().skip(1) {
        if pos.x * side > anchor {
            pos.x = anchor;
        }
    }
}

fn default_focus(attacking: bool) -> PhaseFocus {
    if attacking {
        PhaseFocus::new(0.55, 0.6, 0.5, 0.3)
    } else {
        PhaseFocus::new(0.45, 0.4, 0.3, 0.5)
    }
}
