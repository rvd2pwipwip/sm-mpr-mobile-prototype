import { usePlayback } from "../../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../../utils/playbackMiniPlayer.js";
import TvLibraryHistorySwimlane from "./TvLibraryHistorySwimlane.jsx";

/**
 * One typed listen-history hub row (music, podcasts, or radio).
 *
 * @param {{ segment: 'music' | 'podcasts' | 'radio', groupIndex: number }} props
 */
export default function TvLibraryHistorySection({
  segment,
  groupIndex,
  focused,
  focusedIndex,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onHistoryCleared,
}) {
  const { session } = usePlayback();
  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);

  return (
    <TvLibraryHistorySwimlane
      segment={segment}
      groupIndex={groupIndex}
      focused={focused}
      focusedIndex={focusedIndex}
      onFocusChange={onFocusChange}
      onBoundaryLeft={onBoundaryLeft}
      registerItemRef={registerItemRef}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onHistoryCleared={onHistoryCleared}
      playingChannelId={playingChannelId}
      playingPodcastId={playingPodcastId}
    />
  );
}
