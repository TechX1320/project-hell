# Wrench Life

**Built Not Bought.**

Text-first project-car ownership, repair, restoration, and bad-decision simulator.

## Current playable shell

The modular prototype now has a real local-first game shell:

- Main menu
- 3 local browser save slots
- Continue / Load
- Autosave
- New Game seed setup
- Random shareable seeds
- Player-entered seeds
- Exact RNG-state persistence when continuing a save
- Day 1 FTUE default setting
- In-game menu and seed display

There is still **no account system or backend**. Saves are intentionally local to the current browser/device.

## Deterministic runs

A New Game seed initializes Wrench Life's deterministic random stream. While a run is active, existing gameplay calls to `Math.random()` are backed by the seeded Wrench Life RNG.

The save file stores both the visible seed and the current RNG state. Loading a save continues from the exact random-stream position rather than restarting the seed.

Player choices can still make two runs with the same seed diverge because they consume different random events in different orders. That is intentional.

## Next milestones

1. Long regression playthrough of saves + seeded runs
2. Main-menu polish
3. Weekly Challenge local prototype
4. Seed-aware run summary / scoring
5. More vehicle-generation and fitment data
6. Only later: accounts, cloud saves, friends, trading, and leaderboards

## GitHub Pages

`https://techx1320.github.io/project-hell/`

GitHub Pages for this repository is configured to publish from `main` / `docs`, so the playable app now lives under `docs/` (`docs/index.html`, `docs/css/`, and `docs/src/`). The repository name remains `project-hell` for now so the existing Pages URL keeps working.
