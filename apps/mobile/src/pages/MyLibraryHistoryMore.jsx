import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import AppStackedDialog from "../components/AppStackedDialog";
import { renderListenAgainTile } from "../components/ListenAgainCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMyLibraryHistoryRouteConfig } from "../constants/myLibraryHistory";
import { useListenHistory } from "../context/ListenHistoryContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
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
  const { clearAllEpisodeProgress } = usePodcastUserState();
  const goBack = () => navigate(-1);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  if (!config) {
    return <Navigate to="/my-library" replace />;
  }

  const filtered = items.filter((x) => x.kind === config.listenKind);

  const closeClearDialog = () => setClearDialogOpen(false);

  const confirmClear = () => {
    clearHistoryByKind(config.listenKind);
    if (config.listenKind === "podcast") {
      clearAllEpisodeProgress();
    }
    closeClearDialog();
    goBack();
  };

  const dialogTitleId = `my-library-history-clear-dialog-title-${historySegment}`;
  const dialogDescId = `my-library-history-clear-dialog-desc-${historySegment}`;

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
            disabled={filtered.length === 0}
            onClick={() => setClearDialogOpen(true)}
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

      <AppStackedDialog
        open={clearDialogOpen}
        onClose={closeClearDialog}
        scrimCloseLabel="Close dialog without clearing history"
        title={config.clearConfirmDialogTitle}
        titleId={dialogTitleId}
        descriptionId={dialogDescId}
        primaryButton={{
          label: config.clearConfirmPrimaryLabel,
          onClick: confirmClear,
          variant: "subscribe-primary",
        }}
        secondaryButton={{
          label: "Cancel",
          onClick: closeClearDialog,
          appearance: "outline",
        }}
      >
        <p className="app-stacked-dialog__confirm-line">
          Are you sure you want to clear your{" "}
          {config.clearConfirmBodyHistoryPhrase}?
        </p>
        <p className="app-stacked-dialog__confirm-line">
          This action cannot be undone.
        </p>
      </AppStackedDialog>
    </main>
  );
}
