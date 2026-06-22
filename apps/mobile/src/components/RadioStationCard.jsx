import { usePlayback } from "../context/PlaybackContext";
import { getActiveRadioStationId } from "../utils/playbackNowPlaying";
import ContentTileCard from "./ContentTileCard";

/**
 * Swimlane tile for a radio station from `src/data/radioStations.js`.
 * Optional subtitle is dial text only (`frequencyLabel`); stations without one show title only.
 *
 * @param {{ station: object, onSelect?: () => void, compact?: boolean, playing?: boolean }} props
 */
export default function RadioStationCard({
  station,
  onSelect,
  compact = false,
  playing,
}) {
  const { session } = usePlayback();
  const isPlaying =
    playing ?? getActiveRadioStationId(session) === station.id;

  return (
    <ContentTileCard
      title={station.name}
      subtitle={station.frequencyLabel}
      imageUrl={station.thumbnail}
      onSelect={onSelect}
      compact={compact}
      playing={isPlaying}
    />
  );
}
