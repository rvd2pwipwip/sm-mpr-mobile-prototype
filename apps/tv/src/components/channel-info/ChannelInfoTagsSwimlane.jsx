import { useMemo } from "react";
import FilterButton from "../focus/FilterButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import VariableSwimlane from "../swimlanes/VariableSwimlane.jsx";
import { getTvSwimlaneInlineEnd } from "../../utils/tvLayout.js";

/** Matches `--tv-focus-ring-width` + `--tv-focus-ring-gap` for parking + ring clearance. */
const TAG_FOCUS_RING_INSET = 14;

/**
 * Channel Info tag chips — variable-width horizontal swimlane (parked focus).
 */
export default function ChannelInfoTagsSwimlane({
  tags,
  groupIndex,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const items = useMemo(
    () => tags.map((tag, index) => ({ id: `${tag}-${index}`, label: tag })),
    [tags],
  );

  return (
    <div className="music-channel-info__tags" aria-label="Tags">
      <VariableSwimlane
        className="music-channel-info__tags-swimlane"
        items={items}
        itemGap={30}
        inlineGutterStart={TAG_FOCUS_RING_INSET}
        inlineGutterEnd={getTvSwimlaneInlineEnd()}
        focused={focused}
        focusedIndex={focusedIndex}
        onFocusChange={onFocusChange}
        onBoundaryLeft={onBoundaryLeft}
        renderItem={(item, index, isFocused) => (
          <KeyboardWrapper
            ref={(node) => registerItemRef(groupIndex, index, node)}
            onSelect={() => {}}
            onUp={onMoveUp}
            onDown={onMoveDown}
          >
            {(focusProps) => (
              <FilterButton
                {...focusProps}
                label={item.label}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    </div>
  );
}
