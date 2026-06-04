# TV music player — agent handoff (clean slate)

**Read this file first** in a new agent chat to implement the **full-screen music player** on TV. It consolidates everything gathered when scoping the player (including work from an earlier chat that also touched Home vertical scroll — **that scroll work is out of scope here**).

| Doc | Role |
|-----|------|
| **This file** | **Canonical implementation brief** for a new agent |
| [`Music-player-implementation-plan.md`](./Music-player-implementation-plan.md) | Original long-form plan (reference; superseded for day-to-day by this handoff) |
| [`vertical-parked-navigation-plan.md`](./vertical-parked-navigation-plan.md) | **Separate track** — vertical focus/scroll parking; do not mix into player PRs |
| [`plan.md`](./plan.md) | TV milestone coordinator |
| [`../visual-ads-and-user-types.md`](../visual-ads-and-user-types.md) | TV ad surfaces + user-type preview route |

---

## Agent instructions

1. **Scope:** Music player route, preroll, playback session, Channel Info Play wiring, TV player UI (Figma), tier rules usage. **Do not** refactor Home vertical scroll unless the user explicitly asks.
2. **Mobile is the behavioral reference** for tiers, preroll, grace, skip cap, and `PlaybackContext` session shape. **SMTV03** (`PlayerOverlay.jsx`) is **not** a port source — D-pad group ideas only.
3. **TV is D-pad first:** `GroupFocusNavigationContext`, `KeyboardWrapper`, `GlobalTvKeys`, Esc = back. No touch-first chrome.
4. **Prototype norms:** Fake data, no real APIs. `npm run build` must pass for `apps/tv` and `apps/mobile` after shared hoists.
5. **When a phase ships:** tick checkboxes here, update [`plan.md`](./plan.md) **Next steps**, append [`../react-learning.md`](../react-learning.md) if a new pattern lands.
6. **StrictMode:** stays **off** on TV (`apps/tv/src/main.jsx`).

**Run TV app:** repo root `npm install`, then `npm run dev --workspace=apps/tv` (port **5174**, 1920x1080 frame).

**Test user types:** `/settings/user-type` (Home Upgrade opens this on TV).

---

## Product goal (one paragraph)

From **Channel Info**, **Play** opens a **full-screen music player** at `/music/:channelId/play`. The same four **`userType`** values as mobile control **15s preroll** (`guest`, `freeStingray` only), **skip limits**, and future ads. Layout follows TV Figma [**`23:20013`**](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) (centered column — **not** mobile’s phone shell). Shared catalog: `getMusicChannelById` from `@sm-mpr/shared/data/musicChannels.js`.

---

## Out of scope (unless user asks)

- Home **vertical scroll / parked ring** (see [`vertical-parked-navigation-plan.md`](./vertical-parked-navigation-plan.md))
- Podcast/radio players on TV
- Real streaming, auth, Cast, Share (mobile has prototype stubs)
- Mini player in `PrimaryNav` (Phase 7 — defer)
- In-player **visual ad strip** on TV until Figma adds it (Phase 8 — defer; preroll only for v1)
- Pixel-perfect Figma match

---

## Figma (TV file `DfwtFG53ud7EHhvlPutvI8`)

| Item | Node | URL |
|------|------|-----|
| **Music player (build this)** | `23:20013` | [Open frame](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013) |
| Channel Info (entry) | (index when added) | Play CTA exists — wire to play route |

**Structure from MCP / design review (tokenize in `apps/tv/src/index.css` during build):**

- Outer column: `gap: 50px`, top padding `100px`, max content width `1000px`
- Channel block: title + actions `gap: 10px` — title Roboto Black **34px**
- Actions: **info** + **like** (~60px targets)
- Cover **360px** rounded; cover + TTA `gap: 30px`; TTA lines `gap: 5px`
- Controls: progress **4px** + transport `gap: 30px`; transport row `gap: 40px` (play/pause pill + skip)
- **Smart tuner** group: `opacity: 0` in frame → **omit v1**

**Not in TV player frame:** Upgrade header, Cast, Share, provider brand row, in-player visual ad strip (mobile has these).

---

## Mobile vs TV — what to share vs build

