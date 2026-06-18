import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import "./TvScrollbarScrollPane.css";

const SCROLL_STEP_PX = 48;
const SCROLL_TOP_EPSILON = 2;

/**
 * Scroll region with hidden native bar + focusable thumb (Channel Info More dialog parity).
 */
export default function TvScrollbarScrollPane({
  children,
  className = "",
  scrollClassName = "",
  scrollbarAriaLabel = "Scroll content",
  onEscape,
}) {
  const bodyRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const scrollbarRailRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const scrollbarThumbRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const canScrollRef = useRef(false);
  const scrollFocusedRef = useRef(false);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollFocused, setScrollFocused] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    trackHeight: 0,
  });

  const syncScrollMetrics = useCallback(() => {
    const el = bodyRef.current;
    if (!el) return;
    const trackHeight = scrollbarRailRef.current?.clientHeight ?? 0;
    const scrollable = el.scrollHeight > el.clientHeight + 1;
    canScrollRef.current = scrollable;
    setCanScroll(scrollable);
    setScrollMetrics({
      scrollTop: el.scrollTop,
      scrollHeight: el.scrollHeight,
      clientHeight: el.clientHeight,
      trackHeight,
    });
  }, []);

  useLayoutEffect(() => {
    syncScrollMetrics();
    const el = bodyRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(syncScrollMetrics);
    ro.observe(el);
    return () => ro.disconnect();
  }, [children, syncScrollMetrics]);

  useLayoutEffect(() => {
    if (!canScroll) return;
    syncScrollMetrics();
  }, [canScroll, syncScrollMetrics]);

  const scrollBody = useCallback(
    (delta) => {
      const el = bodyRef.current;
      if (!el) return;
      el.scrollBy({ top: delta, behavior: "auto" });
      syncScrollMetrics();
    },
    [syncScrollMetrics],
  );

  const setScrollFocusState = useCallback((focused) => {
    scrollFocusedRef.current = focused;
    setScrollFocused(focused);
  }, []);

  const focusScrollbar = useCallback(() => {
    if (!canScrollRef.current) return;
    setScrollFocusState(true);
    scrollbarThumbRef.current?.focus({ preventScroll: true });
  }, [setScrollFocusState]);

  const blurScrollbar = useCallback(() => {
    setScrollFocusState(false);
  }, [setScrollFocusState]);

  const handleScrollUp = useCallback(() => {
    const el = bodyRef.current;
    if (!el || el.scrollTop <= SCROLL_TOP_EPSILON) {
      if (el) el.scrollTop = 0;
      return;
    }
    scrollBody(-SCROLL_STEP_PX);
  }, [scrollBody]);

  const handleScrollDown = useCallback(() => {
    scrollBody(SCROLL_STEP_PX);
  }, [scrollBody]);

  useLayoutEffect(() => {
    if (!canScroll) return undefined;
    const frameId = requestAnimationFrame(focusScrollbar);
    return () => cancelAnimationFrame(frameId);
  }, [canScroll, focusScrollbar]);

  useEffect(() => {
    const onKeyDown = (event) => {
      if (!canScrollRef.current || !scrollFocusedRef.current) return;

      const key = event.key;
      const isVertical =
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Down" ||
        key === "Up";
      const isBack = key === "Escape" || key === "Backspace";

      if (!isVertical && !isBack) return;

      if (isBack && onEscape) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onEscape();
        return;
      }

      if (!isVertical) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (key === "ArrowDown" || key === "Down") {
        handleScrollDown();
        return;
      }

      if (key === "ArrowUp" || key === "Up") {
        handleScrollUp();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [onEscape, handleScrollDown, handleScrollUp]);

  const { scrollTop, scrollHeight, clientHeight, trackHeight } = scrollMetrics;
  const scrollRange = Math.max(scrollHeight - clientHeight, 1);
  const thumbHeight = canScroll
    ? Math.max((clientHeight / scrollHeight) * trackHeight, 24)
    : 0;
  const thumbTop = canScroll
    ? (scrollTop / scrollRange) * Math.max(trackHeight - thumbHeight, 0)
    : 0;

  const rootClass = ["tv-scrollbar-scroll-pane", className]
    .filter(Boolean)
    .join(" ");
  const scrollClass = ["tv-scrollbar-scroll-pane__body", scrollClassName]
    .filter(Boolean)
    .join(" ");

  return (
    <div className={rootClass}>
      <div
        ref={bodyRef}
        className={scrollClass}
        onScroll={syncScrollMetrics}
      >
        {children}
      </div>

      {canScroll ? (
        <aside
          className="tv-scrollbar-scroll-pane__scrollbar-col"
          aria-label="Scroll controls"
        >
          <div
            ref={scrollbarRailRef}
            className="tv-scrollbar-scroll-pane__scrollbar-rail"
          >
            <span
              className="tv-scrollbar-scroll-pane__scrollbar-track"
              aria-hidden="true"
            />
            <KeyboardWrapper
              onUp={handleScrollUp}
              onDown={handleScrollDown}
              onSelect={focusScrollbar}
            >
              {(focusProps) => (
                <FocusableButton
                  {...focusProps}
                  ref={scrollbarThumbRef}
                  focused={scrollFocused}
                  className="tv-scrollbar-scroll-pane__scrollbar-thumb"
                  style={{
                    height: `${thumbHeight}px`,
                    transform: `translateY(${thumbTop}px)`,
                  }}
                  aria-label={scrollbarAriaLabel}
                  aria-valuenow={Math.round(scrollTop)}
                  aria-valuemin={0}
                  aria-valuemax={Math.round(scrollRange)}
                  onClick={focusScrollbar}
                  onFocus={() => setScrollFocusState(true)}
                  onBlur={blurScrollbar}
                />
              )}
            </KeyboardWrapper>
          </div>
        </aside>
      ) : null}
    </div>
  );
}
