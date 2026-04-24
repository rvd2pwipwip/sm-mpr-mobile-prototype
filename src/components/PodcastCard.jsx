import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a podcast show from `src/data/podcasts.js`.
 *
 * @param {{ podcast: object, onSelect?: () => void }} props
 */
export default function PodcastCard({ podcast, onSelect }) {
  return (
    <ContentTileCard
      title={podcast.title}
      subtitle={podcast.categoryLabel}
      imageUrl={podcast.thumbnail}
      onSelect={onSelect}
    />
  );
}
