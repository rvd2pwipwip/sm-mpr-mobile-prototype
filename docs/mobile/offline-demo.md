# Offline demo (no Wi-Fi)

The prototype **defaults to local cover art** (`VITE_OFFLINE_MEDIA=true` in `apps/mobile/.env` and `apps/tv/.env`). `npm run dev` and `npm run build` work without internet for thumbnails and Roboto.

## One-time setup (on Wi-Fi)

Download cover art into the repo:

```bash
npm run media:sync
```

Writes JPEGs under `packages/shared/media/` (~1,300+ files: music, home radio, international geo radio, podcast shows). Episode rows reuse show art. **Re-run after adding new music channels** (e.g. MVP Home swimlanes) — sync skips files already on disk.

Optional: commit `packages/shared/media/` so you never re-sync before a trip (~28 MB).

## Run the demo (no Wi-Fi)

```bash
npm run dev              # mobile
npm run dev:tv           # TV
```

Stable tab for a room presentation:

```bash
npm run build
npm run preview          # mobile
```

## What works without network

- App shell, routing, mock catalog
- Cover images (after `media:sync`)
- **Roboto** (bundled via `@fontsource-variable/roboto`)

## Still needs network if you tap them

- Terms, privacy, login, FAQ, and other external links in Info / auth stubs

## Use picsum placeholders again (optional)

Create `apps/mobile/.env.local` (git-ignored) with:

```
VITE_OFFLINE_MEDIA=false
```

Same for `apps/tv/.env.local` if needed. Restart the dev server.
