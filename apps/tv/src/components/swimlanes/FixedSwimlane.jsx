import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import { getTvCardGap, getTvCardSize } from "../../utils/tvLayout.js";
import "./FixedSwimlane.css";

/**
 * Fixed-width horizontal swimlane with transform parking (SMTV03 pattern).
 * Arrow Left/Right when `focused` is true. Up/Down/Enter stay on slot children.
 */
export default function FixedSwimlane({
  slotCount = 0,
  focusedIndex = 0,
  onFocusChange,
  focused = false,
  onBoundaryLeft,
  registerSlotRef,
  renderSlot,
  className = "",
}) {
  const { focusZone } = useTvNavFocus();
  const viewportRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const cardSize = getTvCardSize();
  const cardGap = getTvCardGap();
  const cardFullWidth = cardSize + cardGap;

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    setTransitionEnabled(false);
    setViewportWidth(node.offsetWidth);

    const observer = new ResizeObserver(() => {
      setViewportWidth(node.offsetWidth);
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [slotCount]);

  useEffect(() => {
    if (viewportWidth <= 0) return undefined;

    const frameId = requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, [viewportWidth]);

  const totalContentWidth =
    slotCount > 0 ? slotCount * cardSize + (slotCount - 1) * cardGap : 0;

  const offset = useMemo(() => {
    if (slotCount === 0 || viewportWidth <= 0) return 0;
    const left = focusedIndex * cardFullWidth;
    const maxOffset = Math.max(0, totalContentWidth - viewportWidth);
    return Math.min(left, maxOffset);
  }, [
    focusedIndex,
    cardFullWidth,
    slotCount,
    totalContentWidth,
    viewportWidth,
  ]);

  useEffect(() => {
    if (!focused) return undefined;

    const handleKeyDown = (event) => {
      if (focusZone !== FOCUS_ZONE_CONTENT) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        if (focusedIndex < slotCount - 1) {
          onFocusChange?.(focusedIndex + 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        if (focusedIndex === 0) {
          onBoundaryLeft?.(event);
          return;
        }
        onFocusChange?.(focusedIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [focused, focusZone, focusedIndex, slotCount, onFocusChange, onBoundaryLeft]);

  const viewportClass = ["fixed-swimlane__viewport", className]
    .filter(Boolean)
    .join(" ");

  const rowClass = [
    "fixed-swimlane__row",
    transitionEnabled ? "fixed-swimlane__row--animated" : "",
    viewportWidth > 0 ? "fixed-swimlane__row--ready" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={viewportRef} className={viewportClass} aria-label="Swimlane">
      <div
        className={rowClass}
        style={{ transform: `translateX(-${offset}px)` }}
        role="list"
      >
        {Array.from({ length: slotCount }, (_, index) =>
          renderSlot(
            index,
            focused && index === focusedIndex,
            (node) => registerSlotRef?.(index, node),
          ),
        )}
      </div>
    </div>
  );
}
