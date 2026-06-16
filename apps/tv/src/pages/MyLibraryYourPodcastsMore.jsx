import { useCallback, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  PODCAST_LIBRARY_RAIL_TITLES,
  PODCAST_LIBRARY_SLUG,
  PODCAST_LIBRARY_YOUR_PODCASTS_CLEAR,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
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
import { usePlayback } from "../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../utils/playbackMiniPlayer.js";
import { getTvBrowseGridLayout } from "../utils/tvLayout.js";
import { FOCUS_ZONE_CONTENT, useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import "../components/cards/ContentTileCard.css";
import "../components/drill/TvDrillScreen.css";
import "./ListenAgainMore.css";

const SCREEN_TITLE =
  PODCAST_LIBRARY_RAIL_TITLES[PODCAST_LIBRARY_SLUG.yourPodcasts];
const SCREEN_ID = "my-library-your-podcasts";

/** Full subscribed-shows grid + Clear (`/my-library/podcasts/your-podcasts`). */
export default function MyLibraryYourPodcastsMore() {
  const navigate = useNavigate();
  const { subscribedPodcasts, unsubscribePodcasts } = usePodcastUserState();
  const { session } = usePlayback();
  const { focusZone } = useTvNavFocus();

  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [headerClearFocused, setHeaderClearFocused] = useState(false);
  const clearBtnRef = useRef(null);

  const tiles = useMemo(
    () =>
      subscribedPodcasts.map((podcast) => ({
        kind: "podcast",
        id: podcast.id,
        title: podcast.title,
        thumbnail: podcast.thumbnail,
        path: `/podcast/${podcast.id}`,
      })),
    [subscribedPodcasts],
  );

  const playingPodcastId = getActivePodcastShowId(session);

  const gridLayout = useMemo(() => getTvBrowseGridLayout(), []);
  const gridRef = useRef(null);
  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const rowCount = useMemo(() => {
    if (tiles.length === 0) return 0;
    return Math.ceil(tiles.length / gridLayout.columns);
  }, [tiles.length, gridLayout.columns]);

  const canClear = tiles.length > 0;

  useContentFocusGroups(1);

  const {
    gridFocusedPosition,
    setGridFocusedPosition,
    gridActive,
    enterNavFromGrid,
    enterContent,
  } = useTvGridScreenFocus(SCREEN_ID, gridLayout.columns);

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
    screenId: SCREEN_ID,
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
    unsubscribePodcasts(subscribedPodcasts.map((podcast) => podcast.id));
    setClearDialogOpen(false);
    navigate(-1);
  }, [navigate, subscribedPodcasts, unsubscribePodcasts]);

  const handleSelect = useCallback(
    (tile) => {
      enterContent();
      navigate(tile.path);
    },
    [enterContent, navigate],
  );

  const gridFocused = gridActive && !headerClearFocused;

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
          aria-label={PODCAST_LIBRARY_YOUR_PODCASTS_CLEAR.clearAriaLabel}
        >
          Clear
        </FocusableButton>
      )}
    </KeyboardWrapper>
  );

  return (
    <div ref={shellRef} className="tv-drill-screen tv-screen-overlay">
      <TvDrillScreenHeader
        title={SCREEN_TITLE}
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
            <p className="tv-drill-screen__empty">No subscriptions yet.</p>
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
                        playing={playingPodcastId === item.id}
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
        confirm={PODCAST_LIBRARY_YOUR_PODCASTS_CLEAR}
      />
    </div>
  );
}
