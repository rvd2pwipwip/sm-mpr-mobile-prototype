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
  /** Demo only: click / Enter dismisses banner (limited Home). */
  onDismiss,
}) {
  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef?.(groupIndex, 0, node)}
      onSelect={() => onDismiss?.()}
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
          aria-label={
            onDismiss
              ? "Promo banner. Activate to hide for this session."
              : "Promo banner"
          }
        >
          Promo Banner
        </div>
      )}
    </KeyboardWrapper>
  );
}
