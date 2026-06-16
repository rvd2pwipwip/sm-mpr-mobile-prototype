import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
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

function applyCatalogScopeToDocument(musicLineupMode) {
  if (typeof document === "undefined") return;
  const catalogScope = catalogScopeFromMusicLineup(musicLineupMode);
  document.documentElement.setAttribute("data-catalog-scope", catalogScope);
}

/**
 * Prototype territory stand-in (broad vs limited catalog).
 * Default **broad**. Toggle via **wordmark click** only (mouse easter egg; not in D-pad focus order).
 * Shares sessionStorage key with mobile so the same tab keeps one lineup choice.
 */
export function TerritoryProvider({ children }) {
  const [musicLineupMode, setMusicLineupModeState] = useState(
    initialMusicLineupMode,
  );

  const catalogScope = useMemo(
    () => catalogScopeFromMusicLineup(musicLineupMode),
    [musicLineupMode],
  );

  const setMusicLineupMode = useCallback((nextMode) => {
    setMusicLineupModeState((prev) => {
      const resolved =
        typeof nextMode === "function" ? nextMode(prev) : nextMode;
      return resolved === prev ? prev : resolved;
    });
  }, []);

  useLayoutEffect(() => {
    writeStoredMusicLineupMode(musicLineupMode);
    applyCatalogScopeToDocument(musicLineupMode);
  }, [musicLineupMode]);

  const toggleMusicLineupMode = useCallback(() => {
    setMusicLineupMode((prev) =>
      prev === MUSIC_LINEUP.limited ? MUSIC_LINEUP.broad : MUSIC_LINEUP.limited,
    );
  }, [setMusicLineupMode]);

  const value = useMemo(
    () => ({
      musicLineupMode,
      catalogScope,
      setMusicLineupMode,
      toggleMusicLineupMode,
    }),
    [musicLineupMode, catalogScope, setMusicLineupMode, toggleMusicLineupMode],
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
