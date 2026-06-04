# TV music player — implementation plan

> **New agent?** Start with **[`Music-player-agent-handoff.md`](./Music-player-agent-handoff.md)** — consolidated brief, accurate repo inventory, and phased checklist. This file remains the detailed reference; the handoff is the clean-slate entry point.

Living plan for the **full-screen music player** in **`apps/tv/`**, with **the same user types and ad/preroll business rules as mobile**, and **maximum shared logic** in **`@sm-mpr/shared`** (plus thin mobile re-exports where they already exist). **TV-only code** should be layout, focus, and chrome — not duplicate tier rules or catalog lookups.

**Do the handoff doc first**, then implement phase by phase (content below matches handoff phases). **Do not** treat SMTV03 (`PlayerOverlay.jsx`) as a port source; use it only for D-pad group ideas if stuck.

**Product references (mobile, authoritative for tiers):**

- **`docs/mobile/visual-ads-and-user-types.md`** — `guest`, `freeStingray`, `freeProvided`, `subscribed`; **`showPlayerPreroll`**, **`showVisualAds`**, skip cap
- **`docs/mobile/Stories/Home-screen-story.md`** — footer ads, subscribed = no ads
- **`docs/mobile/Tutorials/Guest-preroll-grace-tutorial.md`** — grace window after preroll (mobile ships this; TV should reuse context when preroll ships)
- **`docs/mobile/Plans/Full-screen-player-layout-refactor.md`** — mobile shell/anchor model (conceptual parity only; TV layout differs)

**TV references:**

- **`docs/tv/Plans/plan.md`** — coordinates milestones
- **`docs/tv/figma-nodes.md`** — add player node when build starts
- **`docs/tv/react-learning.md`** — append lessons as patterns land

---

## Goals (prototype)

- **Play** from **Channel Info** opens a **full-screen music player** route with **D-pad** focus (not touch-first).
- **Same four `userType` values** and **same preroll eligibility** as mobile: **`showPlayerPreroll(userType)`** is **`true`** only for **`guest`** and **`freeStingray`**; **`freeProvided`** and **`subscribed`** start playback UI immediately.
- **Shared catalog**: channel lookup via **`getMusicChannelById`** from **`@sm-mpr/shared/data/musicChannels.js`** (already used on TV Channel Info).
- **Shared session rules** where possible: upsert “now playing” for a future **mini player** in **`PrimaryNav`** (slot exists; behavior deferred).
- **Figma TV frame** [`23:20013`](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) drives **structure and typography**, not mobile’s phone shell.

---

## Mobile vs TV — what is shared, similar, or different

| Area | Mobile (`apps/mobile`) | TV (`apps/tv`) | Target for this slice |
|------|------------------------|----------------|------------------------|
| **User type enum** | `UserTypeContext` — `guest`, `freeStingray`, `freeProvided`, `subscribed` | Same strings in **`UserTypeContext.jsx`** (duplicate today; **not mounted** in `App.jsx`) | **Shared** constants + helpers in **`@sm-mpr/shared`**; each app keeps a thin context wrapper |
| **Tier / ad rules** | **`showVisualAds.js`**, **`userContentGates.js`** | Not imported yet | **Hoist** to **`packages/shared`**; mobile re-export shims |
| **Preroll gate** | **`showPlayerPreroll`** → **`PlayerPrerollAd`** 15s overlay; playback paused until complete/skip | Channel Info shows “Play prototype — full-screen player ships later” | **Same gate function**; **TV-specific** preroll **UI** (fullscreen 1920×1080, remote-friendly Skip) |
| **Preroll grace** | **`GuestPrerollGraceContext`** — no second preroll while grace active | None | **Share context** (no UI); TV **`MusicPlayer`** reads **`graceActive`** like mobile |
| **Music skip cap** | **`GuestMusicSkipContext`** + **`MusicSkipButton`** for guest / freeStingray | None | **Share** cap logic + dialog triggers; **TV skip control** in player focus group |
| **Playback session** | **`PlaybackContext`** — mini player, `fullPlayerPath`, hide mini on `…/play` | None | **Share core session shape**; TV may omit or no-op **CSS `--mini-player-offset`** until mini player ships |
| **Listen history** | **`ListenHistoryContext`** on play | None | **Optional Phase 2+** — share provider if TV needs “Listen again” later |
| **Route** | `/music/:channelId/play` | `/music/:channelId` only (info) | Add **`/music/:channelId/play`** on TV for parity and shared path helpers |
| **Player chrome** | Header: minimize, **Upgrade** / provider, Cast; meta: info, like, share; **`FullScreenPlayerShell`** + **`VisualAdStrip--player`** | Figma: centered column — channel name, **info + like**, cover, TTA, progress, play/pause, skip; **no** cast/share/header minimize in frame | **TV layout component** only; call shared hooks for like gate + preroll |
| **Visual ads on player** | Fixed footer strip when **`showVisualAds`** | **Not in TV Figma `23:20013`** | **Open question** (see below); default: **preroll only** on TV until design adds in-player banner |
| **Upgrade CTA** | Header + **`/upgrade`** preview toggles | **`TvUpgradeButton`** on Home / Channel Info (stub click) | **Phase 6** — TV settings route to preview **`userType`** (mirror **`Subscription.jsx`**) |
| **Navigation** | Touch + back chevron; bottom tabs hidden on play | **Esc** back, **group focus** (nav vs content zones) | TV **`GlobalTvKeys`** + player **focus groups**; returning focus to Channel Info Play |
| **Provider brand row** | **`PlayerProvidedBrandRow`** for **`freeProvided`** | Not in Figma player frame | **Defer** unless TV design adds provider strip |
| **Cast / share** | Prototype dialogs | Out of TV scope | **Do not port** unless explicitly requested |
| **Catalog data** | Re-export from **`@sm-mpr/shared`** | Direct **`@sm-mpr/shared`** import | **Already shared** — keep |
| **Remount on tier change** | **`MusicPlayerRoute`** `key={channelId-userType}` | N/A | **Same pattern** on TV so preroll/transport reset when previewing types |

