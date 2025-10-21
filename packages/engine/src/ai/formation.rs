use crate::params::{PITCH_H, PITCH_W};
use crate::state::{World, N_PER_TEAM};
use crate::tactics::QuantifiedTactics;
use crate::types::{DetailedPlayerRole, TeamId, Vec2};

/// AI가 참고하는 전술 페이즈
#[derive(Clone, Copy, Debug, PartialEq, Eq)]
pub enum FormationPhase {
    Kickoff,
    Attack,
    Defence,
}

/// 포메이션 레이아웃 정보 (라인 인원수 + 전술 슬라이더)
pub struct FormationContext<'a> {
    pub quantified: &'a QuantifiedTactics,
    pub pitch_length: f32,
    pub pitch_width: f32,
    pub layers: Vec<usize>,
    pub assignments: Vec<(usize, usize)>,
}

impl<'a> FormationContext<'a> {
    pub fn new(formation_str: &str, quantified: &'a QuantifiedTactics) -> Self {
        let layers = parse_formation_layers(formation_str).unwrap_or_else(|| vec![4, 3, 3]);
        let assignments = layer_assignments(&layers);
        Self {
            quantified,
            pitch_length: PITCH_W,
            pitch_width: PITCH_H,
            layers,
            assignments,
        }
    }
}

/// "4-2-3-1" → vec![4,2,3,1]
pub fn parse_formation_layers(input: &str) -> Option<Vec<usize>> {
    let mut layers = Vec::new();
    for segment in input.split('-') {
        let trimmed = segment.trim();
        if trimmed.is_empty() {
            return None;
        }
        let value: usize = trimmed.parse().ok()?;
        if value == 0 {
            return None;
        }
        layers.push(value);
    }
    if layers.is_empty() {
        None
    } else {
        Some(layers)
    }
}

fn layer_assignments(layers: &[usize]) -> Vec<(usize, usize)> {
    let mut result = Vec::new();
    for (line_idx, count) in layers.iter().enumerate() {
        for index_in_line in 0..*count {
            result.push((line_idx, index_in_line));
        }
    }
    result
}

/// 역할/라인업 슬롯에 따른 앵커 좌표 계산
pub fn compute_anchor(
    ctx: &FormationContext,
    team: TeamId,
    role: &DetailedPlayerRole,
    lineup_slot: usize,
    phase: FormationPhase,
    world: &World,
) -> Vec2 {
    if phase == FormationPhase::Kickoff {
        if matches!(role, DetailedPlayerRole::GK) {
            return compute_goalkeeper_anchor(team, phase, world);
        }

        let dir = if team == TeamId::Home { 1.0 } else { -1.0 }; // Home attacks right (+), Away attacks left (-)
        let center_circle_radius = 9.15;

        // Attacking team is the one with possession
        let is_attacking_team = world.possession >= 0 && world.possession == team.index() as i8;

        if is_attacking_team {
            // --- KICKOFF ATTACK ---
            let is_kicker = matches!(role, DetailedPlayerRole::ST | DetailedPlayerRole::LF | DetailedPlayerRole::RF);

            if is_kicker {
                // Place the kicker at the center spot, inside their half.
                return Vec2::new(-0.5 * dir, 0.0);
            } else {
                // --- Other attacking players ---
                let mut pos = fallback_position(team, Vec2::new(20.0, (lineup_slot as f32) * 5.0));
                if pos.norm() < center_circle_radius {
                    pos = pos.normalize() * center_circle_radius;
                }
                if (dir > 0.0 && pos.x > 0.0) || (dir < 0.0 && pos.x < 0.0) {
                    pos.x = -0.1 * dir; // Stay in own half
                }
                return pos;
            }
        } else {
            // --- KICKOFF DEFENCE ---
            let mut pos = fallback_position(team, Vec2::new(15.0, (lineup_slot as f32) * 5.0));
            if pos.norm() < center_circle_radius {
                pos = pos.normalize() * (center_circle_radius + 1.0);
            }
            if (dir > 0.0 && pos.x > 0.0) || (dir < 0.0 && pos.x < 0.0) {
                pos.x = -0.1 * dir; // Stay in own half
            }
            return pos;
        }
    }

    if matches!(role, DetailedPlayerRole::GK) {
        return compute_goalkeeper_anchor(team, phase, world);
    }

    if ctx.layers.is_empty() {
        return fallback_position(team, Vec2::new(20.0, 0.0));
    }

    // 라인업에서 GK를 제거한 필드 플레이어 인덱스
    let field_index = lineup_slot.saturating_sub(1);
    if field_index >= ctx.assignments.len() {
        return fallback_position(team, Vec2::new(22.0, 0.0));
    }
    let (line_idx, index_in_line) = ctx.assignments[field_index];
    let num_layers = ctx.layers.len();
    let players_in_line = ctx.layers[line_idx];

    let dir = if team == TeamId::Home { 1.0 } else { -1.0 };
    let half_len = ctx.pitch_length * 0.5;
    let half_width = ctx.pitch_width * 0.5;

    let ball = world.ball_pos();

    // --- 포메이션 박스 중심과 크기 ---
    let mut center_x = match phase {
        FormationPhase::Kickoff => 0.3 * ball.x,
        FormationPhase::Attack => ball.x * 0.55 + dir * 8.0,
        FormationPhase::Defence => ball.x * 0.45 - dir * 10.0,
    };
    center_x = center_x.clamp(-half_len + 18.0, half_len - 18.0);

    let mut center_y = (ball.y * 0.4).clamp(-half_width * 0.6, half_width * 0.6);

    let mut half_box_x = 18.0 + ctx.quantified.line_height * 12.0;
    let mut half_box_y = 14.0 + ctx.quantified.team_width * 12.0;

    match phase {
        FormationPhase::Kickoff => {
            half_box_x = 20.0;
            half_box_y *= 0.85;
            center_y = (ball.y * 0.2).clamp(-half_width * 0.4, half_width * 0.4);
        }
        FormationPhase::Attack => {
            half_box_x *= 1.05;
        }
        FormationPhase::Defence => {
            half_box_x *= 0.8;
            half_box_y *= 0.7;
        }
    }

    half_box_x = half_box_x.clamp(12.0, 40.0);
    half_box_y = half_box_y.clamp(10.0, half_width - 4.0);

    // --- 라인별 X 좌표 ---
    let playable_length = 2.0 * half_box_x;
    let spacing = if num_layers <= 1 {
        0.0
    } else {
        playable_length / (num_layers as f32 - 1.0)
    };
    let mut local_forward = -half_box_x + line_idx as f32 * spacing;

    // 전술/공에 따른 미세 조정
    local_forward += dir * (ctx.quantified.line_height - 0.5) * 6.0;
    local_forward += dir * ball.x.clamp(-half_len, half_len) * 0.05;

    let mut x = center_x + local_forward * dir;
    x = x.clamp(-half_len + 3.0, half_len - 3.0);

    // --- 라인 내 Y 좌표 ---
    let mut local_span = 2.0 * half_box_y;
    if players_in_line > 4 {
        local_span *= 1.1;
    }
    let step = if players_in_line <= 1 {
        0.0
} else {
        local_span / (players_in_line as f32 - 1.0)
    };
    let mut local_y = -half_box_y + index_in_line as f32 * step;
    local_y += (ball.y * 0.25).clamp(-half_box_y * 0.4, half_box_y * 0.4);

    if let Some(avg) = line_average_y(ctx, team, line_idx, world) {
        local_y = 0.6 * local_y + 0.4 * avg;
    }

    // 역할 기반 보정 (윙/풀백 등)
    local_y += role_lateral_bias(role) * ctx.pitch_width * 0.5;

    let mut y = center_y + local_y;
    y = y.clamp(-half_width + 3.0, half_width - 3.0);

    Vec2::new(x, y)
}

