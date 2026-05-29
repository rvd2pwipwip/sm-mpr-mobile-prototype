import { forwardRef } from "react";
import FocusableButton from "./FocusableButton.jsx";
import "./FilterButton.css";

/** TV genre / filter control — rounded rect (SMTV03 Button medium), not mobile pill shape. */
const FilterButton = forwardRef(function FilterButton(
  { label, active = false, focused = false, onKeyDown, onClick, ...rest },
  ref,
) {
  const className = [
    "filter-button",
    active ? "filter-button--active" : "",
    focused ? "filter-button--focused" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <FocusableButton
      ref={ref}
      className={className}
      focused={focused}
      onKeyDown={onKeyDown}
      onClick={onClick}
      {...rest}
    >
      {label}
    </FocusableButton>
  );
});

export default FilterButton;
