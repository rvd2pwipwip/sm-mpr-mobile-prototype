import { usePlayback } from "../context/PlaybackContext";
import { getActiveMusicChannelId } from "../utils/playbackNowPlaying";
import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a music stream / channel from `src/data/musicChannels.js`.
 *
 * @param {{ channel: object, onSelect?: () => void, compact?: boolean, playing?: boolean }} props
 */
export default function MusicChannelCard({
  channel,
  onSelect,
  compact = false,
  playing,
}) {
  const { session } = usePlayback();
  const isPlaying =
    playing ?? getActiveMusicChannelId(session) === channel.id;

  return (
    <ContentTileCard
      title={channel.name}
      imageUrl={channel.thumbnail}
      onSelect={onSelect}
      compact={compact}
      playing={isPlaying}
    />
  );
}
