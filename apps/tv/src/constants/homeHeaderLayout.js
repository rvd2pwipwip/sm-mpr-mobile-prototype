import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/** AB test modes for Home header chrome. */
export const HOME_HEADER_LAYOUT = {
  STICKY: "sticky",
  SCROLL: "scroll",
};

const STORAGE_KEY = "tv-home-header-layout";

/**
 * Home header layout for AB testing.
 * - Default: scroll (header is first row inside vertical scrollport)
 * - ?homeHeader=scroll | ?homeHeader=sticky (persisted in localStorage)
 *
 * Opening / without a param redirects to /?homeHeader=scroll (see Home.jsx).
 */
export function useHomeHeaderLayout() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const param = searchParams.get("homeHeader");
    if (
      param === HOME_HEADER_LAYOUT.SCROLL ||
      param === HOME_HEADER_LAYOUT.STICKY
    ) {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(STORAGE_KEY, param);
        } catch {
          /* ignore */
        }
      }
      return param;
    }

    if (typeof window !== "undefined") {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (
          stored === HOME_HEADER_LAYOUT.SCROLL ||
          stored === HOME_HEADER_LAYOUT.STICKY
        ) {
          return stored;
        }
      } catch {
        /* ignore */
      }
    }

    return HOME_HEADER_LAYOUT.SCROLL;
  }, [searchParams]);
}

/** Clear saved AB choice (run in devtools console when comparing modes). */
export function clearHomeHeaderLayoutPreference() {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