---

## Figma references (TV file)

| Item | Node | Notes |
|------|------|--------|
| **Music player (this slice)** | [**`23:20013`**](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) | Centered stack: channel title (Roboto Black 34), info/like 60px, cover 360px rounded, song/artist/album, progress 4px, play/pause pill + skip; smart tuner group **opacity 0** in frame — treat as **hidden** for v1 |
| **Channel Info (entry)** | Index under **`docs/tv/figma-nodes.md`** when added | Play CTA already built — wire to **`/music/:id/play`** |
| **Mobile player (parity check only)** | Mobile file uses same node id in comments — **layout differs**; do not copy mobile CSS |

**Measurements to tokenize in `apps/tv/src/index.css` during build** (from MCP pull of `23:20013`):

- Outer column: **`gap: 50px`**, top padding **`100px`**, max content width **`1000px`**
- Channel block: title + actions **`gap: 10px`**
- Cover block: cover + TTA **`gap: 30px`**; TTA lines **`gap: 5px`**
- Controls block: progress + transport **`gap: 30px`**; transport row **`gap: 40px`**

---

## Decisions to lock before coding

1. **Business model** — Identical to mobile: four types, preroll for **`guest`** + **`freeStingray`** only, visual ads for all non-**`subscribed`** on mobile surfaces that exist. TV implements **preroll** in this plan; **in-player visual ad strip** is **TBD** (Figma gap).
2. **Route shape** — **`/music/:channelId/play`** matches mobile and keeps shared **`PlaybackContext.fullPlayerPath`** logic simple.
3. **Shared package boundary** — Pure functions and constants → **`packages/shared`**. React context **implementations** can stay per-app **only if** they need app-specific side effects (e.g. mobile `document.documentElement` mini-player offset). Prefer **one shared `playbackSession.js`** reducer/helpers** if contexts diverge only in effects.
4. **SMTV03** — Reference only; monorepo TV focus system (**`GroupFocusNavigationContext`**, **`KeyboardWrapper`**) is authoritative.
5. **StrictMode** — Stays **off** on TV (`main.jsx`).

---

## Current state (inventory)

