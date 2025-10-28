use crate::ai::coach::{PhaseFocus, QuantifiedTactics};
use crate::ai::phase::TeamPhase;
use crate::params::{PITCH_H, PITCH_W};
use crate::state::N_PER_TEAM;
use crate::types::{TeamId, Vec2};

const DEFAULT_SHAPE: &[usize] = &[4, 4, 2];
const GK_BUFFER: f32 = 4.5;

#[derive(Clone, Copy, Debug)]
pub struct PhaseLayout {
    pub positions: [Vec2; N_PER_TEAM],
}

impl PhaseLayout {
    pub fn new(positions: [Vec2; N_PER_TEAM]) -> Self {
        Self { positions }
    }
}

// Formation pipeline overview:
// 1. Parse formation text into line counts (fallback: DEFAULT_SHAPE).
// 2. Convert PhaseFocus into depth/width/tempo/pressure scalars used for offsets.
// 3. Distribute players evenly across each line's lateral span and clamp positions.
// 4. Backfill remaining slots by repeating the last position to keep 11 entries.
/// Computes an idealised team layout for a given phase directive.
pub fn layout_from_directive(team: TeamId, focus: PhaseFocus, shape: Option<&str>) -> PhaseLayout {
    let lines = parse_shape(shape);
    let positions = distribute_players(team, focus, &lines);
    PhaseLayout::new(positions)
}

/// Convenience helper that resolves the appropriate directive for the phase and
/// falls back to the base attacking/defending shapes when the directive is
/// missing.
pub fn ideal_layout_for_phase(
    team: TeamId,
    phase: TeamPhase,
    tactics: &QuantifiedTactics,
) -> PhaseLayout {
    if let Some(directive) = tactics.directive_for_phase(phase) {
        return layout_from_directive(team, directive.focus, directive.shape.as_deref());
    }

    let fallback_shape = if phase.is_attacking() {
        tactics.base_attacking_shape.as_deref()
    } else {
        tactics.base_defending_shape.as_deref()
    };
    let fallback_focus = default_focus_for_phase(phase);

    layout_from_directive(team, fallback_focus, fallback_shape)
}

fn default_focus_for_phase(phase: TeamPhase) -> PhaseFocus {
    match phase {
        TeamPhase::KickoffAttack | TeamPhase::SetPieceAttack => {
            PhaseFocus::new(0.5, 0.55, 0.5, 0.2)
        }
        TeamPhase::KickoffDefense | TeamPhase::SetPieceDefense => {
            PhaseFocus::new(0.5, 0.55, 0.5, 0.2)
        }
        TeamPhase::BuildUp => PhaseFocus::new(0.55, 0.4, 0.4, 0.3),
        TeamPhase::Progression => PhaseFocus::new(0.6, 0.55, 0.5, 0.3),
        TeamPhase::FinalThird => PhaseFocus::new(0.65, 0.7, 0.6, 0.25),
        TeamPhase::HighBlock => PhaseFocus::new(0.5, 0.55, 0.45, 0.7),
        TeamPhase::MidBlock => PhaseFocus::new(0.45, 0.45, 0.35, 0.55),
        TeamPhase::LowBlock => PhaseFocus::new(0.4, 0.3, 0.25, 0.4),
        TeamPhase::Neutral => PhaseFocus::new(0.5, 0.45, 0.4, 0.4),
    }
}

fn distribute_players(team: TeamId, focus: PhaseFocus, lines: &[usize]) -> [Vec2; N_PER_TEAM] {
    let mut positions = [Vec2::ZERO; N_PER_TEAM];
    positions[0] = goalkeeper_position(team, focus);

    let line_count = lines.len().max(1);
    let half_pitch_x = PITCH_W * 0.5;
    let half_pitch_y = PITCH_H * 0.5;
    let usable_depth = half_pitch_x - 1.0;
    let side = if team == TeamId::Home { -1.0 } else { 1.0 };

    let depth_scale = depth_scale(focus);
    let width_scale = width_scale(focus);
    let width_base = (half_pitch_y - 6.0) * width_scale;

    let mut slot = 1usize;
    for (line_idx, &count) in lines.iter().enumerate() {
        if count == 0 {
            continue;
        }

        let progress = (line_idx as f32 + 1.0) / (line_count as f32 + 1.0);
        let stretched = progress.powf(0.85);

        let mut line_offset = GK_BUFFER + usable_depth * depth_scale * stretched;
        line_offset += tempo_push(focus, stretched);
        line_offset += pressure_push(focus, stretched);
        line_offset = line_offset.clamp(GK_BUFFER, usable_depth);

        let line_x = match team {
            TeamId::Home => -half_pitch_x + line_offset,
            TeamId::Away => half_pitch_x - line_offset,
        };

        let lateral_span = lateral_span(width_base, count, stretched);

        for player_idx in 0..count {
            if slot >= N_PER_TEAM {
                break;
            }
            let y = if count == 1 {
                0.0
            } else {
                let t = player_idx as f32 / (count - 1) as f32;
                -lateral_span + 2.0 * lateral_span * t
            };
            let mut pos = Vec2::new(line_x, -y * side);
            pos = clamp_to_pitch(pos);
            positions[slot] = pos;
            slot += 1;
        }
    }

    while slot < N_PER_TEAM {
        positions[slot] = positions[slot - 1];
        slot += 1;
    }

    positions
}

