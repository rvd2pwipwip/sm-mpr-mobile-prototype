import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "../components/focus/FocusableButton.css";

export default function Search() {
  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
  } = useScreenContentFocus("search", { groupCount: 1, itemCount: 1 });

  return (
    <div className="tv-page">
      <h1 className="tv-page__title">Search</h1>
      <p className="tv-page__lede">
        Placeholder route. Browse and live search UI will be built for TV here.
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
            Search placeholder focus
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </div>
  );
}
