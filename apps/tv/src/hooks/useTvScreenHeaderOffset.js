import { useLayoutEffect, useRef } from "react";

/**
 * Publishes measured header height on the shell as `--tv-screen-header-offset`.
 * Scroll content pads below the bar and slides underneath while scrolling
 * (same idea as mobile `HomeHeader` / `ScreenHeader`).
 */
export function useTvScreenHeaderOffset() {
  const shellRef = useRef(null);
  const headerRef = useRef(null);

  useLayoutEffect(() => {
    const shell = shellRef.current;
    const header = headerRef.current;
    if (!shell || !header) return undefined;

    const publish = () => {
      shell.style.setProperty(
        "--tv-screen-header-offset",
        `${header.offsetHeight}px`,
      );
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(header);
    return () => {
      ro.disconnect();
      shell.style.removeProperty("--tv-screen-header-offset");
    };
  }, []);

  return { shellRef, headerRef };
}
