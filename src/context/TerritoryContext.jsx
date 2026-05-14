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
 * Geo / IP is out of scope. Toggles: **Home** wordmark tap (`HomeHeader`); **Limited Browse** wordmark (`LimitedBrowse`); lineup is no longer toggled from Search Music (prototype).
 * **`sessionStorage`** key **`PROTOTYPE_MUSIC_LINEUP_STORAGE_KEY`** keeps the choice for this tab until cleared.
 * Default is **broad** (~1000+); toggle mocks **limited** (~150).
 *
 * **`catalogScope`** is the same toggle in IA terms (My Library vs Info, limited Browse landing, etc.).
 * It is derived from **`musicLineupMode`** until product needs them to differ.
 *
 * Syncs **`data-catalog-scope`** on `<html>` for CSS (limited: no bottom nav stack in scroll padding).
 */
export function TerritoryProvider({ children }) {
  const [musicLineupMode, setMusicLineupMode] = useState(initialMusicLineupMode);

  const catalogScope = useMemo(
    () => catalogScopeFromMusicLineup(musicLineupMode),
    [musicLineupMode],
  );

  useEffect(() => {
    writeStoredMusicLineupMode(musicLineupMode);
  }, [musicLineupMode]);

  useEffect(() => {
    document.documentElement.setAttribute("data-catalog-scope", catalogScope);
    return () => {
      document.documentElement.removeAttribute("data-catalog-scope");
    };
  }, [catalogScope]);

  const toggleMusicLineupMode = useCallback(() => {
    setMusicLineupMode((prev) =>
      prev === MUSIC_LINEUP.limited ? MUSIC_LINEUP.broad : MUSIC_LINEUP.limited,
    );
  }, []);

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
