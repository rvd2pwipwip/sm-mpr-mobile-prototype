import { createContext, useContext, useMemo, useRef } from "react";

/**
 * Last-selected category slug per rail key (prototype).
 * Survives route remounts while the app stays open; cleared on full reload.
 * Each consumer passes a stable memoryKey string; see docs/Plans/ContentSwimlane-category-rail-variant.md section 3.
 */
const CategoryRailMemoryContext = createContext(null);

export function CategoryRailMemoryProvider({ children }) {
  const mapRef = useRef(new Map());

  const api = useMemo(
    () => ({
      /** @param {string} key @param {string | undefined} [fallback] */
      get(key, fallback) {
        const v = mapRef.current.get(key);
        return typeof v === "string" && v.length > 0 ? v : fallback;
      },
      /** @param {string} key @param {string} slug */
      set(key, slug) {
        if (typeof slug === "string" && slug.length > 0) {
          mapRef.current.set(key, slug);
        }
      },
    }),
    [],
  );

  return (
    <CategoryRailMemoryContext.Provider value={api}>
      {children}
    </CategoryRailMemoryContext.Provider>
  );
}

/** Fallback no-op map when provider is absent (tests / isolated renders). */
export function useCategoryRailMemory() {
  const ctx = useContext(CategoryRailMemoryContext);
  return (
    ctx ?? {
      get: (_key, fallback) => fallback,
      set: () => {},
    }
  );
}
