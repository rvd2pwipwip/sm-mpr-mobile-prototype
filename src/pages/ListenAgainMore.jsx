import { useNavigate } from "react-router-dom";
import { renderListenAgainTile } from "../components/ListenAgainCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { useListenHistory } from "../context/ListenHistoryContext";
import "./ListenAgainMore.css";
import "./SwimlaneMore.css";

/** Full “Listen again” list — mixed grid; header Clear wipes history (Figma `19801:39250`). */
export default function ListenAgainMore() {
  const navigate = useNavigate();
  const { items, clearListenHistory } = useListenHistory();
  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title="Listen again"
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
            onClick={() => {
              clearListenHistory();
              goBack();
            }}
            aria-label="Clear listening history"
          >
            Clear
          </button>
        }
      />

      <div className="swimlane-more__scroll">
        {items.length === 0 ? (
          <p className="listen-again-more__empty">No listening history yet.</p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {items.map((item) => {
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
