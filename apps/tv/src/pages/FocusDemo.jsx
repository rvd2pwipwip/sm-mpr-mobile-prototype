import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import DemoFocusRow from "../components/focus/DemoFocusRow.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import "../components/focus/FocusableButton.css";

/** Child route to verify Esc navigates back (Phase 1 acceptance). */
export default function FocusDemo() {
  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
  } = useScreenContentFocus("focus-demo", { groupCount: 1, itemCount: 1 });

  return (
    <div className="tv-page">
      <h1 className="tv-page__title">Esc back-test</h1>
      <p className="tv-page__lede">
        Press Esc to return to the previous screen. Focus the button below with
        the D-pad if needed.
      </p>
      <KeyboardWrapper
        onUp={handleMoveUp}
        onDown={handleMoveDown}
        onLeft={handleMoveLeft}
        onRight={handleMoveRight}
        ref={(node) => registerItemRef(0, 0, node)}
      >
        {(focusProps) => (
          <FocusableButton {...focusProps} focused={isItemFocused(0, 0)}>
            Focused placeholder
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </div>
  );
}
