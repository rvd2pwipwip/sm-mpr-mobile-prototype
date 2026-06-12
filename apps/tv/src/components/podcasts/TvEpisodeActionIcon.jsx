/** Episode row action icons — `public/*Episode.svg` masks + `currentColor`. */
export default function TvEpisodeActionIcon({ variant }) {
  return (
    <span
      className={[
        "tv-episode-action-icon",
        `tv-episode-action-icon--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}
