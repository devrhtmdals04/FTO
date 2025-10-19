use crate::ai::fsm::{PlayerFSM, TeamState};
use crate::commands::Cmd;
use crate::player_data::get_baseline_player_by_id;
use crate::state::World;
use crate::tactics::QuantifiedTactics;
use crate::types::{DetailedPlayerRole, PlayerIndex, PlayerInstruction, PlayerParams, Tactic, TeamId};

#[derive(Debug)]
pub struct PlayerClass {
    pub player_id: PlayerIndex,
    pub name: &'static str,
    pub role: DetailedPlayerRole,
    pub team_id: TeamId,
    pub quantified_tactics: QuantifiedTactics,
    pub personal_instructions: Option<PlayerInstruction>,
    pub params: PlayerParams,
    pub fsm: PlayerFSM,
}

impl PlayerClass {
    pub fn new(
        world: &World,
        team_tactic: &Tactic,
        quantified_tactics: &QuantifiedTactics,
        player_index: PlayerIndex,
    ) -> Self {
        let team_id = TeamId::from_index(world.p_team[player_index] as usize);
        let player_id = world.p_player_id[player_index];

        let personal_instructions = team_tactic.personal_instructions.get(&player_id).cloned();

        let baseline_data = get_baseline_player_by_id(player_id).unwrap();

        let lineup_index = team_tactic
            .lineup
            .iter()
            .position(|&id| id == player_id)
            .unwrap();
        let role = team_tactic.roles[lineup_index].clone();

        Self {
            player_id: player_index,
            name: baseline_data.name,
            role,
            team_id,
            quantified_tactics: *quantified_tactics,
            personal_instructions,
            params: world.p_params[player_index],
            fsm: PlayerFSM::new(),
        }
    }

    pub fn update_ai(&mut self, world: &mut World, team_state: TeamState) -> Option<Cmd> {
        self.fsm.tick(world, self.player_id, team_state)
    }
}
