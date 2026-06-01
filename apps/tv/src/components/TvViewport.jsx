import { useRef } from "react";
import { useTvViewportScale } from "../hooks/useTvViewportScale.js";

/**
 * Fixed 1920 x 1080 TV frame: layout always at TV pixels; outer shell scale-to-fits
 * the browser window at 100% zoom. Browser zoom scales the result on top.
 */
export default function TvViewport({ children }) {
  const outerRef = useRef(null);
  const { scale, width, height } = useTvViewportScale(outerRef);

  return (
    <div ref={outerRef} className="tv-viewport-outer">
      <div
        className="tv-viewport-scale-wrap"
        style={{
          width: width * scale,
          height: height * scale,
        }}
      >
        <div
          className="tv-viewport"
          style={{
            width,
            height,
            transform: `scale(${scale})`,
          }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}
