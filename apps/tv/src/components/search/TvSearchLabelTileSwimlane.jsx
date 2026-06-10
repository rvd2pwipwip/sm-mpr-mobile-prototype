import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FixedSwimlane from "../swimlanes/FixedSwimlane.jsx";
import TvSearchLabelTile from "./TvSearchLabelTile.jsx";
import "../swimlanes/SwimlaneRow.css";

/**
 * Horizontal row of label-only square tiles (broad vibe sub-tags).
 */
export default function TvSearchLabelTileSwimlane({
  tiles,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onSelectTile,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  ariaLabel = "Browse sub-tags",
}) {
  const slotCount = tiles.length;

  const renderSlot = (index, isFocused, setRef) => {
    const tile = tiles[index];
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
