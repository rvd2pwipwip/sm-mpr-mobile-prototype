# Design review — short sheet (1 hour)

**Prototype:** `apps/mobile` · **Demo:** `/upgrade` → Preview as · **Catalog:** tap wordmark (broad \| limited)

**Full guide:** `Design-review-presentation-guide.md`

Open with: *UX prototype — flows and layout are real; auth, billing, and streaming are stubbed.*

---

## In scope (guardrails)

**Review today**

- IA: Home vs Search vs My Library vs limited Browse-first landing
- User types: guest, freeStingray, freeProvided, subscribed (header, ads, upgrade, provider)
- Continuity: Listen again, mini player, resume paths
- Parity: music, podcasts, radio as peers
- Browse vs Search (type to search, clear to browse; broad vs limited catalog)
- Players + monetization: pre-roll, skip cap, ad placement
- Personalization: populated rails only; Listen again when history exists

**Park (capture, do not debate)**

- Real SSO, App Store, restore purchases
- Ad specs, mediation, final skip-cap policy
- Pixel-perfect Figma unless it blocks a journey
- TV app, Cast/share beyond “flow reserved”

**If sidetracked:** *Parking lot — eyes on [current journey] before time runs out.*

---

## Journeys

### 1. New guest discovers the app (~13 min)

**Setup:** `guest`, broad catalog, no history.

**Story:** Unsigned user opens Home and understands music, podcasts, and radio without searching.

**UX decisions**

- Home is a **sampler**, not the full catalog.
- Non-subscribed: **footer + in-feed + player** ads; music **pre-roll** and **skip cap** for guest/freeStingray.
- Home podcast tiles = **shows**; episodes live in Browse/Search.

**Ask stakeholders**

- Is swimlane **order** (music → podcasts → radio → recommendations) right for first impression?
- Are ad **placements** acceptable vs editorial content?

---

### 2. Returning user resumes listening (~12 min)

**Setup:** Broad; play music, podcast, and radio once so Listen again fills.

**Story:** User with history resumes from Home and keeps listening while browsing elsewhere.

**UX decisions**

- **Listen again** sits above editorial swimlanes when history exists; compact tiles, no labels.
- **One mixed** rail on Home; **typed** history rails in My Library.
- **No Favorites rail** on broad Home — likes in My Library (and limited Browse tabs).

**Ask stakeholders**

- Is one **mixed** Listen again rail enough, or do we need type filters on More?

---

### 3. Intentful discovery (~12 min)

**Setup:** Broad; subscribed optional (less ad noise). Show music browse + live search; one of podcasts or radio.

**Story:** Explorer uses Browse hierarchies; goal-oriented user uses Search and grouped results.

**UX decisions**

- **Browse default**; typing shifts focus to Search; **clear** restores Browse.
- Search results are **global**, not scoped to the active browse tab.
- **Limited catalog:** Browse at `/`, no tab bar; library rails fold into Music \| Podcasts \| Radio tabs.

**Ask stakeholders**

- For **limited** territories, is **no bottom tab bar** OK with Search/Info in the header?
- Is **broad** vibe/tag taxonomy clear vs **limited** genre-only?

---

### 4. My stuff, account, and tiers (~10 min)

**Setup:** Start `subscribed` (clean chrome); switch tiers on `/upgrade`.

**Story:** User manages history, likes, and podcast library; stakeholders see tier differences in chrome and playback.

**UX decisions**

- **My Library** = ownership hub (App Info gear swimlane + user content rails).
- **Home** = daily shortcuts and editorial; broad users get My Library as 4th tab (Info → library redirect).
- Rails appear **only when populated**; history ghosts on first launch.

**Ask stakeholders**

- Is **App Info inside My Library** (vs separate tab) right long-term for broad users?
- Confirm **freeProvided** rules: ads yes, no guest pre-roll/skip cap in prototype — partner expectations?

---

## UX decision scorecard

*Last ~10 min: yes / no / discuss*

1. Home **prioritizes resume** (Listen again) when history exists.
2. **Three content types** are peers on Home and in nav.
3. **Browse vs Search** dual model is the right mental model.
4. **My Library** owns personalized content; broad Home has no Favorites rail.
5. **Tier differences** are obvious in header, footer, and player.
6. **Limited catalog** uses Browse-first landing without a tab bar.
7. Podcast Home = **show** level; empty library rows **hidden**.
8. **Mini player** is the default multitasking pattern above tabs.
9. **Full-screen players** share one shell with type-specific controls.
10. **Ad placement** (footer, in-feed, player) is acceptable for free tiers.

---

_After the session: note scorecard outcomes and parking-lot items in the full guide or team tracker._
