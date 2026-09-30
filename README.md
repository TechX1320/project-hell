# Wrench Life

**Built Not Bought.**

Text-first project-car ownership, repair, restoration, and bad-decision simulator. The repository name remains `project-hell` for now so the existing GitHub Pages URL keeps working.

## Modular prototype baseline

The original V0.21 single-file prototype has now been fully separated into focused static JavaScript files without intentionally changing gameplay. There is still no framework, build step, account system, or backend.

```text
index.html
css/
  app.css
src/
  data/
    cars.js
    store.js
    gameplay.js
    world.js
  core/
    state.js
    vehicle.js
    knowledge.js
    game-state.js
    reputation.js
    time.js
    log.js
    ftue.js
    ui.js
    bootstrap.js
  systems/
    garage.js
    world.js
    vehicle-market.js
    parts-market.js
    junkyard-generation.js
    junkyard-network.js
    junkyard.js
    junkyard-pull.js
    swap-meet.js
    part-sales.js
    store.js
    project-task-rules.js
    body-work.js
    project-work.js
    project-parts.js
    mechanical-work.js
    dtc-repair.js
    project-service.js
    failures.js
    research.js
    side-jobs.js
    events.js
    work.js
    sleep.js
```

## Next milestone

The migration is considered complete enough for a full regression playthrough. After that test, development can move into the real Wrench Life shell:

1. Main menu
2. Local save slots / Continue
3. New Game flow
4. Random and player-entered deterministic seeds
5. Settings
6. Weekly Challenge plumbing

The first playable release remains **local single-player**. User registration, online accounts, player trading, and other backend-dependent features are intentionally deferred.

## GitHub Pages

`https://techx1320.github.io/project-hell/`

All assets use relative paths so the game works under the GitHub Pages repository subpath.

## Development rule

Do not silently expand scope. Preserve the playable baseline during architectural work, then add new systems deliberately.
