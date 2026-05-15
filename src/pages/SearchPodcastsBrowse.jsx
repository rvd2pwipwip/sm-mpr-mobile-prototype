import { Fragment } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane.jsx";
import PodcastCard from "../components/PodcastCard.jsx";
import {
  SearchBrowseTile,
  SearchBrowseTileGrid,
} from "../components/SearchBrowseTile.jsx";
import {
  PODCAST_LIBRARY_SLUG,
  podcastLibraryBrowsePath,
} from "../constants/podcastSearchLibrary.js";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
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
 * catalog tiles (see `docs/Stories/Podcasts-story.md`).
 */
export default function SearchPodcastsBrowse() {
  const navigate = useNavigate();
  const {
    continueListening,
    subscribedPodcasts,
    bookmarkedEpisodes,
    downloadedEpisodes,
    newEpisodeRows,
  } = usePodcastUserState();

  const headingId = "search-podcasts-browse-heading";

  return (
    <Fragment>
      {PODCAST_CATEGORIES.map((cat) => {
        const podcasts = getPodcastsByCategory(cat.id);
        const visible = podcasts.slice(0, SWIMLANE_CARD_MAX);
        const trailingMore = podcasts.length > SWIMLANE_CARD_MAX;
        return (
          <ContentSwimlane
            key={cat.id}
            title={cat.label}
            showMore={false}
            sourceCount={podcasts.length}
            maxVisible={SWIMLANE_CARD_MAX}
            trailingMoreCard={trailingMore}
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
      <div className="content-inset search-page__body search-page__podcasts-categories">
        {/* <h2 id={headingId} className="search-page__browse-heading">
        Browse podcasts
      </h2> */}
        <SearchBrowseTileGrid labelId={headingId}>
          {continueListening.length > 0 ? (
            <SearchBrowseTile
              onClick={() =>
                navigate(
                  podcastLibraryBrowsePath(
                    PODCAST_LIBRARY_SLUG.continueListening,
                  ),
                )
              }
            >
              <PodcastLibraryTileLabel
                label="Continue listening"
                count={continueListening.length}
              />
            </SearchBrowseTile>
          ) : null}
          {subscribedPodcasts.length > 0 ? (
            <SearchBrowseTile
              onClick={() =>
                navigate(
                  podcastLibraryBrowsePath(PODCAST_LIBRARY_SLUG.yourPodcasts),
                )
              }
            >
              <PodcastLibraryTileLabel
                label="Your Podcasts"
                count={subscribedPodcasts.length}
              />
            </SearchBrowseTile>
          ) : null}
          {bookmarkedEpisodes.length > 0 ? (
            <SearchBrowseTile
              onClick={() =>
                navigate(
                  podcastLibraryBrowsePath(PODCAST_LIBRARY_SLUG.yourEpisodes),
                )
              }
            >
              <PodcastLibraryTileLabel
                label="Your Episodes"
                count={bookmarkedEpisodes.length}
              />
            </SearchBrowseTile>
          ) : null}
          {newEpisodeRows.length > 0 ? (
            <SearchBrowseTile
              onClick={() =>
                navigate(
                  podcastLibraryBrowsePath(PODCAST_LIBRARY_SLUG.newEpisodes),
                )
              }
            >
              <PodcastLibraryTileLabel
                label="New Episodes"
                count={newEpisodeRows.length}
              />
            </SearchBrowseTile>
          ) : null}
          {downloadedEpisodes.length > 0 ? (
            <SearchBrowseTile
              onClick={() =>
                navigate(
                  podcastLibraryBrowsePath(
                    PODCAST_LIBRARY_SLUG.downloadedEpisodes,
                  ),
                )
              }
            >
              <PodcastLibraryTileLabel
                label="Downloaded Episodes"
                count={downloadedEpisodes.length}
              />
            </SearchBrowseTile>
          ) : null}
          {PODCAST_CATEGORIES.map((c) => (
            <SearchBrowseTile
              key={c.id}
              onClick={() =>
                navigate(`/search/browse/podcasts/category/${c.id}`)
              }
            >
              {c.label}
            </SearchBrowseTile>
          ))}
        </SearchBrowseTileGrid>
      </div>
    </Fragment>
  );
}
