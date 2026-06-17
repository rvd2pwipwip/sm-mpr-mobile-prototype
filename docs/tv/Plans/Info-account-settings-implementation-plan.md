# TV Account, Settings, and Info — implementation plan

Living plan for **Account and settings** (broad catalog) and **Info** (limited catalog) in **`apps/tv/`**, mirroring **mobile product behavior** without collapsible sections. Includes **Contact** and **About** drill-ins, a **Subscription stub** for Upgrade CTAs, and relocation of **prototype tier tools** to a title easter egg.

**No Figma reference** for these TV screens — layout follows mobile IA and structure, scaled for 10-foot UI with existing TV overlay / focus patterns.

**Companion docs**

- Mobile Info plan (feature reference): [`docs/mobile/Plans/Info-screen-implementation-plan.md`](../../mobile/Plans/Info-screen-implementation-plan.md)
- Mobile My Library App Info: [`docs/mobile/Plans/My-Library-implementation-plan.md`](../../mobile/Plans/My-Library-implementation-plan.md) (Account tile drill-in)
- TV coordinator: [`plan.md`](./plan.md)
- Focus model: [`vertical-parked-navigation.md`](../vertical-parked-navigation.md)
- User types / ads: [`docs/tv/visual-ads-and-user-types.md`](../visual-ads-and-user-types.md)

---

## Decisions locked (stakeholder review)

| Topic | Choice | TV notes |
|--------|--------|----------|
| **Broad screen** | **Account and settings** — Account + Settings only | Same scope as mobile **`MyLibraryAccountSettings`**; **no** FAQ / Contact / About block on this screen |
| **Limited screen** | **Info** — Account + Settings + Info (help rows) | Same scope as mobile **`Info.jsx`** (all sections visible) |
| **Collapsible sections** | **None on TV** | Static section headings + always-visible bodies; no chevron / toggle |
| **Audio quality** | **Omit on TV** | Settings = **Autoplay** toggle + **Communication preferences** link only |
| **Content column** | **~50% viewport**, horizontally centered | e.g. `max-width: 50vw` (or `min(50vw, …)` if a cap is needed later) inside overlay scroll |
| **Prototype tier UI** | Keep **`/settings/user-type`** (`TvUserTypePreview`) | **Not** linked from info icon or Account tile; reachable via **limited Info** title or **broad My Library** title click (mouse easter egg, `tabIndex={-1}`, not in D-pad order) |
| **Upgrade CTA** | **`/upgrade`** Subscription stub | Replace all navigations that today go to **`/settings/user-type`** for Upgrade (Home header, limited Home Upgrade, podcast player Upgrade, Account section Upgrade buttons, etc.) |
| **FAQ / Contact / About (broad)** | **My Library App Info tiles only** | **`TvLibraryAppInfoSection`** keeps four tiles; Account tile → Account and settings route; FAQ external; Contact / About → in-app routes |
| **FAQ / Contact / About (limited)** | **Info section rows** on **`/info`** | Plus same routes **`/info/contact`**, **`/info/about`** as broad |
| **Contact / About copy** | **Mobile strings** | Import from mobile constants modules (see Phase 5) or promote to **`@sm-mpr/shared`** if duplication is awkward |
| **Back** | **Esc** → `navigate(-1)` | Existing **`GlobalTvKeys`**; limited catalog has no **`PrimaryNav`** on overlay routes |
| **Nav chrome** | **`PrimaryNav` visible** on broad Account and settings + Subscription stub | **`TvShell`** unchanged (nav hidden only on full-screen player routes + limited catalog scope) |

---

## Routes

| Route | Screen | Catalog / entry |
|-------|--------|-----------------|
| **`/info`** | **Info** (3 sections) | Limited home **info icon** |
| **`/my-library/account-settings`** | **Account and settings** (2 sections) | My Library **Account and settings** tile |
| **`/info/contact`** | **Contact us** | Info help row or My Library tile |
| **`/info/about`** | **About** | Info help row or My Library tile |
| **`/upgrade`** | **Subscription stub** | Upgrade buttons app-wide |
| **`/upgrade/store`** | **Upgrade store mock** (optional follow-on) | Primary CTA on Subscription stub — mirror mobile if stub includes “Upgrade now” |
| **`/settings/user-type`** | **Preview user type** (existing) | **Title easter egg** on limited **Info** or broad **My Library** title |

**Broad `/info`:** not registered (mobile redirects broad **`/info`** to My Library). TV has no broad Info hub route.

