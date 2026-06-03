import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import FocusableButton from "../focus/FocusableButton.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import "./ChannelInfoDescriptionDialog.css";

const SCROLL_STEP_PX = 48;
const SCROLL_TOP_EPSILON = 2;
const DIALOG_FOCUS_CLOSE = "close";
const DIALOG_FOCUS_SCROLL = "scroll";

/** Full description overlay (Figma `15791:35959`). */
export default function ChannelInfoDescriptionDialog({
  open,
  channelName,
  description,
  onClose,
}) {
  const bodyRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const closeRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const scrollbarRailRef = useRef(/** @type {HTMLDivElement | null} */ (null));
  const scrollbarThumbRef = useRef(/** @type {HTMLButtonElement | null} */ (null));
  const focusTargetRef = useRef(DIALOG_FOCUS_CLOSE);
  const canScrollRef = useRef(false);
  const [focusTarget, setFocusTarget] = useState(DIALOG_FOCUS_CLOSE);
  const [canScroll, setCanScroll] = useState(false);
  const [scrollMetrics, setScrollMetrics] = useState({
    scrollTop: 0,
    scrollHeight: 0,
    clientHeight: 0,
    trackHeight: 0,
  });

  const setDialogFocus = useCallback((target) => {
    focusTargetRef.current = target;
    setFocusTarget(target);
  }, []);

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
    if (!open) return undefined;
    syncScrollMetrics();
    const el = bodyRef.current;
    if (!el) return undefined;
    const ro = new ResizeObserver(syncScrollMetrics);
    ro.observe(el);
    return () => ro.disconnect();
  }, [open, description, syncScrollMetrics]);

  useLayoutEffect(() => {
    if (!open || !canScroll) return;
    syncScrollMetrics();
  }, [open, canScroll, syncScrollMetrics]);

  const scrollBody = useCallback(
    (delta) => {
      const el = bodyRef.current;
      if (!el) return;
      el.scrollBy({ top: delta, behavior: "auto" });
      syncScrollMetrics();
    },
    [syncScrollMetrics],
  );

  const focusClose = useCallback(() => {
    setDialogFocus(DIALOG_FOCUS_CLOSE);
    closeRef.current?.focus({ preventScroll: true });
  }, [setDialogFocus]);

  const focusScrollbar = useCallback(() => {
    if (!canScrollRef.current) return;
    setDialogFocus(DIALOG_FOCUS_SCROLL);
    scrollbarThumbRef.current?.focus({ preventScroll: true });
  }, [setDialogFocus]);

  const handleCloseDown = useCallback(() => {
    if (canScrollRef.current) {
      focusScrollbar();
    }
  }, [focusScrollbar]);

  const handleScrollUp = useCallback(() => {
    const el = bodyRef.current;
    if (!el || el.scrollTop <= SCROLL_TOP_EPSILON) {
      if (el) el.scrollTop = 0;
      focusClose();
      return;
    }
    scrollBody(-SCROLL_STEP_PX);
  }, [focusClose, scrollBody]);

  const handleScrollDown = useCallback(() => {
    scrollBody(SCROLL_STEP_PX);
  }, [scrollBody]);

  useLayoutEffect(() => {
    if (!open) return undefined;

    setDialogFocus(DIALOG_FOCUS_CLOSE);
    const frameId = requestAnimationFrame(() => {
      closeRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frameId);
  }, [open, setDialogFocus]);

  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      const isVertical =
        key === "ArrowDown" ||
        key === "ArrowUp" ||
        key === "Down" ||
        key === "Up";
      const isActivate = key === "Enter" || key === " " || key === "Select";
      const isBack = key === "Escape" || key === "Backspace";

      if (!isVertical && !isActivate && !isBack) return;

      const target = focusTargetRef.current;
      const scrollable = canScrollRef.current;

      if (isBack) {
        event.preventDefault();
        event.stopImmediatePropagation();
        onClose();
        return;
      }

      if (isActivate) {
        event.preventDefault();
        event.stopImmediatePropagation();
        if (target === DIALOG_FOCUS_CLOSE) {
          onClose();
        }
        return;
      }

      event.preventDefault();
      event.stopImmediatePropagation();

      const isDown = key === "ArrowDown" || key === "Down";
      const isUp = key === "ArrowUp" || key === "Up";

      if (isDown) {
        if (target === DIALOG_FOCUS_CLOSE && scrollable) {
          focusScrollbar();
        } else if (target === DIALOG_FOCUS_SCROLL) {
          handleScrollDown();
        }
        return;
      }

      if (isUp && target === DIALOG_FOCUS_SCROLL) {
        handleScrollUp();
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [open, onClose, focusScrollbar, handleScrollDown, handleScrollUp]);

  useEffect(() => {
    if (!open) return;
    document.documentElement.dataset.tvDialogOpen = "true";
    return () => {
      delete document.documentElement.dataset.tvDialogOpen;
    };
  }, [open]);

  if (!open) return null;

  const { scrollTop, scrollHeight, clientHeight, trackHeight } = scrollMetrics;
  const scrollRange = Math.max(scrollHeight - clientHeight, 1);
  const thumbHeight = canScroll
    ? Math.max((clientHeight / scrollHeight) * trackHeight, 24)
    : 0;
  const thumbTop = canScroll
    ? (scrollTop / scrollRange) * Math.max(trackHeight - thumbHeight, 0)
    : 0;

  return (
    <div
      className="channel-info-desc-dialog"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="channel-info-desc-dialog__panel"
        role="dialog"
        aria-modal="true"
        aria-labelledby="channel-info-desc-dialog-title"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="channel-info-desc-dialog__content">
          <div className="channel-info-desc-dialog__text-col">
            <h2
              id="channel-info-desc-dialog-title"
              className="channel-info-desc-dialog__title"
            >
              {channelName}
            </h2>
            <div
              ref={bodyRef}
              className="channel-info-desc-dialog__body"
              onScroll={syncScrollMetrics}
            >
              <p className="channel-info-desc-dialog__copy">{description}</p>
            </div>
          </div>

          <aside
            className="channel-info-desc-dialog__actions"
            aria-label="Dialog controls"
          >
            <KeyboardWrapper onSelect={onClose} onDown={handleCloseDown}>
              {(focusProps) => (
                <FocusableButton
                  {...focusProps}
                  ref={closeRef}
                  focused={focusTarget === DIALOG_FOCUS_CLOSE}
                  className="channel-info-desc-dialog__close"
                  aria-label="Close"
                  onClick={onClose}
                >
                  <img
                    className="channel-info-desc-dialog__close-icon"
                    src="/close.svg"
                    alt=""
                    width={40}
                    height={40}
                    decoding="async"
                  />
                </FocusableButton>
              )}
            </KeyboardWrapper>

            {canScroll ? (
              <div
                ref={scrollbarRailRef}
                className="channel-info-desc-dialog__scrollbar-rail"
              >
                <span
                  className="channel-info-desc-dialog__scrollbar-track"
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
                      focused={focusTarget === DIALOG_FOCUS_SCROLL}
                      className="channel-info-desc-dialog__scrollbar-thumb"
                      style={{
                        height: `${thumbHeight}px`,
                        transform: `translateY(${thumbTop}px)`,
                      }}
                      aria-label="Scroll description"
                      aria-valuenow={Math.round(scrollTop)}
                      aria-valuemin={0}
                      aria-valuemax={Math.round(scrollRange)}
                      onClick={focusScrollbar}
                    />
                  )}
                </KeyboardWrapper>
              </div>
            ) : null}
          </aside>
        </div>
      </div>
    </div>
  );
}
