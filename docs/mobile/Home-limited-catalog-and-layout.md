# Home, catalog scope, and layout

This note explains how the prototype treats **broad** vs **limited** music lineups, what happens to the **classic Home screen**, and how **layout and navigation** change. It complements **`docs/mobile/Stories/Home-screen-story.md`** (product narrative) and **`docs/mobile/Plans/catalog-scope-search-browse-refactor.md`** (IA plan).

## Catalog scope in the prototype

**Catalog scope** (`limited` | `broad`) is driven by **`musicLineupMode`** in **`src/context/TerritoryContext.jsx`**. It mirrors the product idea that some territories get a **smaller music lineup** (on the order of genre-sized buckets) while others get a **much larger** catalog with deeper browse hierarchies.

- **`src/constants/catalogScope.js`** maps lineup mode to **`CATALOG_SCOPE`**.
- **`TerritoryProvider`** writes **`data-catalog-scope`** on **`<html>`** so global CSS can adjust footer stack height (see **`src/index.css`**).

In the demo, tap the **wordmark** on **broad Home** or **limited Browse** to toggle lineup (stored in **`sessionStorage`**).

## Broad catalog: classic Home at `/`

When **`catalogScope === broad`**, **`/`** renders **`src/pages/Home.jsx`**.

**Intent:** Home is a **sampler**, not the full catalog. It welcomes users with a **vertical stack** of horizontal swimlanes (music, podcasts, radio, then recommendations), each showing a ** capped slice** of items plus **More** when the underlying list is larger.

**Layout traits:**

- **`HomeHeader`** fixed at the top (upgrade / branding by user type).
- **`home-body-scroll`** scrolls **banner** + **rails** under the header.
- **`BottomNav`** (`Home` | `Search` | `My Library`) is visible; **`/info`** root redirects to **`/my-library`** for broad users.
- Swimlanes use **`ContentSwimlane`** with **`sourceCount`** and **`SWIMLANE_CARD_MAX`** (**`src/constants/swimlane.js`**, default 12 cards) so **More** reflects catalog depth without filling the screen with every channel.

**User-type extras on Home (broad only):**

- **Listen again** prepends when history exists (mixed content types; compact tiles).
- **`freeProvided`** users see **`ProviderLineupMusicSwimlane`** before the generic music rail.

Deep discovery stays on **Search / Browse** (`/search/*`), matching the story that Home is for shortcuts and sampling.

## Limited catalog: Browse replaces Home at `/`

When **`catalogScope === limited`**, **`/`** does **not** render **`Home.jsx`**. **`HomeOrLimitedBrowse`** in **`src/App.jsx`** swaps in **`src/pages/LimitedBrowse.jsx`** instead.

**Product rationale:** With a **small** lineup, a separate **Home** full of genre-agnostic “most popular” rails is less useful than putting users **straight into structured Browse** (music by **genre**, podcasts by **topic**, radio by **format**). Search stays available but is **query-first** on limited (single **`/search`** path; tab URLs fold back — see **`SearchEntryRoute`** / **`SearchTabRoute`** in **`App.jsx`**).

**Layout traits:**

- **No primary bottom tab bar.** **`BottomNav`** is omitted when limited; **`LimitedCatalogFooterAd`** can still show the **visual ad strip** for tiers where **`showVisualAds`** applies.
- **Chrome:** **`limited-browse-header`** varies by **`userType`**: **`freeProvided`** — row **1** **wordmark** (catalog toggle) + **provider logo** (`space-between`); row **2** **Upgrade** (leading) + **Search** / **Info**. **Guest** / **freeStingray** — row **1** wordmark + icons; row **2** centered **Upgrade**. **Subscribed** — single row, wordmark + icons (**`src/pages/LimitedBrowse.jsx`**).
- **Body:** Reuses **`home-screen`** / **`content-inset`** patterns for the **banner**, then **`SearchBrowseContentSwitcher`** in **`mode="local"`** (Music | Podcasts | Radio **without** `/search/*` URL segments).
- **Rails:** **`LimitedBrowseTaxonomyRails`** renders **Listen again** (tab-scoped), then **`ProviderLineupMusicSwimlane`** when **`freeProvided`** and **Music** tab (same rail order as broad **`Home`** before genre stacks), then likes / podcast library rails, then taxonomy **`ContentSwimlane`** stacks. **Radio** uses **Near You**, then the **International** pill rail (**`SearchRadioInternationalBrowseRail`**), then per-format station swimlanes (**`More`** uses **`/search/browse/...`** like broad Browse).

**User-driven content on limited:** There is **no My Library tab**. Likes, podcast library sections, and **Listen again** surface as **prepended rails inside** the active Browse tab (filtered by content kind for Listen again). See **`LibraryLikedMusicSwimlane`**, **`LibraryPodcastUserSwimlanes`**, **`LibraryLikedRadioSwimlane`**, and the tab-scoped Listen again block in **`LimitedBrowseTaxonomyRails.jsx`**.

**Ads:** In-feed **`SwimlaneBannerAd`** inserts **after the first two taxonomy swimlanes** (third row position) when visual ads are on, similar spacing intent to broad but tuned for the stacked taxonomy layout.

## CSS and footer stack height

Broad layouts reserve vertical space for **tabs + optional ad strip + mini player** via **`--bottom-nav-stack-height`**.

For **`html[data-catalog-scope="limited"]`**, **`src/index.css`** sets **`--bottom-nav-stack-height: 0px`** because there is **no tab bar**. When **`html[data-visual-ads]`** is also set, that token becomes the **ad strip height only**, so scroll padding and **MiniPlayer** docking stay consistent without phantom tab space.

## Summary

| Aspect | Broad (`Home.jsx` at `/`) | Limited (`LimitedBrowse.jsx` at `/`) |
|--------|---------------------------|--------------------------------------|
| Landing role | Curated **sampler** across types | **Browse-first** taxonomy stacks |
| Bottom navigation | Yes (`BottomNav`) | No (header links only) |
| Music discovery on landing | One “Most popular music” rail (+ provider rail if `freeProvided`) | **Per-genre** swimlanes |
| Podcasts / radio on landing | One rail each | Podcasts: **per-topic** swimlanes. Radio: **Near You**, **International** pill rail, then **per-format** swimlanes |
| My Library | Dedicated tab | Surfaced **inside** Browse tabs |
| Toggle in prototype | Wordmark tap | Same |

## Related files

- **`src/App.jsx`** — `HomeOrLimitedBrowse`, Search redirects, `showBottomNav` vs **`LimitedCatalogFooterAd`**
- **`src/pages/Home.jsx`** — broad Home composition
- **`src/pages/LimitedBrowse.jsx`** — limited landing chrome and shell
- **`src/components/LimitedBrowseTaxonomyRails.jsx`** — taxonomy rails and prepended user rails
- **`src/context/TerritoryContext.jsx`** — lineup / **`catalogScope`**
- **`docs/mobile/Stories/Search-story.md`** — limited vs broad Browse vocabulary
