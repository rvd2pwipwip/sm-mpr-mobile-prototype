import KeyboardWrapper from "./focus/KeyboardWrapper.jsx";
import "./TvHomeBanner.css";

/** Promo banner row — single focus slot between header and swimlanes. */
export default function TvHomeBanner({
  groupIndex,
  focused = false,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onBoundaryLeft,
}) {
  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef?.(groupIndex, 0, node)}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={() => onBoundaryLeft?.()}
    >
      {(focusProps) => (
        <div
          {...focusProps}
          className={[
            "tv-home__banner",
            focused ? "tv-home__banner--focused" : "",
          ]
            .filter(Boolean)
            .join(" ")}
          role="button"
          tabIndex={-1}
          aria-label="Promo banner"
        >
          Promo Banner
        </div>
      )}
    </KeyboardWrapper>
  );
}
