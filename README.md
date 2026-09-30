# Project Hell (working title)

Text-first project-car adventure / restoration game prototype. **Project Hell is only the working title.**

## Refactor phase 1

The V0.21 single-file prototype has been moved into GitHub Pages-friendly static files without intentionally changing gameplay. No build system is required yet.

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
    runtime.js
  systems/
    inventory.js
    project.js
    activity.js
```

This is deliberately an intermediate migration. The next passes should split `runtime.js` and the system files further into focused state, save, RNG, garage, research, junkyard, marketplace, events, and UI modules while preserving V0.21 behavior.

## GitHub Pages

Serve from the repository root. `index.html` uses only relative paths, so it works under the `/project-hell/` GitHub Pages subpath.

## Refactor rule

Until the migration is complete, prioritize behavior-preserving moves over new gameplay features. Do not silently expand scope.
