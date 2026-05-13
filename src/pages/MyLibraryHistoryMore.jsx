import { Navigate, useNavigate, useParams } from "react-router-dom";
import { renderListenAgainTile } from "../components/ListenAgainCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMyLibraryHistoryRouteConfig } from "../constants/myLibraryHistory";
import { useListenHistory } from "../context/ListenHistoryContext";
import "./ListenAgainMore.css";
import "./SwimlaneMore.css";

/** Full grid + scoped Clear for one listen-history kind (`/my-library/history/:historySegment`). */
export default function MyLibraryHistoryMore() {
  const { historySegment } = useParams();
  const navigate = useNavigate();
  const config =
    typeof historySegment === "string"
      ? getMyLibraryHistoryRouteConfig(historySegment)
      : null;
  const { items, clearHistoryByKind } = useListenHistory();
  const goBack = () => navigate(-1);

  if (!config) {
    return <Navigate to="/my-library" replace />;
  }

  const filtered = items.filter((x) => x.kind === config.listenKind);

  const handleClear = () => {
    clearHistoryByKind(config.listenKind);
    goBack();
  };

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={config.moreScreenTitle}
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
        endSlot={
          <button
            type="button"
            className="screen-header__text-btn"
            onClick={handleClear}
            aria-label={config.clearAriaLabel}
          >
            Clear
          </button>
        }
      />

      <div className="swimlane-more__scroll">
        {filtered.length === 0 ? (
          <p className="listen-again-more__empty">{config.emptyGridMessage}</p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {filtered.map((item) => {
              const tile = renderListenAgainTile(item, navigate, false);
              if (!tile) return null;
              return (
                <li
                  key={`${item.kind}-${item.id}`}
                  className="swimlane-more__cell"
                >
                  {tile}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