---

## Mobile vs TV — what to share vs rebuild

| Area | Share | TV-only |
|------|-------|---------|
| Help link paths | `@sm-mpr/shared/constants/infoHelpLinks.js` | — |
| Account copy | `apps/mobile/src/constants/infoAccount.js` | TV layout + `FocusableButton` actions |
| Settings copy (autoplay, comm prefs) | `apps/mobile/src/constants/infoSettings.js` (omit audio constants in UI) | TV toggle + external link row |
| Contact / About copy | `infoContactCopy.js`, `infoAboutCopy.js`, `legalLinks.js` | TV overlay pages + focus |
| External URLs | `@sm-mpr/shared/constants/externalLinks.js` | — |
| User type / tier rules | `@sm-mpr/shared` + existing TV contexts | — |
| Restore purchase prototype | Mobile hook + dialog pattern | TV stacked dialog (reuse **`TvStackedDialog`** or existing player dialog shell) |
| Section components | — | **`TvInfoSection`**, **`TvInfoAccountSection`**, **`TvInfoSettingsSection`**, **`TvInfoHelpSection`** under `apps/tv/src/components/info/` |
| Pages | — | **`TvInfo.jsx`**, **`TvAccountSettings.jsx`**, **`TvInfoContact.jsx`**, **`TvInfoAbout.jsx`**, **`TvSubscription.jsx`** |
| Collapsible shell | — | **Do not port** `InfoCollapsibleSection` |

**Constants strategy:** prefer **importing mobile constant files** from TV for this prototype slice; promote to **`packages/shared`** only if cross-app imports become painful (not required for v1).

---

## Layout and chrome

### Shared page shell

Reuse the **drill / overlay** pattern used by **`MyLibrary`**, **`TvDrillGridPage`**, etc.:

- Outer: `tv-drill-screen tv-screen-overlay` (or `tv-info-screen` alias)
- Header: centered **`tv-screen-header-title`** via **`TvDrillScreenHeader`** (or thin wrapper that adds the title easter egg)
- Scroll: `tv-home__scroll tv-screen-overlay__scroll` + `tv-home__scroll-inner`
- Inner column: **`tv-info-screen__column`** — `width: 100%`, `max-width: 50vw`, `margin-inline: auto`, TV vertical gap between sections

### Section block (static)

Each section:

1. **`h2`** section title (Account / Settings / Info) — typography scaled above mobile (`~1.75–2rem`), bottom border token matching mobile accordion header stroke
2. **Body** — always visible; no `hidden`, no `aria-expanded` toggle

### Title easter egg (prototype entry)

On **`TvInfo`** (limited) and **`MyLibrary`** (broad) screen titles only:

- Wrap the visible title in a **`<button type="button">`** with `tabIndex={-1}`, `onClick={() => navigate('/settings/user-type')}`
- `aria-label` documents prototype entry (e.g. “My Library. Click for prototype settings.”)
- **Not** registered in **`useScreenContentFocus`** — mouse / click only, like **`tv-home-header__wordmark-toggle`**
- **Account and settings** uses a plain non-clickable title

---

## Current TV state (inventory)

| Piece | Status |
|-------|--------|
| Limited home info icon → `/settings/user-type` | **Replace** → `/info` |
| My Library Account tile → `/settings/user-type` | **Replace** → `/my-library/account-settings` |
| Upgrade (broad Home, limited Home, podcast player) → `/settings/user-type` | **Replace** → `/upgrade` |
| `/info/contact`, `/info/about` | **Stub** (`TvSearchRouteStub`) — replace |
| `/settings/user-type` | **Done** — keep; narrow entry to easter egg |
| Real Account / Settings / Info UI | **Not started** |
| `/upgrade` route on TV | **Not started** |

---

## Phase 0 — Subscription stub + Upgrade wiring

**Status: done (2026-06-17).** `TvSubscription` + `TvUpgradeStoreMock`, `useGoUpgrade`, restore dialog; Upgrade CTAs → `/upgrade`.

**Goal:** All Upgrade CTAs land on a real route before Account screens ship.

1. Add **`TvSubscription.jsx`** (+ CSS) — structural parity with mobile **`Subscription.jsx`** at prototype depth:
   - Benefits list, **Upgrade now** (opens signup URL + optional navigate to **`/upgrade/store`** mock), **Provider access**, legal links footer as needed for stub
   - **Exclude** mobile-only blocks that duplicate **`/settings/user-type`** (tier preview toggles, Clear/More seed, content profile) — those stay on user-type page
