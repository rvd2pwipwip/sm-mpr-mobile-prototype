# Visual ads and user types (TV prototype)

Tier rules are **shared with mobile** via **`@sm-mpr/shared/utils/userTierRules.js`**. Product narrative: **`docs/mobile/visual-ads-and-user-types.md`** and **`docs/mobile/Stories/Home-screen-story.md`**.

## User type preview

Route **`/settings/user-type`** — four toggles (`guest`, `freeStingray`, `freeProvided`, `subscribed`). Home **Upgrade** opens this screen (prototype stand-in for mobile **`/upgrade`**).

## Where ads render on TV

| Placement | Component | When |
|-----------|-----------|------|
| **Footer band** | `TvFooterAdBanner` in `TvShell` | **Limited catalog** only; `showVisualAds(userType)` |
| **Home in-feed banner** | `TvSwimlaneBannerAd` on broad + limited Home | `showVisualAds(userType)`; between **Popular podcasts** and **Top radio** on broad Home |
| **Scroll reserve** | `TvVisualAdsHtmlSync` + `--tv-scroll-ad-reserve` | Limited catalog footer slot only (`html[data-visual-ads]`) |

**Subscribed:** no in-feed banner (footer also hidden when that ships).

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
