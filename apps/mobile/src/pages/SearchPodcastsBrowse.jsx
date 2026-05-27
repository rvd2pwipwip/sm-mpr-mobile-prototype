import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane.jsx";
import PodcastCard from "../components/PodcastCard.jsx";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import { PODCAST_CATEGORIES, getPodcastsByCategory } from "../data/podcasts";

/** Single text flow for library tile labels + count (wraps like one phrase; see `.search-browse-tile__label-text`). */
function PodcastLibraryTileLabel({ label, count }) {
  return (
    <span className="search-browse-tile__label-text">
      {label}
      {"\u00a0"}
      <span className="search-browse-tile__inline-count">{count}</span>
    </span>
  );
}

/**
 * Search tab → Browse → Podcasts: stacked category swimlanes (no pill rail), then library +
 * catalog tiles (see `docs/mobile/Stories/Podcasts-story.md`).
 */
export default function SearchPodcastsBrowse() {
  const navigate = useNavigate();

  return (
    <Fragment>
      {PODCAST_CATEGORIES.map((cat) => {
        const podcasts = getPodcastsByCategory(cat.id);
        const visible = podcasts.slice(0, SWIMLANE_CARD_MAX);
        return (
          <ContentSwimlane
            key={cat.id}
            title={cat.label}
            showMore={false}
            sourceCount={podcasts.length}
            maxVisible={SWIMLANE_CARD_MAX}
            onMore={() =>
              navigate(`/search/browse/podcasts/category/${cat.id}`)
            }
          >
            {visible.map((p) => (
              <PodcastCard
                key={p.id}
                podcast={p}
                onSelect={() => navigate(`/podcast/${p.id}`)}
              />
            ))}
          </ContentSwimlane>
        );
      })}
    </Fragment>
  );
}
