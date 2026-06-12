import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import TvSearchEpisodeList from "./TvSearchEpisodeList.jsx";
import TvSearchLabelTileSwimlane from "./TvSearchLabelTileSwimlane.jsx";
import "./TvSearchResultsBody.css";

/**
 * Live search result swimlanes (profile-gated; mobile {@link SearchResultsPanel} parity).
 */
export default function TvSearchResultsBody({
  results,
  resultsLayout,
  debouncedQuery,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
}) {
  const navigate = useNavigate();
  const qEnc = encodeURIComponent(debouncedQuery.trim());

  const navigateCatalogMore = useCallback(
    (lane) => {
      navigate(`/search/more/catalog?lane=${lane}&q=${qEnc}`);
    },
    [navigate, qEnc],
  );

  const artistTiles = useMemo(
    () =>
      results.artists.map((artist) => ({
        id: artist.id,
        slug: artist.id,
        label: artist.name,
      })),
    [results.artists],
  );

  const tagTiles = useMemo(
    () =>
      results.tagLabels.map((label) => ({
        id: label,
        slug: label,
        label,
      })),
    [results.tagLabels],
  );

  const podcastItems = useMemo(
    () =>
      results.podcasts.map((podcast) => ({
        id: podcast.id,
        thumbnail: podcast.thumbnail,
        title: podcast.title,
      })),
    [results.podcasts],
  );

  const radioItems = useMemo(
    () =>
      results.radioStations.map((station) => ({
        id: station.id,
        thumbnail: station.thumbnail,
        title: station.name,
      })),
    [results.radioStations],
  );

  const wrapGroup = useCallback(
    (groupIndex, node) => {
      registerGroupRef?.(groupIndex, node);
    },
    [registerGroupRef],
  );

  const laneProps = (groupIndex) => ({
    groupIndex,
    focused: isContentGroupActive(groupIndex),
    focusedIndex: getItemFocusIndex(groupIndex),
    onFocusChange: (index) => setFocusedIndex(groupIndex, index),
    onBoundaryLeft: enterNavFromContent,
    registerItemRef,
    onMoveUp,
    onMoveDown,
  });

  return (
    <div className="tv-search-results">
      {resultsLayout.lanes.map(({ laneId, groupIndex }) => {
        if (laneId === SEARCH_RESULT_LANE.channels) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <MusicChannelSwimlane
                title="Channels"
                channels={results.channels}
                sourceCount={results.channels.length}
                onSelectChannel={(channel) => navigate(`/music/${channel.id}`)}
                onMore={() => navigateCatalogMore("channels")}
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        if (laneId === SEARCH_RESULT_LANE.artists) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <TvSearchLabelTileSwimlane
                title="Artists"
                tiles={artistTiles}
                sourceCount={results.artists.length}
                onSelectTile={(tile) =>
                  navigate(`/search/browse/music/artist/${tile.id}`)
                }
                onMore={() => navigateCatalogMore("artists")}
                ariaLabel="Artists"
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        if (laneId === SEARCH_RESULT_LANE.tags) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <TvSearchLabelTileSwimlane
                title="Tags"
                tiles={tagTiles}
                sourceCount={results.tagLabels.length}
                onSelectTile={(tile) =>
                  navigate(`/search/more/tags?q=${encodeURIComponent(tile.label)}`)
                }
                onMore={() => navigateCatalogMore("tags")}
                ariaLabel="Tags"
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        if (laneId === SEARCH_RESULT_LANE.podcasts) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <ContentTileSwimlane
                title="Podcasts"
                items={podcastItems}
                sourceCount={results.podcasts.length}
                onSelectItem={(item) => navigate(`/podcast/${item.id}`)}
                onMore={() => navigateCatalogMore("podcasts")}
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        if (laneId === SEARCH_RESULT_LANE.episodes) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <TvSearchEpisodeList
                rows={results.episodeRows}
                sourceCount={results.episodeRows.length}
                onSelectRow={({ podcast }) => navigate(`/podcast/${podcast.id}`)}
                onMore={() => navigateCatalogMore("episodes")}
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        if (laneId === SEARCH_RESULT_LANE.radio) {
          return (
            <div
              key={laneId}
              className="tv-home__scroll-group"
              ref={(node) => wrapGroup(groupIndex, node)}
            >
              <ContentTileSwimlane
                title="Radio"
                items={radioItems}
                sourceCount={results.radioStations.length}
                onSelectItem={(item) => navigate(`/radio/${item.id}`)}
                onMore={() => navigateCatalogMore("radio")}
                {...laneProps(groupIndex)}
              />
            </div>
          );
        }

        return null;
      })}
    </div>
  );
}
