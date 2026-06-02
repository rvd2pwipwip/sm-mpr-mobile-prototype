import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
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
import TvHomeBanner from "../components/TvHomeBanner.jsx";
import TvHomeHeaderSection from "../components/TvHomeHeaderSection.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
import { getMusicSwimlaneSlotCount } from "../utils/swimlaneUtils.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";

const POPULAR_GROUP = HOME_FIRST_SWIMLANE_GROUP;
const RECOMMENDATIONS_GROUP = HOME_FIRST_SWIMLANE_GROUP + 1;

export default function BroadHome() {
  const navigate = useNavigate();
  const { catalogScope, musicLineupMode } = useTerritory();

  const recommendations = useMemo(() => getRecommendationsMusicChannels(), []);

  const popularSlotCount = getMusicSwimlaneSlotCount(MUSIC_CHANNELS.length);
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
  } = useScreenContentFocus("home-broad", {
    groupCount: 4,
    itemCounts: {
      [HOME_HEADER_GROUP]: 1,
      [HOME_BANNER_GROUP]: 1,
      [POPULAR_GROUP]: popularSlotCount,
      [RECOMMENDATIONS_GROUP]: recommendationsSlotCount,
    },
    swimlaneGroups: [POPULAR_GROUP, RECOMMENDATIONS_GROUP],
    defaultGroupIndex: POPULAR_GROUP,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: POPULAR_GROUP,
  });

  const playingChannelId = MUSIC_CHANNELS[0]?.id ?? null;

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
              onBoundaryLeft={enterNavFromContent}
              registerItemRef={registerItemRef}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onSelectChannel={openChannelInfo}
              onMore={() => navigate("/more/music")}
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
              focused={isContentGroupActive(RECOMMENDATIONS_GROUP)}
              focusedIndex={getItemFocusIndex(RECOMMENDATIONS_GROUP)}
              onFocusChange={(index) =>
                setFocusedIndex(RECOMMENDATIONS_GROUP, index)
              }
              onBoundaryLeft={enterNavFromContent}
              registerItemRef={registerItemRef}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onSelectChannel={openChannelInfo}
              onMore={() => navigate("/more/recommendations")}
            />
          </div>

          <p className="tv-home__catalog-proof tv-home__content-inset">
            Shared catalog: <strong>{MUSIC_CHANNELS.length}</strong> music channels
            from <code>@sm-mpr/shared</code>. Territory:{" "}
            <strong>{musicLineupLabel(musicLineupMode)}</strong> (
            <code>{catalogScope}</code>). Wordmark click toggles limited / broad
            (mouse only). Header AB: <strong>{headerLayout}</strong> — compare{" "}
            <code>?homeHeader=sticky</code> vs <code>?homeHeader=scroll</code>{" "}
            (plain <code>/</code> uses localStorage; run{" "}
            <code>localStorage.removeItem(&quot;tv-home-header-layout&quot;)</code>{" "}
            to reset).
          </p>
        </div>
      </div>
    </div>
  );
}