fn role_lateral_bias(role: &DetailedPlayerRole) -> f32 {
    use DetailedPlayerRole::*;
    match role {
        LB | LCB | LM | LCM | LW | LF => 0.18,
        RB | RCB | RM | RCM | RW | RF => -0.18,
        _ => 0.0,
    }
}

fn compute_goalkeeper_anchor(team: TeamId, phase: FormationPhase, world: &World) -> Vec2 {
    let half_len = PITCH_W * 0.5;
    let goal_x = if team == TeamId::Home {
        -half_len
    } else {
        half_len
    };
    let dir = if team == TeamId::Home { 1.0 } else { -1.0 };
    let ball = world.ball_pos();

    let mut base_offset = match phase {
        FormationPhase::Kickoff => 6.0,
        FormationPhase::Attack => 8.0,
        FormationPhase::Defence => 4.0,
    };
    base_offset += (world.tactics[team.index()].build_up_patience - 0.5) * 4.0;

    let ball_push = ((ball.x - goal_x) * 0.04).clamp(-4.0, 8.0);
    let mut x = goal_x + dir * (base_offset + ball_push);

    let (min_x, max_x) = if dir > 0.0 {
        (goal_x + dir * 2.0, goal_x + dir * 18.0)
    } else {
        (goal_x + dir * 18.0, goal_x + dir * 2.0)
    };
    x = x.clamp(min_x, max_x);

    let mut y = (ball.y * 0.4).clamp(-PITCH_H * 0.18, PITCH_H * 0.18);
    if team == TeamId::Away {
        // 좌표계는 동일하므로 그대로 사용
        y = y;
    }

    Vec2::new(x, y)
}

fn fallback_position(team: TeamId, base: Vec2) -> Vec2 {
    let half_len = PITCH_W * 0.5;
    let half_width = PITCH_H * 0.5;
    let x = if team == TeamId::Home {
        -half_len + base.x
    } else {
        half_len - base.x
    };
    let y = if team == TeamId::Home {
        base.y
    } else {
        -base.y
    };
    Vec2::new(
        x.clamp(-half_len + 3.0, half_len - 3.0),
        y.clamp(-half_width + 3.0, half_width - 3.0),
    )
}

fn line_average_y(
    ctx: &FormationContext,
    team: TeamId,
    target_line: usize,
    world: &World,
) -> Option<f32> {
    let mut sum = 0.0;
    let mut count = 0;
    let team_offset = match team {
        TeamId::Home => 0,
        TeamId::Away => N_PER_TEAM,
    };

    for (slot, &(line_idx, _)) in ctx.assignments.iter().enumerate() {
        if line_idx != target_line {
            continue;
        }
        let world_index = team_offset + slot + 1; // +1 to skip goalkeeper slot
        if world_index >= team_offset + N_PER_TEAM {
            continue;
        }
        let pos = world.player_pos(world_index);
        sum += pos.y;
        count += 1;
    }

    if count > 0 {
        Some(sum / count as f32)
    } else {
        None
    }
}
