import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import {
  getActivePodcastShowId,
  getActiveRadioStationId,
} from "../../utils/playbackMiniPlayer.js";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { LISTEN_HISTORY_KIND_FOR_BROWSE_TAB } from "@sm-mpr/shared/constants/listenHistory.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import {
  getLimitedMusicChannelsByCategory,
} from "@sm-mpr/shared/data/musicChannels.js";
import {
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import {
  getRadioStationsByCategory,
} from "@sm-mpr/shared/data/radioStations.js";
import { RADIO_BROWSE_PATH } from "../../constants/radioBrowsePaths.js";
import TvSwimlaneBannerAd from "../ads/TvSwimlaneBannerAd.jsx";
import TvLibraryLikedRadioSection from "../library/TvLibraryLikedRadioSection.jsx";
import TvSearchRadioInternationalSection from "../search/TvSearchRadioInternationalSection.jsx";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import TvLibraryPodcastUserSwimlanes from "../podcasts/TvLibraryPodcastUserSwimlanes.jsx";
import TvListenAgainSwimlane from "../swimlanes/TvListenAgainSwimlane.jsx";
import TvProviderLineupMusicSwimlane from "../swimlanes/TvProviderLineupMusicSwimlane.jsx";
import { useContentProfile } from "../../context/ContentProfileContext.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import { useTerritory } from "../../context/TerritoryContext.jsx";
import { useLikes } from "../../context/LikesContext.jsx";
import { buildLimitedHomeStackedLanes } from "../../utils/limitedHomeStackedLanes.js";
import { getLikedRadioStations } from "../../utils/likedRadioCount.js";
import { buildTvPodcastLibraryRails } from "../../utils/tvPodcastLibraryRails.js";
import { HOME_FIRST_SWIMLANE_GROUP } from "../../constants/homeFocusGroups.js";

/**
 * Layout B — stacked taxonomy swimlanes (mobile LimitedBrowse parity).
 */
export default function LimitedHomeStackedBody({
  activeBrowseTab,
  showMidStackAd,
  radioStackedLayout = null,
  onRadioIntlContinentChange,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onHistoryCleared,
  laneGroupOffset = HOME_FIRST_SWIMLANE_GROUP,
  onEpisodeRailCleared,
  providerLineupGroupCount = 0,
}) {
  const navigate = useNavigate();
  const { session } = usePlayback();
  const { userType } = useUserType();
  const { catalogScope } = useTerritory();
  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);
  const playingRadioStationId = getActiveRadioStationId(session);
  const { filterListenHistory, enabledContentTypes } = useContentProfile();
  const { items: likeItems } = useLikes();
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

  const showRadioLiked =
    activeBrowseTab === CONTENT_TYPE.radio &&
    getLikedRadioStations(likeItems).length > 0;
  const libraryRailCount =
    activeBrowseTab === CONTENT_TYPE.podcasts
      ? podcastLibraryRails.length
      : showRadioLiked
        ? 1
        : 0;
  const showProviderLineup =
    activeBrowseTab === CONTENT_TYPE.music &&
    userType === "freeProvided" &&
    enabledContentTypes.includes(CONTENT_TYPE.music);

  const providerLineupPillsGroup =
    laneGroupOffset + listenAgainLaneCount;
  const providerLineupCardsGroup = providerLineupPillsGroup + 1;

  const libraryLaneOffset =
    laneGroupOffset + listenAgainLaneCount + providerLineupGroupCount;

  const lanes = useMemo(
    () =>
      activeBrowseTab === CONTENT_TYPE.radio
        ? []
        : buildLimitedHomeStackedLanes(activeBrowseTab),
    [activeBrowseTab],
  );

  const taxonomyIsEmpty =
    activeBrowseTab === CONTENT_TYPE.radio
      ? !radioStackedLayout?.sections?.length
      : lanes.length === 0;

  const swimlaneNav = {
    registerItemRef,
    onMoveUp,
    onMoveDown,
    onBoundaryLeft: enterNavFromContent,
  };

  if (
    listenAgainLaneCount === 0 &&
    libraryRailCount === 0 &&
    taxonomyIsEmpty
  ) {
    return (
      <div className="tv-home__scroll-group tv-home__content-inset">
        <p className="tv-home__catalog-proof">No browse lanes for this tab.</p>
      </div>
    );
  }

  let taxonomyGroupIndex =
    laneGroupOffset +
    listenAgainLaneCount +
    providerLineupGroupCount +
    libraryRailCount;

  const renderMidStackAd = (sectionIndex) =>
    showMidStackAd &&
    activeBrowseTab === CONTENT_TYPE.radio &&
    radioStackedLayout &&
    sectionIndex === radioStackedLayout.midStackAdAfterSectionIndex ? (
      <div className="tv-home__scroll-group tv-home__content-inset">
        <TvSwimlaneBannerAd />
      </div>
    ) : null;

  const renderRadioSection = (section, sectionIndex) => {
    if (section.kind === "near-you") {
      const groupIndex = taxonomyGroupIndex;
      taxonomyGroupIndex += section.focusGroups.length;
      const stations = getRadioStationsByCategory(section.categoryId);
      const items = stations.map((station) => ({
        id: station.id,
        thumbnail: station.thumbnail,
        title: station.name,
      }));

      return (
        <div key={section.id}>
          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(groupIndex, node)}
          >
            <ContentTileSwimlane
              title={section.title}
              items={items}
              sourceCount={section.sourceCount}
              groupIndex={groupIndex}
              focused={isContentGroupActive(groupIndex)}
              focusedIndex={getItemFocusIndex(groupIndex)}
              onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
              onSelectItem={(item) => navigate(`/radio/${item.id}`)}
              onMore={() => navigate(RADIO_BROWSE_PATH.nearYou)}
              playingItemId={playingRadioStationId}
              {...swimlaneNav}
            />
          </div>
          {renderMidStackAd(sectionIndex)}
        </div>
      );
    }

    if (section.kind === "international") {
      const pillsGroup = taxonomyGroupIndex;
      const cardsGroup = taxonomyGroupIndex + 1;
      taxonomyGroupIndex += section.focusGroups.length;

      return (
        <div key={section.id}>
          <div className="tv-home__scroll-group tv-search-radio-browse__group">
            <TvSearchRadioInternationalSection
              title={section.title}
              memoryKey={section.memoryKey}
              pillsGroup={pillsGroup}
              cardsGroup={cardsGroup}
              registerGroupRef={registerGroupRef}
              registerItemRef={registerItemRef}
              isContentGroupActive={isContentGroupActive}
              getItemFocusIndex={getItemFocusIndex}
              setFocusedIndex={setFocusedIndex}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              enterNavFromContent={enterNavFromContent}
              onContinentChange={onRadioIntlContinentChange}
            />
          </div>
          {renderMidStackAd(sectionIndex)}
        </div>
      );
    }

    const groupIndex = taxonomyGroupIndex;
    taxonomyGroupIndex += section.focusGroups.length;
    const stations = getRadioStationsByCategory(section.categoryId);
    const items = stations.map((station) => ({
      id: station.id,
      thumbnail: station.thumbnail,
      title: station.name,
    }));

    return (
      <div key={section.id}>
        <div
          className="tv-home__scroll-group"
          ref={(node) => registerGroupRef(groupIndex, node)}
        >
          <ContentTileSwimlane
            title={section.title}
            items={items}
            sourceCount={section.sourceCount}
            groupIndex={groupIndex}
            focused={isContentGroupActive(groupIndex)}
            focusedIndex={getItemFocusIndex(groupIndex)}
            onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
            onSelectItem={(item) => navigate(`/radio/${item.id}`)}
            onMore={() => navigate(RADIO_BROWSE_PATH.format(section.categoryId))}
            playingItemId={playingRadioStationId}
            {...swimlaneNav}
          />
        </div>
        {renderMidStackAd(sectionIndex)}
      </div>
    );
  };

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
            playingRadioStationId={playingRadioStationId}
            focused={isContentGroupActive(laneGroupOffset)}
            focusedIndex={getItemFocusIndex(laneGroupOffset)}
            onFocusChange={(index) => setFocusedIndex(laneGroupOffset, index)}
            registerItemRef={registerItemRef}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onBoundaryLeft={enterNavFromContent}
            onHistoryCleared={onHistoryCleared}
          />
        </div>
      ) : null}

      {showProviderLineup && providerLineupGroupCount > 0 ? (
        <TvProviderLineupMusicSwimlane
          catalogScope={catalogScope}
          pillsGroup={providerLineupPillsGroup}
          cardsGroup={providerLineupCardsGroup}
          playingChannelId={playingChannelId}
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

      {activeBrowseTab === CONTENT_TYPE.podcasts && libraryRailCount > 0 ? (
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
          onEpisodeRailCleared={onEpisodeRailCleared}
        />
      ) : null}

      {showRadioLiked ? (
        <div
          className="tv-home__scroll-group"
          ref={(node) => registerGroupRef(libraryLaneOffset, node)}
        >
          <TvLibraryLikedRadioSection
            groupIndex={libraryLaneOffset}
            focused={isContentGroupActive(libraryLaneOffset)}
            focusedIndex={getItemFocusIndex(libraryLaneOffset)}
            onFocusChange={(index) =>
              setFocusedIndex(libraryLaneOffset, index)
            }
            onBoundaryLeft={enterNavFromContent}
            registerItemRef={registerItemRef}
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            playingItemId={playingRadioStationId}
          />
        </div>
      ) : null}

      {activeBrowseTab === CONTENT_TYPE.radio && radioStackedLayout
        ? radioStackedLayout.sections.map((section, sectionIndex) =>
            renderRadioSection(section, sectionIndex),
          )
        : lanes.map((lane, laneIndex) => {
            const groupIndex = taxonomyGroupIndex + laneIndex;

            return (
              <div key={lane.id}>
                <div
                  className="tv-home__scroll-group"
                  ref={(node) => registerGroupRef(groupIndex, node)}
                >
                  {lane.type === CONTENT_TYPE.music ? (
                    <MusicChannelSwimlane
                      title={lane.title}
                      channels={getLimitedMusicChannelsByCategory(lane.categoryId)}
                      sourceCount={lane.sourceCount}
                      groupIndex={groupIndex}
                      focused={isContentGroupActive(groupIndex)}
                      focusedIndex={getItemFocusIndex(groupIndex)}
                      onFocusChange={(index) =>
                        setFocusedIndex(groupIndex, index)
                      }
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
                      items={getPodcastsByCategory(lane.categoryId).map((p) => ({
                        id: p.id,
                        thumbnail: p.thumbnail,
                        title: p.title,
                      }))}
                      sourceCount={lane.sourceCount}
                      groupIndex={groupIndex}
                      focused={isContentGroupActive(groupIndex)}
                      focusedIndex={getItemFocusIndex(groupIndex)}
                      onFocusChange={(index) =>
                        setFocusedIndex(groupIndex, index)
                      }
                      onBoundaryLeft={enterNavFromContent}
                      registerItemRef={registerItemRef}
                      onMoveUp={onMoveUp}
                      onMoveDown={onMoveDown}
                      onSelectItem={(item) =>
                        navigate(`/podcast/${item.id}`)
                      }
                      playingItemId={playingPodcastId}
                      onMore={() =>
                        navigate(
                          `/search/browse/podcasts/category/${lane.categoryId}`,
                        )
                      }
                    />
                  )}
                </div>

                {showMidStackAd &&
                activeBrowseTab !== CONTENT_TYPE.radio &&
                laneIndex === 1 ? (
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
