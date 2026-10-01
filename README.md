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


## No-start recovery

Project State is interactive: try to start the car, scan it with an owned OBD-II reader even when no CEL is stored, diagnose a no-start symptom, follow focused research, and unlock a dedicated recovery card under Work on Project. Existing local saves that were already stuck in a no-start state are migrated into this path instead of remaining soft-locked.


## Bad endings

Wrench Life now treats some failures as real run-ending outcomes instead of only stat penalties. Bad endings are seed-driven, saved locally, and visible from the main menu. Current catastrophic paths include financial collapse, destroying an engine after doubling down on critical mechanical work, fuel-system garage fires, and extreme-fatigue / critically-unreliable driving wrecks. These outcomes are intentionally concentrated around telegraphed risky decisions rather than ordinary routine failures.


## Good endings

Good endings are earned, collectible milestones rather than hard stop points. When a run qualifies, the player can claim the ending and keep playing the same save: collect more cars, finish more projects, chase rare parts, and unlock additional good endings. Current paths cover finishing a dependable project, building a reliable performance car, creating a show-ready car, moving into a real garage, and growing into a multi-project trusted wrench. Bad endings still end the run; good endings do not. Both are tracked locally in the main-menu Endings archive.


## Battery jump pack

The Tools aisle includes a reusable portable battery jump pack. During a no-start, Project State can use it as a real diagnostic action: a discharged battery can be jumped and recovered, a failed battery can reveal itself and require replacement, while starter/cable/crank-no-fire problems react differently. The Battery Terminal / Cable Service Kit now lives in the Tools aisle as a consumable rather than a reusable tool.


## Junkyard generations

Pull-A-Part inventory refreshes every in-game day. Each local yard lists roughly 7-10 donors, normally rotates at least one donor daily, and reports new arrivals in the finder. The playable car catalog stays compact while junkyard donors can spawn as multiple model years within a generation. Generic car-specific junkyard parts now carry generation-level fitment, so a compatible same-generation donor can matter without adding every single model year as a separate playable car.
