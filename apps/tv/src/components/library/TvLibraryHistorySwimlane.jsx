import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  MY_LIBRARY_HISTORY_BY_SEGMENT,
  myLibraryHistoryMorePath,
} from "@sm-mpr/shared/constants/myLibraryHistory.js";
import { resolveListenAgainItems } from "@sm-mpr/shared/utils/listenAgainItems.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useContentProfile } from "../../context/ContentProfileContext.jsx";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import {
  getTvCardSize,
  getTvSwimlaneVisibleSlotCapacity,
} from "../../utils/tvLayout.js";
import {
  getLibraryHistoryGhostCount,
  showsLibraryHistoryMoreTile,
} from "../../utils/swimlaneUtils.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import ContentTileCard from "../cards/ContentTileCard.jsx";
import TvListenHistoryClearDialog from "../listenHistory/TvListenHistoryClearDialog.jsx";
import SwimlaneClearTile from "../swimlanes/SwimlaneClearTile.jsx";
import SwimlaneMoreTile from "../swimlanes/SwimlaneMoreTile.jsx";
import SwimlaneRow from "../swimlanes/SwimlaneRow.jsx";
import TvLibraryHistoryEmptyTile from "./TvLibraryHistoryEmptyTile.jsx";
import "../cards/ContentTileCard.css";
import "./TvLibraryHistoryEmptyTile.css";

/**
 * Typed listen-history swimlane (music, podcasts, or radio).
 * Empty: placeholder + ghost fillers. With items: tiles + ghosts + Clear or More.
 * Ghost tiles are visual-only (not focusable).
 *
 * @param {{ segment: 'music' | 'podcasts' | 'radio' }} props
 */
