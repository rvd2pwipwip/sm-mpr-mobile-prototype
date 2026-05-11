# Info tab — implementation plan

Plan for the **Info** main screen, nested **Contact Us** and **About** screens, and **`freeProvided`** rename. **Do this doc first**, then implement in the phases below. Product context for user-type chrome: **`docs/Stories/Home-screen-story.md`**, **`docs/visual-ads-and-user-types.md`**.

---

## Decisions (from UX; locked for build)

1. **`freeProvided`** in code (formerly `provided`; aligns with **`freeStingray`**). Behavior unchanged: provider SSO tier, **Provider** header pill, ads on, no music preroll, no guest skip cap.
2. **`freeStingray`** — already in **`UserTypeContext`**; Account section will vary by all four types: **`guest`**, **`freeStingray`**, **`freeProvided`**, **`subscribed`**.
3. **Collapsible sections** on **`/info`**: **Account**, **Settings**, **Info**. **Default:** only **Account** expanded on first load. **Several sections may be open** at once (accordion does not close others).
4. **Contact Us** and **About** are **full-height stack screens** with **`ScreenHeader`** (**back** in **`startSlot`**, title centered). **`BottomNav` stays visible** (same as **`Subscription`**: only **music / podcast / radio `…/play`** routes hide the tab bar in **`App.jsx`**).
5. **Remove** **`Info`** mini player **Podcast bar / Radio bar / Clear** demo block — **done in Phase 1** (real flows live under Home / Search / **`/podcast/*`** / **`/radio/*`**).
6. **External links:** use **real Stingray URLs when they appear in the referenced Figma nodes** during implementation; otherwise **`#`** or a short comment placeholder **with rel noopener** on real `<a href>`. **Terms** and **Privacy** reuse existing constants from **`Subscription.jsx`** (`TERMS_URL`, `PRIVACY_URL`).
7. **About / Contact copy:** mirror **strings** from Figma [**About / contact block `5683:78191`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78191&t=RTnR7veKdkyVrhHy-4) (and related frames as needed when pulling **`get_design_context`**).

---

## Figma references

| Area | Node(s) | Notes |
|------|---------|--------|
| Info — Account variants | [**`5518:74009`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5518-74009&t=RTnR7veKdkyVrhHy-4) | Per user type rows / actions |
| Contact Us screen | [**`5683:78189`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78189&t=RTnR7veKdkyVrhHy-4) | In-app stack |
| About screen | [**`5683:78416`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78416&t=RTnR7veKdkyVrhHy-4) | In-app stack |
| About / contact strings | [**`5683:78191`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78191&t=RTnR7veKdkyVrhHy-4) | Copy source of truth |
| Audio quality — row UI | [**`5689:80694`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5689-80694&t=RTnR7veKdkyVrhHy-4) | Settings section |
| Audio quality — segmented control | [**`5689:80479`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5689-80479&t=RTnR7veKdkyVrhHy-4) | Match **Search** browse pill switcher |
| Audio quality — labels / values | [**`5689:80689`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5689-80689&t=RTnR7veKdkyVrhHy-4) | Segment ids + visible strings |

Add these to **`docs/figma-nodes.md`** when implementation starts.

---

## Phase 0 — Rename `provided` to `freeProvided`

**Status: done (2026-05-11).** Code and docs now use **`freeProvided`**; the string **`"provided"`** is no longer a **`userType`** value.

**Goal:** One mechanical rename so **`UserTypeContext`** and helpers stay consistent with **`freeStingray`**.

- Replace string **`"provided"`** with **`"freeProvided"`** everywhere in **`src/`** (Subscription **`setUserType`**, preview toggles, **`HomeHeader`**, **`showVisualAds`**, docs references in code comments if any).
- Update **`docs/visual-ads-and-user-types.md`**, **`docs/react-learning.md`**, **`docs/Plans/plan.md`**, tutorials/plans that list user types, and **`docs/Stories`** lines that name **`provided`** as the code value (keep product words **free provider** where the story uses them).
- **`Subscription.jsx`**: **Select provider** CTA sets **`freeProvided`**; label in **Preview as** e.g. **Free provider** or **Provider** (match Figma / existing copy).
- **Regression:** **`npm run build`**, smoke **Home header**, **Upgrade** preview toggles, **music preroll** (still guest + freeStingray only), **ads** for all non-subscribed types.

---

## Phase 1 — Routing and shells

**Status: done (2026-05-11).** Routes registered; **`InfoContact`** / **`InfoAbout`** use **`ScreenHeader`** + shared **`InfoSubPage.css`** scroll; **`BottomNav`** keeps **Info** active for **`/info/*`**; **`Info`** root no longer includes mini player demos.

- **`/info`** — replace stub in **`Info.jsx`**: **`main.app-shell`** + scroll region + **`content-inset`** (match other tab pages).
- **`/info/contact`** — **`InfoContact.jsx`** (or **`InfoContactUs.jsx`**) with **`ScreenHeader`** + back **`navigate(-1)`**.
- **`/info/about`** — **`InfoAbout.jsx`** with **`ScreenHeader`** + back.
- Register routes in **`App.jsx`** **before** or **after** **`/info`** as needed so **`/info/contact`** does not conflict (explicit **`Route path="/info/contact"`** and **`/info/about`**).

No change to **`hideBottomNavForPath`** unless a future overlay requires it (not planned).

---

## Phase 2 — Collapsible main sections

