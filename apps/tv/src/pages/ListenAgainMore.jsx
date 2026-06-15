import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { resolveListenAgainItems } from "@sm-mpr/shared/utils/listenAgainItems.js";
import { filterListenHistoryByProfile } from "@sm-mpr/shared/constants/productProfile.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import TvDrillGridPage from "../components/drill/TvDrillGridPage.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { getActivePodcastShowId } from "../utils/playbackMiniPlayer.js";
import "../components/cards/ContentTileCard.css";

/** Full mixed Listen again grid (mobile `/more/listen-again` parity). */
export default function ListenAgainMore() {
  const navigate = useNavigate();
  const { items } = useListenHistory();
  const { enabledContentTypes } = useContentProfile();
  const { session } = usePlayback();

  const tiles = useMemo(() => {
    const filtered = filterListenHistoryByProfile(items, enabledContentTypes);
    return resolveListenAgainItems(filtered);
  }, [items, enabledContentTypes]);

  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;
  const playingPodcastId = getActivePodcastShowId(session);

  const handleSelect = useCallback(
    (tile) => {
      navigate(tile.path);
    },
    [navigate],
  );

  return (
    <TvDrillGridPage
      screenId="more-listen-again"
      title="Listen again"
      items={tiles}
      emptyMessage="Nothing in your listening history yet."
      onSelectItem={handleSelect}
      renderItem={(tile, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={tile}
          onSelect={() => onSelect(tile)}
          {...gridCellKeyboardProps(cellNav)}
        >
          {(focusProps) => (
            <ContentTileCard
              {...focusProps}
              title={tile.title}
              imageUrl={tile.thumbnail}
              focused={isFocused}
              playing={
                (tile.kind === "music" && playingChannelId === tile.id) ||
                (tile.kind === "podcast" && playingPodcastId === tile.id)
              }
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