export default function TvLibraryHistorySwimlane({
  segment,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onHistoryCleared,
  playingChannelId = null,
  playingPodcastId = null,
  playingRadioStationId = null,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { filterListenHistory } = useContentProfile();
  const { items, clearHistoryByKind } = useListenHistory();
  const { clearAllEpisodeProgress } = usePodcastUserState();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [viewportWidth, setViewportWidth] = useState(0);

  const config = MY_LIBRARY_HISTORY_BY_SEGMENT[segment];

  const tiles = useMemo(() => {
    if (!config) return [];
    const filtered = filterListenHistory(items).filter(
      (item) => item.kind === config.listenKind,
    );
    return resolveListenAgainItems(filtered);
  }, [config, filterListenHistory, items]);

  const visibleTiles = useMemo(
    () => tiles.slice(0, SWIMLANE_CARD_MAX),
    [tiles],
  );

  const cardSize = getTvCardSize();
  const isEmpty = tiles.length === 0;
  const realTileCount = visibleTiles.length;
  const leadingCount = isEmpty ? 1 : realTileCount;
  const trailingCount = isEmpty ? 0 : 1;

  const ghostCount = useMemo(() => {
    const capacity =
      viewportWidth > 0
        ? getTvSwimlaneVisibleSlotCapacity(cardSize, viewportWidth)
        : getTvSwimlaneVisibleSlotCapacity(cardSize);
    return getLibraryHistoryGhostCount(tiles.length, capacity);
  }, [tiles.length, viewportWidth, cardSize]);

  const trailingVisualIndex = leadingCount + ghostCount;
  const showMoreTile = showsLibraryHistoryMoreTile(tiles.length);

  const visualFocusedIndex = isEmpty
    ? 0
    : focusedIndex >= realTileCount
      ? trailingVisualIndex
      : focusedIndex;

  const handleVisualFocusChange = useCallback(
    (visualIdx) => {
      if (visualIdx > leadingCount - 1 && visualIdx < trailingVisualIndex) {
        return;
      }
      if (isEmpty) {
        if (visualIdx === 0) {
          onFocusChange?.(0);
        }
        return;
      }
      const focusableIdx =
        visualIdx === trailingVisualIndex ? realTileCount : visualIdx;
      onFocusChange?.(focusableIdx);
    },
    [
      isEmpty,
      leadingCount,
      onFocusChange,
      realTileCount,
      trailingVisualIndex,
    ],
  );

  const handleArrowRight = useCallback(
    ({ focusedIndex: visualIdx }) => {
      if (ghostCount <= 0) return false;
      if (isEmpty && visualIdx === 0) {
        return true;
      }
      if (!isEmpty && visualIdx === realTileCount - 1) {
        handleVisualFocusChange(trailingVisualIndex);
        return true;
      }
      return false;
    },
    [
      ghostCount,
      handleVisualFocusChange,
      isEmpty,
      realTileCount,
      trailingVisualIndex,
    ],
  );

  const handleArrowLeft = useCallback(
    ({ focusedIndex: visualIdx }) => {
      if (ghostCount > 0 && !isEmpty && visualIdx === trailingVisualIndex) {
        handleVisualFocusChange(realTileCount - 1);
        return true;
      }
      return false;
    },
    [
      ghostCount,
      handleVisualFocusChange,
      isEmpty,
      realTileCount,
      trailingVisualIndex,
    ],
  );

  if (!config) return null;

  const visualSlotCount = leadingCount + ghostCount + trailingCount;
  const morePath = myLibraryHistoryMorePath(segment);

  const clearConfirm = {
    dialogTitle: config.clearConfirmDialogTitle,
    bodyPhrase: config.clearConfirmBodyHistoryPhrase,
    primaryLabel: config.clearConfirmPrimaryLabel,
  };

  const registerSlotRef = (visualIndex, node) => {
    if (visualIndex >= leadingCount && visualIndex < trailingVisualIndex) {
      return;
    }
    if (isEmpty) {
      if (visualIndex === 0) {
        registerItemRef?.(groupIndex, 0, node);
      }
      return;
    }
    const focusableIdx =
      visualIndex === trailingVisualIndex ? realTileCount : visualIndex;
    registerItemRef?.(groupIndex, focusableIdx, node);
  };

  const goToMore = () => {
    enterContent();
    navigate(morePath);
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (index >= leadingCount && index < trailingVisualIndex) {
      return (
        <ContentTileCard
          key={`ghost-${index}`}
          ghost
          imageUrl=""
          title=""
        />
      );
    }

    if (!isEmpty && index === trailingVisualIndex) {
      if (showMoreTile) {
        return (
          <KeyboardWrapper
            key="more"
            ref={setRef}
            onSelect={goToMore}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <SwimlaneMoreTile
                {...focusProps}
                focused={isFocused}
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
              ariaLabel={config.clearAriaLabel}
            />
          )}
        </KeyboardWrapper>
      );
    }

    if (isEmpty && index === 0) {
      return (
        <KeyboardWrapper
          key="empty"
          ref={setRef}
          onSelect={goToMore}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <TvLibraryHistoryEmptyTile
              {...focusProps}
              label={config.emptySwimlaneMessage}
              focused={isFocused}
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
            focused={isFocused}
            playing={
              (tile.kind === "music" && playingChannelId === tile.id) ||
              (tile.kind === "podcast" && playingPodcastId === tile.id) ||
              (tile.kind === "radio" && playingRadioStationId === tile.id)
            }
          />
        )}
      </KeyboardWrapper>
    );
  };

  return (
    <>
      <SwimlaneRow
        title={config.swimlaneTitle}
        swimlaneProps={{
          slotCount: visualSlotCount,
          focusedIndex: visualFocusedIndex,
          onFocusChange: handleVisualFocusChange,
          focused,
          onBoundaryLeft,
          registerSlotRef,
          renderSlot,
          onViewportWidth: setViewportWidth,
          onArrowRight: handleArrowRight,
          onArrowLeft: handleArrowLeft,
        }}
      />
      <TvListenHistoryClearDialog
        open={clearDialogOpen}
        onClose={() => setClearDialogOpen(false)}
        onConfirm={() => {
          clearHistoryByKind(config.listenKind);
          if (config.listenKind === "podcast") {
            clearAllEpisodeProgress();
          }
          setClearDialogOpen(false);
          onHistoryCleared?.();
        }}
        confirm={clearConfirm}
      />
    </>
  );
}
