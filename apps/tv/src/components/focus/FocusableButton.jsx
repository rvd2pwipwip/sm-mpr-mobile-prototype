import { forwardRef } from "react";
import "./FocusableButton.css";

/**
 * D-pad focusable control (not in tab order). Uses component-managed focus ring.
 */
const FocusableButton = forwardRef(function FocusableButton(
  { focused = false, children, className = "", onKeyDown, ...rest },
  ref,
) {
  const classes = [
    "focusable-button",
    focused ? "focusable-button--focused" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button
      type="button"
      ref={ref}
      tabIndex={-1}
      className={classes}
      onKeyDown={onKeyDown}
      {...rest}
    >
      {children}
    </button>
  );
});

export default FocusableButton;
