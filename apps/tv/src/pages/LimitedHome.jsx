import { useCallback, useLayoutEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
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
import GenreFilterSwimlane from "../components/swimlanes/GenreFilterSwimlane.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import {
  getLimitedHomeChannels,
  getLimitedHomeFilterLabel,
  getLimitedHomeFilters,
} from "../utils/limitedHomeData.js";
import { getMusicSwimlaneSlotCount } from "../utils/swimlaneUtils.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";

const FILTERS_GROUP = HOME_FIRST_SWIMLANE_GROUP;
const SWIMLANE_GROUP = HOME_FIRST_SWIMLANE_GROUP + 1;

export default function LimitedHome() {
  const navigate = useNavigate();
  const { catalogScope, musicLineupMode } = useTerritory();
  const filters = useMemo(() => getLimitedHomeFilters(), []);

  const { memory, setField } = useScreenMemory("home-limited");
  const activeFilterId =
    memory.activeFilterId ?? filters[0]?.id ?? null;

  const channels = useMemo(
    () => getLimitedHomeChannels(activeFilterId),
    [activeFilterId],
  );

  const swimlaneSlotCount = getMusicSwimlaneSlotCount(channels.length);
  const activeFilterIndex = filters.findIndex(
    (filter) => filter.id === activeFilterId,
  );

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    focusedGroupIndex,
  } = useScreenContentFocus("home-limited", {
    groupCount: 4,
    itemCounts: {
      [HOME_HEADER_GROUP]: 1,
      [HOME_BANNER_GROUP]: 1,
      [FILTERS_GROUP]: filters.length,
      [SWIMLANE_GROUP]: swimlaneSlotCount,
    },
    swimlaneGroups: [FILTERS_GROUP, SWIMLANE_GROUP],
    defaultGroupIndex: SWIMLANE_GROUP,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
    navEnterEnabled: false,
  });

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    landingGroupIndex: SWIMLANE_GROUP,
  });

  const prevFocusedGroupRef = useRef(focusedGroupIndex);

  const handleSelectFilter = useCallback(
    (filterId, index) => {
      setField("activeFilterId", filterId);
      setFocusedIndex(FILTERS_GROUP, index);
      setFocusedIndex(SWIMLANE_GROUP, 0);
    },
    [setField, setFocusedIndex],
  );

  // Entering the filter row: focus the active catalog pill (not last browsed index).
  useLayoutEffect(() => {
    const enteredFilters =
      focusedGroupIndex === FILTERS_GROUP &&
      prevFocusedGroupRef.current !== FILTERS_GROUP;

    if (
      enteredFilters &&
      activeFilterIndex >= 0
    ) {
      setFocusedIndex(FILTERS_GROUP, activeFilterIndex);
    } else if (
      activeFilterIndex >= 0 &&
      memory.groupItemIndexes?.[FILTERS_GROUP] === undefined
    ) {
      setFocusedIndex(FILTERS_GROUP, activeFilterIndex);
    }

    prevFocusedGroupRef.current = focusedGroupIndex;
  }, [
    focusedGroupIndex,
    activeFilterIndex,
    memory.groupItemIndexes,
    setFocusedIndex,
  ]);

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  const laneTitle = activeFilterId
    ? getLimitedHomeFilterLabel(activeFilterId)
    : "Music";

  const headerLayout = useHomeHeaderLayout();
  const scrollableHeader = headerLayout === HOME_HEADER_LAYOUT.SCROLL;

  const headerProps = {
    groupIndex: HOME_HEADER_GROUP,
    focused: isContentGroupActive(HOME_HEADER_GROUP),
    registerItemRef,
    onMoveUp: handleMoveUp,
    onMoveDown: handleMoveDown,
  };

  return (
    <div
      className={[
        "tv-home",
        "tv-home--limited",
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
            />
          </div>

          <div
            className="tv-home__scroll-group"
            ref={(node) => registerGroupRef(FILTERS_GROUP, node)}
          >
            <GenreFilterSwimlane
              showTitle={false}
              filters={filters}
              activeFilterId={activeFilterId}
              groupIndex={FILTERS_GROUP}
              focused={isContentGroupActive(FILTERS_GROUP)}
              focusedIndex={getItemFocusIndex(FILTERS_GROUP)}
              onFocusChange={(index) => setFocusedIndex(FILTERS_GROUP, index)}
              onSelectFilter={handleSelectFilter}
              registerItemRef={registerItemRef}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
            />
          </div>

          {activeFilterId ? (
            <div
              className="tv-home__scroll-group"
              ref={(node) => registerGroupRef(SWIMLANE_GROUP, node)}
            >
              <MusicChannelSwimlane
                showTitle={false}
                title={laneTitle}
                channels={channels}
                sourceCount={channels.length}
                groupIndex={SWIMLANE_GROUP}
                focused={isContentGroupActive(SWIMLANE_GROUP)}
                focusedIndex={getItemFocusIndex(SWIMLANE_GROUP)}
                onFocusChange={(index) => setFocusedIndex(SWIMLANE_GROUP, index)}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSelectChannel={openChannelInfo}
                onMore={() => navigate(`/more/music/${activeFilterId}`)}
              />
            </div>
          ) : null}

          <p className="tv-home__catalog-proof tv-home__content-inset">
            Limited catalog Home: genre filters + channel rail. Territory:{" "}
            <strong>{musicLineupLabel(musicLineupMode)}</strong> (
            <code>{catalogScope}</code>). Wordmark click toggles to{" "}
            <code>{CATALOG_SCOPE.broad}</code> (mouse only). Header AB:{" "}
            <strong>{headerLayout}</strong> — compare{" "}
            <code>?homeHeader=sticky</code> vs <code>?homeHeader=scroll</code>.
          </p>
        </div>
      </div>
    </div>
  );
}
