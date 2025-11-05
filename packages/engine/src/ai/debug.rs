// packages/engine/src/ai/debug.rs

use arrayvec::ArrayString;
use core::sync::atomic::{AtomicU64, Ordering, AtomicU8, AtomicU16, AtomicBool};
#[cfg(target_arch = "wasm32")]
use js_sys::{Function, Reflect};
#[cfg(target_arch = "wasm32")]
use wasm_bindgen::{JsCast, JsValue};
#[cfg(target_arch = "wasm32")]
use web_sys::window;

// --- backward compatibility for K/A/B lines ---
#[repr(u8)]
#[derive(Clone, Copy, PartialEq, Eq, Debug)]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen)]
pub enum LogMode {
    Off = 0,
    Alerts = 1,
    Kpi = 2,
    Bread = 3,
}

impl LogMode {
    #[inline]
    pub const fn as_u8(self) -> u8 {
        self as u8
    }

    #[inline]
    pub const fn from_u8(raw: u8) -> Option<Self> {
        match raw {
            0 => Some(LogMode::Off),
            1 => Some(LogMode::Alerts),
            2 => Some(LogMode::Kpi),
            3 => Some(LogMode::Bread),
            _ => None,
        }
    }
}

static MODE: AtomicU8 = AtomicU8::new(LogMode::Bread as u8);
static FOCUS_PID: AtomicU16 = AtomicU16::new(1);
static SAMPLE_NTH: AtomicU8 = AtomicU8::new(1);
static AUTO_FOCUS: AtomicBool = AtomicBool::new(true);

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = setDebugMode))]
pub fn set_mode(m: LogMode) {
    MODE.store(m as u8, Ordering::Relaxed);
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = setDebugModeRaw))]
pub fn set_mode_raw(raw: u8) -> bool {
    if let Some(mode) = LogMode::from_u8(raw) {
        set_mode(mode);
        true
    } else {
        false
    }
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = setDebugFocus))]
pub fn set_focus(pid: PlayerId) {
    FOCUS_PID.store(pid, Ordering::Relaxed);
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = setDebugSampleNth))]
pub fn set_sample_nth(n: u8) {
    SAMPLE_NTH.store(n.max(1), Ordering::Relaxed);
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = getDebugMode))]
pub fn mode() -> LogMode {
    LogMode::from_u8(MODE.load(Ordering::Relaxed)).unwrap_or(LogMode::Off)
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = getDebugFocus))]
pub fn focus() -> PlayerId {
    FOCUS_PID.load(Ordering::Relaxed)
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = getDebugSampleNth))]
pub fn sample_nth() -> u8 {
    SAMPLE_NTH.load(Ordering::Relaxed)
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = setDebugAutoFocus))]
pub fn set_auto_focus(on: bool) {
    AUTO_FOCUS.store(on, Ordering::Relaxed);
}

#[inline]
#[cfg_attr(target_arch = "wasm32", wasm_bindgen::prelude::wasm_bindgen(js_name = getDebugAutoFocus))]
pub fn auto_focus() -> bool {
    AUTO_FOCUS.load(Ordering::Relaxed)
}

#[inline] fn on_alerts() -> bool { MODE.load(Ordering::Relaxed) >= LogMode::Alerts as u8 }
#[inline] fn on_bread()  -> bool { MODE.load(Ordering::Relaxed) >= LogMode::Bread as u8 }
// --- End of backward compatibility part ---

pub type Tick = u64;
pub type Seq  = u16;
pub type PlayerId = u16;

#[repr(u64)]
pub enum Mask {
  Core       = 1<<0,   // K/A/B
  Gap        = 1<<1,   // G
  ActEval    = 1<<2,   // E
  Commit     = 1<<3,   // C
  Abort      = 1<<4,   // X
  Fire       = 1<<5,   // F
  Gate       = 1<<6,   // W
  Reason     = 1<<7,   // R
  Perf       = 1<<8,   // 성능
}

static DBG_MASK: AtomicU64 = AtomicU64::new(
    (Mask::Core as u64) | (Mask::Reason as u64) | (Mask::Fire as u64)
);

