import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  catalogScopeFromMusicLineup,
  readStoredMusicLineupMode,
  writeStoredMusicLineupMode,
} from "../constants/catalogScope.js";
import { MUSIC_LINEUP } from "../constants/musicLineup.js";

const TerritoryContext = createContext(null);

function initialMusicLineupMode() {
  return readStoredMusicLineupMode() ?? MUSIC_LINEUP.broad;
}

/**
 * Prototype-only “territory” stand-in: which **music lineup** Browse assumes.
 * Geo / IP is out of scope. Toggles: **Home** wordmark tap (`HomeHeader`); **Search** second tap on **Music** (see `Search.jsx`).
 * **`sessionStorage`** key **`PROTOTYPE_MUSIC_LINEUP_STORAGE_KEY`** keeps the choice for this tab until cleared.
 * Default is **broad** (~1000+); toggle mocks **limited** (~150).
 *
 * **`catalogScope`** is the same toggle in IA terms (My Library vs Info, and future browse chrome).
 * It is derived from **`musicLineupMode`** until product needs them to differ.
 */
export function TerritoryProvider({ children }) {
  const [musicLineupMode, setMusicLineupMode] = useState(initialMusicLineupMode);

  useEffect(() => {
    writeStoredMusicLineupMode(musicLineupMode);
  }, [musicLineupMode]);

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
