import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { podcastLibraryBrowsePath } from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getActivePodcastShowId } from "../../utils/playbackMiniPlayer.js";
import { buildTvPodcastLibraryRails } from "../../utils/tvPodcastLibraryRails.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import "../cards/ContentTileCard.css";

/**
 * User podcast library rows on My Library — standard swimlanes (mobile parity).
 */
export default function TvLibraryPodcastUserGridSections({
  groupIndexOffset = 0,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session } = usePlayback();
  const playingPodcastId = getActivePodcastShowId(session);
  const userState = usePodcastUserState();

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

  if (rails.length === 0) return null;

  return (
    <>
      {rails.map((rail, index) => {
        const groupIndex = groupIndexOffset + index;

        if (rail.kind === "shows") {
          const shows = rail.shows ?? [];
          const items = shows.map((podcast) => ({
            id: podcast.id,
            thumbnail: podcast.thumbnail,
            title: podcast.title,
          }));

          return (
            <div
              key={rail.id}
              className="tv-home__scroll-group"
              ref={(node) => registerGroupRef?.(groupIndex, node)}
            >
              <ContentTileSwimlane
                title={rail.title}
                items={items}
                sourceCount={shows.length}
                groupIndex={groupIndex}
                playingItemId={playingPodcastId}
                focused={isContentGroupActive(groupIndex)}
                focusedIndex={getItemFocusIndex(groupIndex)}
                onFocusChange={(slotIndex) =>
                  setFocusedIndex(groupIndex, slotIndex)
                }
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={onMoveUp}
                onMoveDown={onMoveDown}
                onMore={() => navigate(podcastLibraryBrowsePath(rail.slug))}
                onSelectItem={(podcast) => navigate(`/podcast/${podcast.id}`)}
              />
            </div>
          );
        }

        const rows = rail.episodeRows ?? [];
        const items = rows.map((row) => ({
          id: `${row.podcast.id}-${row.episode.id}`,
          thumbnail: row.episode.thumbnail ?? row.podcast.thumbnail,
          title: row.episode.title,
        }));

        return (
          <div
            key={rail.id}
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef?.(groupIndex, node)}
          >
            <ContentTileSwimlane
              title={rail.title}
              items={items}
              sourceCount={rows.length}
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
              onMore={() => navigate(podcastLibraryBrowsePath(rail.slug))}
              onSelectItem={(item) => {
                const row = rows.find(
                  (entry) =>
                    `${entry.podcast.id}-${entry.episode.id}` === item.id,
                );
                if (!row) return;
                enterContent();
                navigate(`/podcast/${row.podcast.id}/play/${row.episode.id}`);
              }}
            />
          </div>
        );
      })}
    </>
  );
}
