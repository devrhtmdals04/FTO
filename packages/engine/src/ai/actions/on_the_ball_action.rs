use crate::ai::actions::pass_action::PassAction;
use crate::ai::actions::shoot_action::ShootAction;
use crate::ai::fsm::{Action, ActionContext, ActionPayload, ActionUpdate};
use crate::ai::perception::{Perception, PassTarget};
use crate::commands::Cmd;

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
                let shoot_score = score_shoot(context.perception);
                let pass_info = score_pass(context.perception);

                if shoot_score > 0.65 {
                    self.sub_state = OnBallSubState::ExecutingShoot;
                    if let Some(cmd) = self.shoot_action.begin(context, &ActionPayload::None) {
                        return ActionUpdate::Cmd(cmd);
                    }
                } else if pass_info.score > 0.5 {
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
                ActionUpdate::Move(move_dir)
            }
            OnBallSubState::ExecutingPass => {
                self.pass_action.update(context)
            }
            OnBallSubState::ExecutingShoot => {
                self.shoot_action.update(context)
            }
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

fn score_shoot(p: &Perception) -> f32 {
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

fn score_pass(p: &Perception) -> PassInfo<'_> {
    if p.open_pass_targets.is_empty() {
        return PassInfo {
            score: 0.0,
            best: None,
        };
    }
    let best_target = p.open_pass_targets.iter().max_by(|a, b| {
        eval_pass_target(a)
            .partial_cmp(&eval_pass_target(b))
            .unwrap()
    });
    match best_target {
        Some(target) => PassInfo {
            score: eval_pass_target(target),
            best: Some(target),
        },
        None => PassInfo {
            score: 0.0,
            best: None,
        },
    }
}

fn eval_pass_target(t: &PassTarget) -> f32 {
    let secure = if t.tti_opponent > t.tti_receiver {
        1.0
    } else {
        0.0
    };
    let s_lane = t.lane_open;
    let s_gain = clamp01(t.xt_gain);
    let s_risk = 1.0 - clamp01(t.risk);
    clamp01(0.35 * secure + 0.30 * s_lane + 0.25 * s_gain + 0.10 * s_risk)
}
