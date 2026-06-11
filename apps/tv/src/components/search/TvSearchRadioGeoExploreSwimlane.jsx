import { useMemo } from "react";
import FilterButton from "../focus/FilterButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import VariableSwimlane from "../swimlanes/VariableSwimlane.jsx";

/**
 * Geo sub-region pills — VariableSwimlane with standard swimlane gutters (aligned
 * with channel card rows). Horizontal scroll is preserved when leaving the row.
 */
export default function TvSearchRadioGeoExploreSwimlane({
  title,
  filters,
  groupIndex,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onSelectFilter,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const items = useMemo(
    () => filters.map((filter) => ({ id: filter.id, label: filter.label })),
    [filters],
  );

  return (
    <section className="swimlane-row tv-search-radio-geo__explore" aria-label={title}>
      <h2 className="swimlane-row__title">{title}</h2>
      <VariableSwimlane
        items={items}
        itemGap={30}
        focused={focused}
        focusedIndex={focusedIndex}
        onFocusChange={onFocusChange}
        onBoundaryLeft={onBoundaryLeft}
        renderItem={(filter, index, isFocused) => (
          <KeyboardWrapper
            ref={(node) => registerItemRef(groupIndex, index, node)}
            onSelect={() => onSelectFilter(filter.id, index)}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <FilterButton
                {...focusProps}
                label={filter.label}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    </section>
  );
}
