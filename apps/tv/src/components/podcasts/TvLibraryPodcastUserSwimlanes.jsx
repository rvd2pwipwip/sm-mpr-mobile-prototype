import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PODCAST_LIBRARY_EPISODE_RAIL_CLEAR,
  PODCAST_LIBRARY_SLUG,
  myLibraryPodcastLibraryMorePath,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getActivePodcastShowId } from "../../utils/playbackMiniPlayer.js";
import { buildTvPodcastLibraryRails } from "../../utils/tvPodcastLibraryRails.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import TvEpisodeCardSwimlane from "./TvEpisodeCardSwimlane.jsx";
import "./TvLibraryPodcastUserSwimlanes.css";

/**
 * User podcast library rows — omitted when empty (mobile {@link LibraryPodcastUserSwimlanes}).
 * Limited catalog: Home podcasts tab. Broad catalog: My Library.
 */
export default function TvLibraryPodcastUserSwimlanes({
  groupIndexOffset = 0,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onEpisodeRailCleared,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session } = usePlayback();
  const playingPodcastId = getActivePodcastShowId(session);

  const userState = usePodcastUserState();
  const {
    getEpisodeProgress,
    clearAllEpisodeProgress,
    clearAllBookmarks,
    clearAllDownloads,
    unsubscribePodcasts,
  } = userState;

  const rails = useMemo(
    () => buildTvPodcastLibraryRails(userState),
    [
      userState.subscribedPodcasts,
      userState.continueListening,
      userState.bookmarkedEpisodes,
      userState.newEpisodeRows,
      userState.downloadedEpisodes,
    ],
  );

  const clearEpisodeRail = useCallback(
    (slug, episodeRows) => {
      switch (slug) {
        case PODCAST_LIBRARY_SLUG.continueListening:
          clearAllEpisodeProgress();
          break;
        case PODCAST_LIBRARY_SLUG.yourEpisodes:
          clearAllBookmarks();
          break;
        case PODCAST_LIBRARY_SLUG.newEpisodes:
          unsubscribePodcasts(
            (episodeRows ?? []).map((row) => row.podcast.id),
          );
          break;
        case PODCAST_LIBRARY_SLUG.downloadedEpisodes:
          clearAllDownloads();
          break;
        default:
          break;
      }
    },
    [
      clearAllEpisodeProgress,
      clearAllBookmarks,
      clearAllDownloads,
      unsubscribePodcasts,
    ],
  );

  if (rails.length === 0) {
    return null;
  }

  return (
    <div className="tv-library-podcast-user-swimlanes">
      {rails.map((rail, index) => {
        const groupIndex = groupIndexOffset + index;

        return (
          <div
            key={rail.id}
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef?.(groupIndex, node)}
          >
            {rail.kind === "shows" ? (
              <ContentTileSwimlane
                title={rail.title}
                items={(rail.shows ?? []).map((podcast) => ({
                  id: podcast.id,
                  thumbnail: podcast.thumbnail,
                  title: podcast.title,
                }))}
                sourceCount={rail.sourceCount}
                groupIndex={groupIndex}
                focused={isContentGroupActive(groupIndex)}
                focusedIndex={getItemFocusIndex(groupIndex)}
                onFocusChange={(slotIndex) =>
                  setFocusedIndex(groupIndex, slotIndex)
                }
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onSelectItem={(item) => navigate(`/podcast/${item.id}`)}
                playingItemId={playingPodcastId}
                onMore={() => navigate(myLibraryPodcastLibraryMorePath(rail.slug))}
              />
            ) : (
              <TvEpisodeCardSwimlane
                title={rail.title}
                rows={rail.episodeRows ?? []}
                sourceCount={rail.sourceCount}
                groupIndex={groupIndex}
                focused={isContentGroupActive(groupIndex)}
                focusedIndex={getItemFocusIndex(groupIndex)}
                onFocusChange={(slotIndex) =>
                  setFocusedIndex(groupIndex, slotIndex)
                }
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onSelectRow={({ podcast, episode }) => {
                  enterContent();
                  navigate(`/podcast/${podcast.id}/play/${episode.id}`);
                }}
                onMore={() => navigate(myLibraryPodcastLibraryMorePath(rail.slug))}
                trailingTileMode="clear-or-more"
                clearConfirm={PODCAST_LIBRARY_EPISODE_RAIL_CLEAR[rail.slug]}
                onClear={() => clearEpisodeRail(rail.slug, rail.episodeRows)}
                onRailCleared={() => onEpisodeRailCleared?.(groupIndex)}
                getProgressFraction={(episodeId) => {
                  const row = (rail.episodeRows ?? []).find(
                    (entry) => entry.episode.id === episodeId,
                  );
                  if (
                    row &&
                    typeof row.position01 === "number" &&
                    !Number.isNaN(row.position01)
                  ) {
                    return row.position01;
                  }
                  return getEpisodeProgress(episodeId);
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
