import { useEffect } from "react";
import { useFocusNavigation } from "../context/GroupFocusNavigationContext.jsx";

/** Register how many vertical content groups the active screen exposes. */
export function useContentFocusGroups(count) {
  const { setContentGroupCount } = useFocusNavigation();

  useEffect(() => {
    setContentGroupCount(count);
    return () => setContentGroupCount(1);
  }, [count, setContentGroupCount]);
}
