import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { NavLink, useLocation } from "react-router-dom";
import { BROWSE_TABS, SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import "./SearchBrowseContentSwitcher.css";

/**
 * @typedef {{ id: string, label: string, to: string }} ContentSwitcherSegment
 */

function activeIdFromPathname(segments, pathname) {
  const sorted = [...segments].sort((a, b) => b.to.length - a.to.length);
  const hit = sorted.find((s) => pathname.startsWith(s.to));
  return hit?.id ?? segments[0]?.id ?? "";
}

/**
 * Pill-track switcher: thumb `left` + `width` track each segment's layout (variable label widths).
 * First layout on each mount skips motion; motion runs only when `activeIndex` changes afterward.
 * `transitionend` + a timeout clear the motion flag so `ResizeObserver` does not animate snaps.
 * Default: Search browse tabs + pathname. Override `segments` (+ optional `activeId`) to reuse elsewhere.
 *
 * @param {object} props
 * @param {() => void} props.onMusicLineupToggle — Search only: re-tap Music on `/search/music`
 * @param {ContentSwitcherSegment[]} [props.segments]
 * @param {string} [props.activeId] — when set, skips pathname derivation
 */
export default function SearchBrowseContentSwitcher({
  onMusicLineupToggle,
  segments: segmentsProp,
  activeId: activeIdProp,
}) {
  const location = useLocation();
  const railRef = useRef(null);
  const segmentRefs = useRef([]);

  const defaultSegments = useMemo(
    () =>
      BROWSE_TABS.map((t) => ({
        id: t.id,
        label: t.label,
        to: SEARCH_BROWSE[t.id],
      })),
    [],
  );

  const segments = segmentsProp ?? defaultSegments;

  const activeId =
    activeIdProp ??
    activeIdFromPathname(segments, location.pathname) ??
    segments[0]?.id ??
    "";

  const activeIndex = Math.max(
    0,
    segments.findIndex((s) => s.id === activeId),
  );

  const [thumb, setThumb] = useState({ left: 0, width: 0 });
  /** True only while animating a deliberate tab change — not on mount/remount or resize-only updates. */
  const [thumbMotionEnabled, setThumbMotionEnabled] = useState(false);
  const isFirstLayoutRef = useRef(true);
  const prevActiveIndexRef = useRef(activeIndex);

  const measureThumb = useCallback(() => {
    const rail = railRef.current;
    const el = segmentRefs.current[activeIndex];
    if (!rail || !el) return;

    const railRect = rail.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const left = elRect.left - railRect.left;
    const width = elRect.width;
    setThumb((prev) =>
      Math.abs(prev.left - left) < 0.25 && Math.abs(prev.width - width) < 0.25
        ? prev
        : { left, width },
    );
  }, [activeIndex]);

  useLayoutEffect(() => {
    measureThumb();

    if (isFirstLayoutRef.current) {
      isFirstLayoutRef.current = false;
      prevActiveIndexRef.current = activeIndex;
      setThumbMotionEnabled(false);
      return;
    }

    const tabChanged = prevActiveIndexRef.current !== activeIndex;
    prevActiveIndexRef.current = activeIndex;
    setThumbMotionEnabled(tabChanged);
  }, [activeIndex, measureThumb, segments, location.pathname, activeIdProp]);

  useEffect(() => {
    if (!thumbMotionEnabled) return;
    const fallbackMs = 400;
    const t = window.setTimeout(() => {
      setThumbMotionEnabled(false);
    }, fallbackMs);
    return () => window.clearTimeout(t);
  }, [thumbMotionEnabled]);

  useLayoutEffect(() => {
    const rail = railRef.current;
    if (!rail || typeof ResizeObserver === "undefined") return undefined;

    const ro = new ResizeObserver(() => {
      measureThumb();
    });
    ro.observe(rail);
    return () => ro.disconnect();
  }, [measureThumb]);

  const setSegmentRef = useCallback((i) => (el) => {
    segmentRefs.current[i] = el;
  }, []);

  return (
    <div
      className={[
        "search-browse-content-switcher",
        thumbMotionEnabled ? "search-browse-content-switcher--thumb-motion" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      role="tablist"
      aria-label="Browse content type"
    >
      <div ref={railRef} className="search-browse-content-switcher__rail">
        <div
          className="search-browse-content-switcher__thumb"
          aria-hidden={true}
          style={{
            left: thumb.left,
            width: thumb.width,
            visibility: thumb.width > 0 ? "visible" : "hidden",
          }}
          onTransitionEnd={(e) => {
            if (e.target !== e.currentTarget) return;
            if (e.propertyName !== "left" && e.propertyName !== "width") {
              return;
            }
            setThumbMotionEnabled(false);
          }}
        />
        <div className="search-browse-content-switcher__segments">
          {segments.map((tab, i) => {
            const active = tab.id === activeId;
            const labelClass = [
              "search-browse-content-switcher__label",
              active ? "search-browse-content-switcher__label--active" : "",
            ].join(" ");

            if (tab.id === "music" && onMusicLineupToggle) {
              return (
                <NavLink
                  key={tab.id}
                  ref={setSegmentRef(i)}
                  to={tab.to}
                  end
                  role="tab"
                  aria-selected={active}
                  className={({ isActive }) =>
                    [
                      "search-browse-content-switcher__segment",
                      isActive
                        ? "search-browse-content-switcher__segment--active"
                        : "",
                    ].join(" ")
                  }
                  onClick={(e) => {
                    if (location.pathname === SEARCH_BROWSE.music) {
                      e.preventDefault();
                      onMusicLineupToggle();
                    }
                  }}
                >
                  <span className={labelClass}>{tab.label}</span>
                </NavLink>
              );
            }

            return (
              <NavLink
                key={tab.id}
                ref={setSegmentRef(i)}
                to={tab.to}
                end
                role="tab"
                aria-selected={active}
                className={({ isActive }) =>
                  [
                    "search-browse-content-switcher__segment",
                    isActive
                      ? "search-browse-content-switcher__segment--active"
                      : "",
                  ].join(" ")
                }
              >
                <span className={labelClass}>{tab.label}</span>
              </NavLink>
            );
          })}
        </div>
      </div>
    </div>
  );
}
