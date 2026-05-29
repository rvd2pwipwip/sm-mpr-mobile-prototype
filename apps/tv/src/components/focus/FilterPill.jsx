import { forwardRef } from "react";
import FocusableButton from "./FocusableButton.jsx";
import "./FilterPill.css";

/** Variable-width genre / filter chip for TV limited Home. */
const FilterPill = forwardRef(function FilterPill(
  { label, active = false, focused = false, onKeyDown, onClick, ...rest },
  ref,
) {
  const className = [
    "filter-pill",
    active ? "filter-pill--active" : "",
    focused ? "filter-pill--focused" : "",
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

export default FilterPill;
