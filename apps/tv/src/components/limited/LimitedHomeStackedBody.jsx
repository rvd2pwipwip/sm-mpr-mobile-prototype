import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../../utils/playbackMiniPlayer.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import {
  getMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";
import {
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import {
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import TvSwimlaneBannerAd from "../ads/TvSwimlaneBannerAd.jsx";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import TvLibraryPodcastUserSwimlanes from "../podcasts/TvLibraryPodcastUserSwimlanes.jsx";
import { buildLimitedHomeStackedLanes } from "../../utils/limitedHomeStackedLanes.js";
import { buildTvPodcastLibraryRails } from "../../utils/tvPodcastLibraryRails.js";
import { HOME_FIRST_SWIMLANE_GROUP } from "../../constants/homeFocusGroups.js";

const MID_STACK_AD_AFTER_LANE_INDEX = 1;

/**
 * Layout B — stacked taxonomy swimlanes (mobile LimitedBrowse parity).
 */
export default function LimitedHomeStackedBody({
  activeBrowseTab,
  showMidStackAd,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  laneGroupOffset = HOME_FIRST_SWIMLANE_GROUP,
}) {
  const navigate = useNavigate();
  const { session } = usePlayback();
  const playingPodcastId = getActivePodcastShowId(session);
  const podcastUserState = usePodcastUserState();

  const podcastLibraryRails = useMemo(() => {
    if (activeBrowseTab !== CONTENT_TYPE.podcasts) return [];
    return buildTvPodcastLibraryRails(podcastUserState);
  }, [
    activeBrowseTab,
    podcastUserState.subscribedPodcasts,
    podcastUserState.continueListening,
    podcastUserState.bookmarkedEpisodes,
    podcastUserState.newEpisodeRows,
    podcastUserState.downloadedEpisodes,
  ]);

  const libraryRailCount = podcastLibraryRails.length;
  const taxonomyLaneOffset = laneGroupOffset + libraryRailCount;

  const lanes = useMemo(
    () => buildLimitedHomeStackedLanes(activeBrowseTab),
    [activeBrowseTab],
  );

  if (libraryRailCount === 0 && lanes.length === 0) {
    return (
      <div className="tv-home__scroll-group tv-home__content-inset">
        <p className="tv-home__catalog-proof">No browse lanes for this tab.</p>
      </div>
    );
  }

  return (
    <>
      {libraryRailCount > 0 ? (
        <TvLibraryPodcastUserSwimlanes
          groupIndexOffset={laneGroupOffset}
          registerGroupRef={registerGroupRef}
          registerItemRef={registerItemRef}
          isContentGroupActive={isContentGroupActive}
          getItemFocusIndex={getItemFocusIndex}
          setFocusedIndex={setFocusedIndex}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          enterNavFromContent={enterNavFromContent}
        />
      ) : null}

      {lanes.map((lane, laneIndex) => {
        const groupIndex = taxonomyLaneOffset + laneIndex;

        return (
          <div key={lane.id}>
            <div
              className="tv-home__scroll-group"
              ref={(node) => registerGroupRef(groupIndex, node)}
            >
              {lane.type === CONTENT_TYPE.music ? (
                <MusicChannelSwimlane
                  title={lane.title}
                  channels={getMusicChannelsByCategory(lane.categoryId)}
                  sourceCount={lane.sourceCount}
                  groupIndex={groupIndex}
                  focused={isContentGroupActive(groupIndex)}
                  focusedIndex={getItemFocusIndex(groupIndex)}
                  onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
                  onBoundaryLeft={enterNavFromContent}
                  registerItemRef={registerItemRef}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onSelectChannel={(channel) =>
                    navigate(`/music/${channel.id}`)
                  }
                  onMore={() =>
                    navigate(`/more/music/${lane.categoryId}`)
                  }
                />
              ) : (
                <ContentTileSwimlane
                  title={lane.title}
                  items={
                    lane.type === CONTENT_TYPE.podcasts
                      ? getPodcastsByCategory(lane.categoryId).map((p) => ({
                          id: p.id,
                          thumbnail: p.thumbnail,
                          title: p.title,
                        }))
                      : getRadioStationsByCategory(lane.categoryId).map((s) => ({
                          id: s.id,
                          thumbnail: s.thumbnail,
                          title: s.name,
                        }))
                  }
                  sourceCount={lane.sourceCount}
                  groupIndex={groupIndex}
                  focused={isContentGroupActive(groupIndex)}
                  focusedIndex={getItemFocusIndex(groupIndex)}
                  onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
                  onBoundaryLeft={enterNavFromContent}
                  registerItemRef={registerItemRef}
                  onMoveUp={onMoveUp}
                  onMoveDown={onMoveDown}
                  onSelectItem={(item) => {
                    if (lane.type === CONTENT_TYPE.podcasts) {
                      navigate(`/podcast/${item.id}`);
                      return;
                    }
                    navigate(`/radio/${item.id}`);
                  }}
                  playingItemId={
                    lane.type === CONTENT_TYPE.podcasts ? playingPodcastId : null
                  }
                  onMore={() => {
                    if (lane.type === CONTENT_TYPE.podcasts) {
                      navigate(
                        `/search/browse/podcasts/category/${lane.categoryId}`,
                      );
                      return;
                    }
                    navigate(
                      `/search/browse/radio/category/${lane.categoryId}`,
                    );
                  }}
                />
              )}
            </div>

            {showMidStackAd &&
            laneIndex === MID_STACK_AD_AFTER_LANE_INDEX ? (
              <div className="tv-home__scroll-group tv-home__content-inset">
                <TvSwimlaneBannerAd />
              </div>
            ) : null}
          </div>
        );
      })}
    </>
  );
}
