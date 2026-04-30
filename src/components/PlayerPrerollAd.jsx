import { useCallback, useEffect, useRef, useState } from "react";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext";
import "./PlayerPrerollAd.css";

const DEFAULT_SECONDS = 15;

/**
 * Full-screen pre-roll stub before playback (guest prototype).
 * Counts down; optional subtle Skip ends early.
 */
export default function PlayerPrerollAd({
  durationSeconds = DEFAULT_SECONDS,
  onComplete,
  title = "Advertisement",
}) {
  const { beginPrerollGracePeriod } = useGuestPrerollGrace();
  const [remaining, setRemaining] = useState(durationSeconds);
  const doneRef = useRef(false);

  useEffect(() => {
    beginPrerollGracePeriod();
  }, [beginPrerollGracePeriod]);

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
      className="player-preroll"
      role="dialog"
      aria-modal="true"
      aria-labelledby="player-preroll-title"
      aria-describedby="player-preroll-count"
    >
      <div className="player-preroll__backdrop" aria-hidden={true} />
      <div className="player-preroll__content">
        <p id="player-preroll-title" className="player-preroll__label">
          {title}
        </p>
        <p id="player-preroll-count" className="player-preroll__count" aria-live="polite">
          {remaining}
        </p>
        <p className="player-preroll__hint">Video will start automatically</p>
        <button type="button" className="player-preroll__skip" onClick={skip}>
          Skip
        </button>
      </div>
    </div>
  );
}
