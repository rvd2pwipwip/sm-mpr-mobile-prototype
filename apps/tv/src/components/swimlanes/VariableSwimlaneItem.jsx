/** Measured slot wrapper for VariableSwimlane (keeps ref registration out of parent render). */
export default function VariableSwimlaneItem({
  item,
  index,
  isFocused,
  measureRef,
  renderItem,
}) {
  return (
    <div ref={measureRef} className="variable-swimlane__item">
      {renderItem(item, index, isFocused)}
    </div>
  );
}
