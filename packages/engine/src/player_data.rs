use crate::{state::PlayerInput20, types::Foot};

pub static SQUAD_A: [PlayerInput20; 11] = [
    // Alisson Becker
    PlayerInput20 {
        name: "Alisson Becker",
        pace: 9, accel: 9, agility: 12, stamina: 12, strength: 15,
        first_touch: 11, passing: 12, vision: 12,
        finishing: 3, shot_power: 10, tackling: 12, interception: 14,
        heading: 10, jumping: 16,
        height_cm: 193, weight_kg: 91,
        foot: Foot::R, weak_foot: 3,
    },
    // Kyle Walker
    PlayerInput20 {
        name: "Kyle Walker",
        pace: 18, accel: 18, agility: 15, stamina: 16, strength: 14,
        first_touch: 13, passing: 13, vision: 12,
        finishing: 8, shot_power: 12, tackling: 17, interception: 15,
        heading: 12, jumping: 15,
        height_cm: 183, weight_kg: 83,
        foot: Foot::R, weak_foot: 3,
    },
    // Rúben Dias
    PlayerInput20 {
        name: "Rúben Dias",
        pace: 12, accel: 11, agility: 12, stamina: 15, strength: 17,
        first_touch: 12, passing: 12, vision: 11,
        finishing: 6, shot_power: 10, tackling: 18, interception: 17,
        heading: 16, jumping: 15,
        height_cm: 187, weight_kg: 82,
        foot: Foot::R, weak_foot: 3,
    },
    // Kim Min-jae
    PlayerInput20 {
        name: "Kim Min-jae",
        pace: 13, accel: 12, agility: 12, stamina: 15, strength: 16,
        first_touch: 12, passing: 11, vision: 10,
        finishing: 6, shot_power: 9, tackling: 17, interception: 16,
        heading: 16, jumping: 15,
        height_cm: 190, weight_kg: 81,
        foot: Foot::R, weak_foot: 3,
    },
    // Alphonso Davies
    PlayerInput20 {
        name: "Alphonso Davies",
        pace: 19, accel: 19, agility: 17, stamina: 16, strength: 12,
        first_touch: 13, passing: 13, vision: 12,
        finishing: 9, shot_power: 12, tackling: 14, interception: 13,
        heading: 10, jumping: 14,
        height_cm: 183, weight_kg: 77,
        foot: Foot::L, weak_foot: 4,
    },
    // Rodri
    PlayerInput20 {
        name: "Rodri",
        pace: 10, accel: 10, agility: 11, stamina: 16, strength: 16,
        first_touch: 15, passing: 17, vision: 16,
        finishing: 9, shot_power: 14, tackling: 17, interception: 18,
        heading: 14, jumping: 13,
        height_cm: 191, weight_kg: 82,
        foot: Foot::R, weak_foot: 3,
    },
    // Luka Modrić
    PlayerInput20 {
        name: "Luka Modrić",
        pace: 12, accel: 13, agility: 18, stamina: 14, strength: 10,
        first_touch: 19, passing: 19, vision: 20,
        finishing: 12, shot_power: 13, tackling: 10, interception: 12,
        heading: 8, jumping: 9,
        height_cm: 172, weight_kg: 66,
        foot: Foot::R, weak_foot: 4,
    },
    // Kevin De Bruyne
    PlayerInput20 {
        name: "Kevin De Bruyne",
        pace: 13, accel: 12, agility: 14, stamina: 14, strength: 12,
        first_touch: 18, passing: 20, vision: 20,
        finishing: 14, shot_power: 16, tackling: 10, interception: 12,
        heading: 10, jumping: 9,
        height_cm: 181, weight_kg: 70,
        foot: Foot::R, weak_foot: 5,
    },
    // Mohamed Salah
    PlayerInput20 {
        name: "Mohamed Salah",
        pace: 17, accel: 18, agility: 17, stamina: 15, strength: 12,
        first_touch: 16, passing: 15, vision: 15,
        finishing: 18, shot_power: 16, tackling: 7, interception: 8,
        heading: 9, jumping: 12,
        height_cm: 175, weight_kg: 73,
        foot: Foot::L, weak_foot: 3,
    },
    // Erling Haaland
    PlayerInput20 {
        name: "Erling Haaland",
        pace: 17, accel: 16, agility: 12, stamina: 15, strength: 18,
        first_touch: 14, passing: 11, vision: 11,
        finishing: 20, shot_power: 19, tackling: 7, interception: 8,
        heading: 18, jumping: 17,
        height_cm: 195, weight_kg: 94,
        foot: Foot::L, weak_foot: 4,
    },
    // Son Heung-min
    PlayerInput20 {
        name: "Son Heung-min",
        pace: 18, accel: 17, agility: 17, stamina: 16, strength: 12,
        first_touch: 16, passing: 15, vision: 15,
        finishing: 17, shot_power: 16, tackling: 8, interception: 10,
        heading: 11, jumping: 13,
        height_cm: 183, weight_kg: 78,
        foot: Foot::R, weak_foot: 5,
    },
];

