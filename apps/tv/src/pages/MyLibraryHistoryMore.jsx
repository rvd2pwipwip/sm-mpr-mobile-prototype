import { useCallback, useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMyLibraryHistoryRouteConfig } from "@sm-mpr/shared/constants/myLibraryHistory.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { resolveListenAgainItems } from "@sm-mpr/shared/utils/listenAgainItems.js";
import { filterListenHistoryByProfile } from "@sm-mpr/shared/constants/productProfile.js";
import ContentGrid from "../components/grid/ContentGrid.jsx";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import TvDrillScreenHeader from "../components/drill/TvDrillScreenHeader.jsx";
import TvListenHistoryClearDialog from "../components/listenHistory/TvListenHistoryClearDialog.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import { useContentFocusGroups } from "../hooks/useContentFocusGroups.js";
import { useTvGridScreenFocus } from "../hooks/useTvGridScreenFocus.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../utils/playbackMiniPlayer.js";
import { getTvBrowseGridLayout } from "../utils/tvLayout.js";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import "../components/cards/ContentTileCard.css";
import "../components/drill/TvDrillScreen.css";
import "./ListenAgainMore.css";

/** Full typed history grid + scoped Clear (`/my-library/history/:historySegment`). */
export default function MyLibraryHistoryMore() {
  const { historySegment } = useParams();
  const navigate = useNavigate();
  const config =
    typeof historySegment === "string"
      ? getMyLibraryHistoryRouteConfig(historySegment)
      : null;
  const { items, clearHistoryByKind } = useListenHistory();
  const { clearAllEpisodeProgress } = usePodcastUserState();
  const { enabledContentTypes } = useContentProfile();
  const { session } = usePlayback();
  const { focusZone } = useTvNavFocus();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [headerClearFocused, setHeaderClearFocused] = useState(false);
  const clearBtnRef = useRef(null);

  const tiles = useMemo(() => {
    if (!config) return [];
    const filtered = filterListenHistoryByProfile(items, enabledContentTypes).filter(
      (item) => item.kind === config.listenKind,
    );
    return resolveListenAgainItems(filtered);
  }, [config, items, enabledContentTypes]);

  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);

  const gridLayout = useMemo(() => getTvBrowseGridLayout(), []);
  const gridRef = useRef(null);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const rowCount = useMemo(() => {
    if (tiles.length === 0) return 0;
    return Math.ceil(tiles.length / gridLayout.columns);
  }, [tiles.length, gridLayout.columns]);

  const canClear = tiles.length > 0;
  const screenId = config
    ? `my-library-history-${historySegment}`
    : "my-library-history";

  useContentFocusGroups(1);

  const {
    gridFocusedPosition,
    setGridFocusedPosition,
    gridActive,
    enterNavFromGrid,
    enterContent,
  } = useTvGridScreenFocus(screenId, gridLayout.columns);

  const getFocusedElement = useCallback(
    () => gridRef.current?.getFocusedElement() ?? null,
    [],
  );

  const {
    viewportRef,
    innerRef,
    registerGroupRef,
    offsetY,
    innerClassName,
  } = useTvVerticalGroupScroll(gridFocusedPosition.row, {
    landingGroupIndex: 0,
    firstFocusableGroupIndex: 0,
    lastFocusableGroupIndex: Math.max(0, rowCount - 1),
    getFocusedElement,
    screenId,
  });

  const focusHeaderClear = useCallback(() => {
    if (!canClear) return;
    setHeaderClearFocused(true);
    requestAnimationFrame(() => {
      clearBtnRef.current?.focus({ preventScroll: true });
    });
  }, [canClear]);

  const focusGridFromHeader = useCallback(() => {
    setHeaderClearFocused(false);
    enterContent();
    requestAnimationFrame(() => {
      gridRef.current?.getFocusedElement()?.focus({ preventScroll: true });
    });
  }, [enterContent]);

  const openClearDialog = useCallback(() => {
    if (!canClear) return;
    setClearDialogOpen(true);
  }, [canClear]);

  const closeClearDialog = useCallback(() => {
    setClearDialogOpen(false);
    if (canClear) {
      focusHeaderClear();
    }
  }, [canClear, focusHeaderClear]);

  const confirmClear = useCallback(() => {
    if (!config) return;
    clearHistoryByKind(config.listenKind);
    if (config.listenKind === "podcast") {
      clearAllEpisodeProgress();
    }
    setClearDialogOpen(false);
    navigate(-1);
  }, [clearHistoryByKind, clearAllEpisodeProgress, config, navigate]);

  const handleSelect = useCallback(
    (tile) => {
      enterContent();
      navigate(tile.path);
    },
    [enterContent, navigate],
  );

  if (!config) {
    return <Navigate to="/my-library" replace />;
  }

  const gridFocused = gridActive && !headerClearFocused;

  const clearConfirm = {
    dialogTitle: config.clearConfirmDialogTitle,
    bodyPhrase: config.clearConfirmBodyHistoryPhrase,
    primaryLabel: config.clearConfirmPrimaryLabel,
  };

  const headerClearButton = (
    <KeyboardWrapper
      ref={clearBtnRef}
      onSelect={openClearDialog}
      onDown={tiles.length > 0 ? focusGridFromHeader : undefined}
    >
      {(focusProps) => (
        <FocusableButton
          {...focusProps}
          type="button"
          className="listen-again-more__clear-btn"
          focused={headerClearFocused && focusZone === FOCUS_ZONE_CONTENT}
          disabled={!canClear}
          onClick={openClearDialog}
          aria-label={config.clearAriaLabel}
        >
          Clear
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );

  return (
    <div ref={shellRef} className="tv-drill-screen tv-screen-overlay">
      <TvDrillScreenHeader
        title={config.moreScreenTitle}
        headerRef={headerRef}
        endSlot={headerClearButton}
      />

      <div
        ref={viewportRef}
        className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {tiles.length === 0 ? (
            <p className="tv-drill-screen__empty">{config.emptyGridMessage}</p>
          ) : (
            <ContentGrid
              ref={gridRef}
              items={tiles}
              columns={gridLayout.columns}
              cardSize={gridLayout.cardSize}
              focused={gridFocused}
              focusedPosition={gridFocusedPosition}
              onFocusChange={(position) => {
                setHeaderClearFocused(false);
                setGridFocusedPosition(position);
              }}
              onBoundaryLeft={enterNavFromGrid}
              onSelect={handleSelect}
              registerRowRef={registerGroupRef}
              scrollIntoViewOnFocus={false}
              renderItem={(item, rowIndex, _col, isFocused, setRef, cellNav) => {
                const nav = {
                  ...cellNav,
                  onUp:
                    rowIndex === 0 && canClear
                      ? (event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          focusHeaderClear();
                        }
                      : cellNav.onUp,
                };
                return (
                  <KeyboardWrapper
                    ref={setRef}
                    selectData={item}
                    onSelect={() => handleSelect(item)}
                    {...gridCellKeyboardProps(nav)}
                  >
                    {(focusProps) => (
                      <ContentTileCard
                        {...focusProps}
                        title={item.title}
                        imageUrl={item.thumbnail}
                        focused={isFocused}
                        playing={
                          (item.kind === "music" &&
                            playingChannelId === item.id) ||
                          (item.kind === "podcast" &&
                            playingPodcastId === item.id)
                        }
                      />
                    )}
                  </KeyboardWrapper>
                );
              }}
            />
          )}
        </div>
      </div>

      <TvListenHistoryClearDialog
        open={clearDialogOpen}
        onClose={closeClearDialog}
        onConfirm={confirmClear}
        confirm={clearConfirm}
      />
    </div>
  );
}
