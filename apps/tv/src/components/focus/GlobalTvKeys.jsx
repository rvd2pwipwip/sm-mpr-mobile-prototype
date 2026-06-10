import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

/** Global TV remote keys: Esc = back; Tab disabled outside text fields. */
export default function GlobalTvKeys() {
  const navigate = useNavigate();

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        if (document.querySelector('[aria-modal="true"]')) {
          return;
        }
        if (document.documentElement.hasAttribute("data-tv-keyboard-stub")) {
          return;
        }
        event.preventDefault();
        navigate(-1);
        return;
      }

      if (event.key === "Tab") {
        const tag = event.target?.tagName?.toLowerCase();
        if (tag !== "input" && tag !== "textarea" && tag !== "select") {
          event.preventDefault();
        }
      }
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [navigate]);

  return null;
}
