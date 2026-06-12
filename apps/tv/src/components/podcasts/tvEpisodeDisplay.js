/**
 * @param {{ isNew?: boolean }} episode
 * @param {number} [progressFraction]
 */
export function getEpisodeProgressDisplay(episode, progressFraction = 0) {
  const p =
    typeof progressFraction === "number" && !Number.isNaN(progressFraction)
      ? Math.min(1, Math.max(0, progressFraction))
      : 0;
  const inProgress = p > 0 && p < 1;
  const complete = p >= 1;

  let dotModifier = "accent";
  if (complete) {
    dotModifier = "complete";
  } else if (inProgress || !episode?.isNew) {
    dotModifier = "muted";
  }

  return { p, inProgress, complete, dotModifier };
}
