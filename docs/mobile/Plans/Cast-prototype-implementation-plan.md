# Cast prototype (dumb flow) — implementation plan

## Goal

Clickable **UX-only** cast flow: no real discovery, pairing, or network APIs. All dialogs and states are **local React state** (or a small context) so Music, Podcast, and Radio full-screen players stay in sync with the same rules.

## Design source (Figma)

| Step / screen | Node | URL |
|---------------|------|-----|
| Cast to (device list) | `7511:78524` | [Cast to](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=7511-78524) |
| Network Access | `19973:35855` | [Network Access](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19973-35855) |
| Local Network permission | `19973:35892` | [Local Network](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19973-35892) |
| Thumbnail while casting | `19975:36144` | [Cover / casting state](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19975-36144) |
| Casting on (device summary while casting) | `19976:36417` | [Casting on](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=19976-36417) — frame renamed in Figma; URL unchanged |

## Confirmed copy from Figma (implement verbatim unless noted)

### Cast to (`castPopup`)

- Header row: **Cast to** (bold).
- Device rows (icon + label), use `public/videoScreen.svg` for the left icon:
  - Living Room
  - Kitchen
  - Home Cinema

### Network Access

- Title: **Network Access**
- Body (bold lead): **This app needs Local Network Access to Cast**
- Body: **To connect to your devices, this app needs access to your Wi-Fi network.**
- Body: **To Cast, select "OK" when the app asks to connect to your local network.**
- Primary: **OK**
- Secondary: **Cancel** (outline + home icon in Figma; prototype can keep outline + label only if icons are optional)

### Local Network

- Title: **Local Network**
- Body (bold lead): **Allow "Stingray Music" to find devices on local networks?**
- Body: **This will allow the app to connect to speakers and other devices on your Wi-Fi network.**
- Primary: **OK**
- Secondary: **Block**

### Casting on (summary dialog while casting)

- Title: **Casting on** (same wording as thumbnail line 1; aligns with updated Figma `19976:36417`).
- Row: same **videoScreen** icon + selected **device name** (e.g. Living Room).
- Primary: **OK**
- Secondary: **Stop Casting** (outline; optional home icon per Figma)

### Thumbnail overlay

- Line 1: **Casting on**; line 2: **Device name** (dynamic, matches selected device).
- **50% black** scrim on the artwork (`rgba(0,0,0,0.5)`).
- **Figma node `19975:36144`** may show extra stacked overlays; prototype uses the **single 50% scrim** above unless design requests parity with the frame.

## Flow (state machine)

1. User taps **Cast** in the full-screen player header (`cast.svg` via existing mask).
2. Open **Network Access** dialog first.
3. **OK** -> close Network Access, open **Local Network**.
4. **Cancel** on Network Access -> dismiss entire chain; **stay not casting** (abort flow).
5. **OK** on Local Network -> close dialog, open **Cast to** sheet/dialog (fake device list).
6. User taps a **device** -> close Cast to, set **casting = true**, store **selected device name**, show casting UI on full-screen players.
7. While casting:
   - Header icon: **`casting.svg`** instead of cast mask (same mask treatment as `cast.svg`; see Assets).
   - Thumbnail: **50% black** overlay + centered two-line label (**Casting on** / device name).
8. Tapping **casting icon** or **thumbnail** while casting -> **Casting on** summary dialog (same device name).
9. **OK** -> dismiss only (stay casting).
10. **Stop Casting** -> dismiss, **casting = false**, clear device, restore thumbnail and **cast** icon.

**Block** on Local Network -> same as **Cancel** on Network Access: **abort flow**, **stay not casting**.

Scrim-dismiss on **Cast to** without picking a device ends the wizard **without** casting (user already passed permission dialogs).

## Technical approach

### Shared state

Introduce **`CastPrototypeContext`** (or `CastContext`) in `src/context/`:

- `isCasting: boolean`
- `castDeviceName: string | null`
- `startCastFromSelection(deviceName: string)` — called when user picks a device on **Cast to** (after permission dialogs)
- `stopCasting()`
- Optional: `castDialogStep` if you prefer one component to own the wizard instead of nested open flags

Mount the provider in `App.jsx` **inside** the router shell so any full-screen player can `useCastPrototype()`.

Why context: casting must be **global** across Music / Podcast / Radio players and survive route changes if the user navigates while casting (prototype scope: at minimum, consistent state when returning to a player).

### Dialogs UI

Reuse patterns from **`AppStackedDialog`** + `AppStackedDialog.css` where possible:

- **Network Access**, **Local Network**, **Casting on** (summary) match the **strong header** + body + stacked buttons layout (same family as `AccountRequiredDialog` / guest dialogs).

