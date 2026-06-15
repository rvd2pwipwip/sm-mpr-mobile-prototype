import { useMemo, useCallback } from "react";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useNavigate } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import { PODCASTS } from "@sm-mpr/shared/data/podcasts.js";
import { RADIO_STATIONS } from "@sm-mpr/shared/data/radioStations.js";
import {
  BROAD_HOME_SWIMLANE_ID,
  getVisibleBroadHomeTvSwimlanes,
  HOME_MUSIC_MORE_CATEGORY,
} from "@sm-mpr/shared/constants/homeSwimlanes.js";
import {
  getHomeMusicSwimlaneChannels,
  getHomeMusicSwimlaneTitle,
} from "@sm-mpr/shared/data/homeMusicSwimlanes.js";
import { showVisualAds } from "@sm-mpr/shared/utils/userTierRules.js";
import TvSwimlaneBannerAd from "../components/ads/TvSwimlaneBannerAd.jsx";
import TvHomeBanner from "../components/TvHomeBanner.jsx";
import TvHomeHeaderSection from "../components/TvHomeHeaderSection.jsx";
import TvListenAgainSwimlane from "../components/swimlanes/TvListenAgainSwimlane.jsx";
import ContentTileSwimlane from "../components/swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import {
  HOME_BANNER_GROUP,
  HOME_FIRST_SWIMLANE_GROUP,
  HOME_HEADER_GROUP,
  HOME_LANDING_ITEM_INDEX,
} from "../constants/homeFocusGroups.js";
import {
  HOME_HEADER_LAYOUT,
  useHomeHeaderLayout,
} from "../constants/homeHeaderLayout.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { getActivePodcastShowId } from "../utils/playbackMiniPlayer.js";
import {
  getListenAgainSwimlaneSlotCount,
  getMusicSwimlaneSlotCount,
} from "../utils/swimlaneUtils.js";

function bannerAfterSwimlaneId(visibleIds, showBannerAd) {
  if (!showBannerAd) return null;
  if (visibleIds.includes(BROAD_HOME_SWIMLANE_ID.popularPodcasts)) {
    return BROAD_HOME_SWIMLANE_ID.popularPodcasts;
  }
  if (visibleIds.includes(BROAD_HOME_SWIMLANE_ID.countryEssentials)) {
    return BROAD_HOME_SWIMLANE_ID.countryEssentials;
  }
  if (visibleIds.includes(BROAD_HOME_SWIMLANE_ID.mostPopularMusic)) {
    return BROAD_HOME_SWIMLANE_ID.mostPopularMusic;
  }
  return null;
}

