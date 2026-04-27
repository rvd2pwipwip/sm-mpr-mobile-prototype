# Visual ads and user types (prototype)

This note ties **`UserTypeContext`** to **footer ad placeholders** and documents how the clickable prototype behaves. **Product source:** narrative in **`docs/Home-screen-story.md`** (footer ads, swimlane ads, subscribed users without ads).

## User types in code

| `userType` (state) | Meaning in prototype | Header (see `HomeHeader`) | Visual ad strip (footer) |
|--------------------|----------------------|---------------------------|---------------------------|
| `guest` | Unsigned / not provided | **Upgrade** CTA | **Shown** — under bottom tabs, in-feed banner on Home, player footer strip |
| `provided` | Access via provider (cable / partner stub) | **Provider** pill | **Shown** (same as guest for banner + footer strip) |
| `subscribed` | Paying / entitled subscriber | Centered wordmark only | **Hidden** — more vertical room for content |

**Helpers** (`src/utils/showVisualAds.js`):

- **`showVisualAds(userType)`** — `true` for **`guest`** and **`provided`**, `false` for **`subscribed`** (footer strip, in-feed banner, player footer strip).
- **`showPlayerPreroll(userType)`** — `true` only for **`guest`** today: full-screen **15s** countdown before the **music** player UI is usable; **`provided`** / **`subscribed`** skip pre-roll. Podcast / radio play entry points should reuse **`PlayerPrerollAd`** when those stacks exist.

### Figma / product vocabulary (future refinement)

The story also names **freeStingray** (account, no subscription) and **freeProvider** (provider access). This repo collapses those into **`guest`** and **`provided`** for layout toggles. If ads should differ between “freeStingray” and “freeProvider”, extend `userType` or add flags and update `showVisualAds` — **not** implemented yet.

## Where ads render

1. **`BottomNav`** — Below the tab row, same frosted bar (`--color-nav-bar-bg` + blur). Only when `showVisualAds(userType)`.
2. **`MusicPlayer`** — Bottom of the player body (full-bleed vs content inset via **`VisualAdStrip`** `variant="player"`). Hidden when `!showVisualAds(userType)`. Bottom tab bar is already hidden on **`/music/…/play`**.
3. **Home in-feed banner** — **`SwimlaneBannerAd`**: scrolls with content inside **`.content-inset`**, below **`HomeBanner`**, when `showVisualAds(userType)`. Figma reference: [in-feed banner `13548:75362`](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=13548-75362).
4. **Player pre-roll (guest only)** — **`PlayerPrerollAd`**: fixed overlay above player chrome (`--z-player-preroll`), **15s** countdown, subtle **Skip** (prototype). Shown when `showPlayerPreroll(userType)` on **`/music/:channelId/play`**. **`MusicPlayerRoute`** in **`App.jsx`** remounts **`MusicPlayer`** with **`key={channelId-userType}`** so pre-roll and transport state reset per channel and when previewing types on **`/upgrade`**. Playback UI stays **paused** until pre-roll completes or skip.

Shared strip UI: **`src/components/VisualAdStrip.jsx`** + **`VisualAdStrip.css`**.  
Pre-roll: **`src/components/PlayerPrerollAd.jsx`**.  
In-feed banner: **`src/components/SwimlaneBannerAd.jsx`**.

## Layout / scroll padding

**`--bottom-nav-stack-height`** in **`src/index.css`** includes **`--bottom-nav-ad-height`** (default `0`). **`VisualAdsHtmlSync`** sets **`data-visual-ads`** on **`<html>`** when ads are on, which sets **`--bottom-nav-ad-height`** to **`--visual-ad-strip-min-height`** (`86px`). **`.app-shell`** and **`.home-body-scroll`** use the stack height so the last swimlane can scroll clear of tabs **and** the ad strip.

## Mini player (not built)

When a mini player exists above the tabs, **`Home-screen-story.md`** says the footer stack grows again; this prototype does **not** model mini player height yet — only tabs + optional ad strip.
