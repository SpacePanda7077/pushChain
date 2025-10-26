### Quick context

This is a small Phaser 3 + React + TypeScript template wired for Vite. The repo bootstraps a React app that embeds a Phaser Game via `src/PhaserGame.tsx` and communicates using a lightweight EventBus at `src/game/EventBus.ts`.

Key entry points:
- React app: `src/main.tsx` -> `src/App.tsx` (UI + controls)
- Phaser bridge: `src/PhaserGame.tsx` (initializes game and exposes ref)
- Game startup: `src/game/main.ts` (creates `Phaser.Game` with scenes)
- Primary scene: `src/game/scenes/Game.ts` (preload/create, emits `current-scene-ready`)

Build & run commands (important):
- Install: `npm install`
- Dev (with telemetry): `npm run dev` (runs `node log.js dev & vite --config vite/config.dev.mjs`)
- Dev without telemetry: `npm run dev-nolog` (runs Vite directly)
- Build: `npm run build` (runs `node log.js build & vite build --config vite/config.prod.mjs`)
- Build without telemetry: `npm run build-nolog`

Project-specific patterns and conventions
- EventBus is the canonical cross-boundary channel. Use `EventBus.emit('event', data)` in scenes and `EventBus.on('event', handler)` in React (or vice versa). See `src/game/scenes/Game.ts` where it emits `current-scene-ready`.
- The PhaserGame component exposes a ref with shape `{ game, scene }` (see `IRefPhaserGame` in `src/PhaserGame.tsx`). When updating React code that needs to manipulate Phaser objects, prefer using that ref and guard for `null`.
- Scenes must call `EventBus.emit('current-scene-ready', this)` when they are ready for React to access them. That's the observed contract used across the template.
- Assets: static assets live in `public/assets`; in-scene code uses `this.load.setPath('assets')` and `this.load.image('key','file.png')` (see `Game.ts`). Bundled imports are supported too, but this template uses the public folder pattern.
- Game config (resolution, parent DOM node) lives in `src/game/main.ts`; StartGame accepts a `parent` DOM id. Avoid changing this shape unless updating `PhaserGame.tsx` accordingly.

Files to inspect when changing behavior
- UI / controls: `src/App.tsx`
- Bridge and lifecycle: `src/PhaserGame.tsx`
- Game startup/config: `src/game/main.ts`
- Scenes: `src/game/scenes/*.ts`
- Cross-boundary events: `src/game/EventBus.ts`
- Build config: `vite/config.dev.mjs`, `vite/config.prod.mjs` (Vite behaviour and plugin config)

Common fixes & PR guidance
- If adding a new Scene: export a class extending `Phaser.Scene`, add it into `scene` array in `src/game/main.ts`, and emit `current-scene-ready` once created.
- If exposing new APIs from Phaser to React: update `IRefPhaserGame` in `src/PhaserGame.tsx` and ensure you set the `ref.current` in the EventBus handler that listens for `current-scene-ready`.
- When editing assets referenced by scenes, prefer placing files in `public/assets` to match existing loaders; otherwise update loader paths in `preload()`.

Developer workflow notes
- Telemetry: `log.js` makes a silent, anonymous call. Use `*-nolog` scripts or remove `log.js` from `package.json` scripts to stop it.
- Dev server default host: Vite (see `vite/config.dev.mjs`) — commonly runs on `http://localhost:8080` per README.

Edge cases agents should watch for
- `ref` values in `PhaserGame` may be `null` during teardown. Always null-check before calling Phaser APIs.
- EventBus listeners should be removed on unmount to avoid memory leaks; `PhaserGame` removes the `current-scene-ready` listener in its cleanup.

If something is ambiguous, inspect these files first: `src/PhaserGame.tsx`, `src/game/EventBus.ts`, `src/game/main.ts`, `src/game/scenes/Game.ts`, and `package.json`.

Ask the repo owner if any custom Vite plugins were added to `vite/config.*.mjs` that affect asset handling or aliases; those are the only likely surprises not visible from TS source alone.

If this file is incomplete or you'd like more examples (e.g., how to call scene methods from React), say which area to expand and I'll add short, copy-pasteable snippets.
