import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resolveListenAgainItems } from "@sm-mpr/shared/utils/listenAgainItems.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getTvCardSizeCompact } from "../../utils/tvLayout.js";
import { showsListenAgainMoreTile } from "../../utils/swimlaneUtils.js";
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
  onMore = "/more/listen-again",
  onHistoryCleared,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { clearListenHistory } = useListenHistory();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const tiles = useMemo(
    () => resolveListenAgainItems(historyItems),
    [historyItems],
  );

  const visibleTiles = useMemo(
    () => tiles.slice(0, SWIMLANE_CARD_MAX),
    [tiles],
  );

  if (tiles.length === 0) {
    return null;
  }

  const slotCount = visibleTiles.length + 1;
  const trailingIndex = visibleTiles.length;
  const showMoreTile = showsListenAgainMoreTile(tiles.length);
  const compactCardSize = getTvCardSizeCompact();

  const registerSlotRef = (index, node) => {
    registerItemRef?.(groupIndex, index, node);
  };

  const isPlaying = (tile) => {
    if (tile.kind === "music" && playingChannelId) {
      return playingChannelId === tile.id;
    }
    if (tile.kind === "podcast" && playingPodcastId) {
      return playingPodcastId === tile.id;
    }
    return false;
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (index === trailingIndex) {
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
          slotCount,
          focusedIndex,
          onFocusChange,
          focused,
          onBoundaryLeft,
          registerSlotRef,
          renderSlot,
          slotWidth: compactCardSize,
          className: "tv-listen-again-swimlane__scroller",
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
