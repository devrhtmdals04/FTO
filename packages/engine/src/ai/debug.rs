// ai/debug_min.rs
use core::sync::atomic::{AtomicU8, AtomicU16, Ordering};
use parking_lot::Mutex;

pub type PlayerId = u16;

#[derive(Clone, Copy, PartialEq, Eq, Debug)]
pub enum LogMode { Off=0, Alerts=1, Kpi=2, Bread=3 } // Bread => Alerts+KPI+브레드크럼

static MODE: AtomicU8 = AtomicU8::new(LogMode::Bread as u8);
static FOCUS_PID: AtomicU16 = AtomicU16::new(1);
static SAMPLE_NTH: AtomicU8 = AtomicU8::new(1); // n틱마다 한 번(KPI/브레드)

#[inline] pub fn set_mode(m: LogMode) { MODE.store(m as u8, Ordering::Relaxed); }
#[inline] pub fn set_focus(pid: PlayerId) { FOCUS_PID.store(pid, Ordering::Relaxed); }
#[inline] pub fn set_sample_nth(n: u8) { SAMPLE_NTH.store(n.max(1), Ordering::Relaxed); }

#[inline] fn on_alerts() -> bool { MODE.load(Ordering::Relaxed) >= LogMode::Alerts as u8 }
#[inline] fn on_kpi()    -> bool { MODE.load(Ordering::Relaxed) >= LogMode::Kpi as u8 }
#[inline] fn on_bread()  -> bool { MODE.load(Ordering::Relaxed) >= LogMode::Bread as u8 }

#[cfg(target_arch="wasm32")]
fn out(s: &str){ web_sys::console::log_1(&s.into()); }
#[cfg(not(target_arch="wasm32"))]
fn out(s: &str){ println!("{s}"); }

// --- KPI 집계 ---
#[derive(Default, Clone, Copy)]
pub struct Kpi {
  pub has_ball_cnt: u16,
  pub pass_opts: u16,
  pub pass_chosen: u16,
  pub emits: u16,
  pub dec_gp: u16, pub dec_tp: u16, pub dec_lp: u16, pub dec_hl: u16,
}
static KPI: Mutex<Kpi> = Mutex::new(Kpi{ has_ball_cnt:0, pass_opts:0, pass_chosen:0, emits:0, dec_gp:0, dec_tp:0, dec_lp:0, dec_hl:0 });

pub fn begin_tick(_tick: u64){ if on_kpi(){ *KPI.lock() = Kpi::default(); } }

pub fn end_tick(tick: u64){
  if !on_kpi() { return; }
  let nth = SAMPLE_NTH.load(Ordering::Relaxed) as u64;
  if tick % nth != 0 { return; }
  let kpi = *KPI.lock();
    out(&format!("K,{tick},HB={},PO={},PC={},EM={},GP={},TP={},LP={},HL={}",
      kpi.has_ball_cnt, kpi.pass_opts, kpi.pass_chosen, kpi.emits,
      kpi.dec_gp, kpi.dec_tp, kpi.dec_lp, kpi.dec_hl));
}

// --- 이벤트 훅: Perception/Decision/Execution에서 호출 ---
pub fn note_has_ball(_tick:u64, _pid:PlayerId){ if on_kpi(){ KPI.lock().has_ball_cnt+=1; } }
pub fn note_pass_opts(_tick:u64, _pid:PlayerId, n: usize){ if on_kpi(){ KPI.lock().pass_opts+=n as u16; } }

#[derive(Debug, Clone, Copy)]
pub enum DecKind { GP, TP, LP, HL, Other }
pub fn note_decision(tick:u64, pid:PlayerId, kind:DecKind, tgt:i32, score:f32){
  if on_kpi(){
      let mut kpi = KPI.lock();
      match kind {
        DecKind::GP => { kpi.pass_chosen+=1; kpi.dec_gp+=1; }
        DecKind::TP => { kpi.pass_chosen+=1; kpi.dec_tp+=1; }
        DecKind::LP => { kpi.pass_chosen+=1; kpi.dec_lp+=1; }
        DecKind::HL => { kpi.dec_hl+=1; }
        DecKind::Other => {}
      }
  }
  if on_bread(){
      if pid == FOCUS_PID.load(Ordering::Relaxed) {
        // BREAD: tick,pid,DEC,tgt,score
        out(&format!("B,{tick},p={pid},d={:?},t={tgt},u={:.2}", kind, score));
      }
  }
}

// Execution emit 성공/실패
pub fn note_emit(tick:u64, pid:PlayerId, kind:&DecKind, tgt:i32){
  if on_kpi(){ KPI.lock().emits += 1; }
  if on_bread(){
    if pid == FOCUS_PID.load(Ordering::Relaxed) { out(&format!("B,{tick},p={pid},emit={:?},t={tgt}", kind)); }
  }
}
pub fn note_emit_blocked(tick:u64, pid:PlayerId, reason:&str){
  if on_alerts(){
    out(&format!("A,{tick},p={pid},emit_blocked,r={reason}"));
  }
}

// --- ALERTS (이상 상황 원인 코드 중심) ---
#[derive(Debug, Clone, Copy)]
pub enum Reason { NB, NO, RF, OF, NK, SL, CD, BL } 
// NB:NoBall, NO:NoOptions, RF:RiskFiltered, OF:Offside, NK:NoTKick, SL:SlotSkip, CD:Cooldown, BL:Blocked

pub fn alert(tick:u64, pid:PlayerId, r:Reason, detail:&str){
  if on_alerts(){
    out(&format!("A,{tick},p={pid},r={:?},{detail}", r));
  }
}

pub fn alert_nk_if_pass(tick:u64, pid:PlayerId, is_pass: bool, has_tkick: bool){
  if is_pass && !has_tkick { alert(tick, pid, Reason::NK, "t_kick=None"); }
}