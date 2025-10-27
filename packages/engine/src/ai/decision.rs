use crate::params::PITCH_W;
use crate::types::{TeamId, Vec2};

use super::advanced_movement;
use super::perception::PerceptionSnapshot;
use super::phase::TeamPhase;
use super::positioning::{self, compute_best_position, PositioningContext};

pub struct DecisionContext<'a> {
    pub perception: &'a PerceptionSnapshot,
    pub positioning_ctx: PositioningContext<'a>,
}

#[derive(Clone, Debug)]
pub enum PlayerAction {
    None,
    MoveTo(Vec2),
    GroundPass { target: Vec2, receiver: usize },
    Shoot { target: Vec2 },
}

pub fn decide(ctx: DecisionContext<'_>) -> PlayerAction {
    if ctx.perception.has_ball {
        return decide_with_ball(&ctx);
    }

    let mut target = compute_best_position(&ctx.positioning_ctx);
    if let Some(advanced) = advanced_movement::plan(
        ctx.positioning_ctx.team_phase,
        ctx.perception,
        ctx.positioning_ctx.anchor,
    ) {
        target = target.lerp(advanced, 0.35);
    }

    PlayerAction::MoveTo(target)
}

// A struct to hold information about a potential pass candidate.
struct PassCandidate {
    index: usize,
    position: Vec2,
    score: f32,
}

/// Evaluates all teammates within perception range to find the best pass option.
fn evaluate_best_pass(ctx: &DecisionContext<'_>) -> Option<PassCandidate> {
    let perception = ctx.perception;
    let mut best_candidate: Option<PassCandidate> = None;
    let mut best_score = -1.0;

    for teammate in &perception.teammates {
        // Exclude teammates who are too close to be viable pass options.
        if teammate.distance < 8.0 {
            continue;
        }

        // Calculate the Expected Threat (xT) score for the teammate's position.
        let xt_score =
            positioning::calculate_normalized_xt_score(teammate.position, perception.team_id);

        // Apply a penalty based on distance; longer passes are riskier.
        // Assumes a max effective pass distance of 40m.
        let distance_penalty = 1.0 - (teammate.distance / 40.0).clamp(0.0, 1.0);

        let final_score = xt_score * distance_penalty;

        if final_score > best_score {
            best_score = final_score;
            best_candidate = Some(PassCandidate {
                index: teammate.index,
                position: teammate.position,
                score: final_score,
            });
        }
    }

    best_candidate
}

fn decide_with_ball(ctx: &DecisionContext<'_>) -> PlayerAction {
    let perception = ctx.perception;
    let team_phase = ctx.positioning_ctx.team_phase;
    let goal_target = opponent_goal(perception.team_id);
    let goal_distance = perception.player_position.distance(goal_target);

    // 1. Shooting Logic (unchanged)
    if team_phase == TeamPhase::FinalThird && goal_distance < 20.0 {
        return PlayerAction::Shoot {
            target: goal_target,
        };
    }

    // 2. New Passing Logic
    // If under pressure, evaluate passing options.
    if perception.opponent_pressure > 0.5 {
        if let Some(best_pass) = evaluate_best_pass(ctx) {
            // If a good pass option is found (score > threshold), execute the pass.
            if best_pass.score > 0.03 {
                return PlayerAction::GroundPass {
                    target: best_pass.position,
                    receiver: best_pass.index,
                };
            }
        }
    }

    // 3. Dribble/Carry Logic (unchanged)
    let mut target = compute_best_position(&ctx.positioning_ctx);
    let carry =
        perception.player_position + (goal_target - perception.player_position).normalize() * 6.0;
    target = target.lerp(carry, 0.4);

    PlayerAction::MoveTo(target)
}

fn opponent_goal(team: TeamId) -> Vec2 {
    let x = match team {
        TeamId::Home => PITCH_W * 0.5 - 2.0,
        TeamId::Away => -PITCH_W * 0.5 + 2.0,
    };
    Vec2::new(x, 0.0)
}
