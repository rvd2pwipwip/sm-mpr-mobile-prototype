import { useNavigate } from "react-router-dom";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "./KeyboardWrapper.jsx";
import FocusableButton from "./FocusableButton.jsx";

const DEMO_ITEMS = [
  { id: "a", label: "Demo A" },
  { id: "b", label: "Demo B" },
  { id: "c", label: "Demo C" },
];

/**
 * Phase 1 horizontal focus row — replaced by FixedSwimlane in Phase 3.
 */
export default function DemoFocusRow({
  groupIndex = 0,
  isItemFocused,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
  onSelectItem,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();

  return (
    <section className="demo-focus-row-block" aria-label="Focus demo row">
      <p className="demo-focus-row__label">Focus demo row</p>
      <div className="demo-focus-row">
        {DEMO_ITEMS.map((item, index) => (
          <KeyboardWrapper
            key={item.id}
            selectData={item}
            onSelect={() => {
              if (onSelectItem) onSelectItem(item);
              else {
                enterContent();
                navigate("/focus-demo");
              }
            }}
            onUp={onMoveUp}
            onDown={onMoveDown}
            onLeft={onMoveLeft}
            onRight={onMoveRight}
            ref={(node) => registerItemRef(groupIndex, index, node)}
          >
            {(focusProps) => (
              <FocusableButton
                {...focusProps}
                focused={isItemFocused(groupIndex, index)}
              >
                {item.label}
              </FocusableButton>
            )}
          </KeyboardWrapper>
        ))}
      </div>
      <p className="demo-focus-row__hint">
        Arrows move focus. Enter on a demo opens Esc back-test. Left from Demo A
        or Up enters the nav. Right from nav returns here.
      </p>
    </section>
  );
}
