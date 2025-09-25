# 12‑Week Plan (Repo‑Mapped)

This adapts the ROADMAP sprint sample to the current structure. Engine loop target: 60 Hz physics/control, 60 FPS render via interpolation, tactics/utility AI running at a slower cadence (10–20 Hz) through the scheduler.

## W1–2: M0, M1 (Core loop + basic actions)
- Determinism & loop
  - Promote `DT` to 1/60s (`params.rs`) and ensure scheduler/tick math follow 60 Hz
  - Add render interpolation data (previous/current snapshots) for 60 FPS viewer
  - Hash stable snapshot: `engine.rs::state_hash`, `snapshot.rs`
- Actions (pass/shoot/dribble/tackle demo)
  - Commands path: `packages/engine/src/commands.rs`
  - Ball control: `physics/ball.rs`, `engine.rs::apply_ball_command`
  - Player motion: `physics/player.rs`, `engine.rs::update_ai` (temporary)
- AI cadence split
  - Configure `ai/scheduler.rs` to evaluate tactics/utilities at 3–6 ticks (10–20 Hz)
  - Ensure control outputs are held/interpolated for in-between physics ticks

Exit: same‑seed replay hashes match; pass/shoot/dribble/tackle shown

## W3–4: M2 (Tactics pipeline v1)
- Tactics schema & clamp: `packages/engine/src/tactics.rs`, `commands.rs`
- Derived params (line/width/press radius/cooldowns): `tactics.rs`, `engine.rs`
- Phase FSM (In/Transition/Out) scaffolding: `state.rs`, `engine.rs`
- Two playbooks: High‑Press Trap, Left Overlap: `ai/playbook.rs`
- TS↔WASM bridge: ensure `engine.command` envelopes exist in `viewer-3d/src/wasm/bridge.ts`

Exit: High press vs low block A/B; behavior distribution shifts

## W5–6: M3 (Rules & flow)
- Restarts: `rules/restarts.rs`
- Fouls/advantage/cards: `rules/referee.rs`
- Offside check at pass instant: `rules/offside.rs`
- Timeline (half/added time/pause/fast‑forward/sub slots): `state.rs`, `rules/*`

Exit: Offside/foul/restarts property tests pass

## W7–8: M4–M5 (Perception/spatial/path + physical/condition)
- Influence map v1: `spatial.rs`, `ai/*`
- Pass scoring (lane/opening, angle, distance, intercept P, next‑state xG): `ai/utility.rs`
- Pathfinding (grid/navmesh + steering): `spatial.rs`
- Stamina model linked to tempo/press; low stamina penalties: `state.rs`, `physics/player.rs`

Exit: Tempo/press correlate with stamina and success rates

## W9: M6 (Tactics UI)
- Presets hotkeys 1–5: `viewer-3d/src`
- Individual radial: `viewer-3d/src`
- HUD KPIs (PPDA, press success, touch map, mini xG/xT), change log: `viewer-3d/src/scene/hud.ts`

Exit: Preset hotkeys/radial reflected in play within seconds

## W10: M7 (Manager AI & difficulty)
- Manager scripts switching tactics by score/time/stamina: `ai/*`
- Difficulty knobs: reaction delay/risk/playbook repertoire: `ai/*`
- (Optional) RL hooks: state/reward logs: `engine.rs` export tap

Exit: Zero‑input matches show stable difficulty curves

## W11: M8 (Networking 1v1)
- Lockstep: only `TacticOp(tick=N+k)` synced; deterministic local replay
- Delay comp: `k = ceil(RTT_ticks)+safety`; drift monitor
- Validation/anti‑cheat: host rules/collision checks; replay consensus hash

Exit: 100 matches without desync; delay settings applied

## W12: M9–M11 (Replay/analytics/tools + perf)
- Replay viewer (playable, cameras, slow‑mo, event jumps): `tools/` (new)
- Scout view (line/width/gap time series, press map animation): `tools/` or viewer
- Content pipeline (teams/players JSON; formation/playbook hot‑reload; validators)
- Perf: 60Hz sim/60FPS render; main tick ≤ 4ms (PC), WASM ≤ 64–128MB
- Tests: golden replay/rules properties/boundary fuzz/soak

Exit: Performance & stability gates pass; demo build ready
