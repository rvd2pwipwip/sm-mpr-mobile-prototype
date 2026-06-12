/** Spread onto `KeyboardWrapper` from a ContentGrid `cellNav` object. */
export function gridCellKeyboardProps(cellNav) {
  if (!cellNav) return {};
  return {
    onLeft: cellNav.onLeft,
    onRight: cellNav.onRight,
    onUp: cellNav.onUp,
    onDown: cellNav.onDown,
  };
}
