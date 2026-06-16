import { useMemo, useState } from "react";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import { getTvCardGap } from "../../utils/tvLayout.js";
import {
  getEpisodeLibrarySwimlaneSlotCount,
  showsEpisodeLibraryMoreTile,
} from "../../utils/swimlaneUtils.js";
import TvListenHistoryClearDialog from "../listenHistory/TvListenHistoryClearDialog.jsx";
import SwimlaneClearTile from "../swimlanes/SwimlaneClearTile.jsx";
import SwimlaneMoreTile from "../swimlanes/SwimlaneMoreTile.jsx";
import SwimlaneRow from "../swimlanes/SwimlaneRow.jsx";
import TvEpisodeCard from "./TvEpisodeCard.jsx";
import "./TvEpisodeCardSwimlane.css";

/**
 * Horizontal episode card swimlane — search results and library rows.
 * One focus target per card (no bookmark/download on card; see player / podcast info).
 *
 * @param {{ episode: object, podcast: object }[]} rows
 * @param {'more-only' | 'clear-or-more'} [trailingTileMode]
 */
export default function TvEpisodeCardSwimlane({
  title = "Episodes",
  rows,
  sourceCount,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onSelectRow,
  onMore,
  getProgressFraction,
  trailingTileMode = "more-only",
  clearConfirm,
  onClear,
  onRailCleared,
}) {
  const { enterContent } = useTvNavFocus();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const totalCount = sourceCount ?? rows.length;
  const useClearOrMore = trailingTileMode === "clear-or-more";
  const showMoreTile = useClearOrMore
    ? showsEpisodeLibraryMoreTile(totalCount)
    : totalCount > SWIMLANE_CARD_MAX;
  const visibleRows = useMemo(
    () => rows.slice(0, SWIMLANE_CARD_MAX),
    [rows],
  );
  const slotCount = useClearOrMore
    ? getEpisodeLibrarySwimlaneSlotCount(totalCount)
    : visibleRows.length + (showMoreTile ? 1 : 0);
  const trailingIndex = useClearOrMore
    ? visibleRows.length
    : showMoreTile
      ? visibleRows.length
      : -1;

  const registerSlotRef = (index, node) => {
    registerItemRef(groupIndex, index, node);
  };

  const goToMore = () => {
    enterContent();
    onMore?.();
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (useClearOrMore && index === trailingIndex) {
      if (showMoreTile) {
        return (
          <div key="more" className="tv-episode-card-swimlane__slot">
            <KeyboardWrapper
              ref={setRef}
              onSelect={goToMore}
              onUp={onMoveUp}
              onDown={onMoveDown}
            >
              {(focusProps) => (
                <SwimlaneMoreTile
                  {...focusProps}
                  focused={isFocused}
                  className="tv-episode-card-swimlane__trailing-tile"
                />
              )}
            </KeyboardWrapper>
          </div>
        );
      }

      return (
        <div key="clear" className="tv-episode-card-swimlane__slot">
          <KeyboardWrapper
            ref={setRef}
            onSelect={() => setClearDialogOpen(true)}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <SwimlaneClearTile
                {...focusProps}
                focused={isFocused}
                ariaLabel={clearConfirm?.clearAriaLabel}
                className="tv-episode-card-swimlane__trailing-tile"
              />
            )}
          </KeyboardWrapper>
        </div>
      );
    }

    if (!useClearOrMore && showMoreTile && index === trailingIndex) {
      return (
        <div key="more" className="tv-episode-card-swimlane__slot">
          <KeyboardWrapper
            ref={setRef}
            onSelect={goToMore}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <SwimlaneMoreTile
                {...focusProps}
                focused={isFocused}
                className="tv-episode-card-swimlane__trailing-tile"
              />
            )}
          </KeyboardWrapper>
        </div>
      );
    }

    const row = visibleRows[index];
    if (!row) return null;

    const progressFraction = getProgressFraction?.(row.episode.id) ?? 0;

    const episode = {
      ...row.episode,
      thumbnail: row.episode.thumbnail ?? row.podcast.thumbnail,
    };

    return (
      <div key={row.episode.id} className="tv-episode-card-swimlane__slot">
        <KeyboardWrapper
          ref={setRef}
          selectData={row}
          onSelect={() => {
            enterContent();
            onSelectRow?.(row);
          }}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <TvEpisodeCard
              variant="swimlane"
              episode={episode}
              showTitle={row.podcast.title}
              progressFraction={progressFraction}
              focusProps={focusProps}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      </div>
    );
  };

  const dialogConfirm = clearConfirm
    ? {
        dialogTitle: clearConfirm.clearConfirmDialogTitle,
        bodyPhrase: clearConfirm.clearConfirmBodyHistoryPhrase,
        primaryLabel: clearConfirm.clearConfirmPrimaryLabel,
      }
    : undefined;

  return (
    <>
      <SwimlaneRow
        title={title}
        mixedWidth
        swimlaneProps={{
          slotCount,
          focusedIndex,
          onFocusChange,
          focused,
          onBoundaryLeft,
          registerSlotRef,
          renderSlot,
          className: "tv-episode-card-swimlane__viewport",
          slotGap: getTvCardGap(),
        }}
      />
      {useClearOrMore && clearConfirm ? (
        <TvListenHistoryClearDialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          onConfirm={() => {
            onClear?.();
            setClearDialogOpen(false);
            onRailCleared?.();
          }}
          confirm={dialogConfirm}
        />
      ) : null}
    </>
  );
}
