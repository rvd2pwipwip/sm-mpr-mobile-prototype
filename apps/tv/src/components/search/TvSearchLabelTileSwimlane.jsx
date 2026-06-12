import { useMemo } from "react";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FixedSwimlane from "../swimlanes/FixedSwimlane.jsx";
import SwimlaneMoreTile from "../swimlanes/SwimlaneMoreTile.jsx";
import TvSearchLabelTile from "./TvSearchLabelTile.jsx";
import "../swimlanes/SwimlaneRow.css";

/**
 * Horizontal row of label-only square tiles (broad vibe sub-tags, radio geo rows).
 */
export default function TvSearchLabelTileSwimlane({
  title,
  tiles,
  sourceCount,
  onMore,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onSelectTile,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  showTitle = true,
  ariaLabel = "Browse sub-tags",
}) {
  const { enterContent } = useTvNavFocus();
  const totalCount = sourceCount ?? tiles.length;
  const showMoreTile = totalCount > SWIMLANE_CARD_MAX;
  const visibleTiles = useMemo(
    () => tiles.slice(0, SWIMLANE_CARD_MAX),
    [tiles],
  );
  const slotCount = visibleTiles.length + (showMoreTile ? 1 : 0);
  const moreIndex = showMoreTile ? visibleTiles.length : -1;

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

    const tile = visibleTiles[index];
    if (!tile) return null;

    return (
      <KeyboardWrapper
        key={tile.slug ?? tile.id ?? index}
        ref={setRef}
        onSelect={() => onSelectTile(tile, index)}
        onUp={onMoveUp}
        onDown={onMoveDown}
      >
        {(focusProps) => (
          <TvSearchLabelTile
            {...focusProps}
            label={tile.label}
            focused={isFocused}
          />
        )}
      </KeyboardWrapper>
    );
  };

  const registerSlotRef = (index, node) => {
    registerItemRef(groupIndex, index, node);
  };

  return (
    <section className="swimlane-row" aria-label={ariaLabel}>
      {showTitle && title ? (
        <h2 className="swimlane-row__title">{title}</h2>
      ) : null}
      <FixedSwimlane
        slotCount={slotCount}
        focused={focused}
        focusedIndex={focusedIndex}
        onFocusChange={onFocusChange}
        onBoundaryLeft={onBoundaryLeft}
        registerSlotRef={registerSlotRef}
        renderSlot={renderSlot}
      />
    </section>
  );
}
