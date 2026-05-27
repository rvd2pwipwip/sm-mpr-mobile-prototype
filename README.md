# sm-mpr-prototypes

Workspace for **Stingray Music** (music, podcasts, radio) clickable prototypes:

- **`apps/mobile`** — phone-first React + Vite app (formerly the standalone mobile repo).
- **`apps/tv`** — TV React + Vite app (D-pad / focus-first shell; port **5174**).

## Prerequisites

Node.js with npm.

## Scripts (run from repo root)

| Command              | Purpose                          |
|----------------------|----------------------------------|
| `npm install`       | Install all workspace deps      |
| `npm run dev`       | Same as `npm run dev:mobile`     |
| `npm run dev:mobile`| Vite dev server for mobile       |
| `npm run dev:tv`    | Vite dev server for TV (5174)    |
| `npm run build`     | Production build (`apps/mobile`) |
| `npm run build:tv`  | Production build (`apps/tv`)     |
| `npm run lint`      | ESLint (`apps/mobile`)           |
| `npm run lint:tv`   | ESLint (`apps/tv`)               |

## Shared package

**`packages/shared`** is a placeholder npm workspace (`@sm-mpr/shared`). Add modules there when mobile and TV should import the same fake data or constants.
