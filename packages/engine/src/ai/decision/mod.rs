pub mod types;
pub mod scorers;
pub mod factors;
pub mod micro;
pub mod effect;
pub mod planner;

pub use types::{
    Decision, DecisionEnvelope, Intent, IntentMemory, IntentTarget, IntentType, PlayerContext,
};

use crate::ai::coach;
use crate::ai::debug::{self as dbg};
use crate::ai::perception::{self, PassType, PerceptionSnapshot};
use crate::ai::{PlayerId, Role, Vec2, types as game_types};

use factors::{all_ok, quantify_pass_factors};
use micro::{MicroAction, MicroActionKind};
use planner::{enumerate_actions, score_action, time_cost_ms};

#[derive(Default)]
pub struct DecisionModule {
    pub mem: IntentMemory,
    pub last_score: f32,
}

impl DecisionModule {
    pub fn decide(
        &mut self,
        tick: u64,
        pid: PlayerId,
        s: &perception::PerceptionSnapshot,
        tactics: &coach::TacticsView,
        _ctx: &PlayerContext,
        exec_can_kick: bool,
        _rng_seed: u64,
    ) -> DecisionEnvelope {
        if just_kicked_now(tick, s) {
            self.mem.clear();
            return hold_envelope(pid, tick, 160, 80, 0.0);
        }

        let pol = policy_for(s.role.base, s.game, tactics);
        let risk_cap = pol.pass_risk_max.min(tactics.pass_risk_max);

        if s.me.has_ball {
            self.decide_pass_inference(
                tick,
                pid,
                s,
                &pol,
                risk_cap,
                exec_can_kick,
            )
        } else {
            self.mem.clear();
            decide_off_ball(pid, tick)
        }
    }

    fn decide_pass_inference(
        &mut self,
        tick: u64,
        pid: PlayerId,
        s: &perception::PerceptionSnapshot,
        _pol: &game_types::RolePolicy,
        risk_cap: f32,
        exec_can_kick: bool,
    ) -> DecisionEnvelope {
        for o in &s.pass_options {
            if o.offside_on_arrival {
                dbg::reason(tick, pid as usize, "offside");
            }
            if o.p_intercept > risk_cap {
                dbg::reason(tick, pid as usize, "risk>cap");
            }
        }

        let Some((best_idx, base_score)) = pick_best_pass(s, risk_cap) else {
            self.mem.clear();
            return fallback_touch_or_hold(pid, tick, s);
        };

        let option = &s.pass_options[best_idx];
        let gaps = quantify_pass_factors(s, option, risk_cap, exec_can_kick);
        dbg::gap_pass(tick, pid as usize, &gaps);

        if all_ok(&gaps) && exec_can_kick {
            let intent = compose_intent_id(pid, tick);
            dbg::fire_pass(
                tick,
                pid as usize,
                option.ty.kind_str(),
                option.target_id as usize,
                base_score,
                base_score,
                option.p_intercept,
                option.p_receiver,
                intent,
            );
            self.mem.clear();
            return fire_pass(pid, tick, option, base_score);
        }

        // Re-evaluate any committed micro action.
        if let Some(state) = self.mem.current_micro_mut() {
            if state.is_active(tick) {
                let dg = effect::predict_effect(&state.action.kind, s, option);
                let current_progress = planner::progress(&gaps, &dg);
                let previous_progress = planner::progress(&state.baseline_gap, &dg);
                let prog_delta = current_progress - previous_progress;

                let risk_now = planner::risk(&state.action.kind, s, option);

                if prog_delta < -0.02 || risk_now > 0.20 {
                    dbg::abort(
                        tick,
                        pid as usize,
                        if risk_now > 0.20 {
                            "risk_spike>0.20"
                        } else {
                            "neg_progress"
                        },
                        prog_delta,
                    );
                    self.mem.clear();
                } else {
                    let score = score_action(&state.action.kind, &gaps, s, option);
                    state.update_score(score);
                    return micro_to_envelope(pid, tick, &state.action, score);
                }
            } else {
                self.mem.clear();
            }
        }

        let actions = enumerate_actions(tick, pid, s, option, &gaps);
        let mut best: Option<(usize, MicroAction, f32)> = None;

        for (i, action) in actions.into_iter().enumerate() {
            let dg = effect::predict_effect(&action.kind, s, option);
            let prog = planner::progress(&gaps, &dg);
            let score = score_action(&action.kind, &gaps, s, option);
            dbg::act_eval(
                tick,
                pid as usize,
                i,
                score,
                prog,
                time_cost_ms(&action.kind) as i32,
                planner::risk(&action.kind, s, option),
                &dg,
                &action.kind.short_str(),
            );

            match &mut best {
                None => best = Some((i, action, score)),
                Some((best_i, best_act, best_score)) => {
                    let ord = score.total_cmp(best_score);
                    if ord.is_gt() || (ord.is_eq() && tie_break(pid, tick, &action, best_act)) {
                        *best_i = i;
                        *best_act = action;
                        *best_score = score;
                    }
                }
            }
        }

        let (i_best, action, score) = best.unwrap_or_else(|| {
            (
                99,
                MicroAction {
                    kind: MicroActionKind::MicroHold { dur_ms: 120 },
                    until: tick + 3,
                },
                -0.1,
            )
        });

        self.mem.set_micro(action.clone(), tick, gaps, score);
        dbg::commit(
            tick,
            pid as usize,
            i_best,
            action.until,
            compose_intent_id(pid, tick),
        );

        micro_to_envelope(pid, tick, &action, score)
    }
}

