import { useMemo } from "react";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import ContentTileCard from "../cards/ContentTileCard.jsx";
import SwimlaneMoreTile from "./SwimlaneMoreTile.jsx";
import SwimlaneRow from "./SwimlaneRow.jsx";
import "../cards/ContentTileCard.css";

/**
 * Generic fixed swimlane — podcast / radio tiles (same cap + More as music).
 * @param {{ id: string, thumbnail: string, title: string }[]} items
 */
export default function ContentTileSwimlane({
  title,
  items,
  sourceCount,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onSelectItem,
  onMore,
  hint,
  showTitle = true,
  /** When set, tile with matching `item.id` shows the now-playing scrim (e.g. active podcast show). */
  playingItemId = null,
}) {
  const { enterContent } = useTvNavFocus();

  const showMoreTile = sourceCount > SWIMLANE_CARD_MAX;
  const visibleItems = useMemo(
    () => items.slice(0, SWIMLANE_CARD_MAX),
    [items],
  );
  const slotCount = visibleItems.length + (showMoreTile ? 1 : 0);
  const moreIndex = showMoreTile ? visibleItems.length : -1;

  const registerSlotRef = (index, node) => {
    registerItemRef(groupIndex, index, node);
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (showMoreTile && index === moreIndex) {
      return (
        <KeyboardWrapper
          key="more"
          ref={setRef}
          onSelect={() => {
            enterContent();
            onMore?.();
          }}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <SwimlaneMoreTile {...focusProps} focused={isFocused} />
          )}
        </KeyboardWrapper>
      );
    }

    const item = visibleItems[index];
    if (!item) return null;

    return (
      <KeyboardWrapper
        key={item.id}
        ref={setRef}
        selectData={item}
        onSelect={() => {
          enterContent();
          onSelectItem?.(item);
        }}
        onUp={onMoveUp}
        onDown={onMoveDown}
      >
        {(focusProps) => (
          <ContentTileCard
            {...focusProps}
            imageUrl={item.thumbnail}
            title={item.title}
            focused={isFocused}
            playing={playingItemId != null && playingItemId === item.id}
          />
        )}
      </KeyboardWrapper>
    );
  };

  return (
    <SwimlaneRow
      title={showTitle ? title : undefined}
      ariaLabel={title}
      hint={hint}
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
  );
}
