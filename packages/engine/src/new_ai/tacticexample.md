{
          "offensive_formation": "4-3-3",
          "defensive_formation": "4-4-2",
          "roles": ["GK", "LB", "LCB", "RCB", "RB", "LCM", "RCM", "CAM", "LW", "RW", "ST"],
          "lineup": [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
          "team_tactic": {
            "team_attacking": {
              "buildup_formation": "4-3-3",
              "goalkeeper_engage": false,
              "pass_distance": 0.5,
              "final_third_formation": "2-1-7",
              "attack_preference": "center",
              "cross_frequency": 0.3,
              "over_underlapping_player": "fullbacks"
            },
            "team_transition": {
              "on_ball_gain": "InPosition",
              "on_ball_loose": "CounterPress"
            },
            "team_defending": {
              "defending_formation": "4-4-2",
              "high_block": "Pressing",
              "mid_block": "MakeBlock",
              "low_block": "BlockMiddle"
            },
            "team_set_piece": {
              "attack_corner": "default",
              "defence_corner": "default"
            }
          },
          "personal_instructions": {
            "5": {
              "risk_intensity": 0.3,
              "defense_participation": 0.8,
              "attacking_participation": 0.4,
              "mark_man_id": 9,
              "buildup_intensity": null,
              "cover_radius": null
            },
            "10": {
              "risk_intensity": 0.8,
              "defense_participation": 0.2,
              "attacking_participation": 0.9,
              "mark_man_id": null,
              "buildup_intensity": null,
              "cover_radius": null
            }
          }
        }