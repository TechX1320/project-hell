# Wrench Life

**Built Not Bought.**

Text-first project-car ownership, repair, restoration, and bad-decision simulator. The repository name remains `project-hell` for now so the existing GitHub Pages URL keeps working.

## Refactor phase 2

The original V0.21 single-file prototype is now split into focused static JavaScript files while intentionally preserving its current gameplay. There is still no framework, build step, account system, or backend.

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
    junkyard.js
    junkyard-pull.js
    swap-meet.js
    part-sales.js
    store.js
    project-work.js
    failures.js
    research.js
    side-jobs.js
    events.js
    work.js
    sleep.js
```

## Current goal

Finish the behavior-preserving migration first. After that, add the real Wrench Life shell: main menu, settings, local save slots, deterministic player-entered/random seeds, and weekly-challenge plumbing.

The first playable release remains **local single-player**. User registration, online accounts, player trading, and other backend-dependent features are intentionally deferred.

## GitHub Pages

The game is served directly from the repository root. All paths are relative, so it works at:

`https://techx1320.github.io/project-hell/`

## Refactor rule

Until the migration is complete, prioritize behavior-preserving moves over new gameplay features. Do not silently expand scope.
