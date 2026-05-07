import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import EpisodeCard from "../components/EpisodeCard";
import PodcastCard from "../components/PodcastCard";
import {
  SearchBrowseTile,
  SearchBrowseTileGrid,
} from "../components/SearchBrowseTile.jsx";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { PODCAST_CATEGORIES } from "../data/podcasts";

/**
 * Search tab → Browse → Podcasts: conditional library rails + category tiles (see
 * `docs/Stories/Podcasts-story.md`, Figma `19805:39266`).
 */
export default function SearchPodcastsBrowse() {
  const navigate = useNavigate();
  const {
    continueListening,
    subscribedPodcasts,
    bookmarkedEpisodes,
    downloadedEpisodes,
    newEpisodeRows,
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const categoryHeadingId = "search-podcasts-categories-heading";

  const episodeHandlers = (podcast, episode) => ({
    isBookmarked: isBookmarked(episode.id),
    isDownloaded: isDownloaded(episode.id),
    progressFraction: getEpisodeProgress(episode.id),
    onNavigate: () =>
      navigate(`/podcast/${podcast.id}/play/${episode.id}`, {
        replace: true,
        state: playOverDetailNavigateState(),
      }),
    onToggleBookmark: () => toggleBookmark(episode.id),
    onToggleDownload: () => toggleDownload(episode.id),
  });

  return (
    <>
      {continueListening.length > 0 ? (
        <ContentSwimlane title="Continue listening" showMore={false}>
          {continueListening.map(({ podcast, episode, position01 }) => (
            <div key={episode.id} className="search-page__episode-rail-cell">
              <EpisodeCard
                episode={episode}
                {...episodeHandlers(podcast, episode)}
                progressFraction={position01}
              />
            </div>
          ))}
        </ContentSwimlane>
      ) : null}

      {subscribedPodcasts.length > 0 ? (
        <ContentSwimlane title="Your Podcasts" showMore={false}>
          {subscribedPodcasts.map((podcast) => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              onSelect={() => navigate(`/podcast/${podcast.id}`)}
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {bookmarkedEpisodes.length > 0 ? (
        <ContentSwimlane title="Your Episodes" showMore={false}>
          {bookmarkedEpisodes.map((row) => (
            <div key={row.episode.id} className="search-page__episode-rail-cell">
              <EpisodeCard
                episode={row.episode}
                {...episodeHandlers(row.podcast, row.episode)}
              />
            </div>
          ))}
        </ContentSwimlane>
      ) : null}

      {newEpisodeRows.length > 0 ? (
        <ContentSwimlane title="New Episodes" showMore={false}>
          {newEpisodeRows.map(({ podcast, episode }) => (
            <div key={episode.id} className="search-page__episode-rail-cell">
              <EpisodeCard
                episode={episode}
                {...episodeHandlers(podcast, episode)}
              />
            </div>
          ))}
        </ContentSwimlane>
      ) : null}

      {downloadedEpisodes.length > 0 ? (
        <ContentSwimlane title="Downloaded Episodes" showMore={false}>
          {downloadedEpisodes.map((row) => (
            <div key={row.episode.id} className="search-page__episode-rail-cell">
              <EpisodeCard
                episode={row.episode}
                {...episodeHandlers(row.podcast, row.episode)}
              />
            </div>
          ))}
        </ContentSwimlane>
      ) : null}

      <div className="content-inset search-page__body search-page__podcasts-categories">
        <h2 id={categoryHeadingId} className="search-page__browse-heading">
          Browse by category
        </h2>
        <SearchBrowseTileGrid labelId={categoryHeadingId}>
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
    </>
  );
}
