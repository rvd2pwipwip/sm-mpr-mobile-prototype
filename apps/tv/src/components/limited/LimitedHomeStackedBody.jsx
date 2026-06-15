import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../../utils/playbackMiniPlayer.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { LISTEN_HISTORY_KIND_FOR_BROWSE_TAB } from "@sm-mpr/shared/constants/listenHistory.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
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
import TvListenAgainSwimlane from "../swimlanes/TvListenAgainSwimlane.jsx";
import { useContentProfile } from "../../context/ContentProfileContext.jsx";
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
  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);
  const { filterListenHistory } = useContentProfile();
  const { items: listenHistoryItems } = useListenHistory();
  const podcastUserState = usePodcastUserState();

  const tabListenItems = useMemo(() => {
    const kind = LISTEN_HISTORY_KIND_FOR_BROWSE_TAB[activeBrowseTab];
    if (!kind) return [];
    return filterListenHistory(listenHistoryItems).filter(
      (item) => item.kind === kind,
    );
  }, [activeBrowseTab, filterListenHistory, listenHistoryItems]);

  const showListenAgain = tabListenItems.length > 0;
  const listenAgainLaneCount = showListenAgain ? 1 : 0;

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
  const libraryLaneOffset = laneGroupOffset + listenAgainLaneCount;
  const taxonomyLaneOffset = libraryLaneOffset + libraryRailCount;

  const lanes = useMemo(
    () => buildLimitedHomeStackedLanes(activeBrowseTab),
    [activeBrowseTab],
  );

  if (listenAgainLaneCount === 0 && libraryRailCount === 0 && lanes.length === 0) {
    return (
      <div className="tv-home__scroll-group tv-home__content-inset">
        <p className="tv-home__catalog-proof">No browse lanes for this tab.</p>
      </div>
    );
  }

  return (
    <>
      {showListenAgain ? (
        <div
          className="tv-home__scroll-group"
          ref={(node) => registerGroupRef(laneGroupOffset, node)}
        >
          <TvListenAgainSwimlane
            historyItems={tabListenItems}
            groupIndex={laneGroupOffset}
            playingChannelId={playingChannelId}
            playingPodcastId={playingPodcastId}
            focused={isContentGroupActive(laneGroupOffset)}
            focusedIndex={getItemFocusIndex(laneGroupOffset)}
            onFocusChange={(index) => setFocusedIndex(laneGroupOffset, index)}
            registerItemRef={registerItemRef}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onBoundaryLeft={enterNavFromContent}
          />
        </div>
      ) : null}

      {libraryRailCount > 0 ? (
        <TvLibraryPodcastUserSwimlanes
          groupIndexOffset={libraryLaneOffset}
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
