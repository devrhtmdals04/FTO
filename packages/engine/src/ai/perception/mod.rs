pub mod blackboard;
pub mod derive;
pub mod memory;
pub mod sense;

pub use blackboard::{EntityDistance, PerceptionSnapshot as LegacyPerceptionSnapshot};

use crate::ai::{

    comm, coach, types, EngineView, PlayerId, Role, TeamCtx, TeamId, Vec2, Vec3,

};

use crate::ai::PhaseMode;
use crate::ai::debug as dbg;



#[derive(Clone, Copy, Debug, Default)]

pub struct MePercept {

    pub id: PlayerId,

    pub team: TeamId,

    pub pos: Vec2,

    pub vel: Vec2,

    pub body_angle: f32,

    pub stamina: f32,

    pub has_ball: bool,

    pub can_kick: bool,

    pub relinquish_until: u64,

}



#[derive(Clone, Copy, Debug, Default)]

pub struct ActuationView {

    pub can_kick: bool,

    pub relinquish_until: u64,

}


#[derive(Clone, Copy, Debug, Default)]

pub struct BallPercept {

    pub pos: Vec3,

    pub vel: Vec3,

    pub airborne: bool,

}



#[derive(Clone, Copy, Debug, Default)]

pub struct PlayerPercept {

    pub id: PlayerId,

    pub team: TeamId,

    pub pos: Vec2,

    pub vel: Vec2,

    pub dist: f32,

    pub facing_to_me: f32,

}



#[derive(Clone, Debug, Default)]

pub struct PitchPercept {

    pub our_half: bool,

    pub zone_id: u16,

}



#[derive(Clone, Debug, Default)]

pub struct LanePercept {

    pub pass_block_prob: f32,

    pub offside_line_y: f32,

}



#[derive(Clone, Debug)]

pub struct PhasePercept {

    pub mode: PhaseMode,

    pub is_set_piece: bool,

}



impl Default for PhasePercept {

    fn default() -> Self {

        Self {

            mode: PhaseMode::Transition,

            is_set_piece: false,

        }

    }

}



#[derive(Clone, Debug, Default)]

pub struct ThreatScores {

    pub xt_here: f32,

    pub xt_best: f32,

    pub opp_xt_nearby: f32,

    pub xg_candidate: f32,

}



#[derive(Clone, Debug)]

pub struct RolePercept {

    pub base: Role,

    pub override_role: Option<Role>,

}



impl Default for RolePercept {

    fn default() -> Self {

        Self {

            base: Role::ST,

            override_role: None,

        }

    }

}



#[derive(Clone, Debug, Default)]

pub struct VisibilityMap {

    pub visible_ratio: f32,

}



#[derive(Clone, Copy, Debug)]

pub enum PassType { Ground, Lofted, Through }



#[derive(Clone, Debug)]

pub struct PassOption {

  pub target_id: PlayerId,

  pub ty: PassType,

  pub lead: Vec2,     // 수신 예측 오프셋(Through 중심)

  pub pace: f32,      // 0..1 (양자화 예정)

  pub apex: f32,      // 0..1 (Lofted)

  pub dt_flight: f32, // sec

  pub p_intercept: f32,

  pub p_receiver: f32,

  pub xt_delta: f32,

  pub offside_on_arrival: bool,

  pub lane_id: u8,

}



#[derive(Clone, Debug)]

pub struct PerceptionSnapshot {

    pub me: MePercept,

    pub ball: BallPercept,

    pub mates: Vec<PlayerPercept>,

    pub opps: Vec<PlayerPercept>,

    pub pitch: PitchPercept,

    pub lanes: LanePercept,

    pub phase: PhasePercept,

    pub scores: ThreatScores,

    pub role: RolePercept,

    pub tactics: coach::TacticsView,

    pub comm_bias: comm::CommBias,

    pub visibility: VisibilityMap,

    pub game: types::GameState,

    pub pass_options: Vec<PassOption>, // 상위 N만

}



impl Default for PerceptionSnapshot {

    fn default() -> Self {

        Self {

            me: MePercept::default(),

            ball: BallPercept::default(),

            mates: Vec::new(),

            opps: Vec::new(),

            pitch: PitchPercept::default(),

            lanes: LanePercept::default(),

            phase: PhasePercept::default(),

            scores: ThreatScores::default(),

            role: RolePercept::default(),

            tactics: coach::TacticsView::default(),

            comm_bias: comm::CommBias::default(),

            visibility: VisibilityMap::default(),

            game: types::GameState {

                clock: types::GameClock {

                    minute: 0,

                    second: 0,

                    stoppage: 0,

                },

                score: types::ScoreState { us: 0, them: 0 },

                phase: PhaseMode::Transition,

            },

            pass_options: Vec::new(),

        }

    }

}



#[derive(Clone, Debug)]

pub struct PerceptMemory {

    pub last_pos: Vec2,

    pub last_touch_tick: u64,

    pub last_pressure: f32,

}



impl Default for PerceptMemory {

    fn default() -> Self {

        Self {

            last_pos: Vec2::default(),

            last_touch_tick: 0,

            last_pressure: 0.0,

        }

    }

}



#[derive(Clone, Debug, Default)]

pub struct Scratch;



#[derive(Clone, Debug)]

pub struct PerceptionModule {

