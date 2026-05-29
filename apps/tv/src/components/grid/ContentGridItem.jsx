function ContentGridItem({
  item,
  rowIndex,
  colIndex,
  isFocused,
  flatIndex,
  renderItem,
  onItemRef,
}) {
  return (
    <div className="content-grid__cell">
      {renderItem(item, rowIndex, colIndex, isFocused, (node) =>
        onItemRef(flatIndex, node),
      )}
    </div>
  );
}

export default ContentGridItem;
