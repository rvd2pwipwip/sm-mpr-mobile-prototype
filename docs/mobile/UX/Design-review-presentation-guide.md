# Mobile prototype — stakeholder design review (presenter guide)

**Purpose:** Keep a **1-hour** review focused on **user journeys**, **UX intent**, and **design decisions** — not implementation detail, backlog grooming, or TV parity.

**Audience:** Product, engineering, marketing, partner/OEM stakeholders (adjust emphasis per room).

**Prototype:** Clickable React app in `apps/mobile/` (fake data, no real auth/billing/streaming).

**Related docs:** `docs/mobile/UX/*`, `docs/mobile/Stories/*`, `docs/mobile/visual-ads-and-user-types.md`, `docs/mobile/Home-limited-catalog-and-layout.md`, `docs/mobile/Plans/plan.md`.

---

## Before you present (5 minutes, not in the room)

| Check | Action |
|-------|--------|
| Dev server | From repo root: `npm run dev` (mobile). Use **mobile frame** width (~460px) or a phone-sized browser window. Cover art is **local by default** — run `npm run media:sync` once on Wi-Fi if images are missing (`docs/mobile/offline-demo.md`). |
| Default demo mode | **Broad catalog** + **`guest`** unless you intentionally open with **subscribed** (cleanest chrome). |
| Demo controls | **`/upgrade`** (Subscription screen) → **Preview as** toggles `guest` \| `freeStingray` \| `freeProvided` \| `subscribed`. |
| Catalog scope | Tap **wordmark** on **Home** (broad) or **limited Browse** landing to toggle **broad** vs **limited** lineup (persisted in session). |
| Theme (optional) | System light/dark, or `data-theme` on `<html>` if you need a fixed mode. |
| Reset history | Refresh page clears in-memory **Listen again** / likes unless you’ve added persistence — plan a quick “listen once” beat before Journey 2 if needed. |

**Say once at the start:** “This is a **UX prototype** — flows and layout are real; APIs, stores, and entitlements are stubbed.”

---

## One-minute product frame (say this early)

**What it is:** Stingray Music (working title) — **music channels**, **podcasts**, and **radio** in one **mobile-first** streaming app (phone-native patterns in the browser).

**Business model (prototype):**

| Tier | Who | Monetization in UI |
|------|-----|-------------------|
| **Guest** | Not signed in | Upgrade CTA, **visual ads**, **music pre-roll** (15s), **hourly music skip cap** |
| **freeStingray** | Stingray account, no sub | Same ads/pre-roll/skip cap as guest; Upgrade CTA |
| **freeProvided** | Partner/cable access | Provider branding, ads, **no** guest skip cap / **no** music pre-roll in prototype |
| **subscribed** | Paying / entitled | No ads; centered branding; full player without upgrade strip |

**Three media types, one app chrome:** Shared **bottom tabs** (broad), **mini player**, **full-screen player family**, **Listen again** history across types.

**Two catalog modes (territory IA):**

| Mode | Home at `/` | Bottom nav | Discovery home |
|------|-------------|------------|----------------|
| **Broad** | Classic **Home** sampler | Home \| Search \| **My Library** | Search = deep Browse + live search |
| **Limited** | **Browse-first** landing | **No tab bar**; Search/Info in header | Taxonomy swimlanes + tab switcher on `/` |

---

## Guardrails — stay on track

**In scope for this review**

- Information architecture (Home vs Search vs My Library vs limited Browse).
- User-type chrome (header, ads, upgrade, provider).
- Continuity (**Listen again**, mini player, resume patterns).
- Content-type parity (music / podcast / radio feel equally supported).
- Browse vs Search behavior and catalog depth (broad vs limited).
- Player + monetization surfaces (pre-roll, skip limit, ad placement).
- Personalization rules (show rails only when populated; Listen again prominence).

**Park until another meeting (do not debate at length)**

