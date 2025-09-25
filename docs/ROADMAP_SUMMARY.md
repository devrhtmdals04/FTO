# Roadmap Summary

- Tech: Rust (engine) + WASM + TypeScript (viewer)
- Scope: 11v11, deterministic lockstep, replay/analysis, offline/online
- Loop: 60 Hz physics/control tick with render interpolation; tactics/utility AI decoupled at 10–20 Hz

## Goals
- Real‑time tactics (slider/preset/individual) applied to derived params and actions each tick
- Determinism: same input+seed -> same outcome; lockstep netcode; perfect replay
- Analysis tools: xG/PPDA/line/width time series; set‑piece editor

## Phases
- Now (M0–M2): Core loop, determinism, debugging; action set; tactics pipeline v1
- Next (M3–M7): Rules/flow; perception/spatial/path; physical/condition; tactics/UI; manager AI
- Later (M8–M11): Networking; replay/analytics; editors/content; perf/quality/release

## Definition of Done
- Tactics reflect in overlays within 3 ticks
- Determinism: 100 matches hash‑exact with same seed+inputs
- Rules: Offside/foul/restarts/advantage property tests pass
- Perf: 60 Hz physics tick avg ≤ 4ms, 99% ≤ 8ms (PC); render 60 FPS with interpolation

## Risks & Mitigations
- Determinism drift -> fixed‑point/normalization, golden replay CI
- O(N²) hotspots -> spatial partitioning, candidate limits/caches
- Rules bloat -> min cases -> property tests -> expand
- UI fatigue -> presets and hints
