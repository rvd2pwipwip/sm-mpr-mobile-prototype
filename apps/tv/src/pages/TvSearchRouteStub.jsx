import { useNavigate } from "react-router-dom";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";

/** Placeholder for Search browse / More drill routes (Phases 2–6). */
export default function TvSearchRouteStub({ title = "Search" }) {
  const navigate = useNavigate();
  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("search-route-stub", {
    groupCount: 1,
    itemCount: 1,
  });

  return (
    <div className="tv-page">
      <h1 className="tv-page__title">{title}</h1>
      <p className="tv-page__lede">
        This Search drill-down route is registered for navigation. Full grid UI
        ships in a later Search &amp; Browse phase.
      </p>
      <KeyboardWrapper
        ref={(node) => registerItemRef(0, 0, node)}
        onSelect={() => navigate(-1)}
        onUp={handleMoveUp}
        onDown={handleMoveDown}
        onLeft={handleMoveLeft}
        onRight={handleMoveRight}
      >
        {(focusProps) => (
          <FocusableButton {...focusProps} focused={isItemFocused(0, 0)}>
            Go back
          </FocusableButton>
        )}
      </KeyboardWrapper>
    </div>
  );
}
