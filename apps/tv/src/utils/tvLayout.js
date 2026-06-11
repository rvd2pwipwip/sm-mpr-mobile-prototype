/** Read fixed card width from CSS tokens (default 308). */
export function getTvCardSize() {
  if (typeof window === "undefined") return 308;
  const raw = getComputedStyle(document.documentElement).getPropertyValue(
    "--tv-card-size",
  );
  const parsed = parseInt(raw, 10);
  return Number.isNaN(parsed) ? 308 : parsed;
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
