import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ScreenMemoryContext = createContext(null);

export function ScreenMemoryProvider({ children }) {
  const [screenMemory, setScreenMemory] = useState({});

  const setScreenField = useCallback((screen, field, value) => {
    setScreenMemory((mem) => ({
      ...mem,
      [screen]: { ...mem[screen], [field]: value },
    }));
  }, []);

  const getScreenFocusedGroupIndex = useCallback(
    (screen, defaultGroupIndex = 0) =>
      screenMemory[screen]?.focusedGroupIndex ?? defaultGroupIndex,
    [screenMemory],
  );

  const setScreenFocusedGroupIndex = useCallback(
    (screen, groupIndex) => {
      setScreenField(screen, "focusedGroupIndex", groupIndex);
    },
    [setScreenField],
  );

  const value = useMemo(
    () => ({
      screenMemory,
      setScreenField,
      getScreenFocusedGroupIndex,
      setScreenFocusedGroupIndex,
    }),
    [
      screenMemory,
      setScreenField,
      getScreenFocusedGroupIndex,
      setScreenFocusedGroupIndex,
    ],
  );

  return (
    <ScreenMemoryContext.Provider value={value}>
      {children}
    </ScreenMemoryContext.Provider>
  );
}

export function useScreenMemory(screenId) {
  const ctx = useContext(ScreenMemoryContext);
  if (!ctx) {
    throw new Error("useScreenMemory must be used within ScreenMemoryProvider");
  }

  return {
    memory: ctx.screenMemory[screenId] ?? {},
    setField: (field, value) => ctx.setScreenField(screenId, field, value),
    getFocusedGroupIndex: (defaultGroupIndex = 0) =>
      ctx.getScreenFocusedGroupIndex(screenId, defaultGroupIndex),
    setFocusedGroupIndex: (groupIndex) =>
      ctx.setScreenFocusedGroupIndex(screenId, groupIndex),
  };
}
