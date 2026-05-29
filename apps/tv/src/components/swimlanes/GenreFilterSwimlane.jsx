import FilterButton from "../focus/FilterButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import VariableSwimlane from "./VariableSwimlane.jsx";
import "./SwimlaneRow.css";

/**
 * Genre / filter button row for limited-catalog TV Home (same stack pattern as SwimlaneRow).
 */
export default function GenreFilterSwimlane({
  filters,
  activeFilterId,
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onSelectFilter,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const activeIndex = filters.findIndex((filter) => filter.id === activeFilterId);

  return (
    <section className="swimlane-row" aria-label="Browse by genre">
      <h2 className="swimlane-row__title">Browse by genre</h2>
      <VariableSwimlane
        items={filters}
        focused={focused}
        focusedIndex={focusedIndex}
        onFocusChange={onFocusChange}
        onBoundaryLeft={onBoundaryLeft}
        ensureActiveVisible
        activeIndex={activeIndex >= 0 ? activeIndex : 0}
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
                active={filter.id === activeFilterId}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    </section>
  );
}
