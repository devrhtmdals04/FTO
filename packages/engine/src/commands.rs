use serde::Deserialize;
use serde_wasm_bindgen::from_value;
use wasm_bindgen::JsValue;

use crate::params::{PITCH_H, PITCH_W, TACTICS_COOLDOWN_TICKS, TICKS_PER_SECOND};
use crate::tactics::Tactics;
use crate::types::RoleParams;

const RATE_LIMIT_PER_SECOND: u32 = 8;
const POSITION_EPS: f32 = 1.0;

#[derive(Clone, Debug)]
pub enum Cmd {
    TacticsSet(Tactics),
    RoleOverride { pid: u8, params: RoleParams, ttl: u16 },
    LoftedPass { tx: f32, ty: f32, loft: f32 },
    GroundPass { tx: f32, ty: f32 },
    Shoot { tx: f32, ty: f32, power: f32 },
}

#[derive(Default)]
pub struct CommandBuffer {
    queue: Vec<ScheduledCmd>,
    last_second_bucket: Option<u32>,
    bucket_count: u32,
    last_tactics_tick: Option<u32>,
}

#[derive(Clone, Debug)]
struct ScheduledCmd {
    apply_tick: u32,
    cmd: Cmd,
}

#[derive(Debug)]
pub enum CommandError {
    PastTick,
    RateLimited,
    TacticsCooldown,
    OutOfBounds,
}

#[derive(Debug)]
pub enum ParseError {
    Serde(String),
    Invalid,
}

#[derive(Deserialize)]
struct CommandEnvelope {
    apply_tick: u32,
    #[serde(flatten)]
    payload: CommandPayload,
}

#[derive(Deserialize)]
#[serde(tag = "type", rename_all = "snake_case")]
enum CommandPayload {
    TacticsSet { value: Tactics },
    RoleOverride { pid: u8, params: RoleParams, ttl: u16 },
    LoftedPass { tx: f32, ty: f32, loft: f32 },
    GroundPass { tx: f32, ty: f32 },
    Shoot { tx: f32, ty: f32, power: f32 },
}

pub struct ParsedCommand {
    pub apply_tick: u32,
    pub cmd: Cmd,
}

impl CommandBuffer {
    pub fn new() -> Self {
        Self::default()
    }

    pub fn push(
        &mut self,
        now_tick: u32,
        apply_tick: u32,
        cmd: Cmd,
    ) -> Result<(), CommandError> {
        if apply_tick <= now_tick {
            return Err(CommandError::PastTick);
        }

        self.enforce_rate_limit(now_tick)?;
        if matches!(cmd, Cmd::TacticsSet(_)) {
            self.enforce_tactics_cooldown(now_tick, apply_tick)?;
        }

        if !validate_command(&cmd) {
            return Err(CommandError::OutOfBounds);
        }

        self.queue.push(ScheduledCmd { apply_tick, cmd });
        Ok(())
    }

    pub fn drain_ready(&mut self, current_tick: u32) -> impl Iterator<Item = Cmd> {
        let mut ready = Vec::new();
        let mut pending = Vec::new();
        for item in self.queue.drain(..) {
            if item.apply_tick <= current_tick {
                ready.push(item.cmd);
            } else {
                pending.push(item);
            }
        }
        self.queue = pending;
        ready.into_iter()
    }

    fn enforce_rate_limit(&mut self, now_tick: u32) -> Result<(), CommandError> {
        let bucket = now_tick / TICKS_PER_SECOND;
        if let Some(prev_bucket) = self.last_second_bucket {
            if prev_bucket == bucket {
                if self.bucket_count >= RATE_LIMIT_PER_SECOND {
                    return Err(CommandError::RateLimited);
                }
                self.bucket_count += 1;
            } else {
                self.last_second_bucket = Some(bucket);
                self.bucket_count = 1;
            }
        } else {
            self.last_second_bucket = Some(bucket);
            self.bucket_count = 1;
        }
        Ok(())
    }

    fn enforce_tactics_cooldown(
        &mut self,
         _now_tick: u32,
        apply_tick: u32,
    ) -> Result<(), CommandError> {
        if let Some(last_tick) = self.last_tactics_tick {
            if apply_tick < last_tick + TACTICS_COOLDOWN_TICKS {
                return Err(CommandError::TacticsCooldown);
            }
        }
        self.last_tactics_tick = Some(apply_tick);
        Ok(())
    }
}

fn validate_command(cmd: &Cmd) -> bool {
    match cmd {
        Cmd::TacticsSet(t) => {
            let clamped = t.clone().clamp();
            (clamped.line_height - t.line_height).abs() < f32::EPSILON
                && (clamped.press_intensity - t.press_intensity).abs() < f32::EPSILON
        }
        Cmd::RoleOverride { pid, ttl, .. } => *pid < crate::state::N_PLAYERS as u8 && *ttl > 0,
        Cmd::LoftedPass { tx, ty, loft } => in_pitch_bounds(*tx, *ty) && (0.0..=1.0).contains(loft),
        Cmd::GroundPass { tx, ty } => in_pitch_bounds(*tx, *ty),
        Cmd::Shoot { tx, ty, power } => in_pitch_bounds(*tx, *ty) && (0.0..=1.0).contains(power),
    }
}

fn in_pitch_bounds(x: f32, y: f32) -> bool {
    let half_w = PITCH_W * 0.5 + POSITION_EPS;
    let half_h = PITCH_H * 0.5 + POSITION_EPS;
    x.abs() <= half_w && y.abs() <= half_h
}

pub fn parse_command(value: JsValue) -> Result<ParsedCommand, ParseError> {
    let envelope: CommandEnvelope = from_value(value).map_err(|e| ParseError::Serde(e.to_string()))?;
    let cmd = match envelope.payload {
        CommandPayload::TacticsSet { value } => Cmd::TacticsSet(value.clamp()),
        CommandPayload::RoleOverride { pid, params, ttl } => Cmd::RoleOverride { pid, params, ttl },
        CommandPayload::LoftedPass { tx, ty, loft } => Cmd::LoftedPass { tx, ty, loft },
        CommandPayload::GroundPass { tx, ty } => Cmd::GroundPass { tx, ty },
        CommandPayload::Shoot { tx, ty, power } => Cmd::Shoot { tx, ty, power },
    };
    Ok(ParsedCommand {
        apply_tick: envelope.apply_tick,
        cmd,
    })
}
