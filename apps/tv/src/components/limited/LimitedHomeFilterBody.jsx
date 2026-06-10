import GenreFilterSwimlane from "../swimlanes/GenreFilterSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import {
  HOME_FIRST_SWIMLANE_GROUP,
} from "../../constants/homeFocusGroups.js";

const FILTERS_GROUP = HOME_FIRST_SWIMLANE_GROUP;
const SWIMLANE_GROUP = HOME_FIRST_SWIMLANE_GROUP + 1;

/**
 * Layout A — genre filter row + single channel swimlane (SMTV03 pattern).
 */
export default function LimitedHomeFilterBody({
  filters,
  activeFilterId,
  channels,
  laneTitle,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  onSelectFilter,
  onSelectChannel,
  onMore,
}) {
  return (
    <>
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
          onSelectFilter={onSelectFilter}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
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
            onMoveUp={onMoveUp}
            onMoveDown={onMoveDown}
            onSelectChannel={onSelectChannel}
            onMore={onMore}
          />
        </div>
      ) : null}
    </>
  );
}

export { FILTERS_GROUP, SWIMLANE_GROUP };
