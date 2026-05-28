import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import ContentTileCard from "./ContentTileCard.jsx";

/**
 * D-pad wiring for a square ContentTileCard (KeyboardWrapper + focus ring props).
 */
export default function FocusableTile({
  groupIndex = 0,
  index,
  title,
  imageUrl,
  focused = false,
  playing = false,
  onSelect,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onMoveLeft,
  onMoveRight,
}) {
  return (
    <KeyboardWrapper
      ref={(node) => registerItemRef(groupIndex, index, node)}
      onSelect={onSelect}
      onUp={onMoveUp}
      onDown={onMoveDown}
      onLeft={onMoveLeft}
      onRight={onMoveRight}
    >
      {(focusProps) => (
        <ContentTileCard
          {...focusProps}
          title={title}
          imageUrl={imageUrl}
          focused={focused}
          playing={playing}
        />
      )}
    </KeyboardWrapper>
  );
}