export default function BroadHome() {
  const navigate = useNavigate();
  const { session } = usePlayback();
  const { userType } = useUserType();
  const { enabledContentTypes, isMusicOnlyProfile, filterListenHistory } =
    useContentProfile();
  const { items: listenHistoryItems } = useListenHistory();
  const showBannerAd = showVisualAds(userType);

  const listenAgainFiltered = useMemo(
    () => filterListenHistory(listenHistoryItems),
    [filterListenHistory, listenHistoryItems],
  );
  const showListenAgain = listenAgainFiltered.length > 0;

  const recommendations = useMemo(() => getRecommendationsMusicChannels(), []);
  const newReleaseChannels = useMemo(
    () => getHomeMusicSwimlaneChannels("newReleases"),
    [],
  );
  const countryEssentialChannels = useMemo(
    () => getHomeMusicSwimlaneChannels("countryEssentials"),
    [],
  );

  const podcastTiles = useMemo(
    () =>
      PODCASTS.map((podcast) => ({
        id: podcast.id,
        thumbnail: podcast.thumbnail,
        title: podcast.title,
      })),
    [],
  );

  const radioTiles = useMemo(
    () =>
      RADIO_STATIONS.map((station) => ({
        id: station.id,
        thumbnail: station.thumbnail,
        title: station.name,
      })),
    [],
  );

  const visibleTvSwimlanes = useMemo(
    () =>
      getVisibleBroadHomeTvSwimlanes(
        enabledContentTypes,
        userType,
        isMusicOnlyProfile,
      ),
    [enabledContentTypes, userType, isMusicOnlyProfile],
  );

  const slotCountById = useMemo(
    () => ({
      [BROAD_HOME_SWIMLANE_ID.mostPopularMusic]: getMusicSwimlaneSlotCount(
        MUSIC_CHANNELS.length,
      ),
      [BROAD_HOME_SWIMLANE_ID.newReleases]: getMusicSwimlaneSlotCount(
        newReleaseChannels.length,
      ),
      [BROAD_HOME_SWIMLANE_ID.countryEssentials]: getMusicSwimlaneSlotCount(
        countryEssentialChannels.length,
      ),
      [BROAD_HOME_SWIMLANE_ID.popularPodcasts]: getMusicSwimlaneSlotCount(
        PODCASTS.length,
      ),
      [BROAD_HOME_SWIMLANE_ID.topRadio]: getMusicSwimlaneSlotCount(
        RADIO_STATIONS.length,
      ),
      [BROAD_HOME_SWIMLANE_ID.recommendations]: getMusicSwimlaneSlotCount(
        recommendations.length,
      ),
    }),
    [
      newReleaseChannels.length,
      countryEssentialChannels.length,
      recommendations.length,
    ],
  );

  const { swimlaneLayout, focusConfig } = useMemo(() => {
    /** @type {{ id: string, groupIndex: number, slotCount: number }[]} */
    const lanes = [];
    let groupIndex = HOME_FIRST_SWIMLANE_GROUP;

    if (showListenAgain) {
      lanes.push({
        id: BROAD_HOME_SWIMLANE_ID.listenAgain,
        groupIndex,
        slotCount: getListenAgainSwimlaneSlotCount(listenAgainFiltered.length),
      });
      groupIndex += 1;
    }

    for (const swimlane of visibleTvSwimlanes) {
      lanes.push({
        id: swimlane.id,
        groupIndex,
        slotCount: slotCountById[swimlane.id] ?? 1,
      });
      groupIndex += 1;
    }

    const itemCounts = {
      [HOME_HEADER_GROUP]: 1,
      [HOME_BANNER_GROUP]: 1,
    };
    const swimlaneGroups = [];

    for (const lane of lanes) {
      itemCounts[lane.groupIndex] = lane.slotCount;
      swimlaneGroups.push(lane.groupIndex);
    }

    return {
      swimlaneLayout: lanes,
      focusConfig: {
        groupCount: groupIndex,
        itemCounts,
        swimlaneGroups,
        firstSwimlaneGroup:
          swimlaneGroups[0] ?? HOME_FIRST_SWIMLANE_GROUP,
        lastSwimlaneGroup:
          swimlaneGroups[swimlaneGroups.length - 1] ??
          HOME_FIRST_SWIMLANE_GROUP,
      },
    };
  }, [visibleTvSwimlanes, slotCountById, showListenAgain, listenAgainFiltered.length]);

  const bannerAfterLaneId = bannerAfterSwimlaneId(
    visibleTvSwimlanes.map((s) => s.id),
    showBannerAd,
  );

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNavFromContent,
    focusedGroupIndex,
    focusedIndex,
    getItemElement,
  } = useScreenContentFocus("home-broad", {
    groupCount: focusConfig.groupCount,
    itemCounts: focusConfig.itemCounts,
    swimlaneGroups: focusConfig.swimlaneGroups,
    defaultGroupIndex: focusConfig.firstSwimlaneGroup,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: focusConfig.firstSwimlaneGroup,
    lastFocusableGroupIndex: focusConfig.lastSwimlaneGroup,
    getFocusedElement,
    screenId: "home-broad",
  });

  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  const headerLayout = useHomeHeaderLayout();
  const scrollableHeader = headerLayout === HOME_HEADER_LAYOUT.SCROLL;
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const headerProps = {
    groupIndex: HOME_HEADER_GROUP,
    focused: isContentGroupActive(HOME_HEADER_GROUP),
    registerItemRef,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onBoundaryLeft: enterNavFromContent,
  };

  const swimlaneNav = {
    registerItemRef,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
    onBoundaryLeft: enterNavFromContent,
  };

  function renderSwimlane(lane) {
    switch (lane.id) {
      case BROAD_HOME_SWIMLANE_ID.listenAgain:
        return (
          <TvListenAgainSwimlane
            historyItems={listenAgainFiltered}
            groupIndex={lane.groupIndex}
            playingChannelId={playingChannelId}
            playingPodcastId={playingPodcastId}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            registerItemRef={registerItemRef}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onBoundaryLeft={enterNavFromContent}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.mostPopularMusic:
        return (
          <MusicChannelSwimlane
            title="Most popular music"
            channels={MUSIC_CHANNELS}
            sourceCount={MUSIC_CHANNELS.length}
            groupIndex={lane.groupIndex}
            playingChannelId={playingChannelId}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            onSelectChannel={openChannelInfo}
            onMore={() => navigate("/more/music")}
            {...swimlaneNav}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.newReleases:
        return (
          <MusicChannelSwimlane
            title={getHomeMusicSwimlaneTitle("newReleases")}
            channels={newReleaseChannels}
            sourceCount={newReleaseChannels.length}
            groupIndex={lane.groupIndex}
            playingChannelId={playingChannelId}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            onSelectChannel={openChannelInfo}
            onMore={() =>
              navigate(`/more/${HOME_MUSIC_MORE_CATEGORY.newReleases}`)
            }
            {...swimlaneNav}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.countryEssentials:
        return (
          <MusicChannelSwimlane
            title={getHomeMusicSwimlaneTitle("countryEssentials")}
            channels={countryEssentialChannels}
            sourceCount={countryEssentialChannels.length}
            groupIndex={lane.groupIndex}
            playingChannelId={playingChannelId}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            onSelectChannel={openChannelInfo}
            onMore={() =>
              navigate(`/more/${HOME_MUSIC_MORE_CATEGORY.countryEssentials}`)
            }
            {...swimlaneNav}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.popularPodcasts:
        return (
          <ContentTileSwimlane
            title="Popular podcasts in your area"
            items={podcastTiles}
            sourceCount={PODCASTS.length}
            groupIndex={lane.groupIndex}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            onSelectItem={(item) => navigate(`/podcast/${item.id}`)}
            onMore={() => navigate("/search/podcasts")}
            playingItemId={playingPodcastId}
            {...swimlaneNav}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.topRadio:
        return (
          <ContentTileSwimlane
            title="Top radio stations"
            items={radioTiles}
            sourceCount={RADIO_STATIONS.length}
            groupIndex={lane.groupIndex}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) => setFocusedIndex(lane.groupIndex, index)}
            onSelectItem={() => navigate("/search")}
            onMore={() => navigate("/search")}
            {...swimlaneNav}
          />
        );
      case BROAD_HOME_SWIMLANE_ID.recommendations:
        return (
          <MusicChannelSwimlane
            title="Recommendations"
            channels={recommendations}
            sourceCount={recommendations.length}
            groupIndex={lane.groupIndex}
            playingChannelId={playingChannelId}
            focused={isContentGroupActive(lane.groupIndex)}
            focusedIndex={getItemFocusIndex(lane.groupIndex)}
            onFocusChange={(index) =>
              setFocusedIndex(lane.groupIndex, index)
            }
            onSelectChannel={openChannelInfo}
            onMore={() => navigate("/more/recommendations")}
            {...swimlaneNav}
          />
        );
      default:
        return null;
    }
  }

  return (
    <div
      ref={shellRef}
      className={[
        "tv-home",
        "tv-screen-overlay",
        scrollableHeader ? "tv-home--header-scroll" : "tv-home--header-sticky",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="tv-home__ab-badge" aria-hidden="true">
        Header {headerLayout}
      </p>
      {!scrollableHeader ? (
        <div ref={headerRef} className="tv-screen-overlay__header">
          <TvHomeHeaderSection {...headerProps} />
        </div>
      ) : null}
      <div ref={viewportRef} className="tv-home__scroll tv-screen-overlay__scroll">
        <div
          ref={innerRef}
          className={innerClassName}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {scrollableHeader ? (
            <TvHomeHeaderSection
              {...headerProps}
              scrollable
              registerGroupRef={registerGroupRef}
            />
          ) : null}
          <div
            className="tv-home__scroll-group tv-home__content-inset"
            ref={(node) => registerGroupRef(HOME_BANNER_GROUP, node)}
          >
            <TvHomeBanner
              groupIndex={HOME_BANNER_GROUP}
              focused={isContentGroupActive(HOME_BANNER_GROUP)}
              registerItemRef={registerItemRef}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onBoundaryLeft={enterNavFromContent}
            />
          </div>

          {swimlaneLayout.map((lane) => (
            <div key={lane.id}>
              <div
                className="tv-home__scroll-group"
                ref={(node) => registerGroupRef(lane.groupIndex, node)}
              >
                {renderSwimlane(lane)}
              </div>
              {bannerAfterLaneId === lane.id ? (
                <div className="tv-home__scroll-group tv-home__content-inset">
                  <TvSwimlaneBannerAd />
                </div>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
