use blake3::Hasher;
use std::vec::Vec;

use crate::params::{SNAPSHOT_POS_SCALE, SNAPSHOT_VEL_SCALE};
use crate::state::{World, N_PLAYERS};
use crate::types::MatchPhase;

pub const SNAPSHOT_VERSION: u8 = 1;

#[derive(Default)]
pub struct SnapshotBuffer {
    bytes: Vec<u8>,
}

impl SnapshotBuffer {
    pub fn write(&mut self, data: &[u8]) {
        self.bytes.extend_from_slice(data);
    }

    pub fn write_u8(&mut self, value: u8) {
        self.bytes.push(value);
    }

    pub fn write_u16(&mut self, value: u16) {
        self.write(&value.to_le_bytes());
    }

    pub fn write_u32(&mut self, value: u32) {
        self.write(&value.to_le_bytes());
    }

    pub fn write_i16(&mut self, value: i16) {
        self.write(&value.to_le_bytes());
    }

    pub fn write_f32(&mut self, value: f32) {
        self.write(&value.to_le_bytes());
    }

    pub fn into_bytes(self) -> Vec<u8> {
        self.bytes
    }
}

#[derive(Default)]
pub struct DeltaBuffer {
    bytes: Vec<u8>,
}

impl DeltaBuffer {
    pub fn write(&mut self, data: &[u8]) {
        self.bytes.extend_from_slice(data);
    }

    pub fn write_u8(&mut self, value: u8) {
        self.bytes.push(value);
    }

    pub fn write_u16(&mut self, value: u16) {
        self.write(&value.to_le_bytes());
    }

    pub fn write_u32(&mut self, value: u32) {
        self.write(&value.to_le_bytes());
    }

    pub fn write_i16(&mut self, value: i16) {
        self.write(&value.to_le_bytes());
    }

    pub fn into_bytes(self) -> Vec<u8> {
        self.bytes
    }
}

#[derive(Clone, PartialEq, Eq)]
pub struct QuantizedWorld {
    pub tick: u32,
    pub ms: u32,
    pub ms_subtick: u16,
    pub match_phase: u8,
    pub home_score: u16,
    pub away_score: u16,
    pub ball: QuantizedBall,
    pub players: [QuantizedPlayer; N_PLAYERS],
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct QuantizedBall {
    pub pos: [i16; 3],
    pub vel: [i16; 3],
    pub mode: u8,
}

#[derive(Clone, Copy, PartialEq, Eq)]
pub struct QuantizedPlayer {
    pub pos: [i16; 2],
    pub vel: [i16; 2],
    pub stamina: u16,
    pub vis_scale: u8,
    pub collider_radius_opt: i16,
}

#[derive(Clone)]
pub struct HashGuard {
    hasher: Hasher,
}

impl HashGuard {
    pub fn new() -> Self {
        Self {
            hasher: Hasher::new(),
        }
    }

    pub fn update(&mut self, data: &[u8]) {
        self.hasher.update(data);
    }

