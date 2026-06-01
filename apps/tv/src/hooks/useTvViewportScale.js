import { useLayoutEffect, useState } from "react";

const TV_WIDTH = 1920;
const TV_HEIGHT = 1080;

/**
 * Scale-to-fit for the fixed 1920x1080 TV frame at 100% browser zoom.
 * visualViewport.scale compensates for browser zoom so fit does not fight Ctrl+/- .
 */
function getFitScale(containerWidth, containerHeight) {
  const zoom = window.visualViewport?.scale ?? 1;
  const w = containerWidth * zoom;
  const h = containerHeight * zoom;
  if (w <= 0 || h <= 0) return 1;
  return Math.min(w / TV_WIDTH, h / TV_HEIGHT);
}

export function useTvViewportScale(outerRef) {
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const outer = outerRef.current;
    if (!outer) return undefined;

    const update = () => {
      setScale(getFitScale(outer.clientWidth, outer.clientHeight));
    };

    update();

    const ro = new ResizeObserver(update);
    ro.observe(outer);

    window.addEventListener("resize", update);
    window.visualViewport?.addEventListener("resize", update);
    window.visualViewport?.addEventListener("scroll", update);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("resize", update);
      window.visualViewport?.removeEventListener("scroll", update);
    };
  }, [outerRef]);

  return { scale, width: TV_WIDTH, height: TV_HEIGHT };
}
