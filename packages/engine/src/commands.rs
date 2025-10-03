use crate::state::N_PLAYERS;
use crate::tactics::Tactics;
use crate::types::RoleParams;
use serde::Deserialize;
use wasm_bindgen::JsValue;

#[derive(Debug, Clone, Copy)]
pub enum Cmd {
    TacticsSet {
        team_id: u8,
        tactics: Tactics,
    },
    RoleOverride {
        pid: u8,
        params: RoleParams,
        ttl: u16,
    },
    LoftedPass {
        player_id: u8,
        tx: f32,
        ty: f32,
        loft: f32,
    },
    GroundPass {
        player_id: u8,
        tx: f32,
        ty: f32,
    },
    Shoot {
        player_id: u8,
        tx: f32,
        ty: f32,
        power: f32,
    },
    MovePlayerVelocity {
        pid: u8,
        vx: f32,
        vy: f32,
    },
    MovePlayerTarget {
        pid: u8,
        tx: f32,
        ty: f32,
    },
}

#[derive(Debug)]
pub struct ParsedCommand {
    pub apply_tick: u32,
    pub cmd: Cmd,
}

#[derive(Debug)]
pub enum ParseError {
    JsError(String),
    DeserializeError(String),
}

impl From<serde_wasm_bindgen::Error> for ParseError {
    fn from(err: serde_wasm_bindgen::Error) -> Self {
        ParseError::DeserializeError(err.to_string())
    }
}

#[derive(Deserialize)]
struct CommandFields {
    #[serde(rename = "apply_tick")]
    apply_tick: u32,
    #[serde(rename = "type")]
    ty: String,
}

#[derive(Deserialize)]
struct TacticsCmd {
    team_id: u8,
    tactics: Tactics,
}

#[derive(Deserialize)]
struct RoleOverrideCmd {
    pid: u8,
    params: RoleParams,
    ttl: u16,
}

#[derive(Deserialize)]
struct LoftedPassCmd {
    pid: u8,
    tx: f32,
    ty: f32,
    loft: f32,
}

#[derive(Deserialize)]
struct GroundPassCmd {
    pid: u8,
    tx: f32,
    ty: f32,
}

#[derive(Deserialize)]
struct ShootCmd {
    pid: u8,
    tx: f32,
    ty: f32,
    power: f32,
}

#[derive(Deserialize)]
struct MovePlayerCmd {
    pid: u8,
    #[serde(default)]
    vx: Option<f32>,
    #[serde(default)]
    vy: Option<f32>,
    #[serde(default)]
    tx: Option<f32>,
    #[serde(default)]
    ty: Option<f32>,
}

pub fn parse_command(js_value: JsValue) -> Result<ParsedCommand, ParseError> {
    let fields: CommandFields = serde_wasm_bindgen::from_value(js_value.clone())
        .map_err(|e| ParseError::DeserializeError(e.to_string()))?;

    let cmd = match fields.ty.as_str() {
        "tactics_set" => {
            let val: TacticsCmd = serde_wasm_bindgen::from_value(js_value)?;
            Cmd::TacticsSet {
                team_id: val.team_id,
                tactics: val.tactics,
            }
        }
        "role_override" => {
            let val: RoleOverrideCmd = serde_wasm_bindgen::from_value(js_value)?;
            if val.pid >= N_PLAYERS as u8 {
                return Err(ParseError::DeserializeError("invalid pid".to_string()));
            }
            Cmd::RoleOverride {
                pid: val.pid,
                params: val.params,
                ttl: val.ttl,
            }
        }
        "lofted_pass" => {
            let val: LoftedPassCmd = serde_wasm_bindgen::from_value(js_value)?;
            Cmd::LoftedPass {
                player_id: val.pid,
                tx: val.tx,
                ty: val.ty,
                loft: val.loft,
            }
        }
        "ground_pass" => {
            let val: GroundPassCmd = serde_wasm_bindgen::from_value(js_value)?;
            Cmd::GroundPass {
                player_id: val.pid,
                tx: val.tx,
                ty: val.ty,
            }
        }
        "shoot" => {
            let val: ShootCmd = serde_wasm_bindgen::from_value(js_value)?;
            Cmd::Shoot {
                player_id: val.pid,
                tx: val.tx,
                ty: val.ty,
                power: val.power,
            }
        }
        "move_player" => {
            let val: MovePlayerCmd = serde_wasm_bindgen::from_value(js_value)?;
            if val.pid >= N_PLAYERS as u8 {
                return Err(ParseError::DeserializeError("invalid pid".to_string()));
            }
            match (val.vx, val.vy, val.tx, val.ty) {
                (Some(vx), Some(vy), _, _) => Cmd::MovePlayerVelocity {
                    pid: val.pid,
                    vx,
                    vy,
                },
                (_, _, Some(tx), Some(ty)) => Cmd::MovePlayerTarget {
                    pid: val.pid,
                    tx,
                    ty,
                },
                _ => {
                    return Err(ParseError::DeserializeError(
                        "move_player requires either vx/vy or tx/ty".to_string(),
                    ));
                }
            }
        }
        _ => {
            return Err(ParseError::DeserializeError(format!(
                "unknown command type: {}",
                fields.ty
            )))
        }
    };

    Ok(ParsedCommand {
        apply_tick: fields.apply_tick,
        cmd,
    })
}

const MAX_COMMANDS: usize = 256;

#[derive(Debug)]
pub enum CommandError {
    Full,
}

#[derive(Debug)]
pub struct CommandBuffer {
    cmds: [Option<ParsedCommand>; MAX_COMMANDS],
    len: usize,
}

impl CommandBuffer {
    pub fn new() -> Self {
        const EMPTY: Option<ParsedCommand> = None;
        Self {
            cmds: [EMPTY; MAX_COMMANDS],
            len: 0,
        }
    }

    pub fn push(
        &mut self,
        current_tick: u32,
        apply_tick: u32,
        cmd: Cmd,
    ) -> Result<(), CommandError> {
        if self.len >= MAX_COMMANDS {
            return Err(CommandError::Full);
        }
        if apply_tick < current_tick {
            return Ok(());
        }
        self.cmds[self.len] = Some(ParsedCommand { apply_tick, cmd });
        self.len += 1;
        Ok(())
    }

    pub fn drain_ready(&mut self, tick: u32) -> impl Iterator<Item = Cmd> + '_ {
        let mut i = 0;
        std::iter::from_fn(move || {
            while i < self.len {
                let command_apply_tick = self.cmds[i].as_ref().unwrap().apply_tick;
                if command_apply_tick <= tick {
                    let extracted = self.cmds[i].take();
                    self.cmds.swap(i, self.len - 1);
                    self.len -= 1;
                    return Some(extracted.unwrap().cmd);
                } else {
                    i += 1;
                }
            }
            None
        })
    }
}