| Area | Mobile | TV target |
|------|--------|-----------|
| Tier rules | `showPlayerPreroll`, `showVisualAds`, etc. | Import `@sm-mpr/shared/utils/userTierRules.js` |
| `USER_TYPES` | Context + `/upgrade` | **`USER_TYPES`** shared; TV preview at `/settings/user-type` |
| Preroll | `PlayerPrerollAd` 15s + Skip | **`TvPlayerPrerollAd`** — same rules, TV focus on Skip |
| Preroll grace | `GuestPrerollGraceContext` | Same behavior — copy provider to TV or hoist if identical |
| Skip cap | `GuestMusicSkipContext` + `MusicSkipButton` | TV skip control calling same cap logic |
| Playback | `PlaybackContext` | TV provider; **skip** `--mini-player-offset` DOM effect until mini player |
| Like gate | `userMayLikeMusicRadio` in `userContentGates.js` | Hoist gates to shared **or** duplicate thin check on TV |
| Route | `/music/:channelId/play` | **Same path** |
| Remount on tier change | `key={channelId-userType}` on route wrapper | **Same** |
| Player chrome | `FullScreenPlayerShell` + header/meta/ads | **TV-only** `MusicPlayer.jsx` + CSS |
| Back from player | Chevron + history | **Esc** / `navigate(-1)` via `GlobalTvKeys` |
| Info from player | `navigate` with **replace** to channel info | Match mobile: **replace** to `/music/:channelId` |

---

## Preroll state machine (copy mobile logic)

From `apps/mobile/src/pages/MusicPlayer.jsx`:

```js
const needsPreroll = showPlayerPreroll(userType);
const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
const [playing, setPlaying] = useState(() => skipPrerollGate);
```

- **`showPlayerPreroll`:** `true` for `guest` and `freeStingray` only (`packages/shared/utils/userTierRules.js`).
- **`graceActive`:** from `GuestPrerollGraceContext` — after first preroll, channel changes skip preroll until grace expires (`docs/mobile/Tutorials/Guest-preroll-grace-tutorial.md`).
- **`PlayerPrerollAd`:** calls `beginPrerollGracePeriod()` on mount; 15s countdown; Skip sets remaining to 0.
- Until `prerollComplete`, show preroll overlay; then show player and allow `upsertMusicSession`.

TV v1 can omit `expandFromMini` until mini player exists (pass `false`).

---

## Repo inventory (accurate before player work)

### Already done (helps player; do not redo)

| Item | Location |
|------|----------|
| Shared `musicChannels` + `getMusicChannelById` | `packages/shared/data/musicChannels.js` |
| Shared tier rules (`showPlayerPreroll`, `showVisualAds`, …) | `packages/shared/utils/userTierRules.js` |
| Shared `USER_TYPES` | `packages/shared/constants/userTypes.js` |
| TV `UserTypeProvider` mounted | `apps/tv/src/App.jsx` |
| User type preview UI | `apps/tv/src/pages/TvUserTypePreview.jsx`, route `/settings/user-type` |
| Channel Info screen (Play control exists) | `apps/tv/src/pages/MusicChannelInfo.jsx` |
| TV focus system | `GroupFocusNavigationContext`, `KeyboardWrapper`, `GlobalTvKeys` |
| Primary nav mini player **slot** (placeholder) | `apps/tv/src/components/nav/PrimaryNav.jsx` |
| TV ads / Home (context only) | `docs/tv/visual-ads-and-user-types.md` |

### Not done (player slice)

| Item | Notes |
|------|--------|
| Mini player in `PrimaryNav` | Phase 7 |
| In-player visual ad strip | Phase 8 — blocked on Figma |

---

## Locked decisions (defaults for open questions)

Use these unless the user overrides:

| # | Question | Default for TV v1 |
|---|----------|-------------------|
| 1 | In-player visual ads? | **Preroll only** — no `VisualAdStrip` on player (Figma gap) |
| 2 | Upgrade on player? | **No** — Upgrade stays Home / Channel Info / `/settings/user-type` |
| 3 | Smart tuner? | **Omit** |
| 4 | Share / Cast? | **Out of scope** |
| 5 | Info icon navigation | **`replace`** to `/music/:channelId` (mobile pattern) |
| 6 | User type preview | **`/settings/user-type`** is enough; optional later alias `/upgrade` |

Other locks:

- Route shape: **`/music/:channelId/play`**
- Invalid `channelId`: **`Navigate` to `/`** (match mobile)
- Business rules in **`@sm-mpr/shared`** — no duplicated tier strings in player components

---

## Implementation phases (execute in order)

### Phase 0 — Docs index

- [x] Add Figma **`23:20013`** to `docs/tv/figma-nodes.md` under “Full-screen player”
- [x] Confirm `docs/tv/visual-ads-and-user-types.md` mentions **preroll on play** (one line)

