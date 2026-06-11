# Visual ads and user types (TV prototype)

Tier rules are **shared with mobile** via **`@sm-mpr/shared/utils/userTierRules.js`**. Product narrative: **`docs/mobile/visual-ads-and-user-types.md`** and **`docs/mobile/Stories/Home-screen-story.md`**.

## User type preview

Route **`/settings/user-type`** — four toggles (`guest`, `freeStingray`, `freeProvided`, `subscribed`). Home **Upgrade** opens this screen (prototype stand-in for mobile **`/upgrade`**).

## Where ads render on TV

| Placement | Component | When |
|-----------|-----------|------|
| **Player preroll** | `TvPlayerPrerollAd` on `/music/:channelId/play` | `showPlayerPreroll(userType)` — **guest** and **freeStingray** only; 15s countdown + Skip |
| **Home in-feed banner** | `TvSwimlaneBannerAd` on broad + limited Home (stacked layout B) | `showVisualAds(userType)`; between **Popular podcasts** and **Top radio** on broad Home |

**Subscribed:** no in-feed banner.

## Home swimlanes (broad)

Matches mobile broad Home ordering (music-first slice):

1. Promo banner  
2. Most popular music  
3. Popular podcasts in your area  
4. In-feed banner ad (non-subscribed)  
5. Top radio stations  
6. Recommendations  

Podcast/radio tiles navigate to **Search** until those flows exist on TV.

## Header chrome

`TvHomeHeader` mirrors mobile **`HomeHeader`**: Upgrade for **guest** / **freeStingray**, provider logos for **freeProvided**, wordmark-only for **subscribed**.
