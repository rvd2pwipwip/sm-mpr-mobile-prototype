import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import "./MusicPlayerCoverSkip.css";

const SKIP_COMMIT_RATIO = 0.3;
const INCOMING_SCALE_MIN = 0.6;
/** Keep in sync with --music-cover-skip-release-duration in MusicPlayerCoverSkip.css */
const RELEASE_DURATION_MS = 420;

/**
 * Horizontally draggable album art — release past threshold commits skip via `onSkip`.
 * Incoming cover slides in from the screen right (prototype uses the same image).
 *
 * @param {{ imageUrl: string, thumbSidePx: number, enabled?: boolean, onSkip: () => boolean }} props
 */
export default function MusicPlayerCoverSkip({
  imageUrl,
  thumbSidePx,
  enabled = true,
  onSkip,
}) {
  const viewportRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const draggingRef = useRef(false);
  const startXRef = useRef(0);
  const startDragXRef = useRef(0);
  const dragXRef = useRef(0);
  const animatingRef = useRef(false);
  const gestureActiveRef = useRef(false);
  const metricsRef = useRef({
    commitThreshold: 0,
    minDragX: 0,
    centerOffset: 0,
    enabled: true,
  });
  const windowListenersRef = useRef(/** @type {(() => void) | null} */ (null));

  const [viewportWidth, setViewportWidth] = useState(0);
  const [dragX, setDragX] = useState(0);
  const [animating, setAnimating] = useState(false);

  const coverWidth = Math.min(thumbSidePx, viewportWidth || thumbSidePx);
  const centerOffset =
    viewportWidth > 0 ? (viewportWidth - coverWidth) / 2 : 0;
  /** Gap so incoming cover's left edge aligns with the viewport right edge at rest. */
  const slideGap = centerOffset;
  const skipTravel = coverWidth + slideGap;
  const commitThreshold = coverWidth * SKIP_COMMIT_RATIO;
  /** Fully skip when incoming cover is centered (current cover off-screen left). */
  const minDragX = skipTravel > 0 ? -skipTravel : 0;

  const translateX = centerOffset + dragX;
  const swipeProgress =
    skipTravel > 0 ? Math.min(1, Math.max(0, -dragX / skipTravel)) : 0;
  const incomingOpacity = swipeProgress;
  const incomingScale = INCOMING_SCALE_MIN + (1 - INCOMING_SCALE_MIN) * swipeProgress;

  metricsRef.current = {
    commitThreshold,
    minDragX,
    centerOffset,
    enabled,
  };

  const syncDrag = useCallback((next) => {
    dragXRef.current = next;
    setDragX(next);
  }, []);

  useLayoutEffect(() => {
    const el = viewportRef.current;
    if (!el) return undefined;

    const measure = () => {
      setViewportWidth(el.clientWidth);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = viewportRef.current;
    if (!el || !enabled) return undefined;

    const onTouchMove = (event) => {
      if (!draggingRef.current) return;
      event.preventDefault();
    };

    el.addEventListener("touchmove", onTouchMove, { passive: false });
    return () => el.removeEventListener("touchmove", onTouchMove);
  }, [enabled]);

  const detachWindowReleaseListeners = useCallback(() => {
    const detach = windowListenersRef.current;
    if (!detach) return;
    detach();
    windowListenersRef.current = null;
  }, []);

  const finishAnimation = useCallback(
    (nextDragX, afterTransition) => {
      if (nextDragX === dragXRef.current) {
        afterTransition?.();
        return;
      }

      animatingRef.current = true;
      setAnimating(true);
      syncDrag(nextDragX);

      const el = viewportRef.current?.querySelector(".music-player-cover-skip__track");
      if (!el) {
        animatingRef.current = false;
        setAnimating(false);
        afterTransition?.();
        return;
      }

      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        el.removeEventListener("transitionend", onEnd);
        window.clearTimeout(fallbackId);
        animatingRef.current = false;
        setAnimating(false);
        afterTransition?.();
      };

      const onEnd = (event) => {
        if (event.target !== el) return;
        settle();
      };

      const fallbackId = window.setTimeout(settle, RELEASE_DURATION_MS + 40);

      el.addEventListener("transitionend", onEnd);
    },
    [syncDrag],
  );

  const rearmTrackSilently = useCallback(() => {
    if (dragXRef.current === 0) return;
    const track = viewportRef.current?.querySelector(".music-player-cover-skip__track");
    const incoming = track?.querySelector(".music-player-cover-skip__slide--incoming");
    if (track) track.style.transition = "none";
    if (incoming) incoming.style.transition = "none";
    syncDrag(0);
    if (track) {
      void track.offsetWidth;
      track.style.removeProperty("transition");
      incoming?.style.removeProperty("transition");
    }
  }, [syncDrag]);

  const releaseGesture = useCallback((options = {}) => {
    const { forceCommit = false } = options;
    if (!draggingRef.current) return;
    draggingRef.current = false;
    detachWindowReleaseListeners();

    if (!gestureActiveRef.current) {
      gestureActiveRef.current = false;
      return;
    }
    gestureActiveRef.current = false;

    const { commitThreshold: threshold, minDragX: minX, enabled: isEnabled } =
      metricsRef.current;
    if (!isEnabled) return;

    const currentDrag = dragXRef.current;
    if (currentDrag === 0) {
      return;
    }

    if (forceCommit || currentDrag <= -threshold) {
      finishAnimation(minX, () => {
        const allowed = onSkip();
        if (!allowed) {
          finishAnimation(0);
          return;
        }
        // Incoming is centered at minX — same pixels as rest; re-arm without a visible jump.
        rearmTrackSilently();
      });
      return;
    }

    finishAnimation(0);
  }, [detachWindowReleaseListeners, finishAnimation, onSkip, rearmTrackSilently]);

  const attachWindowReleaseListeners = useCallback(() => {
    if (windowListenersRef.current) return;

    const onWindowRelease = () => {
      releaseGesture();
    };

    window.addEventListener("touchend", onWindowRelease, { passive: true });
    window.addEventListener("touchcancel", onWindowRelease, { passive: true });

    windowListenersRef.current = () => {
      window.removeEventListener("touchend", onWindowRelease);
      window.removeEventListener("touchcancel", onWindowRelease);
    };
  }, [releaseGesture]);

  useEffect(() => () => detachWindowReleaseListeners(), [detachWindowReleaseListeners]);

  const onTouchStart = (event) => {
    if (!enabled || animatingRef.current) return;
    const touch = event.touches[0];
    if (!touch) return;
    rearmTrackSilently();
    draggingRef.current = true;
    gestureActiveRef.current = dragXRef.current < 0;
    startXRef.current = touch.clientX;
    startDragXRef.current = dragXRef.current;
    attachWindowReleaseListeners();
  };

  const onTouchMove = (event) => {
    if (!draggingRef.current || !enabled) return;
    const touch = event.touches[0];
    if (!touch) return;
    const delta = touch.clientX - startXRef.current;

    if (!gestureActiveRef.current) {
      if (delta >= 0) return;
      gestureActiveRef.current = true;
    }

    const { minDragX: minX, centerOffset: offset } = metricsRef.current;
    const next = Math.max(minX, Math.min(0, startDragXRef.current + delta));
    syncDrag(next);

    const viewport = viewportRef.current;
    if (!viewport) return;

    const rect = viewport.getBoundingClientRect();
    const coverPastLeftEdge = offset + next <= 0;
    const fingerPastLeftEdge = touch.clientX <= rect.left;

    if (coverPastLeftEdge || fingerPastLeftEdge) {
      releaseGesture({ forceCommit: true });
    }
  };

  const onTouchEnd = () => {
    releaseGesture();
  };

  const onTouchCancel = () => {
    releaseGesture();
  };

  return (
    <div
      className={[
        "music-player-cover-skip",
        enabled ? "" : "music-player-cover-skip--disabled",
      ]
        .filter(Boolean)
        .join(" ")}
      style={{
        "--music-cover-skip-size": `${coverWidth}px`,
        "--music-cover-skip-gap": `${slideGap}px`,
        "--music-cover-skip-incoming-opacity": String(incomingOpacity),
        "--music-cover-skip-incoming-scale": String(incomingScale),
      }}
    >
      <div
        ref={viewportRef}
        className="music-player-cover-skip__viewport"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchCancel}
      >
        <div
          className={[
            "music-player-cover-skip__track",
            animating ? "music-player-cover-skip__track--animating" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          style={{ transform: `translateX(${translateX}px)` }}
        >
          <div className="music-player-cover-skip__slide" aria-hidden={false}>
            <img src={imageUrl} alt="" width={coverWidth} height={coverWidth} decoding="async" />
          </div>
          <div
            className="music-player-cover-skip__gap"
            aria-hidden={true}
          />
          <div
            className="music-player-cover-skip__slide music-player-cover-skip__slide--incoming"
            aria-hidden={true}
          >
            <img src={imageUrl} alt="" width={coverWidth} height={coverWidth} decoding="async" />
          </div>
        </div>
      </div>
    </div>
  );
}
