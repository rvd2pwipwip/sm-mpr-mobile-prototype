/** @param {number} totalSec */
export function formatPlaybackClock(totalSec) {
  if (!Number.isFinite(totalSec) || totalSec <= 0) {
    return "0:00";
  }
  const s = Math.min(Math.floor(totalSec), 86400);
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = s % 60;
  if (h > 0) {
    return `${String(h)}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
  }
  return `${String(m)}:${String(sec).padStart(2, "0")}`;
}

/**
 * Parses `PodcastEpisode.duration` labels from mock data (`42 mins`, `1 hr`, `1 hr 15 mins`).
 * @param {string} label
 * @returns {number} seconds — at least 60.
 */
export function approxDurationSecondsFromLabel(label) {
  if (!label || typeof label !== "string") {
    return 2700;
  }
  const s = label.toLowerCase();
  let sec = 0;
  const hm = s.match(/(\d+)\s*hr\s+(\d+)\s*mins?/);
  if (hm) {
    sec +=
      Number.parseInt(hm[1], 10) * 3600 + Number.parseInt(hm[2], 10) * 60;
    return Math.max(60, sec);
  }
  const hp = s.match(/^(\d+)\s*hr\s*$/);
  if (hp) {
    sec += Number.parseInt(hp[1], 10) * 3600;
  }
  const mp = s.match(/(\d+)\s*mins?/);
  if (mp) {
    sec += Number.parseInt(mp[1], 10) * 60;
  }
  return Math.max(60, sec || 2700);
}
