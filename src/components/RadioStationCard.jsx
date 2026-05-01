import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a radio station from `src/data/radioStations.js`.
 * Subtitle prefers dial text (`frequencyLabel`) when present, else category.
 *
 * @param {{ station: object, onSelect?: () => void, compact?: boolean }} props
 */
export default function RadioStationCard({ station, onSelect, compact = false }) {
  const subtitle = station.frequencyLabel ?? station.categoryLabel;

  return (
    <ContentTileCard
      title={station.name}
      subtitle={subtitle}
      imageUrl={station.thumbnail}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
