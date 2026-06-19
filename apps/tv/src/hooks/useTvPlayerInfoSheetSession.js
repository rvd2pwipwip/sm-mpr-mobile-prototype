import { useEffect, useRef, useState } from "react";
import {
  useOptionalScreenMemory,
  useScreenMemory,
} from "../context/ScreenMemoryContext.jsx";

/**
 * Modal sheet session — reset focus (and optional scroll memory) each time the
 * sheet opens so parked scroll and group index stay in sync.
 */
export function useTvPlayerInfoSheetSession({
  open,
  focusScreenId,
  scrollScreenId = null,
  landingGroupIndex = 0,
  landingItemIndex = 0,
}) {
  const { setFocusedGroupIndex, setField } = useScreenMemory(focusScreenId);
  const { persistField: persistScrollField } = useOptionalScreenMemory(
    scrollScreenId ?? undefined,
  );
  const prevOpenRef = useRef(false);
  const [contentKey, setContentKey] = useState(0);

  useEffect(() => {
    const opening = open && !prevOpenRef.current;
    prevOpenRef.current = open;

    if (!opening) return;

    setFocusedGroupIndex(landingGroupIndex);
    setField("groupItemIndexes", { [landingGroupIndex]: landingItemIndex });

    if (scrollScreenId) {
      persistScrollField("scrollOffsetY", 0);
      persistScrollField("parkLineY", null);
    }

    setContentKey((key) => key + 1);
  }, [
    open,
    scrollScreenId,
    landingGroupIndex,
    landingItemIndex,
    setFocusedGroupIndex,
    setField,
    persistScrollField,
  ]);

  return { contentKey };
}
