# sm-mpr-prototypes

Workspace for **Stingray Music** (music, podcasts, radio) clickable prototypes:

- **`apps/mobile`** — phone-first React + Vite app (formerly the standalone mobile repo).
- **`apps/tv`** — TV React + Vite app (D-pad / focus-first shell; port **5174**).

**Developer handoff:** [`docs/DEVELOPER-GUIDE.md`](docs/DEVELOPER-GUIDE.md) — how to run both apps, demo controls (user type, catalog scope, content profile), and UX decisions for production teams.

## Prerequisites

Node.js with npm.

## Scripts (run from repo root)

| Command              | Purpose                                        |
| -------------------- | ---------------------------------------------- |
| `npm install`        | Install all workspace deps                     |
| `npm run dev`        | Same as `npm run dev:mobile`                   |
| `npm run dev:mobile` | Vite dev server for mobile                     |
| `npm run dev:tv`     | Vite dev server for TV (5174)                  |
| `npm run media:sync` | Download local cover art (optional; see guide) |

## Shared package

**`packages/shared`** (`@sm-mpr/shared`) — shared mock data, tier rules, and constants used by mobile and TV.
