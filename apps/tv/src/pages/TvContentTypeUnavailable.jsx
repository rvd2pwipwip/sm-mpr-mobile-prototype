import { useNavigate } from "react-router-dom";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "./TvContentTypeUnavailable.css";

/**
 * Stub for podcast / radio detail until full TV layouts ship.
 * Music-only profile shows the standard "not available" copy.
 */
export default function TvContentTypeUnavailable({ contentLabel = "This content" }) {
  const navigate = useNavigate();
  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("content-unavailable", {
    groupCount: 1,
    itemCount: 1,
    navEnterEnabled: false,
  });

  return (
    <div className="tv-content-unavailable">
      <h1 className="tv-content-unavailable__title">Not available in this build</h1>
      <p className="tv-content-unavailable__lede">
        {contentLabel} screens are not in the TV prototype yet. Switch to{" "}
        <strong>Full MPR</strong> on Settings when those layouts are ready.
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
