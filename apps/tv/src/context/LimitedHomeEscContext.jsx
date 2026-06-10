import { createContext, useContext, useMemo, useRef } from "react";

/**
 * Optional Esc handler for limited Home (layout B: focus header mini player).
 * Returns `true` when Esc was handled (skip global back).
 */
const LimitedHomeEscContext = createContext(null);

export function LimitedHomeEscProvider({ children }) {
  const handlerRef = useRef(null);

  const api = useMemo(
    () => ({
      setHandler(fn) {
        handlerRef.current = fn;
      },
      clearHandler() {
        handlerRef.current = null;
      },
      tryHandleEscape() {
        const fn = handlerRef.current;
        if (typeof fn !== "function") return false;
        return fn() === true;
      },
    }),
    [],
  );

  return (
    <LimitedHomeEscContext.Provider value={api}>
      {children}
    </LimitedHomeEscContext.Provider>
  );
}

export function useLimitedHomeEsc() {
  return useContext(LimitedHomeEscContext);
}
