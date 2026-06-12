import { Navigate, useParams } from "react-router-dom";
import { getPodcastEpisodeById } from "@sm-mpr/shared/data/podcasts.js";
import "./PodcastPlayer.css";

/**
 * Full-screen podcast player — Phase 0 route shell; full layout in Phase 4 (Figma `7531:342033`).
 */
export default function PodcastPlayer() {
  const { podcastId, episodeId } = useParams();
  const resolved =
    podcastId && episodeId
      ? getPodcastEpisodeById(podcastId, episodeId)
      : null;

  if (!resolved) {
    return <Navigate to="/" replace />;
  }

  const { podcast, episode } = resolved;

  return (
    <div className="tv-podcast-player-shell">
      <p className="tv-podcast-player-shell__show">{podcast.title}</p>
      <img
        className="tv-podcast-player-shell__art"
        src={episode.thumbnail}
        alt=""
        width={360}
        height={360}
      />
      <h1 className="tv-podcast-player-shell__episode">{episode.title}</h1>
      <p className="tv-podcast-player-shell__meta">
        {episode.releaseDate} — {episode.duration}
      </p>
      <p className="tv-podcast-player-shell__lede">
        Full player controls ship in the next podcasts phase.
      </p>
    </div>
  );
}