**Acceptance:** Cross-links only; no app code required.

---

### Phase 1 — Finish shared business rules

- [x] Hoist `userContentGates.js` to `packages/shared` (e.g. `utils/userContentGates.js`); mobile re-export shim
- [x] Export from `packages/shared/package.json`
- [x] Align TV `UserTypeContext` comment/docs with shared `USER_TYPES` (already imports constant)

**Acceptance:** `showPlayerPreroll('guest') === true` and `userMayLikeMusicRadio('guest', …) === false` from shared in both apps; `npm run build` passes.

---

### Phase 2 — TV providers (`App.jsx`)

Mount inside existing `UserTypeProvider` (order mirrors mobile where dependencies matter):

1. [x] `GuestPrerollGraceProvider`
2. [x] `PlaybackProvider` — copy from mobile; **guard or omit** `document.documentElement` `--mini-player-offset` effect
3. [x] `GuestMusicSkipProvider`
4. [x] `LikesProvider` (if like action on player)

**Acceptance:** App boots; `useUserType()` / `usePlayback()` usable on a test page or Channel Info without crash.

---

### Phase 3 — Routing and Play entry

- [x] `Route path="/music/:channelId/play"` → `MusicPlayerRoute` wrapper
- [x] `MusicPlayerRoute`: `key={\`${channelId}-${userType}\`}` remount (see mobile `App.jsx`)
- [x] `MusicChannelInfo`: `onSelect` on Play → `navigate(\`/music/${channel.id}/play\`)`; remove stub status text
- [x] Register `play.svg` in `apps/tv/public/` if not present (mobile has it)

**Acceptance:** Enter on Play opens play URL; Esc returns; invalid id redirects home.

---

### Phase 4 — TV preroll overlay

- [x] `apps/tv/src/components/player/TvPlayerPrerollAd.jsx` + CSS — fullscreen 1920x1080, `role="dialog"`, **Skip** focusable (D-pad)
- [x] Wire `showPlayerPreroll(userType)` + grace skip
- [x] `onComplete` → `setPrerollComplete(true)` + start playing UI

**Acceptance:** At `/settings/user-type`, **guest** sees preroll; **subscribed** does not; changing type remounts player (Phase 6).

---

### Phase 5 — TV player UI (Figma `23:20013`)

**New files:**

- [x] `apps/tv/src/pages/MusicPlayer.jsx`
- [x] `apps/tv/src/pages/MusicPlayer.css`
- [x] Optional: `apps/tv/src/components/player/*` presentational pieces

**Layout:**

- [x] Full viewport centered column; use TV tokens (`--color-*`, `--tv-focus-ring-*`, overscan)
- [x] Channel name; **info** (replace → channel info); **like** (`useMusicRadioLikeAction` or TV wrapper)
- [x] Cover 360px (clamp if needed); stub track title / artist / album (same strings as mobile prototype)
- [x] Progress bar (static fill OK v1)
- [x] Transport: play/pause toggle; skip (`GuestMusicSkip` / cap dialog)

**Focus groups (document in react-learning):**

- [x] Suggested: **meta** (info, like) → **transport** (play/pause, skip)
- [x] On mount after preroll: focus **play/pause** (or first control per UX)
- [x] **Esc:** `navigate(-1)` or global back handler

**PlaybackContext:**

- [x] After preroll: `upsertMusicSession({ channelId, thumbnail, title, subtitle, isPaused })` — mirror mobile stub strings

**Acceptance:** D-pad pass at 1920x1080; hierarchy matches Figma; guest like blocked uses account pattern if TV has equivalent (else stub).

---

### Phase 6 — User type preview (verify)

- [x] Already at `/settings/user-type` — verify Play route remounts when toggling guest ↔ subscribed
- [x] Document test URLs in this file (see **Phase 6 QA** below)

**Acceptance:** Subscribed → no preroll; guest → preroll again after remount.

#### Phase 6 QA (manual)

