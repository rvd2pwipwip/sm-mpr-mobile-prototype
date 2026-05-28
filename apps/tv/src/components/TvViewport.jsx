/**
 * Fixed 1920 x 1080 TV frame centered in the browser viewport.
 */
export default function TvViewport({ children }) {
  return (
    <div className="tv-viewport-outer">
      <div className="tv-viewport">{children}</div>
    </div>
  );
}
