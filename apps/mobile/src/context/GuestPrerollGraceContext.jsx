import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { GUEST_PREROLL_GRACE_MS } from "../constants/guestPrerollGrace";

const GuestPrerollGraceContext = createContext(null);

/**
 * In-memory only: resets when the SPA loads fresh. When the preroll UI
 * mounts (guest / free Stingray), call beginPrerollGracePeriod() — for GUEST_PREROLL_GRACE_MS, further
 * tune events skip the full-screen preroll.
 */
export function GuestPrerollGraceProvider({ children }) {
  const [graceActive, setGraceActive] = useState(false);
  const timeoutRef = useRef(null);

  const beginPrerollGracePeriod = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setGraceActive(true);
    timeoutRef.current = window.setTimeout(() => {
      setGraceActive(false);
      timeoutRef.current = null;
    }, GUEST_PREROLL_GRACE_MS);
  }, []);

  const value = useMemo(
    () => ({ graceActive, beginPrerollGracePeriod }),
    [graceActive, beginPrerollGracePeriod],
  );

  return (
    <GuestPrerollGraceContext.Provider value={value}>
      {children}
    </GuestPrerollGraceContext.Provider>
  );
}

export function useGuestPrerollGrace() {
  const ctx = useContext(GuestPrerollGraceContext);
  if (!ctx) {
    throw new Error("useGuestPrerollGrace must be used within GuestPrerollGraceProvider");
  }
  return ctx;
}
