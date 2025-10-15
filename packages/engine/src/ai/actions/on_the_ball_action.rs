use crate::ai::actions::pass_action::PassAction;
use crate::ai::actions::shoot_action::ShootAction;
use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};
use crate::ai::perception::{PassTarget, Perception};
use crate::commands::Cmd;
use crate::params::PLAYER_VMAX;
use crate::tactics::ResolvedTactics;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
enum OnBallSubState {
    Dribbling,
    ExecutingPass,
    ExecutingShoot,
}

pub struct OnTheBallAction {
    sub_state: OnBallSubState,
    pass_action: PassAction,
    shoot_action: ShootAction,
}

impl Default for OnTheBallAction {
    fn default() -> Self {
        Self {
            sub_state: OnBallSubState::Dribbling,
            pass_action: PassAction::default(),
            shoot_action: ShootAction::default(),
        }
    }
}

impl Action for OnTheBallAction {
    fn begin(&mut self, _context: &mut ActionContext, _payload: &ActionPayload) -> Option<Cmd> {
        self.sub_state = OnBallSubState::Dribbling;
        None
    }

    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate {
        match self.sub_state {
            OnBallSubState::Dribbling => {
                let tactics = context.tactics;
                let shoot_score = score_shoot(context.perception, tactics);
                let pass_info = score_pass(context.perception, tactics);

                let shoot_threshold = (0.6 - 0.25 * (tactics.direct - 0.5)).clamp(0.45, 0.75);
                let pass_threshold = (0.5 - 0.2 * (tactics.risk - 0.5)).clamp(0.35, 0.65);

                if shoot_score > shoot_threshold {
                    self.sub_state = OnBallSubState::ExecutingShoot;
                    if let Some(cmd) = self.shoot_action.begin(context, &ActionPayload::None) {
                        return ActionUpdate::Cmd(cmd);
                    }
                } else if pass_info.score > pass_threshold {
                    if let Some(target) = pass_info.best {
                        self.sub_state = OnBallSubState::ExecutingPass;
                        let payload = ActionPayload::Pass(target);
                        if let Some(cmd) = self.pass_action.begin(context, &payload) {
                            return ActionUpdate::Cmd(cmd);
                        }
                    }
                }

                // Default to Dribble
                let dribble_target = context.perception.opp_goal.center;
                let player_pos = context.perception.me.pos;
                let move_dir = (dribble_target - player_pos).normalize();
                let speed = 2.5 + tactics.tempo.clamp(0.0, 1.0) * (PLAYER_VMAX - 2.5);
                ActionUpdate::Move(move_dir * speed)
            }
            OnBallSubState::ExecutingPass => self.pass_action.update(context),
            OnBallSubState::ExecutingShoot => self.shoot_action.update(context),
        }
    }

    fn is_done(&self) -> bool {
        match self.sub_state {
            OnBallSubState::ExecutingPass => self.pass_action.is_done(),
            OnBallSubState::ExecutingShoot => self.shoot_action.is_done(),
            OnBallSubState::Dribbling => false, // Dribbling is a continuous action
        }
    }
}

// --- Scoring Functions ---

fn clamp01(v: f32) -> f32 {
    v.clamp(0.0, 1.0)
}

fn score_shoot(p: &Perception, _tactics: &ResolvedTactics) -> f32 {
    let d = p.dist_to_goal.max(1.0);
    let s_dist = 1.0 / (1.0 + 0.08 * (d - 12.0));
    let s_ang = clamp01(p.angle_to_goal / (std::f32::consts::FRAC_PI_2));
    let s_lane = p.open_lane_to_goal;
    let s_press = clamp01((p.nearest_opponent_dist - 2.0) / 6.0);
    clamp01(0.35 * s_dist + 0.30 * s_ang + 0.25 * s_lane + 0.10 * s_press)
}

struct PassInfo<'a> {
    score: f32,
    best: Option<&'a PassTarget>,
}

fn score_pass<'a>(p: &'a Perception, tactics: &ResolvedTactics) -> PassInfo<'a> {
    if p.open_pass_targets.is_empty() {
        return PassInfo {
            score: 0.0,
            best: None,
        };
    }
    let best_target = p.open_pass_targets.iter().max_by(|a, b| {
        eval_pass_target(a, tactics)
            .partial_cmp(&eval_pass_target(b, tactics))
            .unwrap_or(std::cmp::Ordering::Equal)
    });
    match best_target {
        Some(target) => PassInfo {
            score: eval_pass_target(target, tactics),
            best: Some(target),
        },
        None => PassInfo {
            score: 0.0,
            best: None,
        },
    }
}

fn eval_pass_target(t: &PassTarget, tactics: &ResolvedTactics) -> f32 {
    let secure = if t.tti_opponent > t.tti_receiver {
        1.0
    } else {
        0.0
    };
    let s_lane = t.lane_open;
    let s_gain = clamp01(t.xt_gain);
    let s_risk = 1.0 - clamp01(t.risk);
    let direct_bias = tactics.direct.clamp(0.0, 1.0);
    let risk_bias = tactics.risk.clamp(0.0, 1.0);

    let gain_weight = 0.2 + 0.3 * direct_bias;
    let secure_weight = 0.25 + 0.2 * (1.0 - risk_bias);
    let lane_weight = 0.25;
    let mut risk_weight = 1.0 - (gain_weight + secure_weight + lane_weight);
    if risk_weight < 0.05 {
        risk_weight = 0.05;
    }

    clamp01(
        secure_weight * secure + lane_weight * s_lane + gain_weight * s_gain + risk_weight * s_risk,
    )
}
