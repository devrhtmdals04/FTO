use crate::ai::actions::defensive_action::DefensiveAction;
use crate::ai::actions::off_the_ball_action::OffTheBallAction;
use crate::ai::actions::on_the_ball_action::OnTheBallAction;
use crate::ai::perception::{build_perception, PassTarget, Perception};
use crate::commands::Cmd;
use crate::state::World;
use crate::types::Vec2;
use log::info;

// Represents the team's overall tactical situation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TeamState {
    Attacking,
    Defending,
    Transition,
}

// Represents the individual player's current high-level action.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum State {
    Idle,
    OnTheBall,
    OffTheBallAttack,
    Defending,
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
    fn begin(&mut self, _context: &mut ActionContext, _payload: &ActionPayload) -> Option<Cmd> {
        None
    }
    fn update(&mut self, _context: &mut ActionContext) -> ActionUpdate {
        ActionUpdate::None
    }
    fn is_done(&self) -> bool {
        true
    }
}

// The Finite State Machine for a single player.
pub struct PlayerFSM {
    state: State,
    idle_action: IdleAction,
    on_the_ball_action: OnTheBallAction,
    otb_action: OffTheBallAction,
    defensive_action: DefensiveAction,
}

impl PlayerFSM {
    pub fn new() -> Self {
        Self {
            state: State::Idle,
            idle_action: IdleAction::default(),
            on_the_ball_action: OnTheBallAction::default(),
            otb_action: OffTheBallAction::default(),
            defensive_action: DefensiveAction::default(),
        }
    }

    pub fn tick(
        &mut self,
        world: &mut World,
        player_index: usize,
        team_state: TeamState,
    ) -> Option<Cmd> {
        let perception = build_perception(world, player_index);
        let mut context = ActionContext {
            perception: &perception,
            player_index,
        };

        let current_action_is_done = match self.state {
            State::OnTheBall => self.on_the_ball_action.is_done(),
            _ => false,
        };

        if current_action_is_done {
            info!(
                "[Player {}] Action {:?} finished. Returning to Idle.",
                player_index, self.state
            );
            self.state = State::Idle;
        }

        if self.state == State::Idle {
            let decision = decide(&perception, team_state);
            return self.transition(decision.state, &mut context, &decision.payload);
        }

        let update_result = match self.state {
            State::Idle => self.idle_action.update(&mut context),
            State::OnTheBall => self.on_the_ball_action.update(&mut context),
            State::OffTheBallAttack => self.otb_action.update(&mut context),
            State::Defending => self.defensive_action.update(&mut context),
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
        info!(
            "[Player {}] State transition: {:?} -> {:?}",
            context.player_index, self.state, new_state
        );
        self.state = new_state;
        match self.state {
            State::Idle => self.idle_action.begin(context, payload),
            State::OnTheBall => self.on_the_ball_action.begin(context, payload),
            State::OffTheBallAttack => self.otb_action.begin(context, payload),
            State::Defending => self.defensive_action.begin(context, payload),
        }
    }
}

// --- Decision Logic ---

struct DecisionOutput<'a> {
    state: State,
    payload: ActionPayload<'a>,
}

fn decide<'a>(p: &'a Perception, team_state: TeamState) -> DecisionOutput<'a> {
    match team_state {
        TeamState::Attacking | TeamState::Transition => {
            if p.me.has_ball {
                DecisionOutput {
                    state: State::OnTheBall,
                    payload: ActionPayload::None,
                }
            } else {
                DecisionOutput {
                    state: State::OffTheBallAttack,
                    payload: ActionPayload::None,
                }
            }
        }
        TeamState::Defending => DecisionOutput {
            state: State::Defending,
            payload: ActionPayload::None,
        },
    }
}
