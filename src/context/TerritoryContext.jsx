import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { catalogScopeFromMusicLineup } from "../constants/catalogScope.js";
import { MUSIC_LINEUP } from "../constants/musicLineup.js";

const TerritoryContext = createContext(null);

/**
 * Prototype-only “territory” stand-in: which **music lineup** Browse assumes.
 * Geo / IP is out of scope; designers toggle via Search tab demo affordance (see Search.jsx).
 * Default is **broad** (~1000+); tap **Music** again while already on Music browse to mock **limited** (~150).
 *
 * **`catalogScope`** is the same toggle in IA terms (My Library vs Info, and future browse chrome).
 * It is derived from **`musicLineupMode`** until product needs them to differ.
 */
export function TerritoryProvider({ children }) {
  const [musicLineupMode, setMusicLineupMode] = useState(MUSIC_LINEUP.broad);

  const toggleMusicLineupMode = useCallback(() => {
    setMusicLineupMode((prev) =>
      prev === MUSIC_LINEUP.limited ? MUSIC_LINEUP.broad : MUSIC_LINEUP.limited,
    );
  }, []);

  const catalogScope = useMemo(
    () => catalogScopeFromMusicLineup(musicLineupMode),
    [musicLineupMode],
  );

  const value = useMemo(
    () => ({
      musicLineupMode,
      catalogScope,
      setMusicLineupMode,
      toggleMusicLineupMode,
    }),
    [musicLineupMode, catalogScope, toggleMusicLineupMode],
  );

  return <TerritoryContext.Provider value={value}>{children}</TerritoryContext.Provider>;
}

export function useTerritory() {
  const ctx = useContext(TerritoryContext);
  if (!ctx) {
    throw new Error("useTerritory must be used within TerritoryProvider");
  }
  return ctx;
}
