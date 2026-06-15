import { useCallback, useMemo } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import { getRadioStationById } from "@sm-mpr/shared/data/radioStations.js";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import TvDrillGridPage from "../components/drill/TvDrillGridPage.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import { useLikes } from "../context/LikesContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import "../components/cards/ContentTileCard.css";

const MORE_TITLE = {
  music: "Your music channels",
  radio: "Your radio stations",
};

/** Full likes grid (`/my-library/likes/music` or `/my-library/likes/radio`). */
export default function MyLibraryLikesMore() {
  const { likeKind } = useParams();
  const navigate = useNavigate();
  const { items } = useLikes();
  const { session } = usePlayback();
  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;

  const rows = useMemo(() => {
    if (likeKind === "music") {
      return items
        .filter((entry) => entry.kind === "music")
        .map((entry) => getMusicChannelById(entry.id))
        .filter(Boolean);
    }
    if (likeKind === "radio") {
      return items
        .filter((entry) => entry.kind === "radio")
        .map(
          (entry) =>
            getRadioStationById(entry.id) ??
            resolveRadioStationForStub(entry.id),
        )
        .filter(Boolean);
    }
    return [];
  }, [items, likeKind]);

  const handleMusicSelect = useCallback(
    (channel) => {
      navigate(`/music/${channel.id}`);
    },
    [navigate],
  );

  const handleRadioSelect = useCallback(
    (station) => {
      navigate(`/radio/${station.id}`);
    },
    [navigate],
  );

  if (likeKind !== "music" && likeKind !== "radio") {
    return <Navigate to="/my-library" replace />;
  }

  const title = MORE_TITLE[likeKind];
  const screenId = `my-library-likes-${likeKind}`;

  if (likeKind === "music") {
    return (
      <TvDrillGridPage
        screenId={screenId}
        title={title}
        items={rows}
        emptyMessage="Nothing saved yet."
        onSelectItem={handleMusicSelect}
        renderItem={(channel, isFocused, setRef, onSelect, cellNav) => (
          <KeyboardWrapper
            ref={setRef}
            selectData={channel}
            onSelect={() => onSelect(channel)}
            {...gridCellKeyboardProps(cellNav)}
          >
            {(focusProps) => (
              <MusicChannelCard
                {...focusProps}
                channel={channel}
                focused={isFocused}
                playing={playingChannelId === channel.id}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

  return (
    <TvDrillGridPage
      screenId={screenId}
      title={title}
      items={rows}
      emptyMessage="Nothing saved yet."
      onSelectItem={handleRadioSelect}
      renderItem={(station, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={station}
          onSelect={() => onSelect(station)}
          {...gridCellKeyboardProps(cellNav)}
        >
          {(focusProps) => (
            <ContentTileCard
              {...focusProps}
              title={station.name}
              imageUrl={station.thumbnail}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
