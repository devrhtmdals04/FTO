use crate::ai::actions::defensive_action::DefensiveAction;
use crate::ai::actions::off_the_ball_action::OffTheBallAction;
use crate::ai::actions::on_the_ball_action::OnTheBallAction;
use crate::ai::formation::{compute_anchor, FormationContext, FormationPhase};
use crate::ai::perception::{build_perception, PassTarget, Perception};
use crate::commands::Cmd;
use crate::state::World;
use crate::tactics::QuantifiedTactics;
use crate::types::{DetailedPlayerRole, TeamId, Vec2};
use log::info;

// Represents the team's overall tactical situation.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum TeamState {
    BuildUp,
    FinalThird,
    HighBlock,
    MidBlock,
    LowBlock,
    GetBall,
    LoseBall,
    CornerAttack,
    CornerDeffence,
    KickOffAttack,
    KickOFfDeffence,
}

impl TeamState {
    pub fn to_u8(&self) -> u8 {
        match self {
            TeamState::BuildUp => 0,
            TeamState::FinalThird => 1,
            TeamState::HighBlock => 2,
            TeamState::MidBlock => 3,
            TeamState::LowBlock => 4,
            TeamState::GetBall => 5,
            TeamState::LoseBall => 6,
            TeamState::CornerAttack => 7,
            TeamState::CornerDeffence => 8,
            TeamState::KickOffAttack => 9,
            TeamState::KickOFfDeffence => 10,
        }
    }
}

// Represents the individual player's current high-level action.
#[derive(Debug, Clone, Copy, PartialEq, Eq)]
pub enum State {
    Idle,
    OnTheBall,
    OffTheBallAttack,
    Defending,
}

impl State {
    pub fn to_u8(&self) -> u8 {
        match self {
            State::Idle => 0,
            State::OnTheBall => 1,
            State::OffTheBallAttack => 2,
            State::Defending => 3,
        }
    }
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

#[derive(Debug, Default)]
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
#[derive(Debug)]
pub struct PlayerFSM {
    state: State,
    idle_action: IdleAction,
    on_the_ball_action: OnTheBallAction,
    otb_action: OffTheBallAction,
    defensive_action: DefensiveAction,

    // Formation and tactical data
    role: DetailedPlayerRole,
    team_id: TeamId,
    quantified_tactics: QuantifiedTactics,
    lineup_slot: usize,
    attack_formation: String,
    defence_formation: String,
    kickoff_formation: String,

    // Internal state
    formation_anchor: Vec2,
}

impl PlayerFSM {
    pub fn new(
        role: DetailedPlayerRole,
        team_id: TeamId,
        quantified_tactics: QuantifiedTactics,
        lineup_slot: usize,
        attack_formation: String,
        defence_formation: String,
        kickoff_formation: String,
    ) -> Self {
        Self {
            state: State::Idle,
            idle_action: IdleAction::default(),
            on_the_ball_action: OnTheBallAction::default(),
            otb_action: OffTheBallAction::default(),
            defensive_action: DefensiveAction::default(),
            role,
            team_id,
            quantified_tactics,
            lineup_slot,
            attack_formation,
            defence_formation,
            kickoff_formation,
            formation_anchor: Vec2::ZERO, // Initial anchor
        }
    }

    pub fn get_state(&self) -> State {
        self.state
    }

    pub fn tick(
        &mut self,
        world: &mut World,
        player_index: usize,
        team_state: TeamState,
    ) -> Option<Cmd> {
        // 1. Update formation anchor based on team state
        let phase = formation_phase_from_team_state(team_state);
        let formation_str = self.formation_string_for_phase(phase);
        let ctx = FormationContext::new(formation_str, &self.quantified_tactics);
        self.formation_anchor = compute_anchor(
            &ctx,
            self.team_id,
            &self.role,
            self.lineup_slot,
            phase,
            world,
        );

        // 2. Build perception and context
        let perception = build_perception(world, player_index, self.formation_anchor);
        let mut context = ActionContext {
            perception: &perception,
            player_index,
        };

        // 3. Check for action completion
        let current_action_is_done = match self.state {
            State::OnTheBall => self.on_the_ball_action.is_done(),
            _ => false,
        };

        if current_action_is_done {
            self.state = State::Idle;
        }

        // 4. If idle, decide on a new action
        if self.state == State::Idle {
            let decision = decide(&perception, team_state);
            return self.transition(decision.state, &mut context, &decision.payload);
        }

        // 5. Update the current action
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
            "[AI/FSM] Player {} state {:?} -> {:?}",
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

    fn formation_string_for_phase(&self, phase: FormationPhase) -> &str {
        match phase {
            FormationPhase::Attack => &self.attack_formation,
            FormationPhase::Defence => &self.defence_formation,
            FormationPhase::Kickoff => &self.kickoff_formation,
        }
    }
}

// --- Decision Logic ---

struct DecisionOutput<'a> {
    state: State,
    payload: ActionPayload<'a>,
}

fn decide<'a>(
    p: &'a Perception,
    team_state: TeamState,
) -> DecisionOutput<'a> {
    match team_state {
        TeamState::BuildUp
        | TeamState::FinalThird
        | TeamState::GetBall
        | TeamState::KickOffAttack
        | TeamState::CornerAttack => {
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
        TeamState::HighBlock
        | TeamState::MidBlock
        | TeamState::LowBlock
        | TeamState::LoseBall
        | TeamState::KickOFfDeffence
        | TeamState::CornerDeffence => DecisionOutput {
            state: State::Defending,
            payload: ActionPayload::None,
        },
    }
}

fn formation_phase_from_team_state(team_state: TeamState) -> FormationPhase {
    match team_state {
        TeamState::KickOffAttack | TeamState::KickOFfDeffence => FormationPhase::Kickoff,
        TeamState::BuildUp
        | TeamState::FinalThird
        | TeamState::CornerAttack
        | TeamState::GetBall => FormationPhase::Attack,
        TeamState::HighBlock
        | TeamState::MidBlock
        | TeamState::LowBlock
        | TeamState::CornerDeffence
        | TeamState::LoseBall => FormationPhase::Defence,
    }
}
