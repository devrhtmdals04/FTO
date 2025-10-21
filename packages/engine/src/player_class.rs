use crate::ai::fsm::{PlayerFSM, TeamState};
use crate::commands::Cmd;
use crate::player_data::get_baseline_player_by_id;
use crate::state::World;
use crate::tactics::QuantifiedTactics;
use crate::types::{PlayerIndex, PlayerInstruction, PlayerParams, Tactic};
use log::info;

#[derive(Debug)]
pub struct PlayerClass {
    pub player_id: PlayerIndex,
    pub name: &'static str,
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
        let team_id = world.team_id(player_index);
        let player_id = world.p_player_id[player_index];

        let personal_instructions = team_tactic.personal_instructions.get(&player_id).cloned();

        let baseline_data = get_baseline_player_by_id(player_id).unwrap();

        let lineup_index = team_tactic
            .lineup
            .iter()
            .position(|&id| id == player_id)
            .unwrap();
        let role = team_tactic.roles[lineup_index].clone();

        let attack_formation = team_tactic.offensive_formation.clone();
        let defence_formation = team_tactic.defensive_formation.clone();
        let kickoff_formation = team_tactic
            .team_tactic
            .team_attacking
            .buildup_formation
            .clone();

        let fsm = PlayerFSM::new(
            role.clone(),
            team_id,
            *quantified_tactics,
            lineup_index,
            attack_formation,
            defence_formation,
            kickoff_formation,
        );

        let instance = Self {
            player_id: player_index,
            name: baseline_data.name,
            personal_instructions,
            params: world.p_params[player_index],
            fsm,
        };
        info!(
            "[PlayerClass] Initialized {} as {:?}",
            instance.name, role
        );
        instance
    }

    pub fn update_ai(&mut self, world: &mut World, team_state: TeamState) -> Option<Cmd> {
        self.fsm.tick(world, self.player_id, team_state)
    }
}
