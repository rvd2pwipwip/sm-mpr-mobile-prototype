import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import PrimaryNav from "./nav/PrimaryNav.jsx";

export default function TvShell({ children }) {
  const { navExpanded } = useTvNavFocus();

  return (
    <div
      className={
        navExpanded ? "tv-shell tv-shell--nav-expanded" : "tv-shell"
      }
    >
      <PrimaryNav />
      <main className="tv-shell__main">{children}</main>
    </div>
  );
}
