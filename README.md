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


## 55-car playtest catalog

The playable vehicle catalog now contains **55 cars** spanning 1986-2014. All cars participate in the same generic junkyard donor-part pool, marketplace systems, body panels, maintenance, diagnostics, and generation-matching logic.

Starter selection is now seed-controlled rather than permanently fixed: each seed receives one EASY, one FUN, and one WILDCARD option from a 12-car starter-eligible pool. The starter selection is derived from the visible run seed without consuming the run's normal RNG stream.

The junkyard catalog is archetype-driven rather than hand-authoring hundreds of unique parts per vehicle. Current content has roughly 117 Marketplace/rare templates plus about 50 core junkyard pull archetypes; donor year, generation, source car, color, condition, rarity, damage, availability, and fitment create the much larger set of generated part instances.


## Interior / Trim system

Interior work now mirrors the exterior/body workflow instead of being only a list of owned parts. Each project tracks condition for front seats, rear seats where applicable, dashboard, trim/door cards, radio, speakers, floor mats, floor/carpet/boards, pedals, and steering/shifter trim. Aftermarket subwoofer systems are a separate installable slot. Players can inspect/study, clean, repair/restore, replace, and upgrade individual interior areas; Marketplace and Pull-A-Part inventories include matching interior pieces and audio upgrades. Interior condition now contributes to overall appearance.


## Career economy pass

Career progression now uses four tuning targets rather than letting Knowledge alone dictate the economy:

- **Days 1-7 - Broke Kid:** basic $50-$150 favors, simple paid work, and the first useful tool purchases.
- **Days 8-16 - People Know You Wrench:** better referrals, better automotive shifts, meaningful reputation growth, and apartment-level independence.
- **Days 17-27 - Backyard Mechanic:** advanced diagnostics, timing, suspension, clutch and other higher-liability work with substantially better pay.
- **Day 28+ - Established Wrench:** the current late-game earning tier and foundation for a future player-owned shop.

Harder side jobs now require the appropriate owned tools in addition to Knowledge and reputation. Side-job pay scales with career phase and a new **Trusted Work Rep** value weighted toward Workmanship and Friends/Family rather than Car Scene popularity. Harder successful referrals grant more reputation; failures still carry meaningful reputation and comeback penalties.

Part-time work now favors jobs near the player's current ability instead of allowing entry-level shifts to dominate the board forever, and automotive wages rise modestly with progression.

Project repairs now have real equipment gates. Brakes, suspension, timing, clutch, engine and performance work can require jack stands, torque wrench, socket set, breaker bar, spring compressor, compression tester, shop press or transmission jack. The Tools aisle includes the newly required equipment.

Housing now uses Trusted Work Rep for progression so a player does not need to become locally famous at car meets just to move out.

The Parts Store aisle selector was condensed to a three-column desktop layout so the category screen fits a 1080p display without scrolling.


## Parts store hours

The normal Parts Store is now explicitly a physical local store, open **8:00 AM-9:00 PM** every day. Travel time matters: the player cannot leave for the store if they would arrive after closing. The main action button remains clickable while closed so the player can see the posted hours. Pull-A-Part, swap meets, Marketplace, and the physical parts store therefore each have distinct availability rules. A future online parts catalog can be added separately instead of implying instant 3:00 AM access to the local store.