**Cast to** is **not** the same template: it is a **simple list** with a **Cast to** title row (Figma `castPopup`). Options:

- New component **`CastToSheet`** (or bottom-aligned panel) with white panel, rounded corners, list buttons; scrim uses the same full-screen tap target pattern as other modals.
- Or extend a generic **list dialog** component if you want reuse later.

Keep all copy in a small **`src/constants/castPrototypeCopy.js`** (or under `constants/`) for parity with `infoAboutCopy.js`.

### Full-screen players (all three)

Files: `src/pages/MusicPlayer.jsx`, `PodcastPlayer.jsx`, `RadioPlayer.jsx` + shared **`MusicPlayer.css`** (and any player-specific overrides).

- Wire the header **Cast** button: `onClick` starts the wizard (**Network Access** -> **Local Network** -> **Cast to** when not casting). If **isCasting**, open **Casting on** summary dialog instead (or same handler branches).
- Swap icon:
  - Not casting: existing **`PlayerHeaderIcon variant="cast"`** (mask `cast.svg`).
  - Casting: variant **`casting`** with **`mask-image: url("/casting.svg")`** — same **CSS mask + `currentColor`** pattern as idle cast (`casting.svg` uses **`#FAFAFA`** fills like **`cast.svg`**).
- Thumbnail block (inside `.music-player__cover` or equivalent for each player):
  - Wrap image in a **relative** container.
  - When `isCasting`: insert **`::after`** or a **div** with `background: rgba(0,0,0,0.5)` (50% black) covering the image.
  - Absolutely position a **flex column** centered overlay: line 1 / line 2; use tokens from `index.css` for text color (e.g. light on dark).
  - Make the **cover area** a **button** or put a **transparent button** over the cover when casting so **tap targets** match spec (icon **or** thumbnail opens **Casting on** summary). Avoid double navigation: one handler.

### Fake devices

Static array in code or `castPrototypeCopy.js`:

```js
export const CAST_DEVICE_OPTIONS = [
  { id: "living-room", name: "Living Room" },
  { id: "kitchen", name: "Kitchen" },
  { id: "home-cinema", name: "Home Cinema" },
];
```

Selecting a row sets **casting** and stores the device name (**permission dialogs** run before this step).

### Assets

- `public/videoScreen.svg` — device list + **Casting on** summary row icon (black fills; `<img>` or mask as needed).
- `public/cast.svg` — idle cast control; paths use **`fill="#FAFAFA"`** (and stroke on the outer path) for mask luminance.
- `public/casting.svg` — active casting control; **must use the same fill as `cast.svg`** (**`#FAFAFA`** on all paths) so **`mask-image`** + header **`color`** matches the idle cast icon weight and tinting.

## Files likely touched (checklist)

- [x] `src/context/CastPrototypeContext.jsx`
- [x] `src/constants/castPrototypeCopy.js` — dialog strings + device list
- [x] `src/components/CastToDialog.jsx` + `.css`
- [x] `src/components/CastNetworkAccessDialog.jsx`
- [x] `src/components/CastLocalNetworkDialog.jsx`
- [x] `src/components/CastCastingOnDialog.jsx` + `.css` — summary while casting
- [x] `src/components/CastPrototypeDialogs.jsx`
- [x] `src/App.jsx` — provider + render dialog stack
- [x] `src/pages/MusicPlayer.jsx`, `PodcastPlayer.jsx`, `RadioPlayer.jsx` — header + cover
- [x] `src/pages/MusicPlayer.css` — scrim + overlay + `music-player__header-icon-mask--casting`
- [x] `docs/mobile/figma-nodes.md` — cast flow links
- [x] `docs/mobile/Plans/plan.md` — done entry
- [x] `docs/mobile/react-learning.md` — Cast prototype context

## Out of scope (prototype)

- Real Chromecast / AirPlay / DLNA / multicast.
- OS permission APIs and Settings deep links.
- Persisting cast state across refresh (unless you explicitly add `sessionStorage` later).

## Open questions (minor — can default as below)

1. **Mini player:** Not specified; default — **no** cast affordance on mini player; full-screen only.
2. **Guest preroll:** If the player is behind preroll, default — Cast control only after preroll completes (same as other header actions), or enable always; choose one when implementing.

**Decided:** **Cancel** (Network Access) and **Block** (Local Network) **abort the flow** — user remains **not casting**. **Thumbnail line 1** and **summary dialog title** both use **Casting on**. **`casting.svg`** fill matches **`cast.svg`** (`#FAFAFA`).

## Readiness

**Yes — enough information is available** to implement this plan. Remaining defaults (**mini player**, **preroll**) are documented above and do not block implementation.
