import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvButton from "../TvButton.jsx";
import "./TvPlayerUpgradeCta.css";

/** Top-left Upgrade CTA on full-screen players; absolute so layout stays centered. */
export default function TvPlayerUpgradeCta({
  groupIndex,
  registerItemRef,
  isItemFocused,
  onSelect,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  return (
    <div className="tv-player-upgrade-cta">
      <KeyboardWrapper
        ref={(node) => registerItemRef(groupIndex, 0, node)}
        onSelect={onSelect}
        onUp={onMoveUp}
        onDown={onMoveDown}
        onLeft={onMoveLeft}
        onRight={onMoveRight}
      >
        {(focusProps) => (
          <TvButton
            {...focusProps}
            focused={isItemFocused(groupIndex, 0)}
            label="Upgrade"
            iconSrc="/upgrade.svg"
          />
        )}
      </KeyboardWrapper>
    </div>
  );
}