pub static SQUAD_B: [PlayerInput20; 11] = [
    // Thibaut Courtois
    PlayerInput20 {
        name: "Thibaut Courtois",
        pace: 8, accel: 8, agility: 11, stamina: 12, strength: 15,
        first_touch: 11, passing: 12, vision: 12,
        finishing: 3, shot_power: 10, tackling: 12, interception: 14,
        heading: 10, jumping: 17,
        height_cm: 200, weight_kg: 96,
        foot: Foot::R, weak_foot: 3,
    },
    // Achraf Hakimi
    PlayerInput20 {
        name: "Achraf Hakimi",
        pace: 19, accel: 19, agility: 16, stamina: 16, strength: 12,
        first_touch: 13, passing: 13, vision: 12,
        finishing: 9, shot_power: 12, tackling: 13, interception: 12,
        heading: 10, jumping: 14,
        height_cm: 181, weight_kg: 73,
        foot: Foot::R, weak_foot: 4,
    },
    // Virgil van Dijk
    PlayerInput20 {
        name: "Virgil van Dijk",
        pace: 12, accel: 11, agility: 11, stamina: 14, strength: 18,
        first_touch: 13, passing: 14, vision: 12,
        finishing: 7, shot_power: 12, tackling: 19, interception: 18,
        heading: 19, jumping: 15,
        height_cm: 195, weight_kg: 92,
        foot: Foot::R, weak_foot: 3,
    },
    // David Alaba
    PlayerInput20 {
        name: "David Alaba",
        pace: 13, accel: 13, agility: 14, stamina: 14, strength: 13,
        first_touch: 14, passing: 15, vision: 13,
        finishing: 8, shot_power: 14, tackling: 16, interception: 15,
        heading: 14, jumping: 14,
        height_cm: 180, weight_kg: 78,
        foot: Foot::L, weak_foot: 4,
    },
    // Andrew Robertson
    PlayerInput20 {
        name: "Andrew Robertson",
        pace: 15, accel: 15, agility: 14, stamina: 17, strength: 12,
        first_touch: 13, passing: 14, vision: 12,
        finishing: 7, shot_power: 12, tackling: 16, interception: 15,
        heading: 10, jumping: 12,
        height_cm: 178, weight_kg: 64,
        foot: Foot::L, weak_foot: 3,
    },
    // Casemiro
    PlayerInput20 {
        name: "Casemiro",
        pace: 10, accel: 9, agility: 10, stamina: 15, strength: 17,
        first_touch: 12, passing: 12, vision: 11,
        finishing: 8, shot_power: 13, tackling: 19, interception: 19,
        heading: 16, jumping: 15,
        height_cm: 185, weight_kg: 84,
        foot: Foot::R, weak_foot: 3,
    },
    // Toni Kroos
    PlayerInput20 {
        name: "Toni Kroos",
        pace: 10, accel: 10, agility: 12, stamina: 13, strength: 12,
        first_touch: 18, passing: 20, vision: 19,
        finishing: 12, shot_power: 16, tackling: 9, interception: 11,
        heading: 9, jumping: 9,
        height_cm: 183, weight_kg: 76,
        foot: Foot::R, weak_foot: 4,
    },
    // Bruno Fernandes
    PlayerInput20 {
        name: "Bruno Fernandes",
        pace: 13, accel: 13, agility: 15, stamina: 15, strength: 11,
        first_touch: 16, passing: 18, vision: 18,
        finishing: 14, shot_power: 15, tackling: 9, interception: 11,
        heading: 9, jumping: 11,
        height_cm: 179, weight_kg: 69,
        foot: Foot::R, weak_foot: 3,
    },
    // Lionel Messi
    PlayerInput20 {
        name: "Lionel Messi",
        pace: 14, accel: 15, agility: 20, stamina: 12, strength: 10,
        first_touch: 20, passing: 20, vision: 20,
        finishing: 19, shot_power: 15, tackling: 6, interception: 8,
        heading: 6, jumping: 7,
        height_cm: 170, weight_kg: 67,
        foot: Foot::L, weak_foot: 3,
    },
    // Kylian Mbappé
    PlayerInput20 {
        name: "Kylian Mbappé",
        pace: 20, accel: 20, agility: 17, stamina: 15, strength: 14,
        first_touch: 15, passing: 13, vision: 13,
        finishing: 18, shot_power: 16, tackling: 7, interception: 8,
        heading: 12, jumping: 14,
        height_cm: 180, weight_kg: 75,
        foot: Foot::R, weak_foot: 4,
    },
    // Vinícius Júnior
    PlayerInput20 {
        name: "Vinícius Júnior",
        pace: 19, accel: 20, agility: 18, stamina: 15, strength: 10,
        first_touch: 14, passing: 13, vision: 13,
        finishing: 15, shot_power: 14, tackling: 6, interception: 7,
        heading: 8, jumping: 12,
        height_cm: 176, weight_kg: 73,
        foot: Foot::R, weak_foot: 3,
    },
];

pub fn get_baseline_player(slot: usize, team_idx: usize) -> PlayerInput20 {
    if team_idx == 0 {
        SQUAD_A[slot]
    } else {
        SQUAD_B[slot]
    }
}