Run TV: repo root `npm run dev:tv` (default **http://localhost:5174**).

| Step | Action | Expected |
|------|--------|----------|
| 1 | Open **`/settings/user-type`** (Home **Upgrade**, or paste URL) | Tier list + **Open music player** |
| 2 | Select **Guest** → **Open music player** | 15s preroll (`TvPlayerPrerollAd`), then transport |
| 3 | **Esc** back to settings → select **Subscribed** → **Open music player** | No preroll; play/pause focused |
| 4 | **Esc** → **Guest** → **Open music player** again | Preroll shows again (grace resets on tier change) |

**Remount:** `MusicPlayerRoute` uses `key={\`${channelId}-${userType}\`}` in `apps/tv/src/App.jsx`. Tier toggles on the preview screen do **not** navigate away (same as mobile `Subscription.jsx`).

**Test play URL** (first catalog channel): `/music/<firstChannelId>/play` — channel name shown on the preview screen.

---

### Phase 7 — Mini player (deferred)

**Detailed plan:** [`Tv-miniplayer-implementation-plan.md`](./Tv-miniplayer-implementation-plan.md) (Figma `15521:27316`, `15757:36079`, `15516:26917`).

- [ ] Wire `PlaybackContext` to `PrimaryNav` slot; Home `playingChannelId` from session
- [ ] Hide mini on `…/play`
- [ ] `TvMiniPlayer` collapsed/expanded + nav focus index 0 + shortcut to full player

---

### Phase 8 — TV visual ads on player (deferred)

- Blocked until TV Figma shows in-player or footer ad on player.

---

## Acceptance checklist (music player v1)

- [x] Shared `showPlayerPreroll` / gates — no duplicated tier logic in TV player files
- [x] `/music/:channelId/play` from Channel Info Play
- [x] guest / freeStingray: 15s preroll; freeProvided / subscribed: no preroll
- [x] UI structure matches [Figma `23:20013`](https://www.figma.com/design/DfwtFG53ud7EHhvlPutvI8/SM-HTML-TV-MPR?node-id=23-20013)
- [x] D-pad focus order documented; Esc back
- [x] `npm run build` — `apps/tv` + `apps/mobile`
- [x] `docs/tv/react-learning.md` — player + preroll entry
- [x] `docs/tv/Plans/plan.md` — milestone updated

---

## Primary code references

### Mobile (implement by reading these)

| File | Why |
|------|-----|
| `apps/mobile/src/pages/MusicPlayer.jsx` | Preroll gate, session upsert, layout composition |
| `apps/mobile/src/pages/MusicPlayer.css` | Reference only — **do not copy** layout |
| `apps/mobile/src/components/PlayerPrerollAd.jsx` | Countdown + grace + Skip |
| `apps/mobile/src/context/PlaybackContext.jsx` | Session shape, `fullPlayerPath`, mini offset |
| `apps/mobile/src/context/GuestPrerollGraceContext.jsx` | Grace window |
| `apps/mobile/src/context/GuestMusicSkipContext.jsx` | Skip cap |
| `apps/mobile/src/App.jsx` | `MusicPlayerRoute`, provider tree, route path |
| `apps/mobile/src/utils/showVisualAds.js` | Re-export shim → shared rules |

### TV (touch today)

| File | Why |
|------|-----|
| `apps/tv/src/App.jsx` | Add route + providers |
| `apps/tv/src/pages/MusicChannelInfo.jsx` | Play stub ~lines 130–149 — replace with navigate |
| `apps/tv/src/context/UserTypeContext.jsx` | `useUserType` |
| `apps/tv/src/components/focus/GlobalTvKeys.jsx` | Esc / back patterns |
| `apps/tv/src/components/nav/PrimaryNav.jsx` | Future mini player |
| `apps/tv/src/index.css` | Player tokens |

### Shared

| File | Why |
|------|-----|
| `packages/shared/data/musicChannels.js` | Channel lookup |
| `packages/shared/utils/userTierRules.js` | Preroll / ads rules |
| `packages/shared/constants/userTypes.js` | Tier enum |

### Product docs (mobile)

| Doc | Why |
|-----|-----|
| `docs/mobile/visual-ads-and-user-types.md` | Tier meanings |
| `docs/mobile/Tutorials/Guest-preroll-grace-tutorial.md` | Grace behavior |
| `docs/mobile/Plans/Full-screen-player-layout-refactor.md` | Mobile shell model (conceptual only) |

---

## Suggested first PR scope

**Phases 0–5** in one or two PRs:

1. Shared hoist (`userContentGates`) + TV providers + route + Channel Info Play
2. Preroll + player UI + focus

Keep vertical scroll and mini player out of the same PR to avoid review noise.

---

## Chat history note

The conversation that created the original plan also explored **Home vertical navigation** (row-fit scroll, down-bias, parked ring experiments). That work is **intentionally separated** into [`vertical-parked-navigation-plan.md`](./vertical-parked-navigation-plan.md). **This handoff is only the music player.**

---

_Last updated: 2026-06-04 — Phase 6 user-type preview QA complete._
