# Special Cards (non-media and placeholder tiles)

Prototype inventory for swimlane and browse **tiles that are not standard catalog cover art** (`MusicChannelCard`, `PodcastCard`, `RadioStationCard`, `EpisodeCard` all use model `thumbnail` URLs from data modules).

---

## Tiles without an image thumbnail (intentional)

| Component / pattern | Role | Notes |
|---------------------|------|--------|
| **`BrowseTagCard`** | Geo / taxonomy row in **Radio International** browse and similar | Documented as without artwork until flags or CDN art; label + kind (Country, Region, City). See `SearchRadioInternationalBrowseRail`. |
| **`SearchBrowseTile`** | **Search** tab browse grids | Text-only buttons (genres, library shortcuts, catalog shortcuts); no cover column. |
| **`LibraryHistoryEmptyCard`** | **My Library** listen-history swimlane when **empty** | Icon-sized media area + message; Figma-aligned empty state, not a photo thumbnail. |
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

## Stub data: artists without `thumbnail` in JSON

**`src/data/musicArtists.js`** – all **`MUSIC_ARTISTS`** entries omit a `thumbnail` field. **`MusicArtistCard`** always supplies a deterministic **picsum** URL (`artist-${id}`) so Search artist rows still show an image. To treat as "special": no explicit asset in data, only a generated placeholder.

---

## Related

- Standard cover tile: **`ContentTileCard`** + **`ContentTileCard.css`**
- Swimlane More rules: **`ContentSwimlane-category-rail-variant.md`**
- Category rail tutorial: **`docs/Tutorials/ContentSwimlane-category-rail-tutorial.md`**
