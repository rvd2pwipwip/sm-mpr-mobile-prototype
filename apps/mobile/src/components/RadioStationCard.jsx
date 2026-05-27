import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a radio station from `src/data/radioStations.js`.
 * Optional subtitle is dial text only (`frequencyLabel`); stations without one show title only.
 *
 * @param {{ station: object, onSelect?: () => void, compact?: boolean }} props
 */
export default function RadioStationCard({ station, onSelect, compact = false }) {
  return (
    <ContentTileCard
      title={station.name}
      subtitle={station.frequencyLabel}
      imageUrl={station.thumbnail}
      onSelect={onSelect}
      compact={compact}
    />
  );
}
