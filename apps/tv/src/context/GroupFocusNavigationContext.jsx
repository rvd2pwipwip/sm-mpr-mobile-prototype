import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const GroupFocusNavigationContext = createContext(null);

/**
 * Vertical content-group navigation and per-group horizontal memory.
 * Nav is a separate zone (see TvNavFocusContext). Mini-player group deferred.
 */
export function GroupFocusNavigationProvider({ children }) {
  const [contentGroupCount, setContentGroupCount] = useState(1);
  const [focusMemory, setFocusMemory] = useState({});

  const moveFocusUp = useCallback((currentGroupIndex, setGroupIndex) => {
    const next = Math.max(currentGroupIndex - 1, 0);
    setGroupIndex(next);
    return next;
  }, []);

  const moveFocusDown = useCallback(
    (currentGroupIndex, setGroupIndex) => {
      const next = Math.min(currentGroupIndex + 1, contentGroupCount - 1);
      setGroupIndex(next);
      return next;
    },
    [contentGroupCount],
  );

  const setGroupFocusMemory = useCallback((groupIndex, memory) => {
    setFocusMemory((prev) => ({ ...prev, [groupIndex]: memory }));
  }, []);

  const getGroupFocusMemory = useCallback(
    (groupIndex) => focusMemory[groupIndex] ?? { focusedIndex: 0, offset: 0 },
    [focusMemory],
  );

  const value = useMemo(
    () => ({
      contentGroupCount,
      setContentGroupCount,
      moveFocusUp,
      moveFocusDown,
      setGroupFocusMemory,
      getGroupFocusMemory,
    }),
    [
      contentGroupCount,
      moveFocusUp,
      moveFocusDown,
      setGroupFocusMemory,
      getGroupFocusMemory,
    ],
  );

  return (
    <GroupFocusNavigationContext.Provider value={value}>
      {children}
    </GroupFocusNavigationContext.Provider>
  );
}

export function useFocusNavigation() {
  const ctx = useContext(GroupFocusNavigationContext);
  if (!ctx) {
    throw new Error(
      "useFocusNavigation must be used within GroupFocusNavigationProvider",
    );
  }
  return ctx;
}
