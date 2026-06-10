import { forwardRef } from "react";
import FocusableButton from "./focus/FocusableButton.jsx";
import "./TvHeaderIconButton.css";

/**
 * 80px header icon control (Figma `limitedHomeHeader` info / search).
 */
const TvHeaderIconButton = forwardRef(function TvHeaderIconButton(
  { iconMaskClass, label, focused = false, onClick, ...rest },
  ref,
) {
  return (
    <FocusableButton
      ref={ref}
      className={[
        "tv-header-icon-button",
        focused ? "tv-header-icon-button--focused" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      focused={focused}
      tabIndex={-1}
      aria-label={label}
      onClick={onClick}
      {...rest}
    >
      <span className="tv-header-icon-button__slot" aria-hidden="true">
        <span className={["tv-header-icon-button__mask", iconMaskClass].join(" ")} />
      </span>
    </FocusableButton>
  );
});

export default TvHeaderIconButton;
