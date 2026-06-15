import { useMemo, useState } from "react";
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
  getLibraryHistorySwimlaneSlotCount,
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
 * Empty: placeholder + More. With items: up to 9 tiles + Clear or More.
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
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { filterListenHistory } = useContentProfile();
  const { items, clearHistoryByKind } = useListenHistory();
  const { clearAllEpisodeProgress } = usePodcastUserState();
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

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

  if (!config) return null;

  const slotCount = getLibraryHistorySwimlaneSlotCount(tiles.length);
  const isEmpty = tiles.length === 0;
  const showMoreTile = showsLibraryHistoryMoreTile(tiles.length);
  const trailingIndex = isEmpty ? 1 : visibleTiles.length;
  const morePath = myLibraryHistoryMorePath(segment);

  const clearConfirm = {
    dialogTitle: config.clearConfirmDialogTitle,
    bodyPhrase: config.clearConfirmBodyHistoryPhrase,
    primaryLabel: config.clearConfirmPrimaryLabel,
  };

  const registerSlotRef = (index, node) => {
    registerItemRef?.(groupIndex, index, node);
  };

  const goToMore = () => {
    enterContent();
    navigate(morePath);
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (index === trailingIndex) {
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
              (tile.kind === "podcast" && playingPodcastId === tile.id)
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
          slotCount,
          focusedIndex,
          onFocusChange,
          focused,
          onBoundaryLeft,
          registerSlotRef,
          renderSlot,
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
