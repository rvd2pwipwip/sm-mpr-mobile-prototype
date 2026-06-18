import { useEffect, useState } from "react";
import {
  TV_PLAYER_SCREENSAVER_FADE_MS,
  TV_PLAYER_SCREENSAVER_HOLD_MS,
  TV_SCREENSAVER_FRAME_HEIGHT,
  TV_SCREENSAVER_FRAME_WIDTH,
} from "../../constants/tvPlayerScreensaver.js";
import { pickNextScreensaverPosition } from "../../utils/tvScreensaverPosition.js";
import TvPlayerScreensaverPromo from "./TvPlayerScreensaverPromo.jsx";
import "./TvPlayerScreensaver.css";

/**
 * @param {{
 *   model: { thumbnail: string; line1: string; line2: string };
 * }} props
 */
export default function TvPlayerScreensaver({ model }) {
  const initialPosition = pickNextScreensaverPosition(
    null,
    TV_SCREENSAVER_FRAME_WIDTH,
    TV_SCREENSAVER_FRAME_HEIGHT,
  );

  const [layerA, setLayerA] = useState({
    position: initialPosition,
    opacity: 1,
  });
  const [layerB, setLayerB] = useState({
    position: initialPosition,
    opacity: 0,
  });

  useEffect(() => {
    const timers = [];
    let posA = initialPosition;
    let posB = initialPosition;

    const schedule = (fn, delayMs) => {
      const id = window.setTimeout(fn, delayMs);
      timers.push(id);
    };

    const crossfadeTo = (fromLayer, nextPosition) => {
      if (fromLayer === "a") {
        posB = nextPosition;
        setLayerB({ position: nextPosition, opacity: 0 });
        window.requestAnimationFrame(() => {
          setLayerA((current) => ({ ...current, opacity: 0 }));
          setLayerB({ position: nextPosition, opacity: 1 });
        });
        return "b";
      }

      posA = nextPosition;
      setLayerA({ position: nextPosition, opacity: 0 });
      window.requestAnimationFrame(() => {
        setLayerB((current) => ({ ...current, opacity: 0 }));
        setLayerA({ position: nextPosition, opacity: 1 });
      });
      return "a";
    };

    const runHoldCycle = (fromLayer) => {
      schedule(() => {
        const fromPosition = fromLayer === "a" ? posA : posB;
        const nextPosition = pickNextScreensaverPosition(
          fromPosition,
          TV_SCREENSAVER_FRAME_WIDTH,
          TV_SCREENSAVER_FRAME_HEIGHT,
        );
        const toLayer = crossfadeTo(fromLayer, nextPosition);

        schedule(() => {
          runHoldCycle(toLayer);
        }, TV_PLAYER_SCREENSAVER_FADE_MS);
      }, TV_PLAYER_SCREENSAVER_HOLD_MS);
    };

    runHoldCycle("a");

    return () => {
      timers.forEach((id) => window.clearTimeout(id));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const renderFrame = () => (
    <div className="tv-player-screensaver__frame">
      <div className="tv-player-screensaver__cover-row">
        <div className="tv-player-screensaver__cover">
          <img src={model.thumbnail} alt="" width={360} height={360} decoding="async" />
        </div>
        <div className="tv-player-screensaver__meta">
          <p className="tv-player-screensaver__line1">{model.line1}</p>
          <p className="tv-player-screensaver__line2">{model.line2}</p>
        </div>
      </div>
      <TvPlayerScreensaverPromo />
    </div>
  );

  return (
    <div
      className="tv-player-screensaver"
      aria-hidden="true"
      data-testid="tv-player-screensaver"
    >
      <div
        className="tv-player-screensaver__layer"
        style={{
          top: `${layerA.position.top}px`,
          left: `${layerA.position.left}px`,
          opacity: layerA.opacity,
        }}
      >
        {renderFrame()}
      </div>
      <div
        className="tv-player-screensaver__layer"
        style={{
          top: `${layerB.position.top}px`,
          left: `${layerB.position.left}px`,
          opacity: layerB.opacity,
        }}
      >
        {renderFrame()}
      </div>
    </div>
  );
}
