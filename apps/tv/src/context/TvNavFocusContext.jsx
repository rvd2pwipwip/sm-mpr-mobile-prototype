import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";

export const FOCUS_ZONE_NAV = "nav";
export const FOCUS_ZONE_CONTENT = "content";

const TvNavFocusContext = createContext(null);

export function TvNavFocusProvider({ children }) {
  const [focusZone, setFocusZone] = useState(FOCUS_ZONE_CONTENT);
  const [navFocusedIndex, setNavFocusedIndex] = useState(0);
  const navContentRestoreRef = useRef(null);
  const restorePendingRef = useRef(false);

  const navExpanded = focusZone === FOCUS_ZONE_NAV;

  const rememberNavContentFocus = useCallback((snapshot) => {
    navContentRestoreRef.current = snapshot;
  }, []);

  const enterNav = useCallback(() => {
    setFocusZone(FOCUS_ZONE_NAV);
  }, []);

  /** Leave nav via route select — do not restore prior content focus. */
  const enterContent = useCallback(() => {
    restorePendingRef.current = false;
    navContentRestoreRef.current = null;
    setFocusZone(FOCUS_ZONE_CONTENT);
  }, []);

  /** Right / Down from nav — restore last content focus (same row + index). */
  const enterContentWithRestore = useCallback(() => {
    restorePendingRef.current = true;
    setFocusZone(FOCUS_ZONE_CONTENT);
  }, []);

  const consumeNavContentRestore = useCallback(() => {
    if (!restorePendingRef.current) return null;
    restorePendingRef.current = false;
    const snapshot = navContentRestoreRef.current;
    navContentRestoreRef.current = null;
    return snapshot;
  }, []);

  const moveNavFocus = useCallback((delta) => {
    setNavFocusedIndex((prev) => {
      const next = prev + delta;
      return Math.max(0, Math.min(next, 2));
    });
  }, []);

  const value = useMemo(
    () => ({
      focusZone,
      navExpanded,
      navFocusedIndex,
      setNavFocusedIndex,
      rememberNavContentFocus,
      enterNav,
      enterContent,
      enterContentWithRestore,
      consumeNavContentRestore,
      moveNavFocus,
    }),
    [
      focusZone,
      navExpanded,
      navFocusedIndex,
      rememberNavContentFocus,
      enterNav,
      enterContent,
      enterContentWithRestore,
      consumeNavContentRestore,
      moveNavFocus,
    ],
  );

  return (
    <TvNavFocusContext.Provider value={value}>
      {children}
    </TvNavFocusContext.Provider>
  );
}

export function useTvNavFocus() {
  const ctx = useContext(TvNavFocusContext);
  if (!ctx) {
    throw new Error("useTvNavFocus must be used within TvNavFocusProvider");
  }
  return ctx;
}
