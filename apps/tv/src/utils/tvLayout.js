/** Read fixed card width from CSS tokens (default 308). */
export function getTvCardSize() {
  if (typeof window === "undefined") return 308;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-card-size",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 308 : parsed;
}

/** Compact square tile (Listen again — labels hidden). */
export function getTvCardSizeCompact() {
  if (typeof window === "undefined") return 192;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-card-size-compact",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 192 : parsed;
}

/** Read card row gap from CSS tokens (default 30). */
export function getTvCardGap() {
  if (typeof window === "undefined") return 30;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-space-card-gap",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 30 : parsed;
}

/** Leading gutter for full-bleed swimlane tracks (teritory-aware). */
export function getTvSwimlaneInlineStart() {
  return readCssPx("--tv-swimlane-inline-start", 140);
}

/** Trailing gutter for swimlane bleed / parking math (teritory-aware). */
export function getTvSwimlaneInlineEnd() {
  return readCssPx("--tv-swimlane-inline-end", 100);
}

/**
 * Content width inside Home inset padding (`tv-home__content-inset` / swimlane gutters).
 *
 * @param {number} [viewportWidth] — scrollport width (default `--tv-viewport-width`)
 */
export function getTvHomeContentWidth(viewportWidth) {
  const width = viewportWidth ?? readCssPx("--tv-viewport-width", 1920);
  return width - getTvSwimlaneInlineStart() - getTvSwimlaneInlineEnd();
}

/**
 * Home Listen again card size so {@link TV_HOME_LISTEN_AGAIN_VISIBLE_SLOTS} tiles
 * fit the inset content width (items, ghosts, and Clear/More share one size).
 *
 * @param {number} visibleSlots
 * @param {number} [viewportWidth]
 */
export function getTvHomeListenAgainCardSize(
  visibleSlots,
  viewportWidth,
) {
  const cardGap = getTvCardGap();
  const availableWidth = getTvHomeContentWidth(viewportWidth);
  const slots = Math.max(1, visibleSlots);
  return Math.floor((availableWidth - (slots - 1) * cardGap) / slots);
}

/**
 * How many equal-width swimlane slots fit in the scrollport at once.
 * Used to size ghost fillers so Clear/More stays on screen when history is short.
 *
 * @param {number} [slotWidth] — card width (default {@link getTvCardSize})
 * @param {number} [viewportWidth] — scrollport width (default `--tv-viewport-width`)
 */
export function getTvSwimlaneVisibleSlotCapacity(
  slotWidth,
  viewportWidth,
) {
  const cardSize = slotWidth ?? getTvCardSize();
  const cardGap = getTvCardGap();
  const inlineStart = getTvSwimlaneInlineStart();
  const inlineEnd = getTvSwimlaneInlineEnd();
  const width =
    viewportWidth ?? readCssPx("--tv-viewport-width", 1920);
  const available = width - inlineStart - inlineEnd;
  if (available <= 0) return 1;
  return Math.max(
    1,
    Math.floor((available + cardGap) / (cardSize + cardGap)),
  );
}

function readCssPx(token, fallback) {
  if (typeof window === "undefined") return fallback;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(token);
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

/** Default column count for TV browse / Search drill grids (cards sized to fit, no horizontal scroll). */
export const TV_BROWSE_GRID_COLUMNS = 5;

/** Content width for grids inside the TV shell (nav + horizontal insets). */
export function getTvBrowseGridAvailableWidth() {
  const viewportWidth = readCssPx("--tv-viewport-width", 1920);
  const navWidth = readCssPx("--nav-width", 48);
  const paddingStart = readCssPx("--tv-content-inline-start", 140);
  const paddingEnd = readCssPx("--tv-content-inline-end", 100);
  return viewportWidth - navWidth - paddingStart - paddingEnd;
}

/**
 * Five-column browse grid: card width is computed so the row fits the content area
 * (focus rings stay inside the scrollport; no horizontal parking).
 */
export function getTvBrowseGridLayout() {
  const columns = TV_BROWSE_GRID_COLUMNS;
  const cardGap = getTvCardGap();
  const availableWidth = getTvBrowseGridAvailableWidth();
  const cardSize = Math.floor(
    (availableWidth - (columns - 1) * cardGap) / columns,
  );
  return { columns, cardGap, cardSize, availableWidth };
}

/**
 * Grid columns for legacy More screens on 1920x1080.
 * Available width = viewport - nav rail - content insets; floor fit for 308px cards + 30px gaps.
 * At default tokens: 1920 - 48 nav - 140 start - 100 end = 1632px => 4 columns.
 */
export function getTvGridColumnCount() {
  const cardSize = getTvCardSize();
  const cardGap = getTvCardGap();
  const availableWidth = getTvBrowseGridAvailableWidth();
  const columns = Math.floor((availableWidth + cardGap) / (cardSize + cardGap));
  return Math.max(3, columns);
}

/** @returns {{ cardSize: number, cardGap: number, columns: number, availableWidth: number }} */
export function getTvGridLayout() {
  const cardSize = getTvCardSize();
  const cardGap = getTvCardGap();
  const columns = getTvGridColumnCount();
  const availableWidth = getTvBrowseGridAvailableWidth();
  return { cardSize, cardGap, columns, availableWidth };
}
