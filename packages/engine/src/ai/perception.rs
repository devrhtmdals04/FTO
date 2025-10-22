use crate::params::R_BODY;
use crate::state::{World, N_PLAYERS};
use crate::types::{TeamId, Vec2};

/// Distance information about a nearby entity.
#[derive(Clone, Copy, Debug)]
pub struct EntityDistance {
    pub index: usize,
    pub position: Vec2,
    pub distance: f32,
}

/// Minimal yet structured perception snapshot passed into the decision layer.
#[derive(Clone, Debug)]
pub struct PerceptionSnapshot {
    pub tick: u32,
    pub player_index: usize,
    pub team_id: TeamId,
    pub player_position: Vec2,
    pub player_velocity: Vec2,
    pub ball_position: Vec2,
    pub ball_velocity: Vec2,
    pub distance_to_ball: f32,
    pub has_ball: bool,
    pub possession_team: Option<TeamId>,
    pub closest_teammate: Option<EntityDistance>,
    pub closest_opponent: Option<EntityDistance>,
    pub teammate_support: usize,
    pub opponent_pressure: f32,
}

impl PerceptionSnapshot {
    pub fn gather(world: &World, player_index: usize) -> Self {
        let team_id = TeamId::from_index((world.team_id(player_index) as usize).min(1));
        let player_position = world.player_pos(player_index);
        let player_velocity = world.player_vel(player_index);
        let ball_position = world.ball_pos();
        let ball_velocity = world.ball_vel();
        let distance_to_ball = player_position.distance(ball_position);
        let ctrl_radius = world.p_params[player_index].ctrl_radius.max(R_BODY);
        let has_ball = distance_to_ball <= ctrl_radius;

        let possession_team = match world.possession {
            -1 => None,
            0 => Some(TeamId::Home),
            1 => Some(TeamId::Away),
            _ => None,
        };

        let mut closest_teammate: Option<EntityDistance> = None;
        let mut closest_opponent: Option<EntityDistance> = None;
        let mut teammate_support = 0usize;

        for other in 0..N_PLAYERS {
            if other == player_index {
                continue;
            }
            let other_team = TeamId::from_index((world.team_id(other) as usize).min(1));
            let position = world.player_pos(other);
            let distance = player_position.distance(position);

            if other_team == team_id {
                if distance < 1e-3 {
                    continue;
                }
                if distance < 18.0 {
                    teammate_support += 1;
                }
                update_closest(&mut closest_teammate, other, position, distance);
            } else {
                update_closest(&mut closest_opponent, other, position, distance);
            }
        }

        let opponent_pressure = closest_opponent
            .map(|entry| (1.0 - (entry.distance / 12.0)).clamp(0.0, 1.0))
            .unwrap_or(0.0);

        Self {
            tick: world.tick,
            player_index,
            team_id,
            player_position,
            player_velocity,
            ball_position,
            ball_velocity,
            distance_to_ball,
            has_ball,
            possession_team,
            closest_teammate,
            closest_opponent,
            teammate_support,
            opponent_pressure,
        }
    }

    /// Higher values mean more room to play. The value is normalised to 0..1.
    pub fn space_score(&self) -> f32 {
        self.closest_opponent
            .map(|entry| (entry.distance / 20.0).clamp(0.0, 1.0))
            .unwrap_or(1.0)
    }

    /// A simple proxy for the player's individual risk appetite. Currently we
    /// reuse the opponent pressure inverted so that high pressure nudges the
    /// decision logic towards safer options.
    pub fn positioning_status(&self) -> f32 {
        1.0 - self.opponent_pressure
    }

    /// Suggests a direction where free space is available, used by the
    /// positioning module.
    pub fn suggested_space_direction(&self) -> Vec2 {
        if let Some(opponent) = self.closest_opponent {
            let away = (self.player_position - opponent.position).normalize();
            if away.norm() > 0.0 {
                return away;
            }
        }
        // Fall back to moving forward.
        (self.ball_position - self.player_position).normalize()
    }
}

fn update_closest(slot: &mut Option<EntityDistance>, index: usize, position: Vec2, distance: f32) {
    match slot {
        Some(existing) => {
            if distance < existing.distance {
                *slot = Some(EntityDistance {
                    index,
                    position,
                    distance,
                });
            }
        }
        None => {
            *slot = Some(EntityDistance {
                index,
                position,
                distance,
            });
        }
    }
}
