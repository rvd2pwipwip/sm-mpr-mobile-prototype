# Podcasts — implementation plan (prototype)

Teaching-oriented guide for **you** while we build podcasts in the Stingray Music mobile prototype (React + Vite). It turns product intent and Figma into **ordered work** and stops to explain **why** patterns match what you already shipped for music.

**Companion docs**

- Story: [`docs/Stories/Podcasts-story.md`](../Stories/Podcasts-story.md)
- UX principles: [`docs/UX/Podcasts - UX Principles.md`](../UX/Podcasts%20-%20UX%20Principles.md)
- Figma index: [`docs/figma-nodes.md`](../figma-nodes.md)
- Living repo plan: [`docs/plan.md`](../plan.md) — update “What we have done” when this slice ships
- Ads, user types & pre-roll entry points: [`docs/visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)
- Guest pre-roll grace (skip rules, **`expandFromMiniPlayer`**): [`docs/Tutorials/Guest-preroll-grace-tutorial.md`](Guest-preroll-grace-tutorial.md)
- **Line-by-line / deep dive:** [`docs/Tutorials/Podcasts-and-episodes-deep-dive-tutorial.md`](Podcasts-and-episodes-deep-dive-tutorial.md)

**No real audio in this prototype** — playback is **UI state only** (progress, play/pause, speed label, seek buttons). That is enough to validate journeys.

---

## Decisions you locked in

| Topic | Choice | Why it helps the prototype |
|--------|--------|----------------------------|
| **Routes** | Show: `/podcast/:podcastId` · Player: `/podcast/:podcastId/play/:episodeId` | Same mental model as music (`/music/:channelId` + `…/play`). One place to copy patterns: stacked screens, hide bottom nav on **play** only, deep links from Home / Browse / Listen again. |
| **Subscriptions, bookmarks, downloads, progress** | **Pure local stub state** (React state / Context, in-memory) | Lets you demo full journeys without a backend. Reset on reload is OK unless you later add `localStorage`. |
| **Playback speed** | **Tap to cycle** through a fixed ordered list (**no audio** — label / state only) | Matches your request; values align with the **in-car sister** treatment in your reference UI. |
| **Player pre-roll & guest grace** | **Same as music** — see § *Player pre-roll & guest grace* below | One monetization vocabulary: **`showPlayerPreroll(userType)`** (`guest` only); **`provided`** / **`subscribed`** skip; **`GuestPrerollGraceContext`** + **`expandFromMiniPlayer`** behave like **`MusicPlayer`**. |

**Playback speed sequence (tap advances, then wraps to the start)**

Use this exact order so “next speed” always matches teammate expectations:

`0.6` → `0.8` → `1` → `1.2` → `1.4` → `1.6` → `1.8` → `2` → (back to) `0.6`  

Display suffix `x` in the UI (`0.6x`, …, `2x`).

**Teaching note — “tap to cycle” vs menu:** Your screenshot shows a **popover list** with a checkmark on `1x`. For the **first prototype pass**, cycling on tap is **less code** and still validates the journey. A **follow-up** can replace the speed control with “tap opens menu, tap row selects speed” to match Figma/in-car pixel-for-behavior.

---

## What you are learning by doing this

You already practiced **one content stack** (music): **list → detail → full player**, plus **PlaybackContext** and **MiniPlayer**. Podcasts rehearse the same **routing + context** ideas with **different data shape** (show + episodes) and **different controls** (±15 / +30, speed, bookmark, download).

In React terms:

- **URL-driven screens** — `useParams()` gives `podcastId` / `episodeId`; invalid ids → redirect home (same idea as unknown `channelId`).
- **Lifted UI state** — “playing episode”, “bookmark for episode X”, and “playback speed” can live in **Context** so **PodcastPlayer** (full screen), **MiniPlayer** (after collapse), and **Podcast Info** all read the **same session** without prop drilling.
- **Stub domain state** — a small **`PodcastUserStateContext`** (name can vary) holds subscribe / bookmark / download / listened progress purely for demos; swap for APIs later without changing every component if you keep a clear boundary.

---

## Player pre-roll & guest grace (parity with music)

Podcasts **do not** invent a separate ad model. Wire **Podcast Player** exactly like **`MusicPlayer`** relative to **`UserTypeContext`**:

| Rule | Implementation source (reuse) |
|------|-------------------------------|
| **Who sees full-screen player pre-roll?** | **`showPlayerPreroll(userType)`** in **`src/utils/showVisualAds.js`** — **`true` only for `guest`**. **`provided`** and **`subscribed`** never see **`PlayerPrerollAd`** for this prototype. |
| **What renders the overlay?** | **`PlayerPrerollAd`** — same countdown / skip UX as music; **`PlayerPrerollAd`** **`useEffect`** calls **`beginPrerollGracePeriod()`** from **`GuestPrerollGraceContext`** when it mounts (**[`Guest-preroll-grace-tutorial`](Guest-preroll-grace-tutorial.md)** walks through why). |
| **When is pre-roll skipped?** | Mirror **`MusicPlayer`**: **`needsPreroll`** is **`showPlayerPreroll(userType)`**; **`skipPrerollGate`** = **`!needsPreroll`** **||** **`location.state.expandFromMiniPlayer`** **||** **`graceActive`**. Opening full player **from **`MiniPlayer`**** passes **`expandFromMiniPlayer: true`** (already in **`MiniPlayer.jsx`**) — **no** second pre-roll spam when expanding collapsed playback. Inside **guest grace** after a finished/skipped pre-roll, **subsequent tunes** skip the overlay the same way as channel hopping — podcast episode changes should behave the same once **PodcastPlayer** reads **`graceActive`**. |
| **When does playback / history “start”?** | Keep **Listen again**, **`PlaybackContext`**, “real listen” stubs **gated**: do **not** treat the user as fully in-session until **either** pre-roll completes **or** skip — same pattern as **`MusicPlayer`** **`useEffect`** guards with **`needsPreroll && !prerollComplete`**. |

**Teaching checklist for implementers**

1. Compose **`PodcastPlayer`** with **`needsPreroll && !prerollComplete`** → render **`PlayerPrerollAd`** before the main chrome ( **`--z-player-preroll`** is already tokenized ).
2. Use **`useGuestPrerollGrace()`** · **`graceActive`** in the same **`skipPrerollGate`** formula as **`MusicPlayer`**.
3. Read **`location.state?.expandFromMiniPlayer`** after **`MiniPlayer`** navigates via **`fullPlayerPath`** — no duplicate pre-roll logic in **`MiniPlayer`** itself.
4. If you **`key`**-remount the podcast play route (**`podcastId`**, **`episodeId`**, **`userType`**) like **`MusicPlayerRoute`**, retain the same rationale: resets player shell when jumping shows/episodes/types.

**Docs already expect this:** [`docs/visual-ads-and-user-types.md`](../visual-ads-and-user-types.md) states podcast / radio should reuse **`PlayerPrerollAd`** when those stacks exist.

---

## Figma anchors (read + implement)

| What | Node (see `figma-nodes.md`) |
|------|-----------------------------|
| Episode row | `19586:136643` — Episode Card (variants: new, progress, downloaded, …) |
| Show detail | `19585:135699` — Podcast Info |
| Full player | `19601:28077` — Podcast Player |
| Browse body (under Search → Podcasts) | `19805:39266` — Browse / Podcasts grid |
| Mini player (shared) | `19777:32024` — already used for music; podcast mode uses ±15 / +30 |

Frame size stays **460 × 990** per project rules.

---

## Data you already have

`src/data/podcasts.js` defines **shows** (`Podcast`) and **episodes** (`PodcastEpisode`) with titles, thumbs, `isNew`, dates, durations. Use it as the **catalog**; add **separate prototype state** for “my library” so you never confuse **CMS-like data** with **user actions**.

---

## Phase 1 — Routes and shells (mirror music)

**Goal:** Clicking paths land on real screens with **dummy content** wired to catalog ids.

| Route | Screen | Matches |
|-------|--------|---------|
| `/podcast/:podcastId` | Show detail (Subscribe, Share, description, episode list) | Figma Podcast Info |
| `/podcast/:podcastId/play/:episodeId` | Full-screen player | Figma Podcast Player |

**Teaching steps**

1. Register routes in **`App.jsx`** next to music routes.
2. On the **player** route, **hide BottomNav** the same way as `/music/.../play` (reuse the rule you already have).
3. Use **`Navigate`** when `podcastId` or `episodeId` does not resolve to `podcasts.js` lookup.

Deliverable: from **Info page** demos or temporary links, you can open a show and an episode player.

---

## Phase 2 — `PodcastUserStateContext` (local stub library)

**Goal:** Enough state to demo **journeys**, not persistence.

Suggested slices (minimal first, grow as screens need them):

- `subscribedPodcastIds` — `Set` or string array
- `bookmarkedEpisodeIds` — episode ids (match your `PodcastEpisode.id` shape)
- `downloadedEpisodeIds`
- `episodeProgressById` — e.g. `{ [episodeId]: { position01: number } }` for progress bar only
- Optional: **`continueListening`** derived list — chronological in-progress episodes (product spec); **omit section when empty**

Expose **tiny functions**: `toggleSubscribe(podcastId)`, `toggleBookmark(episodeId)`, `toggleDownload(episodeId)`, `setEpisodeProgress(episodeId, fraction)`.

**Teaching note:** Providers wrap the tree inside **`BrowserRouter`** (or at least under routes that read them). Mount **once** beside **`PlaybackContext`** so **`MiniPlayer`** and pages see the same library.

Deliverable: toggles on Episode Card / Subscribe change **another screen** without refresh (Browse grid counts, “Your Podcasts”, etc., when you add those UIs).

---

## Phase 3 — Show detail page (`/podcast/:podcastId`)

**Goal:** Figma **Podcast Info** — `ScreenHeader` (back), title, large art, **Subscribe** / **Share**, description + **More…**, vertical **EpisodeCard** list.

**Teaching steps**

1. Reuse **`ScreenHeader`** like **Channel Info**.
2. Map `useParams().podcastId` → `PODCASTS.find` (or a helper from `podcasts.js`).
3. **`EpisodeCard`** as its own component; props driven by episode + stubs (bookmarked?, downloaded?, progress?).

Episode row tap → `navigate(\`/podcast/${id}/play/${episode.id}\`)`.

Deliverable: full **show → episode player** loop.

---

## Phase 4 — Full player (`/podcast/:podcastId/play/:episodeId`)

**Goal:** Align with **`MusicPlayer`** layout family: dismiss, upgrade/cast mirrors, artwork, titles, scrub row, control row.

Feature checklist:

- Progress bar + timestamps (controlled state; drag optional for v2)
- **Play / pause** (UI only)
- **−15 s** / **+30 s** (adjust `episodeProgressById`; clamp 0–1)
- **Bookmark** toggle (delegate to **`PodcastUserStateContext`**)
- **Playback speed** — **`PODCAST_SPEED_STEPS`** array constant; **`useState`** or reducer for current index; **tap speed control** increments index modulo length; show `Nx` label
- **Optional later:** speed **popover** to match sister-app screenshot exactly
- **Guest full-screen pre-roll** — **`PlayerPrerollAd`** gated by **`showPlayerPreroll(userType)`** plus **`graceActive`** / **`expandFromMiniPlayer`** (see § *Player pre-roll & guest grace*)

**Collapse (chevron-down / minimize)** — Same contract as **`MusicPlayer`**: leave the **`/play/...`** route and land on **`/podcast/:podcastId`** (podcast info) while playback stays **active** in **`PlaybackContext`**, so **`MiniPlayer`** appears as the **footer overlay** on top of the info screen (plus tabs / ads)—not a “mini-only” mode with no detail behind it. **`MusicPlayer`** uses **`navigate(-1)`** for this; that works when navigation stack is **info → play**. If you ever deep-link straight into `/play/...`, use **`navigate(\`/podcast/${podcastId}\`)`** instead so collapse still lands on **Podcast Info**.

Deliverable: player matches **Stories** (“variant of music player”) and the **music collapse → detail + mini** mental model.

---

## Phase 5 — `PlaybackContext` + `MiniPlayer` (podcast mode) ✅ (prototype)

**Goal:** Use the **same language and behavior as music**:

1. **Starting an episode (“tune”) opens the full-screen player first.** While the URL is **`/podcast/:podcastId/play/:episodeId`**, **`MiniPlayer` stays hidden**, just like **`/music/:channelId/play`** (playback shell reserves space through **`PlaybackContext`** + `--mini-player-offset` only when mini is visible).
2. **Tapping collapse / minimize on the full player** navigates to **`/podcast/:podcastId`** (**Podcast Info**). Session stays active; **`MiniPlayer`** appears as the **footer overlay** above the scrolling **info** page (tabs, optional visual ads—same stack as **`MusicChannelInfo`** when music is minimized).
3. **Tapping `MiniPlayer`** navigates **`fullPlayerPath`** with **`state: { expandFromMiniPlayer: true }`** (already how **`MiniPlayer`** works). That skips **guest** **`PlayerPrerollAd`** on expand—same contract as music once podcast play uses **`showPlayerPreroll`** · **`graceActive`** (§ *Player pre-roll & guest grace*).

So: **start stream ⇒ full-screen player ⇒ collapse ⇒ show detail behind mini—not the other way round.** “Tap mini ⇒ expand full player again” completes the loop.

**Teaching checklist**

1. When the **play route** mounts, **`PlaybackContext`** sets **`variant: 'podcasts'`**, artwork, episode + show title lines, and **`fullPlayerPath`** = that play URL (**required** so mini has an expand target after collapse).
2. Extend **`PlaybackContext`** **`hideMiniOnFullPlayer`** (or equivalent) so it treats **`/^\/podcast\/[^/]+\/play/`** like the music **`/music/…/play`** regex—otherwise the mini strip would wrongly show **on top of** full podcast player.
3. **`MiniPlayer`** already branches on **`variant === 'podcasts'`** — wire **−15 / +30** (and pause) to the same progress helpers as the full player whether the route is **`/play/...`** or **info**.
4. **Listen again** — when the user has “really listened”: after guest pre-roll (when applicable), **`recordPodcastShowListen(podcastId)`** when **play** is on **or** **`position > 0.05`** (one record per episode mount). **`ListenAgainCard`** **`kind === 'podcast'`** → **`PodcastCard`** → **`/podcast/:id`**.

Deliverable: Podcast playback **reads** like channel playback: **full player on start**, **info + overlays after collapse**, **mini tap returns to full screen**.

---

## Phase 6 — Home and “More” wiring ✅ (prototype)

| Place | Work |
|-------|------|
| **`Home.jsx`** | Pass **`onSelect`** on **`PodcastCard`** → `navigate(\`/podcast/${podcast.id}\`)` |
| **`SwimlaneMore`** (podcasts) | Same navigation on tile tap |
| **Listen again** | **`ListenAgainCard`** handles `kind === 'podcast'` → navigate to show or resume path you choose |

Deliverable: no dead-end podcast tiles.

**Shipped:** `Home.jsx`, `SwimlaneMore.jsx` (`CATEGORIES.podcasts`), `ListenAgainCard` podcast branch (`/podcast/:id`).

## Phase 7 — Search tab → Browse Podcasts (`19805:39266`)

**Goal:** Podcasts segment: **conditional** personal tiles (hide when empty per UX principles), **2-column category grid**, navigation to filtered show lists.

**Teaching note:** Prefer **derived UI** — `const rows = [...]; if (!hasYourPodcasts) omit tile` — so you never maintain parallel “visibility flags” manually.

Reuse browse **card sizing** (~175px, 30px gap) with tokens (`--space-content-inline`).

Deliverable: “intent-heavy” browse matches **Stories** positioning relative to Home.

---

## Phase 8 — Monetization / chrome parity

Reuse **`UserTypeContext`**, **`showVisualAds`**, and **`showPlayerPreroll`** like music (**`src/utils/showVisualAds.js`**):

- **Guest** — **Upgrade** in player chrome; full-screen **`PlayerPrerollAd`** before usable podcast controls; **Listen again** / session writes only **after** the pre-roll gate (same as **`MusicPlayer`**); **guest grace** briefly suppresses repeat pre-rolls (§ *Player pre-roll & guest grace*); **visual** footer ad strip where **`showVisualAds`** applies.
- **Provided** — **no** guest pre-roll; **visual ads** still on for prototype (`showVisualAds` treats every non‑`subscribed` type — align **`provided`** nuances with **`docs/visual-ads-and-user-types.md`** if product splits them further).
- **Subscribed** — **no** **`PlayerPrerollAd`**, **no** upgrade CTA strip, **no** visual footer ads (**`showVisualAds`** is **`false`**).

No new subscription **product** flows — stubs only.

---

## Testing your own clicks (acceptance checklist)

Use this after each phase:

1. Home **Podcasts** tile → **show** → episode → **full player** (mini **hidden**) → **collapse** → **podcast info** with **MiniPlayer** footer overlay → tap **MiniPlayer** → **full player** again.
2. **Subscribe** toggles → appears in **Your Podcasts** when Browse ships (Phase 7).
3. **Bookmark / download** on episode row reflects in icon state.
4. **Speed** cycles through **0.6 … 2** and wraps.
5. Invalid URL → **Home** (or safe fallback).
6. **`guest`**: episode play from Podcast Info shows **`PlayerPrerollAd`** → after complete/skip, controls work **and** **expand-from-mini** does **not** replay pre-roll; **`provided`/`subscribed`** never see podcast pre-roll; align with **`MusicPlayer`** for the same **`userType`**.

---

## After you ship

- Append a short entry to **`docs/react-learning.md`** (Context for library state, nested routes, or speed cycling pattern).
- Update **`docs/plan.md`** — move **Podcast stack** from “Next” to **Done** and note **Search / Browse** follow-up scope.

---

*Last updated: 2026-05-01 — Phase 5 + player pre-roll / guest-grace parity with music documented; companion links added.*
