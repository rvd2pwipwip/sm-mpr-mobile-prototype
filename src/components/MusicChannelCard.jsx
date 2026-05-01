import ContentTileCard from "./ContentTileCard";
import { MUSIC_GENRES } from "../data/musicChannels";

function genreLabel(categoryId) {
  return MUSIC_GENRES.find((g) => g.id === categoryId)?.label ?? categoryId;
}

/**
 * Swimlane tile for a music stream / channel from `src/data/musicChannels.js`.
 *
 * @param {{ channel: object, onSelect?: () => void, compact?: boolean }} props
 */
export default function MusicChannelCard({ channel, onSelect, compact = false }) {
  const subtitle = genreLabel(channel.categoryId);

  return (
    <ContentTileCard
      title={channel.name}
      subtitle={subtitle}
      imageUrl={channel.thumbnail}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
