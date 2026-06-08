import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppStackedDialog from "../components/AppStackedDialog";
import { renderListenAgainTile } from "../components/ListenAgainCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { LISTEN_AGAIN_CLEAR_CONFIRM } from "../constants/listenHistory";
import { useContentProfile } from "../context/ContentProfileContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import "./ListenAgainMore.css";
import "./SwimlaneMore.css";

/** Full “Listen again” list — mixed grid; header Clear wipes history (Figma `19801:39250`). */
export default function ListenAgainMore() {
  const navigate = useNavigate();
  const { items, clearListenHistory } = useListenHistory();
  const { filterListenHistory } = useContentProfile();
  const visibleItems = useMemo(
    () => filterListenHistory(items),
    [filterListenHistory, items],
  );
  const goBack = () => navigate(-1);
  const [clearDialogOpen, setClearDialogOpen] = useState(false);

  const closeClearDialog = () => setClearDialogOpen(false);

  const confirmClear = () => {
    clearListenHistory();
    closeClearDialog();
    goBack();
  };

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
            disabled={visibleItems.length === 0}
            onClick={() => setClearDialogOpen(true)}
            aria-label="Clear listening history"
          >
            Clear
          </button>
        }
      />

      <div className="swimlane-more__scroll">
        {visibleItems.length === 0 ? (
          <p className="listen-again-more__empty">No listening history yet.</p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {visibleItems.map((item) => {
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
        scrimCloseLabel="Close dialog without clearing listening history"
        title={LISTEN_AGAIN_CLEAR_CONFIRM.dialogTitle}
        titleId="listen-again-more-clear-dialog-title"
        descriptionId="listen-again-more-clear-dialog-desc"
        primaryButton={{
          label: LISTEN_AGAIN_CLEAR_CONFIRM.primaryLabel,
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
          {LISTEN_AGAIN_CLEAR_CONFIRM.bodyPhrase}?
        </p>
        <p className="app-stacked-dialog__confirm-line">
          This action cannot be undone.
        </p>
      </AppStackedDialog>
    </main>
  );
}
