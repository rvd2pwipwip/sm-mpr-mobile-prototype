import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import VariableSwimlaneItem from "./VariableSwimlaneItem.jsx";
import { getTvSwimlaneInlineEnd, getTvSwimlaneInlineStart } from "../../utils/tvLayout.js";
import { calcMeasuredSwimlaneOffset } from "../../utils/swimlaneScroll.js";
import { isTvStackedDialogOpen } from "../../utils/tvStackedDialogFocus.js";
import "./VariableSwimlane.css";

/**
 * Variable-width horizontal swimlane (filter pills). Measures item widths after layout.
 * `ensureActiveVisible` scrolls `activeIndex` into view without changing focus.
 */
export default function VariableSwimlane({
  items = [],
  renderItem,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  ensureActiveVisible = false,
  activeIndex = null,
  itemGap,
  inlineGutterStart,
  inlineGutterEnd,
  className = "",
}) {
  const { focusZone, canEnterNavFromContent } = useTvNavFocus();
  const viewportRef = useRef(null);
  const measureRefs = useRef([]);
  const [viewportWidth, setViewportWidth] = useState(0);
  const [itemWidths, setItemWidths] = useState([]);
  const [transitionEnabled, setTransitionEnabled] = useState(false);
  const gap =
    itemGap ??
    (typeof window !== "undefined"
      ? parseInt(
          getComputedStyle(document.documentElement).getPropertyValue(
            "--tv-space-filter-gap",
          ),
          10,
        ) || 20
      : 20);

  const gutterStart = inlineGutterStart ?? getTvSwimlaneInlineStart();
  const gutterEnd = inlineGutterEnd ?? getTvSwimlaneInlineEnd();

  const itemsSignature = useMemo(
    () => items.map((item) => item.id).join("\0"),
    [items],
  );

  const measureItems = useCallback(() => {
    const widths = [];
    for (let index = 0; index < items.length; index += 1) {
      widths.push(measureRefs.current[index]?.offsetWidth ?? 0);
    }
    setItemWidths(widths);
  }, [itemsSignature, items.length]);

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    setTransitionEnabled(false);
    setViewportWidth(node.offsetWidth);
    measureItems();

    const observer = new ResizeObserver(() => {
      setViewportWidth(node.offsetWidth);
      measureItems();
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [itemsSignature, measureItems]);

  useLayoutEffect(() => {
    measureItems();
  }, [measureItems]);

  useEffect(() => {
    if (viewportWidth <= 0) return undefined;

    const frameId = requestAnimationFrame(() => {
      setTransitionEnabled(true);
    });
    return () => cancelAnimationFrame(frameId);
  }, [viewportWidth]);

  const calcOffsetForIndex = useCallback(
    (index) =>
      calcMeasuredSwimlaneOffset({
        index,
        slotWidths: itemWidths,
        gap,
        viewportWidth,
        gutterStart,
        gutterEnd,
      }),
    [gap, gutterStart, gutterEnd, itemWidths, viewportWidth],
  );

  const scrollIndex = useMemo(() => {
    if (focused) {
      return focusedIndex;
    }
    if (
      ensureActiveVisible &&
      activeIndex != null &&
      activeIndex >= 0 &&
      activeIndex < items.length
    ) {
      return activeIndex;
    }
    return focusedIndex;
  }, [focused, ensureActiveVisible, activeIndex, focusedIndex, items.length]);

  const offset = useMemo(
    () => calcOffsetForIndex(scrollIndex),
    [calcOffsetForIndex, scrollIndex],
  );

  useEffect(() => {
    if (!focused) return undefined;

    const handleKeyDown = (event) => {
      if (isTvStackedDialogOpen()) return;
      if (focusZone !== FOCUS_ZONE_CONTENT) return;

      if (event.key === "ArrowRight") {
        event.preventDefault();
        event.stopPropagation();
        if (focusedIndex < items.length - 1) {
          onFocusChange?.(focusedIndex + 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        event.stopPropagation();
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
    items.length,
    canEnterNavFromContent,
    onFocusChange,
    onBoundaryLeft,
  ]);

  const viewportClass = ["variable-swimlane__viewport", className]
    .filter(Boolean)
    .join(" ");

  const rowClass = [
    "variable-swimlane__row",
    transitionEnabled ? "variable-swimlane__row--animated" : "",
    viewportWidth > 0 && itemWidths.length > 0
      ? "variable-swimlane__row--ready"
      : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={viewportRef} className={viewportClass} aria-label="Filter row">
      <div
        className={rowClass}
        style={{ transform: `translateX(-${offset}px)`, gap: `${gap}px` }}
        role="list"
      >
        {items.map((item, index) => (
          <VariableSwimlaneItem
            key={item.id}
            measureRef={(node) => {
              measureRefs.current[index] = node;
            }}
            renderItem={renderItem}
            item={item}
            index={index}
            isFocused={focused && index === focusedIndex}
          />
        ))}
      </div>
    </div>
  );
}
