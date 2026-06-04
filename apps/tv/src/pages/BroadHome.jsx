import { useMemo, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import { PODCASTS } from "@sm-mpr/shared/data/podcasts.js";
import { RADIO_STATIONS } from "@sm-mpr/shared/data/radioStations.js";
import { showVisualAds } from "@sm-mpr/shared/utils/userTierRules.js";
import TvSwimlaneBannerAd from "../components/ads/TvSwimlaneBannerAd.jsx";
import TvHomeBanner from "../components/TvHomeBanner.jsx";
import TvHomeHeaderSection from "../components/TvHomeHeaderSection.jsx";
import ContentTileSwimlane from "../components/swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
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
import { getMusicSwimlaneSlotCount } from "../utils/swimlaneUtils.js";

const POPULAR_GROUP = HOME_FIRST_SWIMLANE_GROUP;
const PODCASTS_GROUP = POPULAR_GROUP + 1;
const RADIO_GROUP = PODCASTS_GROUP + 1;
const RECOMMENDATIONS_GROUP = RADIO_GROUP + 1;
const HOME_GROUP_COUNT = RECOMMENDATIONS_GROUP + 1;

export default function BroadHome() {
  const navigate = useNavigate();
  const { session } = usePlayback();
  const { userType } = useUserType();
  const showBannerAd = showVisualAds(userType);

  const recommendations = useMemo(() => getRecommendationsMusicChannels(), []);

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

  const popularSlotCount = getMusicSwimlaneSlotCount(MUSIC_CHANNELS.length);
  const podcastsSlotCount = getMusicSwimlaneSlotCount(PODCASTS.length);
  const radioSlotCount = getMusicSwimlaneSlotCount(RADIO_STATIONS.length);
  const recommendationsSlotCount = getMusicSwimlaneSlotCount(
    recommendations.length,
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
    groupCount: HOME_GROUP_COUNT,
    itemCounts: {
      [HOME_HEADER_GROUP]: 1,
      [HOME_BANNER_GROUP]: 1,
      [POPULAR_GROUP]: popularSlotCount,
      [PODCASTS_GROUP]: podcastsSlotCount,
      [RADIO_GROUP]: radioSlotCount,
      [RECOMMENDATIONS_GROUP]: recommendationsSlotCount,
    },
    swimlaneGroups: [
      POPULAR_GROUP,
      PODCASTS_GROUP,
      RADIO_GROUP,
      RECOMMENDATIONS_GROUP,
    ],
    defaultGroupIndex: POPULAR_GROUP,
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
    landingGroupIndex: POPULAR_GROUP,
    lastFocusableGroupIndex: RECOMMENDATIONS_GROUP,
    getFocusedElement,
  });

  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  const headerLayout = useHomeHeaderLayout();
  const scrollableHeader = headerLayout === HOME_HEADER_LAYOUT.SCROLL;

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

  return (
    <div
      className={[
        "tv-home",
        scrollableHeader ? "tv-home--header-scroll" : "tv-home--header-sticky",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <p className="tv-home__ab-badge" aria-hidden="true">
        Header {headerLayout}
      </p>
      {!scrollableHeader ? (
        <TvHomeHeaderSection {...headerProps} />
      ) : null}
      <div ref={viewportRef} className="tv-home__scroll">
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

          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(POPULAR_GROUP, node)}
          >
            <MusicChannelSwimlane
              title="Most popular music"
              channels={MUSIC_CHANNELS}
              sourceCount={MUSIC_CHANNELS.length}
              groupIndex={POPULAR_GROUP}
              playingChannelId={playingChannelId}
              focused={isContentGroupActive(POPULAR_GROUP)}
              focusedIndex={getItemFocusIndex(POPULAR_GROUP)}
              onFocusChange={(index) => setFocusedIndex(POPULAR_GROUP, index)}
              onSelectChannel={openChannelInfo}
              onMore={() => navigate("/more/music")}
              {...swimlaneNav}
            />
          </div>

          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(PODCASTS_GROUP, node)}
          >
            <ContentTileSwimlane
              title="Popular podcasts in your area"
              items={podcastTiles}
              sourceCount={PODCASTS.length}
              groupIndex={PODCASTS_GROUP}
              focused={isContentGroupActive(PODCASTS_GROUP)}
              focusedIndex={getItemFocusIndex(PODCASTS_GROUP)}
              onFocusChange={(index) => setFocusedIndex(PODCASTS_GROUP, index)}
              onSelectItem={() => navigate("/search")}
              onMore={() => navigate("/search")}
              {...swimlaneNav}
            />
          </div>

          {showBannerAd ? (
            <div className="tv-home__scroll-group tv-home__content-inset">
              <TvSwimlaneBannerAd />
            </div>
          ) : null}

          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(RADIO_GROUP, node)}
          >
            <ContentTileSwimlane
              title="Top radio stations"
              items={radioTiles}
              sourceCount={RADIO_STATIONS.length}
              groupIndex={RADIO_GROUP}
              focused={isContentGroupActive(RADIO_GROUP)}
              focusedIndex={getItemFocusIndex(RADIO_GROUP)}
              onFocusChange={(index) => setFocusedIndex(RADIO_GROUP, index)}
              onSelectItem={() => navigate("/search")}
              onMore={() => navigate("/search")}
              {...swimlaneNav}
            />
          </div>

          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(RECOMMENDATIONS_GROUP, node)}
          >
            <MusicChannelSwimlane
              title="Recommendations"
              channels={recommendations}
              sourceCount={recommendations.length}
              groupIndex={RECOMMENDATIONS_GROUP}
              playingChannelId={playingChannelId}
              focused={isContentGroupActive(RECOMMENDATIONS_GROUP)}
              focusedIndex={getItemFocusIndex(RECOMMENDATIONS_GROUP)}
              onFocusChange={(index) =>
                setFocusedIndex(RECOMMENDATIONS_GROUP, index)
              }
              onSelectChannel={openChannelInfo}
              onMore={() => navigate("/more/recommendations")}
              {...swimlaneNav}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
