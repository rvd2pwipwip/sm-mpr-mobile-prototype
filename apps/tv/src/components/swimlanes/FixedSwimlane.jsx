import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
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
  const viewportRef = useRef(null);
  const [viewportWidth, setViewportWidth] = useState(0);

  const cardSize = getTvCardSize();
  const cardGap = getTvCardGap();
  const cardFullWidth = cardSize + cardGap;

  useLayoutEffect(() => {
    const node = viewportRef.current;
    if (!node) return undefined;

    const updateWidth = () => setViewportWidth(node.offsetWidth);
    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const totalContentWidth =
    slotCount > 0 ? slotCount * cardSize + (slotCount - 1) * cardGap : 0;

  const offset = useMemo(() => {
    if (slotCount === 0) return 0;
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
      if (event.key === "ArrowRight") {
        event.preventDefault();
        if (focusedIndex < slotCount - 1) {
          onFocusChange?.(focusedIndex + 1);
        }
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        if (focusedIndex === 0) {
          onBoundaryLeft?.(event);
          return;
        }
        onFocusChange?.(focusedIndex - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [focused, focusedIndex, slotCount, onFocusChange, onBoundaryLeft]);

  const viewportClass = ["fixed-swimlane__viewport", className]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={viewportRef} className={viewportClass} aria-label="Swimlane">
      <div
        className="fixed-swimlane__row"
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