See **[`Music-player-agent-handoff.md` — Repo inventory](./Music-player-agent-handoff.md#repo-inventory-accurate-before-player-work)** for the latest checklist. Summary:

| Piece | Mobile | TV |
|-------|--------|-----|
| `musicChannels` / `getMusicChannelById` | Shared | Shared |
| `userTierRules` / `USER_TYPES` | Shared + re-exports | Shared imports; preview at **`/settings/user-type`** |
| `userContentGates` | Mobile `constants/` | **Not hoisted** — Phase 1 |
| `PlaybackContext` | Full | Missing |
| `PlayerPrerollAd` | Full | Missing |
| `GuestPrerollGraceContext` | Full | Missing |
| `GuestMusicSkipContext` | Full | Missing |
| `MusicPlayer` page | Full | Missing |
| Channel Info → Play | Navigates to play | **Stub message** only |

---

## Shared package expansion (`@sm-mpr/shared`)

Add exports (names can adjust during hoist; keep mobile import paths stable via re-exports):

| Module | Contents |
|--------|----------|
| **`constants/userTypes.js`** | `USER_TYPES` array + JSDoc tier meanings |
| **`utils/userTierRules.js`** | `showVisualAds`, `showUpgradeCallToAction`, `showUpgradeInFullPlayerHeader`, `usesGuestMusicSkipCap`, `showPlayerPreroll` (today’s `showVisualAds.js`) |
| **`utils/userContentGates.js`** | `userMayLikeMusicRadio`, etc. (move from mobile `constants/`) |
| **`constants/guestPrerollGrace.js`** | `GUEST_PREROLL_GRACE_MS` |
| **`playback/playbackSession.js`** (optional) | Initial session object + path builders for music/podcast/radio |

**Mobile follow-up:** one-line re-exports under `apps/mobile/src/utils/` and `constants/` so existing imports keep working.

**TV:** import from `@sm-mpr/shared` directly (same as catalog).

---

## Implementation phases

### Phase 0 — Docs and Figma index

- Add **`23:20013`** to **`docs/tv/figma-nodes.md`** (Full-screen player section).
- Create **`docs/tv/visual-ads-and-user-types.md`** as a **short TV supplement**: “tier rules = mobile; TV surfaces that show ads/preroll” (list: preroll on play, future home banner, mini player slot). Link mobile doc as source of truth.
- Update **`docs/tv/Plans/plan.md`** — player slice in **Next steps**; note user types are **in scope** for player (no longer fully deferred).

**Acceptance:** Plans cross-link; no app code required.

---

### Phase 1 — Hoist shared business rules

- Move tier helpers and **`userContentGates`** into **`packages/shared`**; extend **`package.json` `exports`**.
- Add **`USER_TYPES`** export; align TV **`UserTypeContext`** with shared constant (remove duplicate comment-only list).
- Mobile: re-export shims; run **`npm run build`** for mobile + TV workspaces.

**Acceptance:** `showPlayerPreroll('guest') === true`, `showPlayerPreroll('freeProvided') === false` from shared import in both apps.

---

### Phase 2 — App providers (TV)

Mount in **`apps/tv/src/App.jsx`** (order mirrors mobile where dependencies matter):

1. **`UserTypeProvider`**
2. **`GuestPrerollGraceProvider`** (from shared or copied once from mobile into `packages/shared` — prefer **copy file to `packages/shared/context/`** only if both apps import identical provider; otherwise duplicate minimal provider in each app that imports shared constant)
3. **`PlaybackProvider`** — TV copy or shared; **skip `useEffect` for `--mini-player-offset`** until mini player (or guard with env flag)
4. **`GuestMusicSkipProvider`** + **`LikesProvider`** if like button on player uses same hook as mobile

**Acceptance:** `useUserType()` works on a throwaway dev log or Channel Info; app does not crash.

---

### Phase 3 — Routing and play entry

- Register **`Route path="/music/:channelId/play"`** → **`MusicPlayer.jsx`**.
- **`MusicPlayerRoute`** wrapper with **`key={`${channelId}-${userType}`}`** (same as mobile).
- **`MusicChannelInfo`**: **`navigate(`/music/${channel.id}/play`)`** on Play activate; remove stub status text.
- Invalid `channelId` → **`Navigate`** to `/` or info route (match mobile: home redirect).

**Acceptance:** Enter on Play opens player URL; Esc/back returns to previous screen.

---

### Phase 4 — Preroll overlay (TV UI, shared rules)

- **`TvPlayerPrerollAd.jsx`** + CSS — fullscreen over player, **15s** countdown, **Skip** button focusable, **`role="dialog"`** (adapt from mobile **`PlayerPrerollAd`**).
- Wire **`showPlayerPreroll(userType)`**; **`onComplete`** sets playback allowed + starts playing (mirror mobile state machine).
- Call **`beginPrerollGracePeriod()`** on mount (shared grace context).
- **Skip paths:** no preroll for **`freeProvided`** / **`subscribed`**; respect **`graceActive`** for guest / freeStingray channel changes.

**Acceptance:** Preview types (once Phase 6 exists) or temporary dev toggle: guest sees preroll; subscribed does not.

---

### Phase 5 — TV music player UI (Figma `23:20013`)

New files: **`apps/tv/src/pages/MusicPlayer.jsx`**, **`MusicPlayer.css`**, small presentational pieces under **`apps/tv/src/components/player/`** if needed.

**Layout (TV-only):**

- Full viewport centered column per Figma; use existing TV tokens (`--color-*`, overscan).
- Channel name, **info** (navigate to **`/music/:channelId`**), **like** ( **`useMusicRadioLikeAction`** or TV wrapper using shared **`userMayLikeMusicRadio`** ).
- Cover **360px** (clamp if overscan requires), prototype track lines.
- Progress bar (static fill OK for v1).
- Transport: play/pause, skip (**`MusicSkipButton`** logic — extract shared skip handler or duplicate thin TV button calling shared context).

**Focus (TV-only):**

- Define focus groups: e.g. **meta actions** (info, like) → **transport** (play, skip). Document in **`docs/tv/react-learning.md`**.
- **Esc** closes player → **`navigate(-1)`** or replace to Channel Info (prefer **back** to match global TV pattern).
- On mount, focus **play/pause** (or first control per UX).

**PlaybackContext:**

- On preroll complete + play: **`upsertMusicSession`** with channel thumbnail, stub title/subtitle (same strings as mobile prototype).

**Acceptance:** Manual D-pad pass on 1920×1080; matches Figma hierarchy; like blocked for guest opens account pattern if mobile has TV equivalent (else stub dialog).

---

### Phase 6 — User type preview (prototype tooling)

- Add **`/settings/subscription`** or reuse **`/upgrade`**-style page on TV: four toggles for **`setUserType`**, copy labels from mobile **`Subscription.jsx`**.
- Link from hidden dev area or Home long-press **only if** needed — minimum: document URL in plan for testers.
- Wire **`TvHomeHeader`** Upgrade stub to that route when reasonable.

**Acceptance:** Switching to **subscribed** on play route remounts player without preroll; switching to **guest** shows preroll again.

---

### Phase 7 — Mini player + “now playing” (deferred slice)

- Connect **`PlaybackContext`** to **`PrimaryNav`** mini-player slot; **`playingChannelId`** on Home from session.
- Hide mini on **`…/play`** (shared path regex).

**Out of scope for initial player PR** unless you explicitly pull it forward.

---

### Phase 8 — Visual ads on TV (deferred / design-dependent)

- If product requires parity: TV **`VisualAdStrip`** variant (likely bottom of **viewport**, not phone tab bar).
- Reuse **`showVisualAds(userType)`**; add tokens for TV ad height reserve.

**Blocked until** TV Figma shows in-player or footer ad on player or Home.

---

## Acceptance checklist (music player v1)

- [ ] Shared **`showPlayerPreroll`** used by both apps; no duplicated tier strings in player logic
- [ ] **`/music/:channelId/play`** works from Channel Info
- [ ] **guest** / **freeStingray**: 15s preroll before interactive player; **freeProvided** / **subscribed**: no preroll
- [ ] Player UI aligned with [**`23:20013`**](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) (structure, not pixel-perfect)
- [ ] D-pad: focus order documented; Esc back
- [ ] **`npm run build`** passes for **`apps/tv`** and **`apps/mobile`** after shared hoist
- [ ] **`docs/tv/react-learning.md`** entry for player + preroll
- [ ] **`docs/tv/Plans/plan.md`** updated when phases complete

---

## Tutorial and learning follow-ups (after implementation)

| Doc | When |
|-----|------|
| **`docs/tv/Tutorials/PlaybackContext-tutorial.md`** | After Phase 2–5 — TV-specific focus + shared session (mirror mobile tutorial style) |
| **`docs/tv/Tutorials/Guest-preroll-grace-tutorial.md`** | Optional — link to mobile tutorial if behavior is identical |
| **`docs/tv/react-learning.md`** | Short entries per phase (preroll, player focus groups, shared imports) |

---

## Open questions (need your input before or during build)

1. **In-player visual ads on TV** — Mobile shows **`VisualAdStrip--player`** for non-subscribed tiers. TV Figma **`23:20013`** has **no** ad strip. Should TV v1 ship **preroll only**, or is there another TV frame for player + banner?
2. **Upgrade / provider on player** — Mobile player header has Upgrade and provider row. TV frame has **no** Upgrade. Keep upgrade **only on Home / Channel Info** for now?
3. **Smart tuner** — Hidden in Figma (`opacity: 0`). Confirm **omit** for v1?
4. **Share / Cast** — Confirm **out of scope** on TV player?
5. **Route back stack** — From player, should **info** icon **`replace`** to Channel Info (mobile pattern) or **push**? Mobile uses **`replace`** when leaving for channel info from player.
6. **User type preview** — Is a TV **`/upgrade`** page enough, or should toggles live in an existing screen?

---

## Related code (today)

**Mobile (reference implementation):**

- `apps/mobile/src/pages/MusicPlayer.jsx`, `MusicPlayer.css`
- `apps/mobile/src/components/PlayerPrerollAd.jsx`
- `apps/mobile/src/context/PlaybackContext.jsx`, `GuestPrerollGraceContext.jsx`, `GuestMusicSkipContext.jsx`
- `apps/mobile/src/utils/showVisualAds.js`
- `apps/mobile/src/App.jsx` — `MusicPlayerRoute`, providers

**TV (touch points):**

- `apps/tv/src/pages/MusicChannelInfo.jsx` — Play stub
- `apps/tv/src/context/UserTypeContext.jsx`
- `apps/tv/src/App.jsx` — routes
- `apps/tv/src/components/nav/PrimaryNav.jsx` — mini player slot placeholder

**Shared:**

- `packages/shared/data/musicChannels.js`

**SMTV03 (patterns only):**

- `SMTV03/src/components/PlayerOverlay.jsx`

---

_Last updated: 2026-06-03_