- Real SSO, App Store, restore purchases backend.
- Exact ad fill, IAB sizes, mediation.
- Skip-cap legal/licensing final numbers.
- Pixel-perfect Figma deltas unless blocking a journey.
- TV app (`apps/tv/`) — separate prototype.
- Cast/share “dumb” dialogs beyond “we reserved the flow.”

**Facilitator phrase when sidetracked:** “Let’s capture that in parking lot — I want your eyes on **[current journey]** before we run out of time.”

---

## Suggested 60-minute agenda

| Time | Block | Goal |
|------|-------|------|
| 0:00–0:05 | **Frame + rules** | Product, prototype limits, agenda |
| 0:05–0:18 | **Journey 1** — First-time guest, broad Home | Welcome, 3 content types, monetization |
| 0:18–0:30 | **Journey 2** — Return listener + mini player | Continuity, daily-use Home |
| 0:30–0:42 | **Journey 3** — Search & Browse (music + one other type) | Deep discovery, browse/search shift |
| 0:42–0:52 | **Journey 4** — My Library + user types | Personal hub, subscribed vs guest |
| 0:52–1:00 | **Decisions + parking lot** | Explicit asks; capture follow-ups |

*If the room is engineering-heavy, shorten Journey 3 and extend Journey 4.*

---

## Journey 1 — “New guest discovers the app” (~13 min)

**Story:** Unsigned user opens the app and understands **music + podcasts + radio** without searching.

**Principles to cite:** `Home - UX Principles` §1 Welcome, §2 Reflect user, §9 Linear + on-demand equally, §10 Trust/monetization.

**Setup:** `guest`, **broad** catalog, fresh session (no history).

| Step | Where to click | What to call out |
|------|----------------|------------------|
| 1 | `/` Home | **HomeHeader**: branding + **Upgrade**; no provider logo |
| 2 | Scroll | **Banner** (marketing/personality); **in-feed ad** below banner (guest) |
| 3 | Music swimlane → channel | Tile → **`/music/:id`** Channel Info → Play → **`/music/:id/play`** |
| 4 | Music player | **Pre-roll** 15s (guest); then transport; **skip** shows cap badge; optional **cast** stub |
| 5 | Dismiss player | Back to Home; note **footer ad** under tabs |
| 6 | Podcast tile | **`/podcast/:id`** — show-level on Home, not episode grid |
| 7 | Radio tile | **`/radio/:id`** → play — radio as peer content type |

**UX decisions to land**

- Home is a **sampler**, not the full catalog (`Home-screen-story.md`).
- Ads: **footer strip** + **in-feed** + **player** for non-subscribed tiers (`visual-ads-and-user-types.md`).
- Podcasts on Home = **shows**; episode work lives in Browse/Search (`Podcasts - UX Principles` §1–2).

**Ask stakeholders**

- Is the **content order** (music → podcasts → radio → recommendations) right for first impression?
- Are ad **placements** acceptable relative to editorial swimlanes?

---

## Journey 2 — “Returning user resumes listening” (~12 min)

**Story:** User who has listened before should **resume from Home** without opening Search.

**Principles:** `Home - UX Principles` §3 Continuity, §8 Reduce need to search; `Miniplayer - UX Principles` §1–3, §6.

**Setup:** Play **music**, then **podcast**, then **radio** (briefly) so **Listen again** populates. Stay **broad**.

| Step | Where | What to call out |
|------|-------|------------------|
| 1 | Home (scroll top) | **Listen again** appears **above** genre swimlanes; **compact tiles, no labels** |
| 2 | Tap Listen again item | Routes to correct **info** or **player** by kind |
| 3 | **More** on Listen again | `/more/listen-again` — mixed grid, **Clear** in header |
| 4 | Start playback, go to Search tab | **Mini player** above tabs; controls differ by type (music skip vs podcast ±15/30) |
| 5 | Tap mini player body | Opens **full player**; browsing context preserved |
| 6 | My Library (optional tease) | Same history, **split by type** — “hub vs Home recap” |

**UX decisions to land**

