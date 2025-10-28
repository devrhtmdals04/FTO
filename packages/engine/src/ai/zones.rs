use crate::types::Vec2;

const PITCH_LENGTH: f32 = 105.0; // Corresponds to x-axis
const PITCH_WIDTH: f32 = 68.0; // Corresponds to y-axis

/// Represents the 7 longitudinal zones of the pitch, from own goal to opponent's goal.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum LongitudinalZone {
    /// Zone 0: Own penalty area and goal line area.
    OwnGoalLine,
    /// Zone 1: Area for building up from the back.
    DefensiveThird,
    /// Zone 2: Defensive midfield area.
    DefensiveMid,
    /// Zone 3: The middle of the park.
    Center,
    /// Zone 4: Attacking midfield area, "Zone 14" approach.
    AttackingMid,
    /// Zone 5: Final third, area for creating chances.
    AttackingThird,
    /// Zone 6: Opponent's penalty area and goal line.
    OpponentGoalLine,
}

/// Represents the 5 lateral zones of the pitch.
#[derive(Debug, PartialEq, Eq, Clone, Copy)]
pub enum LateralZone {
    LeftWing,
    LeftHalfSpace,
    Center,
    RightHalfSpace,
    RightWing,
}

/// A struct to hold the pitch zone for a given position.
#[derive(Debug, Clone, Copy)]
pub struct PitchZone {
    pub longitudinal: LongitudinalZone,
    pub lateral: LateralZone,
}

/// Gets the pitch zone (both longitudinal and lateral) for a given position.
pub fn get_pitch_zone(pos: Vec2) -> PitchZone {
    PitchZone {
        longitudinal: get_longitudinal_zone(pos.x),
        lateral: get_lateral_zone(pos.y),
    }
}

/// Returns the longitudinal (along pitch length, x-axis) zone for a given x-coordinate.
/// The pitch is divided into 7 zones from own goal (-x) to opponent goal (+x).
pub fn get_longitudinal_zone(x: f32) -> LongitudinalZone {
    // Normalize x-coordinate from [-PITCH_LENGTH/2, PITCH_LENGTH/2] to [0, 1]
    let x_ratio = (x + PITCH_LENGTH / 2.0) / PITCH_LENGTH;
    match (x_ratio * 7.0).floor() as i32 {
        0 => LongitudinalZone::OwnGoalLine,
        1 => LongitudinalZone::DefensiveThird,
        2 => LongitudinalZone::DefensiveMid,
        3 => LongitudinalZone::Center,
        4 => LongitudinalZone::AttackingMid,
        5 => LongitudinalZone::AttackingThird,
        _ => LongitudinalZone::OpponentGoalLine,
    }
}

/// Returns the lateral (along pitch width, y-axis) zone for a given y-coordinate.
/// The pitch is divided into 5 zones.
pub fn get_lateral_zone(y: f32) -> LateralZone {
    // Normalize y-coordinate from [-PITCH_WIDTH/2, PITCH_WIDTH/2] to [0, 1]
    let y_ratio = (y + PITCH_WIDTH / 2.0) / PITCH_WIDTH;
    match (y_ratio * 5.0).floor() as i32 {
        0 => LateralZone::LeftWing,
        1 => LateralZone::LeftHalfSpace,
        2 => LateralZone::Center,
        3 => LateralZone::RightHalfSpace,
        _ => LateralZone::RightWing,
    }
}
