import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation } from "react-router-dom";
import TvPlayerScreensaver from "../components/player/TvPlayerScreensaver.jsx";
import { usePlayback } from "./PlaybackContext.jsx";
import { registerTvPlayerScreensaverEscape } from "../utils/tvPlayerScreensaverEscape.js";
import { buildScreensaverModel } from "../utils/tvScreensaverModel.js";
import { getTvScreensaverIdleMs } from "../utils/tvScreensaverRoute.js";

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

function isBlockingModalOpen() {
  return Boolean(document.querySelector('[aria-modal="true"]'));
}

const TvScreensaverContext = createContext(null);

/**
 * Registers a local reason to block idle screensaver (preroll, info sheet, etc.).
 * @param {boolean} suppressed
 * @param {(() => void) | undefined} onWake
 */
export function useTvScreensaverSuppression(suppressed, onWake) {
  const ctx = useContext(TvScreensaverContext);
  if (!ctx) {
    throw new Error(
      "useTvScreensaverSuppression must be used within TvScreensaverProvider",
    );
  }

  const { registerSuppression, registerOnWake } = ctx;

  useEffect(() => {
    if (!suppressed) return undefined;
    return registerSuppression();
  }, [suppressed, registerSuppression]);

  useEffect(() => {
    if (!onWake) return undefined;
    return registerOnWake(onWake);
  }, [onWake, registerOnWake]);
}

/** @returns {{ isActive: boolean }} */
export function useTvScreensaver() {
  const ctx = useContext(TvScreensaverContext);
  if (!ctx) {
    throw new Error("useTvScreensaver must be used within TvScreensaverProvider");
  }
  return { isActive: ctx.isActive };
}

export function TvScreensaverProvider({ children }) {
  const { pathname } = useLocation();
  const { session } = usePlayback();
  const [isActive, setIsActive] = useState(false);
  const [suppressionCount, setSuppressionCount] = useState(0);
  const idleTimerRef = useRef(null);
  const isActiveRef = useRef(isActive);
  const onWakeRef = useRef(null);
  const idleMs = getTvScreensaverIdleMs(pathname);

  isActiveRef.current = isActive;

  const model = useMemo(() => buildScreensaverModel(session), [session]);

  const enabled = suppressionCount === 0;

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
    if (!enabled || isBlockingModalOpen()) return;
    idleTimerRef.current = window.setTimeout(() => {
      idleTimerRef.current = null;
      if (isBlockingModalOpen()) {
        scheduleIdleTimer();
        return;
      }
      setIsActive(true);
    }, idleMs);
  }, [clearIdleTimer, enabled, idleMs]);

  const enterScreensaver = useCallback(() => {
    if (isBlockingModalOpen()) return;
    clearIdleTimer();
    setIsActive(true);
  }, [clearIdleTimer]);

  const registerSuppression = useCallback(() => {
    setSuppressionCount((count) => count + 1);
    return () => {
      setSuppressionCount((count) => Math.max(0, count - 1));
    };
  }, []);

  const registerOnWake = useCallback((onWake) => {
    onWakeRef.current = onWake;
    return () => {
      if (onWakeRef.current === onWake) {
        onWakeRef.current = null;
      }
    };
  }, []);

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
    if (!isActive) {
      scheduleIdleTimer();
    }
  }, [idleMs, pathname, isActive, scheduleIdleTimer]);

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
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        return;
      }

      if ((event.key === "s" || event.key === "S") && !event.metaKey && !event.ctrlKey) {
        event.preventDefault();
        if (isActiveRef.current) {
          return;
        }
        enterScreensaver();
        return;
      }

      if (!isWakeKey(event)) {
        return;
      }

      if (isActiveRef.current) {
        event.preventDefault();
        dismiss();
        scheduleIdleTimer();
        return;
      }

      scheduleIdleTimer();
    };

    const onClick = () => {
      if (!isActiveRef.current) return;
      dismiss();
      scheduleIdleTimer();
    };

    window.addEventListener("keydown", onKeyDown, true);
    window.addEventListener("click", onClick, true);
    return () => {
      window.removeEventListener("keydown", onKeyDown, true);
      window.removeEventListener("click", onClick, true);
    };
  }, [dismiss, enterScreensaver, scheduleIdleTimer]);

  const value = useMemo(
    () => ({
      isActive,
      registerSuppression,
      registerOnWake,
    }),
    [isActive, registerSuppression, registerOnWake],
  );

  return (
    <TvScreensaverContext.Provider value={value}>
      {children}
      {isActive ? <TvPlayerScreensaver model={model} /> : null}
    </TvScreensaverContext.Provider>
  );
}