fn decide_off_ball(pid: PlayerId, tick: u64) -> DecisionEnvelope {
    DecisionEnvelope {
        decision: Decision::FindSpace { radius: 5.0 },
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: 100,
        cooldown_ms: 50,
        score: 0.1,
    }
}

fn micro_to_envelope(
    pid: PlayerId,
    tick: u64,
    action: &MicroAction,
    score: f32,
) -> DecisionEnvelope {
    let decision = match &action.kind {
        MicroActionKind::Orient { .. } => Decision::Hold { duration_ms: 100 },
        MicroActionKind::LateralCarry { dir, .. } => {
            let dir = if dir.norm() > 1e-4 {
                dir.normalize()
            } else {
                Vec2::new(1.0, 0.0)
            };
            Decision::Carry { dir, speed: 0.6 }
        }
        MicroActionKind::Shield { dur_ms, .. } => Decision::Shield {
            duration_ms: (*dur_ms).max(60) as u16,
        },
        MicroActionKind::Delay { dur_ms } => Decision::Hold {
            duration_ms: (*dur_ms).max(80) as u16,
        },
        MicroActionKind::GateWatch { .. } => Decision::Hold { duration_ms: 120 },
        MicroActionKind::PassRequest { .. } => Decision::Hold { duration_ms: 80 },
        MicroActionKind::TriggerRun { .. } => Decision::Hold { duration_ms: 80 },
        MicroActionKind::MicroHold { dur_ms } => Decision::Hold {
            duration_ms: (*dur_ms).max(80) as u16,
        },
    };

    DecisionEnvelope {
        decision,
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: time_cost_ms(&action.kind).max(60) as u16,
        cooldown_ms: 60,
        score,
    }
}

const HOLD_DEFAULT_MS: u16 = 160;

fn hold_envelope(pid: PlayerId, tick: u64, hold_ms: u16, cooldown: u16, score: f32) -> DecisionEnvelope {
    DecisionEnvelope {
        decision: Decision::Hold {
            duration_ms: hold_ms,
        },
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: hold_ms,
        cooldown_ms: cooldown,
        score,
    }
}