fn goalkeeper_position(team: TeamId, focus: PhaseFocus) -> Vec2 {
    let half_pitch_x = PITCH_W * 0.5;
    let roam = 1.5 + focus.depth * 5.5 + focus.tempo * 2.0;
    match team {
        TeamId::Home => Vec2::new(-half_pitch_x + GK_BUFFER + roam, 0.0),
        TeamId::Away => Vec2::new(half_pitch_x - GK_BUFFER - roam, 0.0),
    }
}

fn parse_shape(shape: Option<&str>) -> Vec<usize> {
    let parsed: Vec<usize> = shape
        .and_then(|s| {
            let parts: Vec<usize> = s
                .split(|c: char| !c.is_ascii_digit())
                .filter(|part| !part.is_empty())
                .filter_map(|part| part.parse::<usize>().ok())
                .collect();
            if parts.is_empty() {
                None
            } else {
                Some(parts)
            }
        })
        .unwrap_or_else(|| DEFAULT_SHAPE.to_vec());

    let total: usize = parsed.iter().sum();
    if total == 10 {
        return parsed;
    }

    // Normalise counts so they sum to ten without losing relative shape.
    let mut normalised = vec![0usize; parsed.len()];
    let mut remaining = 10usize;
    for (idx, &value) in parsed.iter().enumerate() {
        if idx == parsed.len() - 1 {
            normalised[idx] = remaining;
            break;
        }
        let proportion = value as f32 / total as f32;
        let allocated = (proportion * 10.0).round() as isize;
        let clamped = allocated.clamp(0, remaining as isize) as usize;
        normalised[idx] = clamped;
        remaining = remaining.saturating_sub(clamped);
    }

    if normalised.iter().sum::<usize>() == 10 {
        normalised
    } else {
        DEFAULT_SHAPE.to_vec()
    }
}

fn depth_scale(focus: PhaseFocus) -> f32 {
    let base = 0.28;
    let depth_component = focus.depth * 0.55;
    let tempo_component = focus.tempo * 0.1;
    let pressure_component = focus.pressure * 0.15;
    (base + depth_component + tempo_component + pressure_component).clamp(0.2_f32, 0.95_f32)
}

fn width_scale(focus: PhaseFocus) -> f32 {
    (0.3 + focus.width * 0.6).clamp(0.2_f32, 0.95_f32)
}

fn tempo_push(focus: PhaseFocus, progress: f32) -> f32 {
    let tempo_bias = focus.tempo * 6.0;
    tempo_bias * progress.powf(1.1)
}

fn pressure_push(focus: PhaseFocus, progress: f32) -> f32 {
    let pressure_bias = focus.pressure * 5.0;
    pressure_bias * progress
}

fn lateral_span(base_span: f32, count: usize, progress: f32) -> f32 {
    if count <= 1 {
        return base_span * (0.4 + 0.3 * progress);
    }
    let density = (count as f32 - 2.0).max(0.0) * 0.08;
    base_span * (0.6 + 0.35 * progress + density)
}

fn clamp_to_pitch(mut pos: Vec2) -> Vec2 {
    let half_w = PITCH_W * 0.5 - 1.5;
    let half_h = PITCH_H * 0.5 - 1.5;
    pos.x = pos.x.clamp(-half_w, half_w);
    pos.y = pos.y.clamp(-half_h, half_h);
    pos
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn layout_respects_shape_count() {
        let layout = layout_from_directive(
            TeamId::Home,
            PhaseFocus::new(0.5, 0.5, 0.5, 0.5),
            Some("4-3-3"),
        );
        assert_eq!(layout.positions.len(), N_PER_TEAM);
        // Distinct x positions for successive lines.
        assert!(layout.positions[1].x < layout.positions[5].x);
    }

    #[test]
    fn wider_focus_spreads_players() {
        let narrow = layout_from_directive(
            TeamId::Home,
            PhaseFocus::new(0.1, 0.5, 0.5, 0.5),
            Some("4-3-3"),
        );
        let wide = layout_from_directive(
            TeamId::Home,
            PhaseFocus::new(0.9, 0.5, 0.5, 0.5),
            Some("4-3-3"),
        );
        let narrow_span = narrow.positions[1].y.abs() + narrow.positions[4].y.abs();
        let wide_span = wide.positions[1].y.abs() + wide.positions[4].y.abs();
        assert!(wide_span > narrow_span);
    }

    #[test]
    fn depth_focus_pushes_line_forward() {
        let conservative = layout_from_directive(
            TeamId::Home,
            PhaseFocus::new(0.5, 0.2, 0.2, 0.2),
            Some("4-3-3"),
        );
        let aggressive = layout_from_directive(
            TeamId::Home,
            PhaseFocus::new(0.5, 0.9, 0.6, 0.6),
            Some("4-3-3"),
        );
        assert!(aggressive.positions[5].x > conservative.positions[5].x);
    }
}
