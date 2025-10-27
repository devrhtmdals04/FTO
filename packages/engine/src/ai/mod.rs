//! New AI core built around a simple perception → decision → execution pipeline.
//! The goal is to provide a clean foundation that we can iterate on without the
//! complexity of the previous FSM-based implementation.

pub mod advanced_movement;
pub mod decision;
pub mod execution;
pub mod formations;
pub mod perception;
pub mod phase;
pub mod positioning;
pub mod restarts;
pub mod scheduler;
pub mod tactics;
pub mod xtmodel;
pub mod zones;

pub use formations::PhaseLayout;
pub use phase::TeamPhase;
pub use restarts::{kickoff_positions, set_piece_positions};
pub use scheduler::Scheduler;
pub use tactics::{QuantifiedTactics, TacticModel};

use crate::commands::Cmd;
use crate::state::{PlayerInput20, World};
use crate::types::Vec2;
use decision::{DecisionContext, PlayerAction};
use perception::PerceptionSnapshot;
use positioning::{PositioningContext, PositioningWeights};

/// Lightweight player controller that keeps just enough state to layer noise on
/// top of the deterministic positioning result. It acts as the "brain" for a
/// single player within the new pipeline.
#[derive(Debug, Clone, Copy)]
pub struct PlayerBrain {
    anchor: Vec2,
    positioning_bias: f32,
    stats: PlayerInput20, // stats 필드 추가
}

impl PlayerBrain {
    /// Creates a new brain anchored at the player's spawn position.
    pub fn new(initial_anchor: Vec2, stats: PlayerInput20) -> Self {
        Self {
            anchor: initial_anchor,
            positioning_bias: 0.25,
            stats,
        }
    }

    /// Updates the anchor that positioning logic uses as a tactical baseline.
    pub fn set_anchor(&mut self, anchor: Vec2) {
        self.anchor = anchor;
    }

    /// Returns the current tactical anchor used by the positioning logic.
    pub fn anchor(&self) -> Vec2 {
        self.anchor
    }

    /// Runs a single perception → decision → execution cycle for the player.
    pub fn tick(
        &mut self,
        world: &World,
        team_phase: TeamPhase,
        player_index: usize,
    ) -> Option<Cmd> {
        let perception = PerceptionSnapshot::gather(world, player_index, &self.stats);
        let team_id = perception.team_id;

        let positioning_ctx = PositioningContext {
            anchor: self.anchor,
            player_index,
            team_phase,
            perception: &perception,
            tactics: &world.tactics[team_id.index()],
            weights: PositioningWeights::default(),
            noise_bias: self.positioning_bias,
        };

        let action = decision::decide(DecisionContext {
            perception: &perception,
            positioning_ctx,
        });

        if let PlayerAction::MoveTo(target) = action {
            // Update anchor slowly so that players keep learning where they
            // are supposed to be without snapping every frame.
            let blended = self.anchor.lerp(target, 0.05);
            self.anchor = blended;
        }

        execution::into_command(player_index, action)
    }
}
