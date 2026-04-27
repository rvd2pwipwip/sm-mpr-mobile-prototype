# UX SM MPR Mobile 2604 — Figma node map

Quick reference for MCP and design-to-code: paste these URLs in Cursor when you need `get_design_context` for a specific frame or component.

The design file assumes a 460 x 990 screen size. That size should be used for the prototype even if minor layout deviations are fine unless I call something out.

## Design notes

This project's content scope and user mode requirements have changed a lot through the last 2 years which explains why its current Figma design file (referenced below) has some inconsistencies. The project was originally meant to replace an existing mobile app due to its obsolete technical stack (mainly Xamarin).

The Xamarin app only streamed music (no podcasts nor radio back then) but offered 1000+ channels on certain territories and supported a plethora of user access methods such as time-limited guest (free) access, B2C user subscriptions, cable providers access through channel watermarking, providers SSO access and other special cases.

Today's content scope for this project adds podcasts and radio to the types of streaming content but reduces the number of music channels to about 150 channels in most territories with US/Canada being the exception with 1000+ channels.

For most territories, the music offer is very similar to our current in-car implementation (about 150 channels).
The design file used for the in-car implementation is [SM HTML InCar MPR](https://www.figma.com/design/sMhTukUlNNedadBSyRnOq5/SM-HTML-InCar-MPR?node-id=0-1&p=f&t=rnDXCTVDcuxo9aMq-0).

Here is a reference to an HTML implementation (note that this implementation lacks Radio support but the Music channels and podcasts are a good reference for this mobile project): [https://music-in-car-html-prod.stingray.com/](https://music-in-car-html-prod.stingray.com/)

For US/Canada, the music offer (1000+ channels) is more similar to our current online web app ([https://webplayer.stingray.com/en/play/browse](https://webplayer.stingray.com/en/play/browse))

The in-car implementation doesn't have any user mode but our mobile prototype needs to implement:
1- guest (ad supported free streaming)
2- provided (ads for some providers, provider SSO login)
3- subscribed (no ads, B2C subscription user login)

Ads are going to be both audio (pre/post roll) and visual (banners). For the needs of this UX/UI prototype, the only ad free users will be the subscribed ones.

## Design file

- [UX SM MPR Mobile 2604 (file / Mobile Portrait)](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=0-1&p=f&t=NvKDs20ElRoIwSUC-0)

## Components

- [Button / md — CTA + secondary (subscribe pattern)](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19726-48115) — `src/components/Button.jsx` + `index.css` button tokens

## Screens

- [Home](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=1-2&t=NvKDs20ElRoIwSUC-0)
- [Search & Browse, 150+ channels](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=270-45400&t=NvKDs20ElRoIwSUC-0)
- [Search & Browse, 1000+ channels](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19553-131521&t=NvKDs20ElRoIwSUC-0)
- [App Info](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=7-3024&t=NvKDs20ElRoIwSUC-0)
- [Music Player](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-20013&t=NvKDs20ElRoIwSUC-0)
- [Channel Info](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=25-7067&t=NvKDs20ElRoIwSUC-0)
- [Subscription (Upgrade)](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=220-40551&t=NvKDs20ElRoIwSUC-0)
- [Log in](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5638-214108&t=NvKDs20ElRoIwSUC-0)
- [View More grid](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=23-17518&t=NvKDs20ElRoIwSUC-0)
- [Subfilter grid](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=49-332563&t=NvKDs20ElRoIwSUC-0)
- [Search results](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=61-26534&t=NvKDs20ElRoIwSUC-0)

## Radio mock data — International (TODO)

Prototype catalog: `src/data/radioStations.js`.

**Near-term:** International is modeled like the other browse rows—**20 flat stations** under the `international` category so screens can ship without geo drilling.

**Later:** International should gain an extra content level: **continents** (Africa, Asia, Australasia, Central America, Europe, North America, South America), then **countries**, **regions**, and **cities** under those. When that UX exists, refactor mock data (and any routes) to nest stations under `continent → … → city` instead of a single flat list. The repo exports `INTERNATIONAL_CONTINENTS_PLANNED` as a reminder of the continent set; it is not wired into `RADIO_STATIONS` yet.
