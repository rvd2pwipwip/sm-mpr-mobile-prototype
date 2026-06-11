import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getPodcastsByCategory } from "@sm-mpr/shared/data/podcasts.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import "./TvSearchPodcastsBrowseBody.css";

/**
 * Podcasts tab browse body — one {@link ContentTileSwimlane} per iAB category (mobile IA).
 */
export default function TvSearchPodcastsBrowseBody({
  browseLayout,
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

  const wrapGroup = useCallback(
    (groupIndex, node) => {
      registerGroupRef?.(groupIndex, node);
    },
    [registerGroupRef],
  );

  return (
    <div className="tv-search-podcasts-browse">
      {browseLayout.categories.map((category, index) => {
        const groupIndex = browseLayout.firstBodyGroup + index;
        const podcasts = getPodcastsByCategory(category.id);
        const items = podcasts.map((podcast) => ({
          id: podcast.id,
          thumbnail: podcast.thumbnail,
          title: podcast.title,
        }));

        return (
          <div
            key={category.id}
            className="tv-home__scroll-group tv-search-podcasts-browse__group"
            ref={(node) => wrapGroup(groupIndex, node)}
          >
            <ContentTileSwimlane
              title={category.label}
              items={items}
              sourceCount={category.sourceCount}
              groupIndex={groupIndex}
              focused={isContentGroupActive(groupIndex)}
              focusedIndex={getItemFocusIndex(groupIndex)}
              onFocusChange={(index) => setFocusedIndex(groupIndex, index)}
              onBoundaryLeft={enterNavFromContent}
              registerItemRef={registerItemRef}
              onMoveUp={onMoveUp}
              onMoveDown={onMoveDown}
              onSelectItem={(item) => navigate(`/podcast/${item.id}`)}
              onMore={() =>
                navigate(`/search/browse/podcasts/category/${category.id}`)
              }
            />
          </div>
        );
      })}
    </div>
  );
}
