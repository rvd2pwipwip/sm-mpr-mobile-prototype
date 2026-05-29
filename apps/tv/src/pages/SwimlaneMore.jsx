import { useCallback, useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import ContentGrid from "../components/grid/ContentGrid.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import { useContentFocusGroups } from "../hooks/useContentFocusGroups.js";
import { useScreenMemory } from "../context/ScreenMemoryContext.jsx";
import {
  FOCUS_ZONE_CONTENT,
  useTvNavFocus,
} from "../context/TvNavFocusContext.jsx";
import { getTvGridColumnCount } from "../utils/tvLayout.js";
import "../components/cards/ContentTileCard.css";
import "./SwimlaneMore.css";

const MORE_CONFIG = {
  "/more/music": {
    screenId: "more-music",
    title: "Most popular music",
    getChannels: () => MUSIC_CHANNELS,
  },
  "/more/recommendations": {
    screenId: "more-recommendations",
    title: "Recommendations",
    getChannels: () => getRecommendationsMusicChannels(),
  },
};

const GRID_GROUP = 0;
const DEFAULT_GRID_POSITION = { row: 0, col: 0 };

export default function SwimlaneMore() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const config = MORE_CONFIG[pathname];

  const { enterNav, enterContent, focusZone } = useTvNavFocus();
  const { memory, setField, getFocusedGroupIndex } = useScreenMemory(
    config?.screenId ?? "more-unknown",
  );

  useContentFocusGroups(1);

  const channels = useMemo(
    () => (config ? config.getChannels() : []),
    [config],
  );

  const gridFocusedPosition = memory.gridFocusedPosition ?? DEFAULT_GRID_POSITION;
  const focusedGroupIndex = getFocusedGroupIndex(GRID_GROUP);
  const gridFocused =
    focusZone === FOCUS_ZONE_CONTENT && focusedGroupIndex === GRID_GROUP;

  const setGridFocusedPosition = useCallback(
    (position) => {
      setField("gridFocusedPosition", position);
    },
    [setField],
  );

  const handleGridNavigationEscape = useCallback(
    (direction) => {
      if (direction === "up" || direction === "left") {
        enterNav();
      }
    },
    [enterNav],
  );

  const handleChannelSelect = useCallback(
    (channel) => {
      enterContent();
      navigate(`/music/${channel.id}`);
    },
    [enterContent, navigate],
  );

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const columnCount = getTvGridColumnCount();

  return (
    <div className="swimlane-more">
      <header className="swimlane-more__header">
        <h1 className="swimlane-more__title">{config.title}</h1>
        <p className="swimlane-more__meta">
          {channels.length} channels · {columnCount} columns · Esc returns to
          Home
        </p>
      </header>

      <div className="swimlane-more__grid-wrap">
        <ContentGrid
          items={channels}
          columns={columnCount}
          focused={gridFocused}
          focusedPosition={gridFocusedPosition}
          onFocusChange={setGridFocusedPosition}
          onNavigationEscape={handleGridNavigationEscape}
          onSelect={handleChannelSelect}
          renderItem={(channel, _row, _col, isFocused, setRef) => (
            <KeyboardWrapper
              ref={setRef}
              selectData={channel}
              onSelect={() => handleChannelSelect(channel)}
            >
              {(focusProps) => (
                <MusicChannelCard
                  {...focusProps}
                  channel={channel}
                  focused={isFocused}
                />
              )}
            </KeyboardWrapper>
          )}
        />
      </div>
    </div>
  );
}
