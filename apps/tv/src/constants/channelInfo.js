/** Max related channel cards on TV Channel Info (Figma row, no horizontal scroll). */
export const CHANNEL_INFO_RELATED_MAX = 5;

/** Repeat the channel tag list this many times (TV prototype scroll test). */
export const CHANNEL_INFO_TAG_SCROLL_TEST_DUPLICATE_ROUNDS = 5;

/**
 * Duplicate channel tags so the Channel Info pill row scrolls across the viewport.
 * Prototype only — remove or set rounds to 1 when done testing.
 */
export function withChannelInfoTagScrollTest(tags = []) {
  if (tags.length === 0) return [];
  const out = [];
  for (let round = 0; round < CHANNEL_INFO_TAG_SCROLL_TEST_DUPLICATE_ROUNDS; round += 1) {
    out.push(...tags);
  }
  return out;
}
