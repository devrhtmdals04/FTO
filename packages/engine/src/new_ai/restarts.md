# Restart Logic

## Current flow

1. `Engine::tick` → `handle_restarts(&mut world)`
2. `handle_restarts` transitions match phases to `Kickoff`, `PreKickoff`, `Restart`, `InPlay`, etc. Currently no hook to reposition players when phase changes.
3. `Engine::sync_restart_layouts` only checks `MatchPhase::Kickoff | PreKickoff` and calls `align_players_for_kickoff`, but ball possession may not match `team_tactics` data when a goal is scored.

## Requirements

- Ownership data should be updated when a goal is awarded (not covered yet).
- `handle_restarts` should set `world.possession` to the kicking team before `Engine::align_players_for_kickoff` is executed.
- Also need to ensure `world.match_phase` transitions correctly when whistle is blown and teams lined up.

## Potential Implementation Steps

1. Add `RestartContext` and set commanded team in `handle_restarts` (requires referee signals).
2. After scoring, flag `world.possession` as opposite team and set `match_phase` to `PreKickoff`.
3. Ensure `world.match_phase == MatchPhase::PreKickoff` before `Engine::sync_restart_layouts` runs (update order?).
4. Optionally add event API to UI for `ResetKickoff`.

---

`TODO`s: Determine scoring detection point.
