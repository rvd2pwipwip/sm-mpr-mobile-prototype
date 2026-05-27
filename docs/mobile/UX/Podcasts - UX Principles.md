# SM Podcasts & episodes – UX Principles

## Purpose

These UX principles define the experience foundations for **podcasts and episodes** in Stingray Music. They guide design, product, and engineering decisions so **shows** (loyalty, subscriptions, catalogs) and **episodes** (playback, progress, bookmarks, downloads) stay coupled while respecting where users actually discover and manage podcast content—primarily **Browse / Podcasts** and **Search**, with **Home** as a light editorial sampler.

---

## 1. Respect Home as a Sampler, Not the Podcast Catalog

**Home must surface podcasts at the show level without turning into an episode-heavy browse experience.**

- Podcast swimlanes on Home present **shows**, not dense episode lists.
- Editorial curation on Home acts as a **first look and reminder**, not the primary path for topic- or title-driven discovery.

**Success signal:** Users understand that podcasts exist in the app from Home, but do not rely on Home to manage subscriptions or hunt for specific episodes.

---

## 2. Treat Browse / Podcasts and Search as the Main Front Doors

**Intent-heavy discovery belongs in Browse and Search—not on Home.**

- **Browse / Podcasts** carries categories, personal shelves, and library-oriented rows.
- **Search** serves users who arrive with a **specific show, topic, or title** in mind.
- Together they satisfy “I know roughly what I want” and “I know exactly what I want.”

**Success signal:** Regular podcast listeners spend most discovery time in Browse / Podcasts or Search, not re-scrolling Home.

---

## 3. Hide Empty Personal Rows by Default

**User-specific podcast sections appear only when they have content to show.**

- Rows such as **Continue listening**, **Your Podcasts**, **Your Episodes**, **New Episodes**, and **Downloaded Episodes** must **omit themselves** when empty so the screen never feels broken or sparse.

**Success signal:** Users never see placeholder gaps or “empty state” rails masquerading as full sections without explanation.

---

## 4. Continue Listening Prioritizes Resume Over Novelty

**Unfinished episodes should be easy to pick back up in a predictable order.**

- **Continue listening** lists **in-progress episodes** in **chronological order** so resume behavior feels stable and trustworthy.

**Success signal:** Returning users reliably find “where I left off” without hunting across shows.

---

## 5. Keep Shows and Episodes Dependent in the Mental Model

**Product behavior should reinforce that episodes belong to shows—not isolated files.**

- Subscriptions, “new episodes,” and bookmarks tie back to **shows** or **episodes** in ways users expect from other podcast apps.
- **Listen again** on Home may foreground **shows** where appropriate so users can step back toward episode lists naturally.

**Success signal:** Users rarely feel lost between “this episode” and “the show it came from.”

---

## 6. Full-Screen Podcast Player as a Variant of the Music Player

**The podcast full-screen player is a close relative of the music full-screen player: shared core UI elements, look and feel, and the same miniplayer ↔ full-screen behavior—with podcast-adapted metadata and controls.**

- Treat podcast playback as a **variant** of the music player shell, not a separate visual language—users should feel continuity across content types.
- Keep **core layout and chrome** aligned with music; differentiate where podcasts need it (**metadata**: show vs episode identity, episodic context; **controls**: skip ±15/+30 vs channel skip, etc.).
- Mirror music’s **miniplayer ↔ full-screen player** relationship (placement, tap targets, escalation gesture, dismissal)—only the compact control set and on-screen labels change where podcast semantics require it.
- **Sleep timer** is **out of scope for now**; reserve room to add it later without reshaping core IA.

**Success signal:** Users instantly read podcast playback as “the same player family” as music, while still seeing **episode-appropriate information and controls**—never a disconnected second UI paradigm.

---

## 7. Align Lightweight Playback With Shared Chrome

**Miniplayer behavior stays consistent with app-wide patterns while respecting podcast controls.**

- Compact controls follow the podcast pattern (**15s back**, **play/pause**, **30s forward**) alongside predictable escalation to the **full-screen podcast player**.

**Success signal:** Users control episodes from the miniplayer without friction and reach full-screen podcast playback through the same mental model as other content types.

---

## 8. Match Music’s Monetization and Trust Model

**Guest, free provider (`freeProvided` in code), and subscribed experiences mirror music.**

- Ads, upgrade affordances, and entitled experiences behave consistently with music so users do not learn a second monetization vocabulary.

**Success signal:** Podcast surfaces feel financially “fair” in the same way as music—no surprising exceptions.

---

## 9. Earn Depth Through Progressive Disclosure

**Advanced podcast affordances stay available without cluttering early surfaces.**

- Bookmarks, downloads, subscriptions, and “new” cues deepen in Browse / Podcasts and player—not on Home tiles.

**Success signal:** First-time flows stay readable; power users still reach library-grade tools quickly.

---

## 10. Design for Offline Without Breaking On-Demand Clarity

**Downloaded episodes must read clearly as playable local copies of episodic content.**

- When populated, **Downloaded Episodes** behaves like other conditional rows: confident, obvious, and aligned with playback expectations.

**Success signal:** Users trust offline playback for podcasts as much as they trust streamed episodes—without confusing downloaded items with unrelated media types.

---

## Guiding Question

When in doubt, ask:

> *“Does this keep shows and episodes coupled, put Browse / Search ahead of Home for real podcast work, and stay honest about empty vs populated library rows?”*

If the answer is no, the decision likely violates one or more of these principles.
