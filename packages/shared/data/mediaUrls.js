/**
 * Prototype cover art URLs — remote (picsum) or local `/media/...` when
 * `VITE_OFFLINE_MEDIA=true` by default (see `docs/mobile/offline-demo.md`, `npm run media:sync`).
 */

/** @returns {boolean} */
export function useOfflineMedia() {
  return import.meta.env?.VITE_OFFLINE_MEDIA === "true";
}

/**
 * @param {string} segment Path under `/media/` (e.g. `music/512`).
 * @param {string} id Stable catalog id.
 * @param {string} [ext]
 */
export function localMediaUrl(segment, id, ext = "jpg") {
  return `/media/${segment}/${encodeURIComponent(id)}.${ext}`;
}

/** @param {string} seed */
export function picsumSquareUrl(seed, size) {
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/${size}/${size}`;
}

/** Deterministic placeholder art (square music channel). */
export function channelThumbnailUrl(channelId) {
  if (useOfflineMedia()) {
    return localMediaUrl("music/512", channelId);
  }
  return picsumSquareUrl(channelId, 512);
}

/** Large square show art */
export function podcastThumbnailUrl(podcastId) {
  if (useOfflineMedia()) {
    return localMediaUrl("podcasts/show/600", podcastId);
  }
  return `https://picsum.photos/seed/${encodeURIComponent(`pod-${podcastId}`)}/600/600`;
}

/** Episode rows reuse show art (offline demo + simpler catalog). */
export function episodeThumbnailUrl(podcastId, _episodeId) {
  return podcastThumbnailUrl(podcastId);
}

/** Square station art */
export function radioStationThumbnailUrl(stationId) {
  if (useOfflineMedia()) {
    return localMediaUrl("radio/512", stationId);
  }
  return picsumSquareUrl(`radio-${stationId}`, 512);
}
