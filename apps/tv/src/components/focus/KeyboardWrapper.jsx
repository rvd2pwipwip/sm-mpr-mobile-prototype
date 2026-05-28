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
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleActivate(event);
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      if (onUp) onUp(event);
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      if (onDown) onDown(event);
      return;
    }
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      if (onLeft) onLeft(event);
      return;
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      if (onRight) onRight(event);
    }
  };

  return children({
    ref,
    onKeyDown: handleKeyDown,
    onClick: handleActivate,
  });
});

export default KeyboardWrapper;
