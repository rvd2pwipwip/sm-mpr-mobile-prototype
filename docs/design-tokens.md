# Design tokens (SM MPR mobile prototype)

This project does **not** use a full separate design system. **Visual and layout “source of truth” for the running app** is:

1. **Figma** — frames and components in [`docs/figma-nodes.md`](figma-nodes.md) (e.g. [Home](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=1-2), [Channel Info](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=25-7067)).
2. **`src/index.css`** — **CSS custom properties** (`:root`, dark overrides) that components consume via `var(--token-name)`.

**Product and behavior** — see `docs/Stories/Home-screen-story.md` and the plan in `docs/plan.md`.

---

## Who this is for

- **You (UX / UI)** — change spacing, type, and colors in **one file** (`index.css`) to refresh the whole prototype, or addnew tokens when a Figma comp introduces a new repeated value.
- **Developers** — avoid raw `px` / hex in component CSS when a **token** already exists; add a **named** variable in `index.css` if a value repeats.

---

## How to update tokens from Figma

1. Open the **relevant screen or component** in the file linked from `figma-nodes.md` (or paste a Figma URL with `node-id` in Cursor for context).
2. In Figma, read **inspection** (size, radius, color, typography) or **variables** if the file uses them.
3. **Map** the value to an existing property in `src/index.css` or add a new `--name` in the right section (color, spacing, radius, type).
4. Optional: add a one-line **comment** next to the variable with Figma node id, e.g. `/* Figma 25:7067 */`.

### Figma MCP

You do **not** have to paste nodes manually for every small fix — the canonical list is already in `figma-nodes.md`. When you need **structural** or **measurement** help from a **specific** frame, paste that URL in chat and ask for `get_design_context` (or a screenshot) so the assistant can suggest token names and values. Convert `node-id=25-7067` to `25:7067` for tools.

If MCP is not connected, export or type the key numbers; still record them in `index.css`.

---

## What lives in `index.css` today

| Area | Example tokens | Notes |
|------|----------------|--------|
| **Frame** | `--app-max-width` | 460px per `figma-nodes.md` |
| **Gutters** | `--space-content-inline`, `--space-screen-gap` | Swimlane pattern in project rules |
| **Scale** | `--space-1` … `--space-5` | Extend if Figma needs more steps |
| **Color** | `--color-bg`, `--color-text`, `--color-accent2`, … | Light in `:root`; dark via `@media (prefers-color-scheme: dark)` and `html[data-theme="dark"]` |
| **Cards (swimlane row)** | `--card-tile-width`, `--radius-media-thumb`, `--card-tile-gap` | Tweak when Home / browse card components are built |
| **Type** | `--font-size-card-title`, … | Aligned to card text styles when finalized |
| **Bottom nav** | `--bottom-nav-stack-height`, … | Drives `.app-shell` bottom padding so scroll content clears the bar |
| **Icon actions** | `--size-action-icon-btn` | 40px hit + glyph size for circular icon-only controls (headers, episode row, player meta / skip / seek, mini secondary); `--bottom-nav-icon-size` references it |

**New screens** (player, modals) should add a **dedicated group** of variables in the same file with a section comment, not scattered literals.

---

## Component CSS

- Prefer **`var(--token)`** in `Component.css`.
- If only one place uses a value, a literal is fine; the **second** use should become a token.

---

## When this doc changes

- When you add a **new category** of tokens (e.g. ad strip height) or change the **workflow** above, update this file in the same change as `index.css` when possible.

*Last updated: 2026-05-01*
