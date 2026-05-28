import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export const FOCUS_ZONE_NAV = "nav";
export const FOCUS_ZONE_CONTENT = "content";

const TvNavFocusContext = createContext(null);

export function TvNavFocusProvider({ children }) {
  const [focusZone, setFocusZone] = useState(FOCUS_ZONE_CONTENT);
  const [navFocusedIndex, setNavFocusedIndex] = useState(0);

  const navExpanded = focusZone === FOCUS_ZONE_NAV;

  const enterNav = useCallback(() => {
    setFocusZone(FOCUS_ZONE_NAV);
  }, []);

  const enterContent = useCallback(() => {
    setFocusZone(FOCUS_ZONE_CONTENT);
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
      enterNav,
      enterContent,
      moveNavFocus,
    }),
    [
      focusZone,
      navExpanded,
      navFocusedIndex,
      enterNav,
      enterContent,
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
