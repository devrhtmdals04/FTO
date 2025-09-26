use crate::ai::actions::dribble_action::DribbleAction;
use crate::ai::actions::off_the_ball_action::OffTheBallAction;
use crate::ai::actions::pass_action::PassAction;
use crate::ai::actions::shoot_action::ShootAction;
use crate::ai::perception::{build_perception, Perception, PassTarget};
use crate::commands::Cmd;
use crate::state::World;
use crate::types::Vec2;
use log::info;

#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum State {
    Idle,
    AttackShoot,
    AttackPass,
    AttackDribble,
    OffTheBall,
}

#[derive(Clone)]
pub enum ActionPayload<'a> {
    None,
    Pass(&'a PassTarget),
}

pub enum ActionUpdate {
    None,
    Cmd(Cmd),
    Move(Vec2),
}

pub struct ActionContext<'a> {
    pub perception: &'a Perception,
    pub player_index: usize,
}

pub trait Action {
    fn begin(&mut self, context: &mut ActionContext, payload: &ActionPayload) -> Option<Cmd>;
    fn update(&mut self, context: &mut ActionContext) -> ActionUpdate;
    fn is_done(&self) -> bool;
}

// --- Action Handlers ---

#[derive(Default)]
struct IdleAction;
impl Action for IdleAction {
    fn begin(&mut self, _context: &mut ActionContext, _payload: &ActionPayload) -> Option<Cmd> { None }
    fn update(&mut self, _context: &mut ActionContext) -> ActionUpdate { ActionUpdate::None }
    fn is_done(&self) -> bool { true }
}

// The Finite State Machine for a single player.
pub struct PlayerFSM {
    state: State,
    idle_action: IdleAction,
    shoot_action: ShootAction,
    pass_action: PassAction,
    dribble_action: DribbleAction,
    otb_action: OffTheBallAction,
}

impl PlayerFSM {
    pub fn new() -> Self {
        Self {
            state: State::Idle,
            idle_action: IdleAction::default(),
            shoot_action: ShootAction::default(),
            pass_action: PassAction::default(),
            dribble_action: DribbleAction::default(),
            otb_action: OffTheBallAction::default(),
        }
    }

    pub fn tick(&mut self, world: &mut World, player_index: usize) -> Option<Cmd> {
        let perception = build_perception(world, player_index);
        let mut context = ActionContext {
            perception: &perception,
            player_index,
        };

        let current_action_is_done = match self.state {
            State::AttackShoot => self.shoot_action.is_done(),
            State::AttackPass => self.pass_action.is_done(),
            _ => false,
        };

        if current_action_is_done {
            info!("[Player {}] Action {:?} finished. Returning to Idle.", player_index, self.state);
            self.state = State::Idle;
        }

        if self.state == State::Idle {
            let decision = decide(&perception);
            return self.transition(decision.state, &mut context, &decision.payload);
        }

        let update_result = match self.state {
            State::Idle => self.idle_action.update(&mut context),
            State::AttackShoot => self.shoot_action.update(&mut context),
            State::AttackPass => self.pass_action.update(&mut context),
            State::AttackDribble => self.dribble_action.update(&mut context),
            State::OffTheBall => self.otb_action.update(&mut context),
        };

        match update_result {
            ActionUpdate::Cmd(cmd) => Some(cmd),
            ActionUpdate::Move(vel) => {
                world.pcommand[player_index].target_vel = vel;
                None
            }
            ActionUpdate::None => None,
        }
    }

    fn transition(
        &mut self,
        new_state: State,
        context: &mut ActionContext,
        payload: &ActionPayload,
    ) -> Option<Cmd> {
        info!("[Player {}] State transition: {:?} -> {:?}", context.player_index, self.state, new_state);
        self.state = new_state;
        match self.state {
            State::Idle => self.idle_action.begin(context, payload),
            State::AttackShoot => self.shoot_action.begin(context, payload),
            State::AttackPass => self.pass_action.begin(context, payload),
            State::AttackDribble => self.dribble_action.begin(context, payload),
            State::OffTheBall => self.otb_action.begin(context, payload),
        }
    }
}

// --- Decision Logic ---

struct DecisionOutput<'a> {
    state: State,
    payload: ActionPayload<'a>,
}

fn decide<'a>(p: &'a Perception) -> DecisionOutput<'a> {
    if p.me.has_ball {
        let shoot_score = score_shoot(p);
        let pass_info = score_pass(p);
        let dribble_score = score_dribble(p, pass_info.score, shoot_score);

        let max_score = shoot_score.max(pass_info.score).max(dribble_score);

        if max_score == shoot_score && shoot_score > 0.65 {
            return DecisionOutput {
                state: State::AttackShoot,
                payload: ActionPayload::None,
            };
        } else if max_score == pass_info.score && pass_info.score > 0.5 {
            if let Some(target) = pass_info.best {
                return DecisionOutput {
                    state: State::AttackPass,
                    payload: ActionPayload::Pass(target),
                };
            }
        }

        return DecisionOutput {
            state: State::AttackDribble,
            payload: ActionPayload::None,
        };
    } else {
        return DecisionOutput {
            state: State::OffTheBall,
            payload: ActionPayload::None,
        };
    }
}

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

fn score_pass(p: &Perception) -> PassInfo {
    if p.open_pass_targets.is_empty() {
        return PassInfo {
            score: 0.0,
            best: None,
        };
    }
    let best_target = p
        .open_pass_targets
        .iter()
        .max_by(|a, b| eval_pass_target(a).partial_cmp(&eval_pass_target(b)).unwrap());
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

fn score_dribble(p: &Perception, pass_score: f32, shoot_score: f32) -> f32 {
    let s_space = clamp01(p.free_forward_space / 8.0);
    let s_press = clamp01((p.nearest_opponent_dist - 2.0) / 6.0);
    let not_great_alt = clamp01(1.0 - pass_score.max(shoot_score));
    clamp01(0.45 * s_space + 0.35 * s_press + 0.20 * not_great_alt)
}