2. Register **`/upgrade`** in **`App.jsx`**; optional **`/upgrade/store`** mock page (static image like mobile) if primary CTA should complete the flow
3. Add **`useGoUpgrade`** hook on TV (mirror mobile: `navigate('/upgrade')`) or inline navigate in callers
4. Update Upgrade navigations:
   - **`TvHomeHeader`** `handleUpgradeClick`
   - **`TvLimitedHomeHeader`** / **`TvLimitedHomeHeaderStacked`** Upgrade `onSelect`
   - **`PodcastPlayer`** `onUpgradePress` (today also sets `freeStingray` for guest — keep behavior, change destination to `/upgrade`)
   - **`TvPlayerHeaderCenterSlot`** if wired to upgrade
   - Any **`TvUpgradeButton`** `onSelect` that pointed at user-type preview
5. **`TvShell`:** confirm **`PrimaryNav`** stays visible on `/upgrade` (broad); limited catalog users may reach Upgrade from player — nav hidden by catalog scope is OK

**Verify:** Guest on broad Home → Upgrade → Subscription stub; Esc back; tier unchanged unless stub CTAs intentionally change type.

---

## Phase 1 — Routing, shells, navigation entry points

**Status: done (2026-06-17).** `TvInfo`, `TvAccountSettings`, shared shell + title easter egg; entry points wired.

**Goal:** Routes exist; entry points reach correct shells (can use placeholder section bodies briefly).

1. **`TvInfo.jsx`** — limited Info hub (3 section placeholders)
2. **`TvAccountSettings.jsx`** — broad Account and settings (2 section placeholders)
3. Register routes in **`App.jsx`**:
   - `path="/info"` → **`TvInfo`**
   - `path="/my-library/account-settings"` → **`TvAccountSettings`**
4. Update entry points:
   - **`TvLimitedHomeHeader`** + **`TvLimitedHomeHeaderStacked`**: info icon → **`/info`**
   - **`TvLibraryAppInfoSection`**: Account tile → **`MY_LIBRARY_ACCOUNT_SETTINGS_PATH`** (`/my-library/account-settings` from shared **`infoHelpLinks.js`**)
5. Remove **`/settings/user-type`** from public navigation paths (grep cleanup); update **`LimitedHome.jsx`** prototype hint text if it mentions info icon → user-type
6. Wire **title easter egg** on **Info** (limited) and **My Library** (broad) titles → **`/settings/user-type`**; Account and settings uses a plain title
7. Apply **50vw centered column** + overlay shell CSS

**Verify:** Limited info icon → Info screen with title; click Info title (mouse) → user-type preview; My Library Account tile → Account and settings (plain title); click My Library title (mouse) → user-type preview; Esc returns.

---

## Phase 2 — Static section components + Account block

**Status: done (2026-06-17).** `TvInfoAccountSection` with four user types, D-pad focus, restore dialog.

**Goal:** Account section matches mobile four user types; D-pad focus for actions.

1. **`TvInfoSection.jsx`** — presentational wrapper (`title` + `children`, border under title)
2. **`TvInfoAccountSection.jsx`** — port logic from mobile **`InfoAccountSection.jsx`**:
   - Headline / subline / provider logos per **`INFO_ACCOUNT_COPY`**
   - Actions: Upgrade → **`useGoUpgrade`**, Restore purchase dialog, Create account / Log in / Provider access / Manage account / Log out
   - Use **`FocusableButton`**, **`TvUpgradeButton`**, external links with `target="_blank"` + `rel="noopener noreferrer"`
3. **`TvRestorePurchasePrototypeDialog`** (or reuse existing TV dialog primitive)
4. Focus layout: one **`useScreenContentFocus`** group per section (or flattened item counts); vertical scroll via **`useTvVerticalGroupScroll`** if multiple groups

**Verify:** Cycle user type on **`/settings/user-type`** (easter egg); Account block on Info / Account and settings updates; all buttons focusable and activatable.

---

## Phase 3 — Settings section (no audio quality)

**Status: done (2026-06-17).** `TvInfoSettingsSection` with autoplay toggle and communication preferences link; focus groups after Account.

**Goal:** Autoplay + Communication preferences only.

