import { useCallback, useLayoutEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import TvHomeHeader from "../components/TvHomeHeader.jsx";
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

const FILTERS_GROUP = 0;
const SWIMLANE_GROUP = 1;

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
  } = useScreenContentFocus("home-limited", {
    groupCount: 2,
    itemCounts: {
      [FILTERS_GROUP]: filters.length,
      [SWIMLANE_GROUP]: swimlaneSlotCount,
    },
    swimlaneGroups: [FILTERS_GROUP, SWIMLANE_GROUP],
    defaultGroupIndex: SWIMLANE_GROUP,
    navEnterEnabled: false,
  });

  const handleSelectFilter = useCallback(
    (filterId, index) => {
      setField("activeFilterId", filterId);
      setFocusedIndex(FILTERS_GROUP, index);
      setFocusedIndex(SWIMLANE_GROUP, 0);
    },
    [setField, setFocusedIndex],
  );

  useLayoutEffect(() => {
    if (
      activeFilterIndex >= 0 &&
      memory.groupItemIndexes?.[FILTERS_GROUP] === undefined
    ) {
      setFocusedIndex(FILTERS_GROUP, activeFilterIndex);
    }
  }, [activeFilterIndex, memory.groupItemIndexes, setFocusedIndex]);

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  const laneTitle = activeFilterId
    ? getLimitedHomeFilterLabel(activeFilterId)
    : "Music";

  return (
    <div className="tv-home tv-home--limited">
      <TvHomeHeader />
      <div className="tv-home__scroll">
        <div className="tv-home__banner" aria-hidden="true">
          Promo Banner
        </div>

        <GenreFilterSwimlane
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

        {activeFilterId ? (
          <MusicChannelSwimlane
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
        ) : null}

        <p className="tv-home__catalog-proof">
          Limited catalog Home: genre filters + channel rail. Territory:{" "}
          <strong>{musicLineupLabel(musicLineupMode)}</strong> (
          <code>{catalogScope}</code>). Wordmark click toggles to{" "}
          <code>{CATALOG_SCOPE.broad}</code> (mouse only).
        </p>
      </div>
    </div>
  );
}