- **Listen again > discovery** when history exists (product priority).
- **Mixed types** in one Home rail vs typed rails in My Library (intentional split).
- **Broad Home** does **not** show a Favorites swimlane — likes live on **My Library** (and limited Browse tabs).

**Ask stakeholders**

- Is **one mixed** Listen again rail enough, or do we need type filters on More (backlog idea in `plan.md`)?

---

## Journey 3 — “Intentful discovery” (~12 min)

**Story:** User who knows what they want uses **Search**; explorer uses **Browse** hierarchies.

**Principles:** `Search and Browse - UX Principles` §1–2, §6–8, §10–11.

**Setup:** **Broad**, `subscribed` (optional: fewer ads distractions) or `guest` if monetization comparison matters.

### 3A — Browse (music) ~6 min

| Step | Where | What to call out |
|------|-------|------------------|
| 1 | Search tab → defaults to last browse tab (often **Music**) | Sticky header + **Music \| Podcasts \| Radio** |
| 2 | Scroll browse body | **Broad**: vibes → tags → channel grids; **limited**: genre grids (toggle catalog if time) |
| 3 | Drill to channels | `SearchMusicVibe` / tags / category routes |
| 4 | **Re-tap Search tab** while on `/search/*` | Resets to **Music** browse, clears `?q=` (mode reset) |

### 3B — Live search ~4 min

| Step | Where | What to call out |
|------|-------|------------------|
| 1 | Type in search field | Browse chrome **recedes**; **grouped results** (channels, artists, podcasts, episodes, radio) |
| 2 | Clear query | Returns to Browse (principle: reversible mode switch) |

### 3C — One non-music beat ~2 min (pick one)

- **Podcasts:** Browse rows + **conditional** library sections (Continue listening, Your Podcasts, etc.) only when populated.
- **Radio:** Format swimlanes + **International** pill rail → geo stack (local relevance).

**UX decisions to land**

- Search results are **global**, not filtered by the browse tab you came from (`Search-story.md`).
- **Catalog scope** changes IA dramatically — limited puts Browse at `/` and folds library rails into tabs.

**Ask stakeholders**

- For **limited territories**, is **no bottom tab bar** acceptable if Search/Info are in the header?
- Is **broad** music taxonomy (vibe/tag) understandable vs **limited** genre-only?

---

## Journey 4 — “My stuff + account + tiers” (~10 min)

**Story:** Power user manages **history, likes, podcast library** and compares **guest vs subscribed**.

**Principles:** `My Lybrary - UX Principles` §1–2, §7; `Home - UX Principles` §2, §5.

**Setup:** Start **`subscribed`**, broad — show clean chrome. Then switch on **`/upgrade`**.

| Step | Where | What to call out |
|------|-------|------------------|
| 1 | My Library tab | **App Info** swimlane (gear) at top → Account & Settings, FAQ, Contact, About |
| 2 | Scroll | **Music / Podcast / Radio history** (ghost → filled); **More** + per-type clear on history More routes |
| 3 | Likes / podcast shelves | Appear **only when populated** (progressive disclosure) |
| 4 | `/upgrade` → Preview as **guest** | Home: Upgrade + ads; play music → pre-roll + skip dialog at cap |
| 5 | Preview as **freeProvided** | Provider logo on Home; player **Upgrade** + provider row; no guest skip/pre-roll |
| 6 | Preview as **subscribed** | No footer ad; more vertical space; player without ad strip |

**UX decisions to land**

- **My Library** = single **ownership hub**; Home = **daily shortcuts** + editorial.
- **Info** tab on **limited** catalog; **My Library** replaces Info as 4th tab on **broad** (`/info` → redirects to library).

**Ask stakeholders**

- Is **App Info inside My Library** (vs separate tab) the right long-term IA for broad users?
- Any **freeProvided** rules that must diverge from guest (ads yes, pre-roll no — confirm with partners)?

---

## Optional stretch (only if ahead)

