import { forwardRef } from "react";

/**
 * Wraps a focusable child so Enter/Space, click, and arrow keys reach app handlers.
 * Child must accept ref, onKeyDown, and onClick (e.g. FocusableButton).
 */
const KeyboardWrapper = forwardRef(function KeyboardWrapper(
  { onSelect, children, selectData, onUp, onDown, onLeft, onRight },
  ref,
) {
  const handleActivate = (event) => {
    if (onSelect) onSelect(selectData, event);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" || event.key === " " || event.key === "Select") {
      event.preventDefault();
      handleActivate(event);
      return;
    }
    if (event.key === "ArrowUp") {
      if (!onUp) return;
      event.preventDefault();
      event.stopPropagation();
      onUp(event);
      return;
    }
    if (event.key === "ArrowDown") {
      if (!onDown) return;
      event.preventDefault();
      event.stopPropagation();
      onDown(event);
      return;
    }
    if (event.key === "ArrowLeft") {
      if (!onLeft) return;
      event.preventDefault();
      event.stopPropagation();
      onLeft(event);
      return;
    }
    if (event.key === "ArrowRight") {
      if (!onRight) return;
      event.preventDefault();
      event.stopPropagation();
      onRight(event);
    }
  };

  return children({
    ref,
    onKeyDown: handleKeyDown,
    onClick: handleActivate,
  });
});

export default KeyboardWrapper;
