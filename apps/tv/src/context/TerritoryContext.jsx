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
} from "@sm-mpr/shared/constants/catalogScope.js";
import { MUSIC_LINEUP } from "@sm-mpr/shared/constants/musicLineup.js";

const TerritoryContext = createContext(null);

function initialMusicLineupMode() {
  return readStoredMusicLineupMode() ?? MUSIC_LINEUP.broad;
}

/**
 * Prototype territory stand-in (broad vs limited catalog).
 * Default **broad**. Toggle via **wordmark click** only (mouse easter egg; not in D-pad focus order).
 * Shares sessionStorage key with mobile so the same tab keeps one lineup choice.
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

  return (
    <TerritoryContext.Provider value={value}>{children}</TerritoryContext.Provider>
  );
}

export function useTerritory() {
  const ctx = useContext(TerritoryContext);
  if (!ctx) {
    throw new Error("useTerritory must be used within TerritoryProvider");
  }
  return ctx;
}