1. **`TvInfoSettingsSection.jsx`** — port from mobile **`InfoSettingsSection.jsx`** **minus** audio quality row, expand/collapse, and upsell dialog
2. **Autoplay:** checkbox-as-switch (local `useState`); TV-sized track; focusable toggle (single focus slot or native checkbox with visible focus ring per TV pattern)
3. **Communication preferences:** external link row with open-in-new affordance; focusable
4. Register focus indices after Account group

**Verify:** Autoplay toggles visually; comm prefs opens URL in new tab; no audio quality UI anywhere on TV Info flows.

---

## Phase 4 — Info help section (limited only)

**Goal:** Third section on **`/info`** only.

1. **`TvInfoHelpSection.jsx`** — port from mobile **`InfoHelpSection.jsx`**:
   - FAQ → external (`INFO_FAQ_HREF`)
   - Contact us → navigate **`/info/contact`**
   - About → navigate **`/info/about`**
2. Focusable rows (3 items); chevron on internal rows, external icon on FAQ
3. **`TvAccountSettings`** does **not** mount this section

**Verify:** Limited `/info` shows three sections stacked; broad Account and settings shows two only; My Library tiles still reach Contact / About on broad.

---

## Phase 5 — Contact and About TV pages

**Goal:** Replace stubs with real copy from mobile.

1. **`TvInfoContact.jsx`** — body from **`infoContactCopy.js`**; overlay header title **Contact us**; title easter egg **not** required on sub-pages
2. **`TvInfoAbout.jsx`** — wordmark pair, version, copyright, trademark, legal buttons from **`infoAboutCopy.js`** + **`LEGAL_LINKS`**
3. Shared sub-page layout: **`tv-info-sub-page`** — same **50vw** centered column, scroll under **`TvDrillScreenHeader`**
4. Replace **`TvSearchRouteStub`** routes in **`App.jsx`**
5. Focus: static text not focusable; mailto / legal links / back via Esc sufficient for v1 (optional focusable legal buttons if time)

**Verify:** From limited Info or My Library → Contact / About; content matches mobile; Esc back to previous screen.

---

## Phase 6 — `TvUserTypePreview` cleanup + docs

**Goal:** Prototype page is clearly secondary; docs updated.

1. **`TvUserTypePreview`**: remove any copy implying it is the main Account screen; optional subtitle “Prototype only”
2. Keep **Back** focus button; ensure page still works when opened from title easter egg
3. **`docs/tv/react-learning.md`**: entries for static Info sections, 50vw column, title easter egg, Upgrade → Subscription
4. **`docs/tv/Plans/plan.md`**: add link under next / in progress
5. Grep: no remaining user-facing paths to **`/settings/user-type`** except easter egg + direct URL bookmark

---

## D-pad focus notes

- **Section titles** are not focus targets (headings only)
- **Order:** Account actions (top → bottom) → Settings controls → Info rows (limited only)
- **Esc:** `GlobalTvKeys` → `navigate(-1)` from Info, Account and settings, Contact, About, Subscription
- **PrimaryNav:** broad routes — Left from first focus item enters nav per existing **`useTvNavFocus`** / screen focus contract
- **Limited `/info`:** no side nav; first focus item is first Account control

---

## Verification checklist (manual)

- [ ] **Limited:** info icon → **`/info`**; three expanded sections; no collapse controls
- [ ] **Broad:** My Library Account tile → **`/my-library/account-settings`**; two sections only
- [ ] **Broad:** FAQ / Contact / About **not** on Account and settings; still on My Library App Info tiles
- [ ] **Title click** (mouse) on **Info** or **My Library** → **`/settings/user-type`**; title **not** in D-pad order; Account and settings title is **not** clickable
- [ ] **Upgrade** from Home / limited Home / podcast player → **`/upgrade`**, not user-type preview
- [ ] **All four user types** show correct Account copy and actions
- [ ] **Settings:** Autoplay + Communication preferences only; **no** Audio quality
- [ ] **Column** reads at ~half screen width, centered
- [ ] **Contact / About:** mobile copy; Esc back
- [ ] **Restore purchase** dialog works from Account (guest / free Stingray)

---

## Implementation order (recommended)

1. Phase 0 — Subscription stub + Upgrade rewiring  
2. Phase 1 — Routes, shells, entry points, title easter egg, layout column  
3. Phase 2 — Account section + focus  
4. Phase 3 — Settings section (no audio)  
5. Phase 4 — Info help section (limited)  
6. Phase 5 — Contact + About pages  
7. Phase 6 — Prototype page copy + docs  

---

*Created: 2026-06-17 — TV Account / Settings / Info scope; locked decisions from UX review.*
