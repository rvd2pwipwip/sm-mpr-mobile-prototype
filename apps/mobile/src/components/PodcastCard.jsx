import { usePlayback } from "../context/PlaybackContext";
import { getActivePodcastShowId } from "../utils/playbackNowPlaying";
import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a podcast show from `src/data/podcasts.js`.
 *
 * @param {{ podcast: object, onSelect?: () => void, compact?: boolean, playing?: boolean }} props
 */
export default function PodcastCard({
  podcast,
  onSelect,
  compact = false,
  playing,
}) {
  const { session } = usePlayback();
  const isPlaying =
    playing ?? getActivePodcastShowId(session) === podcast.id;

  return (
    <ContentTileCard
      title={podcast.title}
      imageUrl={podcast.thumbnail}
      onSelect={onSelect}
      compact={compact}
      playing={isPlaying}
    />
  );
}