**Status: done (2026-05-11).** **`InfoCollapsibleSection`** (`button` header + **`hidden`** panel, **`aria-expanded`**, **`role="region"`**); **`Info.jsx`** state **`{ account: true, settings: false, info: false }`**; independent toggles.

- New small presentational pieces (one file or split): **section header** (title + chevron / tap target), **body** slot, **`aria-expanded`** on the header **`button`**.
- Local state: three booleans **or** a `Set` / record; **initial:** `{ account: true, settings: false, info: false }`.
- Tokenized spacing: reuse **`--space-content-inline`**, **`--space-screen-gap`**; no one-off horizontal padding on the outer shell.

---

## Phase 3 — Account section (user-type variants)

**Status: done (2026-05-11).** **`InfoAccountSection`** maps **`useUserType()`** to Figma **`5518:74009`** (guest / **freeStingray** / **freeProvided** / **subscribed**); shared URLs in **`src/constants/externalLinks.js`**; copy stub in **`src/constants/infoAccount.js`**. **Log out** resets prototype to **`guest`**.

- Drive UI from **`useUserType()`**.
- Map each type to the layouts in Figma **`5518:74009`** (sign-in / upgrade / provider badge / subscription summary — whatever the frame defines).
- Use existing **`Button`**, **`UpgradeButton`** / **`navigate('/upgrade')`** only where Figma matches current patterns; fake email or “Signed in as …” strings as stub data objects in **`src/data/`** or a tiny **`infoAccountCopy.js`** if it keeps **`Info.jsx`** readable.

---

## Phase 4 — Settings section

**Status: done (2026-05-11).** **Autoplay** checkbox-as-switch (`useState`) + description Figma **`5518:74294`**. **Audio Quality** row **always visible**; **subscribed** / **freeProvided** toggle inline **`SearchBrowseContentSwitcher`**; **guest** / **freeStingray** open **`AppStackedDialog`** upsell (**Figma `9585:70503`**). **Communication preferences** — Figma **`5518:74308`**. Shared modal shell: **`AppStackedDialog`** (**`GuestSkipLimitDialog`** refactored).

---

## Phase 5 — Info section (rows on main screen)

**Status: done (2026-05-11).** **`InfoHelpSection`**: **FAQ** (`INFO_FAQ_HREF` in **`src/constants/infoHelpLinks.js`**, placeholder until Figma URL); **Contact us** **`Link`** **`/info/contact`**; **About** **`Link`** **`/info/about`**. Row chrome matches Settings external / drill-in list.

- **FAQ** — external link (URL from Figma or placeholder).
- **Contact Us** — **`Link`** / **`navigate`** to **`/info/contact`**.
- **About** — navigate to **`/info/about`**.

---

## Phase 6 — About screen content

**Status: done (2026-05-11).** **`InfoAbout.jsx`** matches [**`5683:78416`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78416) (wordmark pair, version, copyright, trademark copy, outline legal buttons). **`legalLinks.js`** holds **`TERMS_URL`** / **`PRIVACY_URL`** and **`LEGAL_LINKS`**; **`Subscription.jsx`** maps the same list. **Contact Us body** from [**`5683:78191`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78191) is in **`InfoContact.jsx`** + **`infoContactCopy.js`** (listed here because the plan originally grouped that copy with About legal links).

- Blocks from [**`5683:78191`**](https://www.figma.com/design/duguG08ZOCWXQemLw59XJW/UX-SM-MPR-Mobile-2604?node-id=5683-78191&t=RTnR7veKdkyVrhHy-4): **contact info** (static prototype copy).
- **Terms and Conditions** — same **`TERMS_URL`** as **`Subscription.jsx`**.
- **Privacy Policy** — same **`PRIVACY_URL`** as **`Subscription.jsx`**.
- Shared **`LEGAL_LINKS`** constant (optional refactor): export from one module (e.g. **`src/constants/legalLinks.js`**) and import in **`Subscription.jsx`**, **`InfoAbout.jsx`** to avoid drift.

---

## Phase 7 — Cleanup and docs

- **`Info.jsx`** playback demos removed in **Phase 1**; confirm **`Info.css`** has no orphaned rules.
- **`docs/react-learning.md`**: short entry for collapsible **`details`-like** pattern and Info routes (**done** for Phase 2 collapsibles + Phase 1 routes).
- **`docs/Plans/plan.md`**: move **Info** from backlog to **done** with checkbox and link here.
- **Optional** story file **`docs/Stories/Info-story.md`** later — not required for first ship if Figma + this plan are enough.

---

## Verification checklist (manual)

- [ ] **`/info`**: Account open only by default; Settings + Info can open together with Account.
- [ ] All four **Preview as** types on **`/upgrade`** show correct **Account** chunk.
- [ ] **Audio Quality** row visible for all user types; **guest** / **freeStingray** open upsell dialog; **subscribed** / **freeProvided** expand the quality switcher.
- [ ] **Contact** / **About**: back returns to previous history entry; tabs still visible.
- [ ] **Terms** / **Privacy** open in new tab with **noopener**.
- [ ] No mini player demo buttons on **Info**.

---

## Implementation order (recommended)

0. **`freeProvided`** rename (avoid building Info on old string).  
1. Routes + **About** + **Contact** placeholders (navigation wiring).  
2. Collapsible shell + **Settings** + **Info** rows (autoplay, links).  
3. **Account** variants + **Audio quality** (switcher integration).  
4. Polish from Figma + **`figma-nodes.md`** + **`plan.md`** update.

---

*Created: 2026-05-11 — Info tab scope + Figma links + locked decisions before code.*