#[inline] pub fn set_mask(m:u64){ DBG_MASK.store(m, Ordering::Relaxed); }
#[inline] fn on(m:Mask)->bool { (DBG_MASK.load(Ordering::Relaxed) & (m as u64))!=0 }

#[derive(Default)]
pub struct TickSeq { cur_tick: Tick, seq: [Seq; 32] } // 22명 + 여유
static mut SEQ: TickSeq = TickSeq{ cur_tick: 0, seq: [0;32] };

#[inline]
fn next_seq(t:Tick, pid:usize)->Seq {
  unsafe {
    if SEQ.cur_tick != t { SEQ.cur_tick=t; SEQ.seq.fill(0); }
    let s = SEQ.seq[pid].wrapping_add(1);
    SEQ.seq[pid]=s; s
  }
}

#[inline]
fn emit_line(tag:&str, line:&str){
  let combined = format!("{}{}", tag, line);
  #[cfg(target_arch="wasm32")]
  {
    if let Some(handler) = get_dbg_hook() {
      let js_line = JsValue::from(combined.as_str());
      let _ = handler.call1(&JsValue::NULL, &js_line);
    } else {
      web_sys::console::log_1(&JsValue::from(combined.as_str()));
    }
  }
  #[cfg(not(target_arch="wasm32"))]
  println!("{}", combined);
}

#[cfg(target_arch="wasm32")]
fn get_dbg_hook() -> Option<Function> {
  let win = window()?;
  let hook = Reflect::get(&win, &JsValue::from_str("__FTO_DBG")).ok()?;
  hook.dyn_into().ok()
}

// ---------- 공개 API ----------

// TODO: Move this to a more appropriate place (e.g., engine.rs)
#[derive(Default)]
pub struct TickSummary {
    pub has_ball: u16,
    pub pass_opts: u16,
    pub pass_chosen: u16,
    pub emits: u16,
    pub gp: u16,
    pub tp: u16,
    pub lp: u16,
    pub hl: u16,
    pub touches: u16,
}

pub fn k_tick_summary(t:Tick, k:&TickSummary){
  if !on(Mask::Core) { return; }
  let mut s: ArrayString<160> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s, "K,t={}", t);
  let _ = write!(s, ",HB={},PO={},PC={},EM={},GP={},TP={},LP={},HL={},TCH={}",
    k.has_ball, k.pass_opts, k.pass_chosen, k.emits, k.gp, k.tp, k.lp, k.hl, k.touches);
  emit_line("", &s);
}

#[inline]
pub fn gap_pass(t:Tick, pid:usize, g:&crate::ai::decision::factors::PassFactors){
  if !on(Mask::Gap) { return; }
  let mut s: ArrayString<192> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s,
    "G,t={0},p={1},pass_gap=orient:{2:.2},lane:{3:.2},recv:{4:.2},offs:{5:.2},gate:{6},press:{7:.2},kick:{8:.2}",
    t,pid,g.orient_gap,g.lane_gap,g.recv_gap,g.offs_gap,g.gate_gap_ms,g.press_gap,g.kick_gap);
  emit_line("", &s);
}

pub fn act_eval(t:Tick, pid:usize, i:usize, sc:f32, prog:f32, time_ms:i32, risk:f32, dg:&crate::ai::decision::factors::PassFactors, act:&str){
  if !on(Mask::ActEval) { return; }
  let mut s: ArrayString<220> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s,
    "E,t={0},p={1},i={2},act={3},prog:{4:.2},time:{5},risk:{6:.2},score:{7:.2},delta=lane:{8:.2},press:{9:.2},orient:{10:.2},recv:{11:.2},offs:{12:.2},gate:{13}",
    t,pid,i,act,prog,time_ms,risk,sc,dg.lane_gap,dg.press_gap,dg.orient_gap,dg.recv_gap,dg.offs_gap,dg.gate_gap_ms);
  emit_line("", &s);
}

