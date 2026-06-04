import { useCallback, useEffect, useRef, useState } from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import { useGuestPrerollGrace } from "../../context/GuestPrerollGraceContext.jsx";
import "./TvPlayerPrerollAd.css";

const DEFAULT_SECONDS = 15;

/**
 * Full-screen pre-roll before music playback (guest / free Stingray tiers).
 */
export default function TvPlayerPrerollAd({
  durationSeconds = DEFAULT_SECONDS,
  onComplete,
  title = "Advertisement",
}) {
  const { beginPrerollGracePeriod } = useGuestPrerollGrace();
  const [remaining, setRemaining] = useState(durationSeconds);
  const doneRef = useRef(false);
  const skipRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

  useEffect(() => {
    beginPrerollGracePeriod();
  }, [beginPrerollGracePeriod]);

  useEffect(() => {
    skipRef.current?.focus({ preventScroll: true });
  }, []);

  const complete = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    onComplete();
  }, [onComplete]);

  useEffect(() => {
    if (remaining <= 0) {
      complete();
      return;
    }
    const id = window.setTimeout(() => setRemaining((r) => r - 1), 1000);
    return () => window.clearTimeout(id);
  }, [remaining, complete]);

  const skip = () => {
    setRemaining(0);
  };

  return (
    <div
      className="tv-player-preroll"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-player-preroll-title"
      aria-describedby="tv-player-preroll-count"
    >
      <div className="tv-player-preroll__backdrop" aria-hidden={true} />
      <div className="tv-player-preroll__content">
        <p id="tv-player-preroll-title" className="tv-player-preroll__label">
          {title}
        </p>
        <p
          id="tv-player-preroll-count"
          className="tv-player-preroll__count"
          aria-live="polite"
        >
          {remaining}
        </p>
        <p className="tv-player-preroll__hint">Video will start automatically</p>
        <KeyboardWrapper ref={skipRef} onSelect={skip}>
          {(focusProps) => (
            <FocusableButton
              {...focusProps}
              type="button"
              className="tv-player-preroll__skip"
              focused
            >
              Skip
            </FocusableButton>
          )}
        </KeyboardWrapper>
      </div>
    </div>
  );
}