    pub fn finalize(&self) -> [u8; 32] {
        *self.hasher.clone().finalize().as_bytes()
    }
}

impl Default for HashGuard {
    fn default() -> Self {
        Self::new()
    }
}

pub fn write_full_snapshot(world: &World, buf: &mut SnapshotBuffer) -> QuantizedWorld {
    let quantized = quantize_world(world);
    buf.write_u8(SNAPSHOT_VERSION);
    buf.write(&[0, 0, 0]);
    serialize_full(&quantized, buf);
    quantized
}

pub fn write_delta(prev: &QuantizedWorld, curr: &QuantizedWorld, buf: &mut DeltaBuffer) {
    buf.write_u8(SNAPSHOT_VERSION);
    buf.write(&[0, 0, 0]);
    buf.write_u32(curr.tick);
    buf.write_u32(curr.ms);
    buf.write_u16(curr.ms_subtick);
    buf.write_u8(curr.match_phase);
    buf.write_u16(curr.home_score);
    buf.write_u16(curr.away_score);

    let mut ball_mask: u16 = 0;
    for i in 0..3 {
        if curr.ball.pos[i] != prev.ball.pos[i] {
            ball_mask |= 1 << i;
        }
        if curr.ball.vel[i] != prev.ball.vel[i] {
            ball_mask |= 1 << (i + 3);
        }
    }
    if curr.ball.mode != prev.ball.mode {
        ball_mask |= 1 << 6;
    }
    buf.write_u16(ball_mask);
    for i in 0..3 {
        if (ball_mask & (1 << i)) != 0 {
            buf.write_i16(curr.ball.pos[i]);
        }
    }
    for i in 0..3 {
        if (ball_mask & (1 << (i + 3))) != 0 {
            buf.write_i16(curr.ball.vel[i]);
        }
    }
    if (ball_mask & (1 << 6)) != 0 {
        buf.write_u8(curr.ball.mode);
    }

    let mut changed_players = Vec::new();
    for (idx, (prev_player, curr_player)) in
        prev.players.iter().zip(curr.players.iter()).enumerate()
    {
        if prev_player != curr_player {
            changed_players.push((idx as u8, *curr_player));
        }
    }
    buf.write_u16(changed_players.len() as u16);
    for (idx, player) in changed_players {
        buf.write_u8(idx);
        buf.write_i16(player.pos[0]);
        buf.write_i16(player.pos[1]);
        buf.write_i16(player.vel[0]);
        buf.write_i16(player.vel[1]);
        buf.write_u16(player.stamina);
        buf.write_u8(player.vis_scale);
        buf.write_i16(player.collider_radius_opt);
    }
}

pub fn quantize_world(world: &World) -> QuantizedWorld {
    let ball = QuantizedBall {
        pos: [
            quantize(world.bx, SNAPSHOT_POS_SCALE),
            quantize(world.by, SNAPSHOT_POS_SCALE),
            quantize(world.bz, SNAPSHOT_POS_SCALE),
        ],
        vel: [
            quantize(world.bvx, SNAPSHOT_VEL_SCALE),
            quantize(world.bvy, SNAPSHOT_VEL_SCALE),
            quantize(world.bvz, SNAPSHOT_VEL_SCALE),
        ],
        mode: world.bmode,
    };
    let mut players = [QuantizedPlayer {
        pos: [0, 0],
        vel: [0, 0],
        stamina: 0,
        vis_scale: 0,
        collider_radius_opt: 0,
    }; N_PLAYERS];
    for idx in 0..N_PLAYERS {
        let params = world.p_params[idx];
        players[idx] = QuantizedPlayer {
            pos: [
                quantize(world.px[idx], SNAPSHOT_POS_SCALE),
                quantize(world.py[idx], SNAPSHOT_POS_SCALE),
            ],
            vel: [
                quantize(world.pvx[idx], SNAPSHOT_VEL_SCALE),
                quantize(world.pvy[idx], SNAPSHOT_VEL_SCALE),
            ],
            stamina: (world.pstamina[idx].clamp(0.0, 1.0) * 1000.0).round() as u16,
            vis_scale: ((params.vis_scale - 0.90) / 0.25 * 255.0)
                .round()
                .clamp(0.0, 255.0) as u8,
            collider_radius_opt: (params.collider_radius_opt * 1000.0).round() as i16,
        };
    }
    QuantizedWorld {
        tick: world.tick,
        ms: world.ms,
        ms_subtick: world.ms_subtick as u16,
        match_phase: match_phase_to_u8(world.match_phase),
        home_score: world.home_score,
        away_score: world.away_score,
        ball,
        players,
    }
}

fn serialize_full(world: &QuantizedWorld, buf: &mut SnapshotBuffer) {
    buf.write_u32(world.tick);
    buf.write_u32(world.ms);
    buf.write_u16(world.ms_subtick);
    buf.write_u8(world.match_phase);
    buf.write_u16(world.home_score);
    buf.write_u16(world.away_score);

    for coord in &world.ball.pos {
        buf.write_i16(*coord);
    }
    for vel in &world.ball.vel {
        buf.write_i16(*vel);
    }
    buf.write_u8(world.ball.mode);

    for player in &world.players {
        buf.write_i16(player.pos[0]);
        buf.write_i16(player.pos[1]);
        buf.write_i16(player.vel[0]);
        buf.write_i16(player.vel[1]);
        buf.write_u16(player.stamina);
        buf.write_u8(player.vis_scale);
        buf.write_i16(player.collider_radius_opt);
    }
}

fn quantize(value: f32, scale: f32) -> i16 {
    let scaled = (value * scale).round();
    scaled.clamp(i16::MIN as f32, i16::MAX as f32) as i16
}

fn match_phase_to_u8(phase: MatchPhase) -> u8 {
    match phase {
        MatchPhase::PreKickoff => 0,
        MatchPhase::InPlay => 1,
        MatchPhase::Restart => 2,
    }
}
