import FilterButton from "./focus/FilterButton.jsx";
import KeyboardWrapper from "./focus/KeyboardWrapper.jsx";
import "./TvHomeContentSwitcher.css";

/**
 * Limited Home header content switcher (Music / Podcasts / Radio).
 * Local state only — does not change URL on limited catalog Home.
 */
export default function TvHomeContentSwitcher({
  segments,
  activeId,
  onActiveIdChange,
  groupIndex,
  startItemIndex = 0,
  focused = false,
  focusedItemIndex = 0,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onBoundaryLeft,
  ariaLabel = "Browse content type",
}) {
  return (
    <div
      className="tv-home-content-switcher"
      role="tablist"
      aria-label={ariaLabel}
    >
      {segments.map((segment, index) => {
        const itemIndex = startItemIndex + index;
        const isFocused = focused && focusedItemIndex === itemIndex;

        return (
          <KeyboardWrapper
            key={segment.id}
            ref={(node) => registerItemRef?.(groupIndex, itemIndex, node)}
            onSelect={() => onActiveIdChange(segment.id)}
            onUp={onMoveUp}
            onDown={onMoveDown}
            onLeft={
              itemIndex === startItemIndex ? () => onBoundaryLeft?.() : undefined
            }
          >
            {(focusProps) => (
              <FilterButton
                {...focusProps}
                label={segment.label}
                active={activeId === segment.id}
                focused={isFocused}
                role="tab"
                aria-selected={activeId === segment.id}
              />
            )}
          </KeyboardWrapper>
        );
      })}
    </div>
  );
}
