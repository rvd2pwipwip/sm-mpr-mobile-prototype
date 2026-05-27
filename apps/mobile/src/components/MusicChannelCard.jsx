import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a music stream / channel from `src/data/musicChannels.js`.
 *
 * @param {{ channel: object, onSelect?: () => void, compact?: boolean }} props
 */
export default function MusicChannelCard({ channel, onSelect, compact = false }) {
  return (
    <ContentTileCard
      title={channel.name}
      imageUrl={channel.thumbnail}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
