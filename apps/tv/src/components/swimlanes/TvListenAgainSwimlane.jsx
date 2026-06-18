import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveListenAgainItems } from "@sm-mpr/shared/utils/listenAgainItems.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import {
  getTvCardSizeCompact,
  getTvSwimlaneVisibleSlotCapacity,
} from "../../utils/tvLayout.js";
import {
  getListenAgainGhostCount,
  showsListenAgainMoreTile,
} from "../../utils/swimlaneUtils.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import ContentTileCard from "../cards/ContentTileCard.jsx";
import TvListenHistoryClearDialog from "../listenHistory/TvListenHistoryClearDialog.jsx";
import SwimlaneClearTile from "./SwimlaneClearTile.jsx";
import SwimlaneMoreTile from "./SwimlaneMoreTile.jsx";
import SwimlaneRow from "./SwimlaneRow.jsx";
import "../cards/ContentTileCard.css";
import "./TvListenAgainSwimlane.css";

/**
 * Mixed-type Listen again row — compact thumb-only tiles (mobile Home parity).
 * Ghost fillers pad the row when history is short; they are visual-only (not focusable).
 *
 * @param {{ kind: string, id: string }[]} historyItems
 */
export default function TvListenAgainSwimlane({
  title = "Listen again",
  historyItems,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  playingChannelId = null,
  playingPodcastId = null,
  playingRadioStationId = null,
  onMore = "/more/listen-again",
  onHistoryCleared,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { clearListenHistory } = useListenHistory();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  const tiles = useMemo(
    () => resolveListenAgainItems(historyItems),
    [historyItems],
  );

  const visibleTiles = useMemo(
    () => tiles.slice(0, SWIMLANE_CARD_MAX),
    [tiles],
  );

  const compactCardSize = getTvCardSizeCompact();
  const realTileCount = visibleTiles.length;

  const ghostCount = useMemo(() => {
    const capacity =
      viewportWidth > 0
        ? getTvSwimlaneVisibleSlotCapacity(compactCardSize, viewportWidth)
        : getTvSwimlaneVisibleSlotCapacity(compactCardSize);
    return getListenAgainGhostCount(tiles.length, capacity);
  }, [tiles.length, viewportWidth, compactCardSize]);

  const trailingVisualIndex = realTileCount + ghostCount;
  const showMoreTile = showsListenAgainMoreTile(tiles.length);

  const visualFocusedIndex =
    focusedIndex >= realTileCount ? trailingVisualIndex : focusedIndex;

  const handleVisualFocusChange = useCallback(
    (visualIdx) => {
      if (visualIdx > realTileCount - 1 && visualIdx < trailingVisualIndex) {
        return;
      }
      const focusableIdx =
        visualIdx === trailingVisualIndex ? realTileCount : visualIdx;
      onFocusChange?.(focusableIdx);
    },
    [onFocusChange, trailingVisualIndex, realTileCount],
  );

  const handleArrowRight = useCallback(
    ({ focusedIndex: visualIdx }) => {
      if (ghostCount > 0 && visualIdx === realTileCount - 1) {
        handleVisualFocusChange(trailingVisualIndex);
        return true;
      }
      return false;
    },
    [ghostCount, handleVisualFocusChange, trailingVisualIndex, realTileCount],
  );

  const handleArrowLeft = useCallback(
    ({ focusedIndex: visualIdx }) => {
      if (ghostCount > 0 && visualIdx === trailingVisualIndex) {
        handleVisualFocusChange(realTileCount - 1);
        return true;
      }
      return false;
    },
    [ghostCount, handleVisualFocusChange, trailingVisualIndex, realTileCount],
  );

  if (tiles.length === 0) {
    return null;
  }

  const visualSlotCount = trailingVisualIndex + 1;

  const registerSlotRef = (visualIndex, node) => {
    if (visualIndex >= realTileCount && visualIndex < trailingVisualIndex) {
      return;
    }
    const focusableIdx =
      visualIndex === trailingVisualIndex ? realTileCount : visualIndex;
    registerItemRef?.(groupIndex, focusableIdx, node);
  };

  const isPlaying = (tile) => {
    if (tile.kind === "music" && playingChannelId) {
      return playingChannelId === tile.id;
    }
    if (tile.kind === "podcast" && playingPodcastId) {
      return playingPodcastId === tile.id;
    }
    if (tile.kind === "radio" && playingRadioStationId) {
      return playingRadioStationId === tile.id;
    }
    return false;
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (index >= realTileCount && index < trailingVisualIndex) {
      return (
        <ContentTileCard
          key={`ghost-${index}`}
          ghost
          compact
          imageUrl=""
          title=""
        />
      );
    }

    if (index === trailingVisualIndex) {
      if (showMoreTile) {
        return (
          <KeyboardWrapper
            key="more"
            ref={setRef}
            onSelect={() => {
              enterContent();
              navigate(
                typeof onMore === "string" ? onMore : "/more/listen-again",
              );
            }}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <SwimlaneMoreTile
                {...focusProps}
                focused={isFocused}
                className="tv-listen-again-swimlane__more"
              />
            )}
          </KeyboardWrapper>
        );
      }

      return (
        <KeyboardWrapper
          key="clear"
          ref={setRef}
          onSelect={() => setClearDialogOpen(true)}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <SwimlaneClearTile
              {...focusProps}
              focused={isFocused}
              className="tv-listen-again-swimlane__clear"
            />
          )}
        </KeyboardWrapper>
      );
    }

    const tile = visibleTiles[index];
    if (!tile) return null;

    return (
      <KeyboardWrapper
        key={`${tile.kind}-${tile.id}`}
        ref={setRef}
        onSelect={() => {
          enterContent();
          navigate(tile.path);
        }}
        onUp={onMoveUp}
        onDown={onMoveDown}
      >
        {(focusProps) => (
          <ContentTileCard
            {...focusProps}
            imageUrl={tile.thumbnail}
            title={tile.title}
            compact
            focused={isFocused}
            playing={isPlaying(tile)}
          />
        )}
      </KeyboardWrapper>
    );
  };

  return (
    <>
      <SwimlaneRow
        title={title}
        swimlaneProps={{
          slotCount: visualSlotCount,
          focusedIndex: visualFocusedIndex,
          onFocusChange: handleVisualFocusChange,
          focused,
          onBoundaryLeft,
          registerSlotRef,
          renderSlot,
          slotWidth: compactCardSize,
          className: "tv-listen-again-swimlane__scroller",
          onViewportWidth: setViewportWidth,
          onArrowRight: handleArrowRight,
          onArrowLeft: handleArrowLeft,
        }}
      />
      <TvListenHistoryClearDialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={() => {
          clearListenHistory();
          setClearDialogOpen(false);
          onHistoryCleared?.();
        }}
      />
    </>
  );
}
