# Backlog (Actionable)

This backlog maps ROADMAP items to current repo paths for quick issue creation and implementation.

## Engine/Core (packages/engine/src)
- [ ] Promote core loop to 60 Hz `fixed_dt` with render interpolation hooks
  - Touch: `state.rs::tick`, `params.rs` (set `DT = 1/60`, `TICKS_PER_SECOND = 60`), viewer interpolation adapter
- [ ] Deterministic RNG and float normalization hotspots review
  - Touch: `rng.rs`, usages in `engine.rs`, `physics/ball.rs`, `physics/player.rs`
- [ ] Snapshot v1 serialize/deserialize + versioning policy doc
  - Touch: `snapshot.rs` (already has v1-ish), add version notes in docs
- [ ] Replay v1: seed + input_ops only; golden hash comparator
  - Touch: `engine.rs::state_hash`, `commands.rs` (log inputs), add tool in `tools/` (future)
- [ ] Debug overlay signals (line/width/press radius, nav paths, AABB)
  - Touch: compute/export in engine view or snapshot; render in viewer

## AI/Decision (packages/engine/src/ai)
- [ ] Multi-rate scheduler: tactics/utility evaluation at 10–20 Hz feeding 60 Hz control
  - Touch: `ai/scheduler.rs`, `engine.rs::update_ai` (split into planner vs executor), expose interpolation of commands
- [ ] FSM frame (individual/team) + state transition logging
  - Touch: `ai/mod.rs`, `engine.rs::update_ai` (split), logging sink
- [ ] Utility score library (weights injection)
  - Touch: `ai/utility.rs` (extend), create types for utilities
- [ ] Pass evaluator (lane/angle/distance/intercept/xG approx)
  - Touch: `ai/utility.rs`, `spatial.rs`
- [ ] Press/Cover scores + influence map integration
  - Touch: `ai/*`, `spatial.rs`
- [ ] Marking assignment (greedy/Hungarian) + hysteresis
  - Touch: `ai/*`
- [ ] Playbook runner (trigger/goal/exit + cooldown)
  - Touch: new `ai/playbook.rs`, integrate in `engine.rs`

## Rules/Match (packages/engine/src/rules)
- [ ] Restart scenarios (kickoff/throw‑in/goal‑kick/corner/free‑kick)
  - Touch: `rules/restarts.rs`
- [ ] Foul/advantage/card adjudicator
  - Touch: `rules/referee.rs`
- [ ] Offside at pass instant
  - Touch: `rules/offside.rs`
- [ ] Match timeline (half/added time/subs)
  - Touch: `state.rs` (phase), `rules/*`

## Physics/Condition (packages/engine/src/physics)
- [ ] Stamina model (tempo/press coupling) + performance impact
  - Touch: `state.rs` (pstamina), `physics/player.rs`
- [ ] Injury system (optional)
  - Touch: `physics/player.rs`, `state.rs`
- [ ] Weather/pitch params (optional)
  - Touch: `params.rs`, `physics/*`

## UI/HUD/Tools (packages/viewer-3d/src)
- [ ] Tactics panel (sliders/presets/individual radial) -> `engine.command`
  - Touch: `wasm/bridge.ts` (command envelopes), new UI components
- [ ] Debug overlays (line/width/press radius/paths/AABB)
  - Touch: `scene/*`, consume `engine.view()` or snapshot bytes
- [ ] KPI HUD (PPDA/xG/xT/touch map/tactics log)
  - Touch: `scene/hud.ts`, data adapter from engine
- [ ] Set‑piece editor v1 (corner/free‑kick playbooks)
  - Touch: viewer editor module + engine playbook hooks
- [ ] DevConsole (inject tactics, spawn scenarios)
  - Touch: viewer utilities, engine commands

## Networking/Replay/Analytics
- [ ] Lockstep protocol: `TacticOp(tick=N+k)`
  - Touch: format spec doc; enforce rate/TTL in `commands.rs`
- [ ] RTT‑based k, tick drift watchdog
  - Touch: net loop (future package), engine tick sanity
- [ ] Replay viewer (camera/event jumps/overlays)
  - Touch: separate `tools/replay-viewer` (future)
- [ ] Scout view (line/width/gap time series)
  - Touch: export CSV/JSON; viewer or tools
- [ ] Telemetry: tick time/alloc/success histograms
  - Touch: engine counters + viewer charts

## DoD Checks (attach to CI later)
- [ ] Golden replay hash equality for deterministic seeds
- [ ] Property tests for rules (offside/foul/restarts)
- [ ] Perf thresholds (avg ≤ 4ms; p99 ≤ 8ms)
