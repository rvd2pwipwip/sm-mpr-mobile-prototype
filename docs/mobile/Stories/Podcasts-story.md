# SM Podcasts & episodes — story

We are **podcasts and episodes** inside Stingray Music (working title, naming/branding to be determined). We are one of three content families in the app, alongside music channels and radio stations, and our experience is built on two linked ideas: **shows** people follow over time, and **episodes** they play, resume, save, or download.

---

## How we show up on Home

On **Home**, we keep things simple: the swimlane surfaces **shows only**—a curated, editorial first look that reminds listeners we exist and points them toward interesting podcasts without asking them to parse episode lists in a crowded layout.

Home is **not** where we expect people to do deep catalog work. It is mainly a **sampler and reminder**: a small window into podcasts in the app, not the main place to hunt for a specific topic or show.

---

## Browse / Podcasts — where the library really lives

**Browse / Podcasts** is our real **front door** for people who already think in terms of categories, subscriptions, or “what’s new in *my* shows.” **Search** is the other big front door—together, Browse and Search are how users usually find podcasts, because there are many categories and shows, and people often arrive with a **specific topic or title** in mind rather than whatever the Home shelf happens to highlight that week.

On this surface, several **user-specific** sections appear **only when they have something to show** (empty sections stay hidden):

- **Continue listening** — unfinished episodes, in **chronological order**, so listeners can pick up where they left off. *(In Figma this row is not designed yet; the rest of Browse / Podcasts is.)*
- **Your Podcasts** — shows the user is **subscribed** to.
- **Your Episodes** — episodes the user has **bookmarked**.
- **New Episodes** — the most recent episodes from **subscribed** shows.
- **Downloaded Episodes** — episodes stored for **offline** playback.

**Figma (Browse / Podcasts, Continue listening not yet in file):** [UX-SM-MPR-Mobile — Browse / Podcasts](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19805-39266&t=8NQn3KeizdhIWSrR-4)

---

## Listen again and the miniplayer

We still align with **Listen again** on Home: that swimlane can mix content types and may point back to a **show** (not necessarily a single episode tile) so users can return toward a podcast they care about—including getting back to an **episode list** when that matters.

When an **episode** is playing, the **miniplayer** is our compact delegate: **15 seconds back**, **play/pause**, **30 seconds forward**, plus the usual path to the **full-screen** experience when the user wants more than quick controls.

---

## Full-screen podcast player

Our **full-screen podcast player** is a **variant** of the **music full-screen player**: **shared core UI elements, look and feel, and the same miniplayer ↔ full-screen behavior**, with **metadata and controls adapted** for episodic spoken content (show vs episode context, scrubbing semantics, ±15/+30 on the mini strip where music uses skip, etc.). **Sleep timer** is **out of scope for now**; it can be added later.

**Figma (full-screen podcast player):** [UX-SM-MPR-Mobile — Podcast full player](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19601-28077&t=8NQn3KeizdhIWSrR-4)

---

## Monetization and user types

We follow the **same monetization model as music**: **guest**, **freeProvided** (free provider / SSO tier), and **subscribed** behave the same way for our surfaces as they do for the rest of the app (including how ads and upgrade patterns apply at the product level).

---

## In a nutshell

We are proud to pair **discovery** (Home’s light-touch, show-level shelf) with **intent** (**Search** and **Browse / Podcasts** for categories, subscriptions, bookmarks, downloads, and “continue where I left off”). Episodes are how time is spent; shows are how loyalty is built—and we speak as **both**, because the product only works when those two stay in sync.
