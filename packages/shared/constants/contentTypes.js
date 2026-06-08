/** Prototype content-type ids (music, podcasts, radio). */
export const CONTENT_TYPE = Object.freeze({
  music: "music",
  podcasts: "podcasts",
  radio: "radio",
});

/** Full MPR prototype (all three types). */
export const ALL_CONTENT_TYPES = Object.freeze([
  CONTENT_TYPE.music,
  CONTENT_TYPE.podcasts,
  CONTENT_TYPE.radio,
]);

/** Music-only MVP default. */
export const MUSIC_ONLY_CONTENT_TYPES = Object.freeze([CONTENT_TYPE.music]);
