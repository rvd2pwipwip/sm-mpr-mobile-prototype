import { useRef } from "react";

const DEFAULT_THRESHOLD_PX = 72;

/**
 * Touch swipe-down on a sheet panel to dismiss (prototype gesture).
 */
export function useSwipeDownDismiss(onDismiss, { threshold = DEFAULT_THRESHOLD_PX } = {}) {
  const startYRef = useRef(null);
  const startScrollTopRef = useRef(0);
  const scrollElRef = useRef(null);

  const onTouchStart = (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    startYRef.current = touch.clientY;
    startScrollTopRef.current = scrollElRef.current?.scrollTop ?? 0;
  };

  const onTouchEnd = (event) => {
    const startY = startYRef.current;
    if (startY == null) return;
    const touch = event.changedTouches[0];
    if (!touch) return;
    const deltaY = touch.clientY - startY;
    const atScrollTop = (scrollElRef.current?.scrollTop ?? 0) <= 0;
    if (atScrollTop && startScrollTopRef.current <= 0 && deltaY > threshold) {
      onDismiss();
    }
    startYRef.current = null;
  };

  return { scrollElRef, onTouchStart, onTouchEnd };
}
