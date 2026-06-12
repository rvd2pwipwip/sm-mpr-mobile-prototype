import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  getPodcastCategoryById,
  getPodcastsByCategory,
} from "@sm-mpr/shared/data/podcasts.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";

/** Search -> Browse -> Podcasts -> one category grid (5-col, parked vertical scroll). */
export default function SearchPodcastsCategory() {
  const { categoryId } = useParams();
  const navigate = useNavigate();

  const category = categoryId ? getPodcastCategoryById(categoryId) : null;
  const podcasts = categoryId ? getPodcastsByCategory(categoryId) : [];

  if (!categoryId || !category) {
    return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-podcasts-category-${categoryId}`}
      title={category.label}
      items={podcasts}
      emptyMessage="No podcasts in this category."
      onSelectItem={(podcast) => navigate(`/podcast/${podcast.id}`)}
      renderItem={(podcast, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={podcast}
          onSelect={() => onSelect(podcast)}
          {...gridCellKeyboardProps(cellNav)}

        >
          {(focusProps) => (
            <ContentTileCard
              {...focusProps}
              title={podcast.title}
              imageUrl={podcast.thumbnail}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
