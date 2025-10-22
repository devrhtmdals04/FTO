use crate::params::PITCH_W;
use crate::types::{TeamId, Vec2};

use super::advanced_movement;
use super::perception::PerceptionSnapshot;
use super::phase::TeamPhase;
use super::positioning::{compute_best_position, PositioningContext};

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

fn decide_with_ball(ctx: &DecisionContext<'_>) -> PlayerAction {
    let perception = ctx.perception;
    let team_phase = ctx.positioning_ctx.team_phase;
    let goal_target = opponent_goal(perception.team_id);
    let goal_distance = perception.player_position.distance(goal_target);

    if team_phase == TeamPhase::FinalThird && goal_distance < 20.0 {
        return PlayerAction::Shoot {
            target: goal_target,
        };
    }

    if let Some(teammate) = perception.closest_teammate {
        if teammate.distance < 14.0 && perception.opponent_pressure > 0.6 {
            return PlayerAction::GroundPass {
                target: teammate.position,
                receiver: teammate.index,
            };
        }
    }

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
