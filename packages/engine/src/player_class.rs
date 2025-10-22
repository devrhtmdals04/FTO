use crate::ai::{formations, PlayerBrain, QuantifiedTactics, TacticModel, TeamPhase};
use crate::commands::Cmd;
use crate::player_data::get_baseline_player_by_id;
use crate::state::World;
use crate::types::{
    DetailedPlayerRole, PlayerIndex, PlayerInstruction, PlayerParams, TeamId, Vec2,
};
use log::info;

#[derive(Debug)]
pub struct PlayerClass {
    pub player_id: PlayerIndex,
    pub name: &'static str,
    pub personal_instructions: Option<PlayerInstruction>,
    pub params: PlayerParams,
    pub quantified_tactics: QuantifiedTactics,
    pub team_id: TeamId,
    pub role: DetailedPlayerRole,
    pub lineup_slot: usize,
    brain: PlayerBrain,
}

impl PlayerClass {
    pub fn new(world: &World, tactic_model: &TacticModel, player_index: PlayerIndex) -> Self {
        let team_id = TeamId::from_index((world.team_id(player_index) as usize).min(1));
        let player_id = world.p_player_id[player_index];

        let personal_instructions = tactic_model.personal_instruction(player_id).cloned();
        let baseline_data = get_baseline_player_by_id(player_id).unwrap();

        let lineup_slot = tactic_model.lineup_slot(player_id).unwrap_or(0);
        let role = tactic_model
            .role_for_slot(lineup_slot)
            .cloned()
            .unwrap_or(DetailedPlayerRole::ST);

        let anchor = world.player_pos(player_index);
        let brain = PlayerBrain::new(anchor);

        info!(
            "[PlayerClass] Initialized {} (team {:?}, role {:?}, atk {}, def {})",
            baseline_data.name,
            team_id,
            role,
            tactic_model.attacking_formation(),
            tactic_model.defensive_formation()
        );

        Self {
            player_id: player_index,
            name: baseline_data.name,
            personal_instructions,
            params: world.p_params[player_index],
            quantified_tactics: tactic_model.quantified(),
            team_id,
            role,
            lineup_slot,
            brain,
        }
    }

    pub fn update_ai(&mut self, world: &World, team_phase: TeamPhase) -> Option<Cmd> {
        let layout =
            formations::ideal_layout_for_phase(self.team_id, team_phase, &self.quantified_tactics);
        let desired_anchor = layout
            .positions
            .get(self.lineup_slot)
            .copied()
            .unwrap_or_else(|| world.player_pos(self.player_id));
        let blended_anchor = self.brain.anchor().lerp(desired_anchor, 0.35);
        self.brain.set_anchor(blended_anchor);
        self.brain.tick(world, team_phase, self.player_id)
    }

    pub fn reset_anchor(&mut self, anchor: Vec2) {
        self.brain.set_anchor(anchor);
    }
}