fn fallback_touch_or_hold(
    pid: PlayerId,
    tick: u64,
    s: &perception::PerceptionSnapshot,
) -> DecisionEnvelope {
    if let Some(decision) = scorers::decide_touch(s) {
        DecisionEnvelope {
            decision,
            me_id: Some(pid),
            intent_id: compose_intent_id(pid, tick),
            min_hold_ms: 100,
            cooldown_ms: 60,
            score: 0.15,
        }
    } else {
        hold_envelope(pid, tick, HOLD_DEFAULT_MS, 80, 0.0)
    }
}

fn fire_pass(
    pid: PlayerId,
    tick: u64,
    option: &perception::PassOption,
    base_score: f32,
) -> DecisionEnvelope {
    let decision = match option.ty {
        PassType::Ground => Decision::GroundPass {
            target_id: option.target_id,
            lead: option.lead,
            pace: option.pace,
        },
        PassType::Lofted => Decision::LoftedPass {
            target_id: option.target_id,
            apex: option.apex,
            pace: option.pace,
        },
        PassType::Through => Decision::ThroughBall {
            target_id: option.target_id,
            lead: option.lead,
            pace: option.pace,
        },
    };

    DecisionEnvelope {
        decision,
        me_id: Some(pid),
        intent_id: compose_intent_id(pid, tick),
        min_hold_ms: 40,
        cooldown_ms: 120,
        score: base_score,
    }
}

fn pick_best_pass(
    s: &perception::PerceptionSnapshot,
    risk_cap: f32,
) -> Option<(usize, f32)> {
    s.pass_options
        .iter()
        .enumerate()
        .filter(|(_, o)| o.p_intercept <= 1.2 * risk_cap + 0.2)
        .map(|(idx, o)| {
            let safety = 1.0 - o.p_intercept;
            let utility = o.xt_delta + 0.7 * o.p_receiver + 0.2 * safety;
            (idx, utility)
        })
        .max_by(|a, b| a.1.total_cmp(&b.1))
}

fn tie_break(pid: PlayerId, tick: u64, a: &MicroAction, b: &MicroAction) -> bool {
    let seed = compose_intent_id(pid, tick) as u64
        ^ (hash_kind(&a.kind) as u64)
        ^ (hash_kind(&b.kind) as u64);
    pcg_unit(seed) > 0.5
}

fn hash_kind(kind: &MicroActionKind) -> u32 {
    use MicroActionKind::*;
    match kind {
        Orient { .. } => 0,
        LateralCarry { .. } => 1,
        Shield { .. } => 2,
        Delay { .. } => 3,
        GateWatch { .. } => 4,
        PassRequest { .. } => 5,
        TriggerRun { .. } => 6,
        MicroHold { .. } => 7,
    }
}

fn just_kicked_now(tick: u64, s: &PerceptionSnapshot) -> bool {
    s.me.just_kicked && s.me.last_kick_tick == tick
}

pub fn policy_for(
    _role: Role,
    _game: game_types::GameState,
    _tactics: &coach::TacticsView,
) -> game_types::RolePolicy {
    game_types::RolePolicy {
        weights: game_types::Weights {
            wT: 1.0,
            wG: 1.0,
            wR: 1.0,
            wL: 1.0,
            wS: 1.0,
            wF: 1.0,
            wC: 1.0,
            wM: 1.0,
        },
        pass_risk_max: 0.35,
        theta_shot: 0.12,
        epsilon_base: 0.05,
        min_hold_ms: 120,
        press_triggers: game_types::PressTriggers {
            on_backpass: true,
            on_bad_touch: true,
            on_hospital_pass: true,
        },
    }
}

fn pcg_unit(seed: u64) -> f32 {
    let mut x = seed.wrapping_add(0x9E37_79B9_7F4A_7C15);
    x = (x ^ (x >> 30)).wrapping_mul(0xBF58_476D_1CE4_E5B9);
    x = (x ^ (x >> 27)).wrapping_mul(0x94D0_49BB_1331_11EB);
    let y = x ^ (x >> 31);
    (y as f64 / u64::MAX as f64) as f32
}

fn compose_intent_id(pid: PlayerId, tick: u64) -> u32 {
    ((pid as u32) << 16) ^ (tick as u32)
}