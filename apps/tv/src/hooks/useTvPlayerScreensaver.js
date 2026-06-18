import { useCallback, useEffect, useRef, useState } from "react";
import { TV_PLAYER_SCREENSAVER_IDLE_MS } from "../constants/tvPlayerScreensaver.js";
import { registerTvPlayerScreensaverEscape } from "../utils/tvPlayerScreensaverEscape.js";

const WAKE_KEYS = new Set([
  "ArrowUp",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "Enter",
  " ",
  "Select",
]);

function isWakeKey(event) {
  return WAKE_KEYS.has(event.key);
}

/**
 * Idle timer + wake handling for full-screen player screensaver.
 * @param {{ enabled: boolean; onWake?: () => void }} options
 */
export function useTvPlayerScreensaver({ enabled, onWake }) {
  const [isActive, setIsActive] = useState(false);
  const idleTimerRef = useRef(null);
  const isActiveRef = useRef(isActive);
  const onWakeRef = useRef(onWake);
  isActiveRef.current = isActive;
  onWakeRef.current = onWake;

  const clearIdleTimer = useCallback(() => {
    if (idleTimerRef.current != null) {
      window.clearTimeout(idleTimerRef.current);
      idleTimerRef.current = null;
    }
  }, []);

  const dismiss = useCallback(() => {
    setIsActive(false);
    onWakeRef.current?.();
  }, []);

  const scheduleIdleTimer = useCallback(() => {
    clearIdleTimer();
    if (!enabled) return;
    idleTimerRef.current = window.setTimeout(() => {
      setIsActive(true);
      idleTimerRef.current = null;
    }, TV_PLAYER_SCREENSAVER_IDLE_MS);
  }, [clearIdleTimer, enabled]);

  const enterScreensaver = useCallback(() => {
    clearIdleTimer();
    setIsActive(true);
  }, [clearIdleTimer]);

  useEffect(() => {
    if (!enabled) {
      clearIdleTimer();
      setIsActive(false);
      return;
    }
    if (!isActive) {
      scheduleIdleTimer();
    }
    return clearIdleTimer;
  }, [enabled, isActive, scheduleIdleTimer, clearIdleTimer]);

  useEffect(() => {
    const bridge = {
      get isActive() {
        return isActiveRef.current;
      },
      dismiss,
    };
    return registerTvPlayerScreensaverEscape(bridge);
  }, [dismiss]);

  useEffect(() => {
    if (!enabled) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        return;
      }

      if ((event.key === "s" || event.key === "S") && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        enterScreensaver();
        return;
      }

      if (!isWakeKey(event)) {
        return;
      }

      if (isActive) {
        event.preventDefault();
        dismiss();
        scheduleIdleTimer();
        return;
      }

      scheduleIdleTimer();
    };

    const onClick = () => {
      if (!isActive) return;
      dismiss();
      scheduleIdleTimer();
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("click", onClick, true);
    };
  }, [enabled, isActive, dismiss, enterScreensaver, scheduleIdleTimer]);

  return {
    isActive,
    dismiss,
    enterScreensaver,
  };
}