pub fn commit(t:Tick, pid:usize, idx:usize, until:Tick, intent:u32){
  if !on(Mask::Commit) { return; }
  let mut s: ArrayString<96> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s, "C,t={0},p={1},commit=i:{2},until:{3},intent:0x{4:08X}", t,pid,idx,until,intent);
  emit_line("", &s);
}

pub fn abort(t:Tick, pid:usize, reason:&str, dprog:f32){
  if !on(Mask::Abort) { return; }
  let mut s: ArrayString<96> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s, "X,t={0},p={1},abort={2},Δprog:{3:.2}", t,pid,reason,dprog);
  emit_line("", &s);
}

pub fn fire_pass(t:Tick, pid:usize, kind:&'static str, to:usize, u_base:f32, sc:f32, pint:f32, precv:f32, intent:u32){
  if !on(Mask::Fire) { return; }
  let mut s: ArrayString<140> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s, "F,t={0},p={1},fire={2},to={3},u_base:{4:.2},score:{5:.2},intc:{6:.2},recv:{7:.2},intent:0x{8:08X}",
    t,pid,kind,to,u_base,sc,pint,precv,intent);
  emit_line("", &s);
}

pub fn reason(t:Tick, pid:usize, why:&str){
  if !on(Mask::Reason) { return; }
  let mut s: ArrayString<128> = ArrayString::new();
  use core::fmt::Write;
  let _ = write!(s, "R,t={t},p={pid},filtered={why}");
  emit_line("", &s);
}

// --- Merged A/B lines ---
#[derive(Debug, Clone, Copy)]
pub enum DecKind { GP, TP, LP, HL, Receive, Carry, Dribble, Other }

pub fn note_decision(tick:u64, pid:PlayerId, kind:DecKind, tgt:i32, score:f32){
  if on(Mask::Core) && on_bread() {
      if pid == FOCUS_PID.load(Ordering::Relaxed) {
        let mut s: ArrayString<128> = ArrayString::new();
        use core::fmt::Write;
        let _ = write!(s, "B,t={0},p={1},d={2:?},to={3},u={4:.2}", tick, pid, kind, tgt, score);
        emit_line("", &s);
      }
  }
}

pub fn note_emit(tick:u64, pid:PlayerId, kind:&DecKind, tgt:i32){
    if on(Mask::Core) && on_bread() {
        if pid == FOCUS_PID.load(Ordering::Relaxed) {
            let mut s: ArrayString<128> = ArrayString::new();
            use core::fmt::Write;
            let _ = write!(s, "B,t={0},p={1},emit={2:?},t={3}", tick, pid, kind, tgt);
            emit_line("", &s);
        }
    }
}

pub fn note_emit_blocked(tick:u64, pid:PlayerId, reason:&str){
    if on(Mask::Core) && on_alerts() {
        let mut s: ArrayString<128> = ArrayString::new();
        use core::fmt::Write;
        let _ = write!(s, "A,t={0},p={1},emit_blocked,r={2}", tick, pid, reason);
        emit_line("", &s);
    }
}

#[derive(Debug, Clone, Copy)]
pub enum ReasonCode { NB, NO, RF, OF, NK, SL, CD, BL, BP }
// NB:NoBall, NO:NoOptions, RF:RiskFiltered, OF:Offside, NK:NoTKick, SL:SlotSkip, CD:Cooldown, BL:Blocked, BP:BallPossession

pub fn alert(tick:u64, pid:PlayerId, r:ReasonCode, detail:&str){
  if on(Mask::Core) && on_alerts() {
    let mut s: ArrayString<128> = ArrayString::new();
    use core::fmt::Write;
    let _ = write!(s, "A,t={0},p={1},r={2:?},{3}", tick, pid, r, detail);
    emit_line("", &s);
  }
}

pub fn alert_nk_if_pass(tick:u64, pid:PlayerId, is_pass: bool, has_tkick: bool){
  if is_pass && !has_tkick { alert(tick, pid, ReasonCode::NK, "t_kick=None"); }
}

pub fn note_has_ball(_tick:u64, pid:PlayerId){
  if AUTO_FOCUS.load(Ordering::Relaxed) {
    FOCUS_PID.store(pid, Ordering::Relaxed);
  }
}