| Journey | Quick path | Why show it |
|---------|------------|-------------|
| **Limited catalog** | Wordmark toggle → `/` Browse landing | Territory/OEM smaller lineup |
| **Subscription funnel** | Upgrade → `/upgrade` → mock store `/upgrade/store` | Upgrade copy/layout |
| **Cast prototype** | Player cast icon → dialogs | Second-screen intent without real Cast SDK |
| **Account required** | Actions that open **AccountRequiredDialog** | Guest gating pattern |
| **Podcast deep** | Browse → show → episode player | Show/episode coupling, continue listening |

---

## UX decision scorecard (explicit feedback)

Use these as **yes / no / discuss** prompts in the last 10 minutes:

1. **Home prioritizes resume** (Listen again) over cold discovery when history exists.
2. **Three content types** are peers on Home and in navigation.
3. **Browse vs Search** dual model (type to search, clear to browse) is the right mental model.
4. **My Library** centralizes personalized content; Home does not show Favorites (broad).
5. **Monetization** tier differences are visible and understandable in header/footer/player.
6. **Limited catalog** trades tab bar for Browse-first landing.
7. **Podcast** Home tiles stay at **show** level; library rows hide when empty.
8. **Mini player** is the default multitasking pattern above bottom nav.
9. **Full-screen players** share one shell across music/radio/podcast with type-specific controls.
10. **Ads** placement (footer, in-feed, player) is acceptable for free tiers.

---

## Parking lot template (copy to whiteboard)

| Topic | Owner | Follow-up |
|-------|-------|-----------|
| | | |
| | | |

---

## Known prototype gaps (set expectations if asked)

- No real billing, login, or restore purchases (stub dialogs only).
- Guest music skip does not change track artwork yet — **counter/timer only**.
- No real geo/IP for radio — mock territory and stations.
- Swimlane-level ads beyond banner/footer/player: partial / story-only in places.
- Recommendations swimlane on Home: present but **generic** (not ML).
- Persistence: mostly **in-memory** per session for history/likes.
- **Favorites on Home** (story mentions) — **not** on broad Home; likes in My Library / limited tabs.

Full shipped vs backlog: `docs/mobile/Plans/plan.md`.

---

## Questions to ask *you* before the meeting

Answer these yourself or with PM so the guide matches your audience:

1. **Primary persona for demos:** OEM guest, Stingray subscriber, or cable **freeProvided**?
2. **Must-show catalog:** broad only, or **limited** territory is a main stakeholder concern?
3. **Monetization sensitivity:** Is it OK to spend time on pre-roll/skip cap, or keep focus on discovery?
4. **Decisions needed today:** IA approval, ad policy, tier rules, or “awareness only”?
5. **Out of room:** Legal, exact pricing, partner logo assets?
6. **Recording / Figma:** Will you screen-share prototype only, or also Figma side-by-side?

---

## Quick reference — routes & tabs

**Bottom nav (broad):** Home `/` · Search `/search/music` (etc.) · My Library `/my-library`

**Key routes**

| Area | Paths |
|------|--------|
| Home / limited | `/` |
| Music | `/music/:channelId`, `/music/:channelId/play` |
| Podcast | `/podcast/:podcastId`, `/podcast/:podcastId/play/:episodeId` |
| Radio | `/radio/:stationId`, `/radio/:stationId/play` |
| Search browse | `/search/browse/...`, `/search?...` |
| Library | `/my-library`, `/my-library/history/:segment`, `/my-library/likes/:likeKind` |
| Upgrade | `/upgrade`, `/upgrade/store` |
| Info (limited) | `/info`, `/info/about`, `/info/contact` |

**Demo toggles**

| Control | Location |
|---------|----------|
| User type | `/upgrade` → Preview as |
| Broad / limited catalog | Wordmark on Home or Limited Browse |
| Listen again data | Play any content once |

---

## Facilitator closing (30 seconds)

“We validated **[journeys 1–4]** against our UX principles. **Decisions needed:** [list from scorecard]. **Parking lot:** [top 3]. Next step: **[Figma refresh / eng spike / partner review]** — owner TBD.”

---

_Draft for stakeholder design review. Update after the session with decisions and parking-lot outcomes._
