import { useLocation } from "react-router-dom";

const MORE_COPY = {
  "/more/music": {
    title: "More music channels",
    lede:
      "Placeholder for the Most popular music More grid. Press Esc to go back. Full grid navigation ships in Phase 5.",
  },
  "/more/recommendations": {
    title: "More recommendations",
    lede:
      "Placeholder for the Recommendations More grid. Press Esc to go back. Full grid navigation ships in Phase 5.",
  },
};

/** Stub More grid route — full grid in Phase 5. */
export default function SwimlaneMore() {
  const { pathname } = useLocation();
  const copy = MORE_COPY[pathname] ?? MORE_COPY["/more/music"];

  return (
    <div className="tv-page">
      <h1 className="tv-page__title">{copy.title}</h1>
      <p className="tv-page__lede">{copy.lede}</p>
    </div>
  );
}