    pub local_index: usize,

    pub mem: PerceptMemory,

    pub tmp: Scratch,

}



impl Default for PerceptionModule {

    fn default() -> Self {

        Self {

            local_index: 0,

            mem: PerceptMemory::default(),

            tmp: Scratch::default(),

        }

    }

}



impl PerceptionModule {
    pub fn build_snapshot(
        &mut self,
        tick: u64,
        engine: &dyn EngineView,
        team: &TeamCtx,
    ) -> PerceptionSnapshot {
        let default_act = ActuationView::default();
        self.build_snapshot_with_act(tick, engine, team, &default_act)
    }

    fn build_snapshot_base(
        &mut self,
        tick: u64,
        engine: &dyn EngineView,
        team: &TeamCtx,
    ) -> PerceptionSnapshot {
        let mut snapshot = PerceptionSnapshot::default();

        snapshot.game.clock.minute = ((tick / 3600) % 90) as u16;
        snapshot.game.clock.second = ((tick / 60) % 60) as u8;
        snapshot.game.phase = PhaseMode::Transition;

        snapshot.tactics = team.tactics.clone();

        let mut comm_bias = comm::CommBias::default();
        if let Some(inbox) = team.comm_broker.inboxes.get(self.local_index) {
            for msg in &inbox.messages {
                match msg.ty {
                    comm::MsgType::BallCall => {
                        comm_bias.pass_bonus_to.push((msg.from, 0.2)); // Example bonus
                    }
                    comm::MsgType::OverlapReq => {
                        if let Some(lane) = msg.payload.lane {
                            comm_bias.lane_bonus.push((lane, 0.15)); // Example bonus
                        }
                    }
                    _ => {}
                }
            }
        }
        snapshot.comm_bias = comm_bias;

        snapshot.me.team = team.team_id;

        if let Some(agent) = team.players.get(self.local_index) {
            snapshot.me.id = agent.id;
            snapshot.role.base = agent.role;
        }

        let ball = engine.ball();
        snapshot.ball = BallPercept {
            pos: ball.pos,
            vel: ball.vel,
            airborne: ball.pos.z > 0.5,
        };

        let players = engine.players();
        if let Some(me_view) = players.iter().find(|p| p.id == snapshot.me.id) {
            snapshot.me.pos = me_view.pos;
            snapshot.me.vel = me_view.vel;
            snapshot.me.body_angle = me_view.body_angle;
            snapshot.me.has_ball = me_view.has_ball;
            snapshot.me.stamina = 1.0;
        }

        let mut mates = Vec::new();
        let mut opps = Vec::new();

        for view in players {
            if view.id == snapshot.me.id {
                continue;
            }
            let percept = build_player_percept(view, snapshot.me.pos);
            if view.team == team.team_id {
                mates.push(percept);
            } else {
                opps.push(percept);
            }
        }

        snapshot.mates = mates;
        snapshot.opps = opps;
        snapshot.pitch.our_half = snapshot.me.pos.x < 0.0;

        let me_has_ball = snapshot.me.has_ball;
        snapshot.pass_options = if me_has_ball {
            self.derive_pass_options(
                tick,
                &snapshot.me,
                &snapshot.mates,
                &snapshot.opps,
                &engine.pitch(),
                &team.xt_grid,
                &snapshot.tactics,
            )
        } else {
            vec![]
        };
        dbg::note_pass_opts(tick, snapshot.me.id, snapshot.pass_options.len());
        if me_has_ball && snapshot.pass_options.is_empty() {
            dbg::alert(tick, snapshot.me.id, dbg::Reason::NO, "pass_opts=0");
        }

        snapshot
    }

    pub fn build_snapshot_with_act(
        &mut self,
        tick: u64,
        engine: &dyn EngineView,
        team: &TeamCtx,
        act: &ActuationView,
    ) -> PerceptionSnapshot {
        let mut snapshot = self.build_snapshot_base(tick, engine, team);

        if tick < act.relinquish_until {
            snapshot.me.has_ball = false;
        }
        if !snapshot.me.has_ball {
            snapshot.pass_options.clear();
        }
        snapshot.me.can_kick = act.can_kick;
        snapshot.me.relinquish_until = act.relinquish_until;

        snapshot
    }
}



fn build_player_percept(view: &crate::ai::EnginePlayerView, me_pos: Vec2) -> PlayerPercept {

    let to_me = vec_sub(me_pos, view.pos);

    let dist = vec_len(to_me);

    let dir = if dist > 1e-5 {

        Vec2 {

            x: to_me.x / dist,

            y: to_me.y / dist,

        }

    } else {

        Vec2::default()

    };

    let facing = Vec2 {

        x: view.body_angle.cos(),

        y: view.body_angle.sin(),

    };

    let facing_to_me = dir.x * facing.x + dir.y * facing.y;



    PlayerPercept {

        id: view.id,

        team: view.team,

        pos: view.pos,

        vel: view.vel,

        dist,

        facing_to_me,

    }

}



fn vec_sub(a: Vec2, b: Vec2) -> Vec2 {

    Vec2 {

        x: a.x - b.x,

        y: a.y - b.y,

    }

}



fn vec_len(v: Vec2) -> f32 {

    (v.x * v.x + v.y * v.y).sqrt()

}
