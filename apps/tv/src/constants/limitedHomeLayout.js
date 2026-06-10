import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

/** Limited Home body layout (prototype AB). */
export const LIMITED_HOME_LAYOUT = {
  /** SMTV03-style filter row + single channel rail. */
  filter: "filter",
  /** Mobile LimitedBrowse stacked taxonomy swimlanes (default). */
  stacked: "stacked",
};

const STORAGE_KEY = "tv-limited-home-layout";

export function readLimitedHomeLayout() {
  if (typeof window === "undefined") {
    return LIMITED_HOME_LAYOUT.stacked;
  }
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored === LIMITED_HOME_LAYOUT.filter) return LIMITED_HOME_LAYOUT.filter;
    if (stored === LIMITED_HOME_LAYOUT.stacked) return LIMITED_HOME_LAYOUT.stacked;
  } catch {
    /* ignore */
  }
  return LIMITED_HOME_LAYOUT.stacked;
}

/** @param {string} mode */
export function writeLimitedHomeLayout(mode) {
  if (typeof window === "undefined") return;
  try {
    sessionStorage.setItem(STORAGE_KEY, mode);
  } catch {
    /* ignore */
  }
}

/**
 * Session-only limited Home layout (`?limitedHome=filter|stacked` overrides once).
 */
export function useLimitedHomeLayout() {
  const [searchParams] = useSearchParams();

  return useMemo(() => {
    const param = searchParams.get("limitedHome");
    if (
      param === LIMITED_HOME_LAYOUT.filter ||
      param === LIMITED_HOME_LAYOUT.stacked
    ) {
      writeLimitedHomeLayout(param);
      return param;
    }
    return readLimitedHomeLayout();
  }, [searchParams]);
}
