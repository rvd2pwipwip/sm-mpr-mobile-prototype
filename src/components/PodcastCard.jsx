import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a podcast show from `src/data/podcasts.js`.
 *
 * @param {{ podcast: object, onSelect?: () => void, compact?: boolean }} props
 */
export default function PodcastCard({ podcast, onSelect, compact = false }) {
  return (
    <ContentTileCard
      title={podcast.title}
      subtitle={podcast.categoryLabel}
      imageUrl={podcast.thumbnail}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
