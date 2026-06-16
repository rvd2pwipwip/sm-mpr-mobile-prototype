import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import {
  getTvCardGap,
  getTvSwimlaneInlineEnd,
  getTvSwimlaneInlineStart,
} from "../../utils/tvLayout.js";
import { calcMeasuredSwimlaneOffset } from "../../utils/swimlaneScroll.js";
import { isTvStackedDialogOpen } from "../../utils/tvStackedDialogFocus.js";
import MixedWidthSwimlaneSlot from "./MixedWidthSwimlaneSlot.jsx";
import "./FixedSwimlane.css";
import "./MixedWidthSwimlane.css";

/**
 * Horizontal swimlane with per-slot measured widths (mixed card sizes).
 * Same render-slot API as {@link FixedSwimlane}; use FixedSwimlane when every
 * slot shares one width.
 */
export default function MixedWidthSwimlane({
  slotCount = 0,
  focusedIndex = 0,
  onFocusChange,
  focused = false,
  onBoundaryLeft,
  registerSlotRef,
  renderSlot,
  className = "",
  slotGap,
  onArrowRight,
  onArrowLeft,
}) {
  const { focusZone, canEnterNavFromContent } = useTvNavFocus();
  const viewportRef = useRef(null);
  const measureRefs = useRef([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [slotWidths, setSlotWidths] = useState([]);
  const [transitionEnabled, setTransitionEnabled] = useState(false);

  const cardGap = slotGap ?? getTvCardGap();
  const gutterStart = getTvSwimlaneInlineStart();
  const gutterEnd = getTvSwimlaneInlineEnd();

  const measureSlots = useCallback(() => {
    const widths = [];
    for (let index = 0; index < slotCount; index += 1) {
      widths.push(measureRefs.current[index]?.offsetWidth ?? 0);
    }
    setSlotWidths(widths);
  }, [slotCount]);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    setTransitionEnabled(false);
    setViewportWidth(node.offsetWidth);
    measureSlots();

    const viewportObserver = new ResizeObserver(() => {
      setViewportWidth(node.offsetWidth);
      measureSlots();
    });
    viewportObserver.observe(node);

    const slotObservers = [];
    for (let index = 0; index < slotCount; index += 1) {
      const slotNode = measureRefs.current[index];
      if (!slotNode) continue;
      const slotObserver = new ResizeObserver(measureSlots);
      slotObserver.observe(slotNode);
      slotObservers.push(slotObserver);
    }

    return () => {
      viewportObserver.disconnect();
      slotObservers.forEach((observer) => observer.disconnect());
    };
  }, [slotCount, measureSlots]);

  useLayoutEffect(() => {
    measureSlots();
  }, [measureSlots, focusedIndex]);

  useEffect(() => {
    if (viewportWidth <= 0) return undefined;

    const frameId = requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, [viewportWidth]);

  const offset = useMemo(
    () =>
      calcMeasuredSwimlaneOffset({
        index: focusedIndex,
        slotWidths,
        gap: cardGap,
        viewportWidth,
        gutterStart,
        gutterEnd,
      }),
    [focusedIndex, slotWidths, cardGap, viewportWidth, gutterStart, gutterEnd],
  );

  useEffect(() => {
    if (!focused) return undefined;

    const handleKeyDown = (event) => {
      if (isTvStackedDialogOpen()) return;
      if (focusZone !== FOCUS_ZONE_CONTENT) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        if (onArrowRight?.({ focusedIndex, slotCount }) === true) {
          return;
        }
        if (focusedIndex < slotCount - 1) {
          onFocusChange?.(focusedIndex + 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
        if (onArrowLeft?.({ focusedIndex, slotCount }) === true) {
          return;
        }
        if (focusedIndex === 0) {
          if (canEnterNavFromContent) {
            onBoundaryLeft?.(event);
          }
          return;
        }
        onFocusChange?.(focusedIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, [
    focused,
    focusZone,
    focusedIndex,
    slotCount,
    canEnterNavFromContent,
    onFocusChange,
    onBoundaryLeft,
    onArrowRight,
    onArrowLeft,
  ]);

  const viewportClass = ["fixed-swimlane__viewport", className]
    .filter(Boolean)
    .join(" ");

  const rowClass = [
    "fixed-swimlane__row",
    transitionEnabled ? "fixed-swimlane__row--animated" : "",
    viewportWidth > 0 && slotWidths.length > 0
      ? "fixed-swimlane__row--ready"
      : "",
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
        {Array.from({ length: slotCount }, (_, index) => (
          <MixedWidthSwimlaneSlot
            key={index}
            measureRef={(node) => {
              measureRefs.current[index] = node;
            }}
          >
            {renderSlot(
              index,
              focused && index === focusedIndex,
              (node) => registerSlotRef?.(index, node),
            )}
          </MixedWidthSwimlaneSlot>
        ))}
      </div>
    </div>
  );
}
