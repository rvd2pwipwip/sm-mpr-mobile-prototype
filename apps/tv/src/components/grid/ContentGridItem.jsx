function ContentGridItem({
  item,
  rowIndex,
  colIndex,
  isFocused,
  flatIndex,
  renderItem,
  onItemRef,
  cellNav,
}) {
  return (
    <div className="content-grid__cell">
      {renderItem(
        item,
        rowIndex,
        colIndex,
        isFocused,
        (node) => onItemRef(flatIndex, node),
        cellNav,
      )}
    </div>
  );
}

export default ContentGridItem;
