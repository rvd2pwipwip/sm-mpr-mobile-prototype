# Special Cards (non-media and placeholder tiles)

Prototype inventory for swimlane and browse **tiles that are not standard catalog cover art** (`MusicChannelCard`, `PodcastCard`, `RadioStationCard`, `EpisodeCard` all use model `thumbnail` URLs from data modules).

---

## Tiles without an image thumbnail (intentional)

| Component / pattern | Role | Notes |
|---------------------|------|--------|
| **`BrowseTagCard`** | Geo / taxonomy row in **Radio International** browse; **My Library** Account tile (**`AppInfoSwimlane`**) | Default: uppercase kind + centered label. **Stacked accent** (**`browse-tag-card--accent`**, vertically centered): **`flagIso2`** (**`public/flags/{iso2}.svg`** in **56 px** circular ring) **or** **`accentIconSvg`** (**`public/gear.svg`** via CSS mask; fill + fade match **`LibraryHistoryEmptyCard`** history icon: **`--color-library-masked-placeholder-icon-fill`** and **`--opacity-library-history-empty-media`** from **`src/index.css`**). Optional **`to`** renders **`react-router`** **`Link`**. **North America**: Caribbean aggregate stays without flag (**`getNorthAmericaInternationalFlagIso2`**). |
| **`SearchBrowseTile`** | **Search** tab browse grids | Text-only buttons (genres, library shortcuts, catalog shortcuts); no cover column. |
| **`LibraryHistoryEmptyCard`** | **My Library** listen-history swimlane when **empty** | Icon-sized media area + message; Figma-aligned empty state, not a photo thumbnail. |
| **`MusicTagCard`** | **Search → Tags** swimlane / **More** grid | Same **`app-info-swimlane__tile`** label square as **`MusicArtistCard`**. Tap → **`/search/more/tags?q=`** (exact tag) → 2-col channel grid. |
| **Vibe sub tiles (`SearchMusicVibeBrowseRail`)** | Broad music vibe rows with **sub-level** navigation | Renders `app-info-swimlane__tile` text buttons when the selection has subs (FAQ-style), not channel art. |
| **`ContentSwimlane` trailing More** | Category-rail variant | Square `content-swimlane__more-card` with "More" label; not a content tile. |

---

## Ghost / skeleton `ContentTileCard` (no `<img>`)

`ContentTileCard` with **`ghost`** and **`imageUrl=""`** skips the image and is non-interactive (`aria-hidden`).

Used for:

- **Home** – **Listen again** filler slots to keep rail width (`Home.jsx`).
- **Limited Browse** – **Listen again** filler slots (`LimitedBrowseTaxonomyRails.jsx`).
- **`LibraryHistoryRail`** – fillers after history items, and beside **`LibraryHistoryEmptyCard`** when the segment is empty.

---

## Stub data: **`MusicArtistCard`** (Search artists lane)

**`src/data/musicArtists.js`** – synthetic **`MUSIC_ARTISTS`** for substring search; **`featuredChannelIds`** lists **1–12** seeded channels per artist. **`MusicArtistCard`** reuses **`app-info-swimlane__tile`** (**`MusicArtistCard.css`**) — same **label-on-square** pattern as Browse **Genre** vibe **sub** tiles (e.g. “All Pop” on **`SearchMusicVibeBrowseRail`**), **not** a **`ContentTileCard`** thumbnail. Drill-down: **`/search/browse/music/artist/:artistId`** → 2-column **`MusicChannelCard`** grid (**`SearchMusicArtistChannels.jsx`**).

**Tags (Search)** — Tag strings live on **`MUSIC_CHANNELS[].tags`**; distinct vocabulary: **`docs/mock-data-music-tags.md`** / **`getDistinctMusicChannelTagLabels()`**. **`MusicTagCard`** matches Artists visually; substring match → tap → **`/search/more/tags?q=`**.

---

## Related

- Standard cover tile: **`ContentTileCard`** + **`ContentTileCard.css`**
- Swimlane More rules: **`ContentSwimlane-category-rail-variant.md`**
- Category rail tutorial: **`docs/Tutorials/ContentSwimlane-category-rail-tutorial.md`**
