import { useMemo } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import TvSearchEpisodeDrillPage from "../components/search/TvSearchEpisodeDrillPage.jsx";
import TvSearchLabelTile from "../components/search/TvSearchLabelTile.jsx";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import {
  CATALOG_MORE_LANE_LABELS,
  getCatalogMoreItems,
  normalizeCatalogMoreNeedle,
  resolveCatalogMoreLane,
} from "../utils/searchCatalogMoreData.js";

function catalogMoreScreenId(lane, rawQuery) {
  const slug = rawQuery.trim().slice(0, 48).replace(/\s+/g, "-") || "empty";
  return `search-more-catalog-${lane}-${slug}`;
}

/** Full Search results grid for one lane (`/search/more/catalog?lane=&q=`). */
export default function TvSearchCatalogMore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { enabledSearchResultLanes } = useContentProfile();

  const rawLane = params.get("lane");
  const rawQ = params.get("q") ?? "";
  const needle = useMemo(() => normalizeCatalogMoreNeedle(rawQ), [rawQ]);

  const { laneAllowed, activeLane } = useMemo(
    () => resolveCatalogMoreLane(rawLane, enabledSearchResultLanes),
    [rawLane, enabledSearchResultLanes],
  );

  const items = useMemo(
    () => getCatalogMoreItems(activeLane, needle),
    [activeLane, needle],
  );

  if (!laneAllowed) {
    const search = rawQ
      ? `?lane=${activeLane}&q=${encodeURIComponent(rawQ)}`
      : `?lane=${activeLane}`;
    return <Navigate to={`/search/more/catalog${search}`} replace />;
  }

  const laneLabel = CATALOG_MORE_LANE_LABELS[activeLane] ?? "Results";
  const title = needle ? `${laneLabel}: ${rawQ.trim()}` : laneLabel;
  const screenId = catalogMoreScreenId(activeLane, rawQ);
  const emptyMessage = !needle
    ? "Enter a search to see results."
    : `No ${laneLabel.toLowerCase()} match "${rawQ.trim()}".`;

  if (activeLane === SEARCH_RESULT_LANE.episodes) {
    return (
      <TvSearchEpisodeDrillPage
        screenId={screenId}
        title={title}
        rows={items}
        emptyMessage={emptyMessage}
        onSelectRow={({ podcast }) => navigate(`/podcast/${podcast.id}`)}
      />
    );
  }

  const onSelectItem = (item) => {
    switch (activeLane) {
      case SEARCH_RESULT_LANE.channels:
        navigate(`/music/${item.id}`);
        break;
      case SEARCH_RESULT_LANE.artists:
        navigate(`/search/browse/music/artist/${item.id}`);
        break;
      case SEARCH_RESULT_LANE.tags:
        navigate(`/search/more/tags?q=${encodeURIComponent(item.label)}`);
        break;
      case SEARCH_RESULT_LANE.podcasts:
        navigate(`/podcast/${item.id}`);
        break;
      case SEARCH_RESULT_LANE.radio:
        navigate(`/radio/${item.id}`);
        break;
      default:
        break;
    }
  };

  const renderItem = (item, isFocused, setRef, onSelect, cellNav) => {
    const gridKeys = gridCellKeyboardProps(cellNav);
    switch (activeLane) {
      case SEARCH_RESULT_LANE.channels:
        return (
          <KeyboardWrapper
            ref={setRef}
            selectData={item}
            onSelect={() => onSelect(item)}
            {...gridKeys}
          >
            {(focusProps) => (
              <MusicChannelCard
                {...focusProps}
                channel={item}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        );
      case SEARCH_RESULT_LANE.artists:
      case SEARCH_RESULT_LANE.tags:
        return (
          <KeyboardWrapper
            ref={setRef}
            selectData={item}
            onSelect={() => onSelect(item)}
            {...gridKeys}
          >
            {(focusProps) => (
              <TvSearchLabelTile
                {...focusProps}
                label={item.label ?? item.name}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        );
      case SEARCH_RESULT_LANE.podcasts:
      case SEARCH_RESULT_LANE.radio:
        return (
          <KeyboardWrapper
            ref={setRef}
            selectData={item}
            onSelect={() => onSelect(item)}
            {...gridKeys}
          >
            {(focusProps) => (
              <ContentTileCard
                {...focusProps}
                title={item.title ?? item.name}
                imageUrl={item.thumbnail}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <TvSearchBrowseDrillPage
      screenId={screenId}
      title={title}
      items={items}
      emptyMessage={emptyMessage}
      onSelectItem={onSelectItem}
      renderItem={renderItem}
    />
  );
}
