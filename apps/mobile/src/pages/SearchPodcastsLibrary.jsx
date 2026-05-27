import { Navigate, useNavigate, useParams } from "react-router-dom";
import EpisodeCard from "../components/EpisodeCard";
import PodcastCard from "../components/PodcastCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import {
  PODCAST_LIBRARY_SLUG,
  isPodcastLibrarySlug,
} from "../constants/podcastSearchLibrary.js";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "../constants/userContentGates";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";
import "./Search.css";
import "./SwimlaneMore.css";

const TITLES = {
  [PODCAST_LIBRARY_SLUG.continueListening]: "Continue listening",
  [PODCAST_LIBRARY_SLUG.yourPodcasts]: "Your Podcasts",
  [PODCAST_LIBRARY_SLUG.yourEpisodes]: "Your Episodes",
  [PODCAST_LIBRARY_SLUG.newEpisodes]: "New Episodes",
  [PODCAST_LIBRARY_SLUG.downloadedEpisodes]: "Downloaded Episodes",
};

/**
 * Search → Browse → Podcasts → one library shelf (episodes column or show grid).
 */
export default function SearchPodcastsLibrary() {
  const { librarySection } = useParams();
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

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

  if (!isPodcastLibrarySlug(librarySection)) {
    return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  const title = TITLES[librarySection];
  const goBack = () => navigate(-1);

  const episodeHandlers = (podcast, episode) => ({
    isBookmarked: isBookmarked(episode.id),
    isDownloaded: isDownloaded(episode.id),
    progressFraction: getEpisodeProgress(episode.id),
    onNavigate: () =>
      navigate(`/podcast/${podcast.id}/play/${episode.id}`, {
        replace: true,
        state: playOverDetailNavigateState(),
      }),
    onToggleBookmark: () => {
      if (
        !isBookmarked(episode.id) &&
        !userMayBookmarkEpisodes(userType)
      ) {
        openAccountRequiredDialog("episodeBookmark");
        return;
      }
      toggleBookmark(episode.id);
    },
    onToggleDownload: () => {
      if (
        !isDownloaded(episode.id) &&
        !userMayDownloadEpisodesOffline(userType)
      ) {
        openAccountRequiredDialog("episodeOfflineDownload");
        return;
      }
      toggleDownload(episode.id);
    },
  });

  let body = null;

  switch (librarySection) {
    case PODCAST_LIBRARY_SLUG.continueListening:
      body =
        continueListening.length === 0 ? (
          <p className="text-muted search-podcasts-library__empty">
            Nothing in progress.
          </p>
        ) : (
          <div className="search-podcasts-library__episode-stack">
            {continueListening.map(({ podcast, episode, position01 }) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                {...episodeHandlers(podcast, episode)}
                progressFraction={position01}
              />
            ))}
          </div>
        );
      break;
    case PODCAST_LIBRARY_SLUG.yourPodcasts:
      body =
        subscribedPodcasts.length === 0 ? (
          <p className="text-muted search-podcasts-library__empty">
            No subscriptions yet.
          </p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {subscribedPodcasts.map((podcast) => (
              <li key={podcast.id} className="swimlane-more__cell">
                <PodcastCard
                  podcast={podcast}
                  onSelect={() => navigate(`/podcast/${podcast.id}`)}
                />
              </li>
            ))}
          </ul>
        );
      break;
    case PODCAST_LIBRARY_SLUG.yourEpisodes:
      body =
        bookmarkedEpisodes.length === 0 ? (
          <p className="text-muted search-podcasts-library__empty">
            No bookmarked episodes.
          </p>
        ) : (
          <div className="search-podcasts-library__episode-stack">
            {bookmarkedEpisodes.map((row) => (
              <EpisodeCard
                key={row.episode.id}
                episode={row.episode}
                {...episodeHandlers(row.podcast, row.episode)}
              />
            ))}
          </div>
        );
      break;
    case PODCAST_LIBRARY_SLUG.newEpisodes:
      body =
        newEpisodeRows.length === 0 ? (
          <p className="text-muted search-podcasts-library__empty">
            Subscribe to shows to see new episodes here.
          </p>
        ) : (
          <div className="search-podcasts-library__episode-stack">
            {newEpisodeRows.map(({ podcast, episode }) => (
              <EpisodeCard
                key={`${podcast.id}-${episode.id}`}
                episode={episode}
                {...episodeHandlers(podcast, episode)}
              />
            ))}
          </div>
        );
      break;
    case PODCAST_LIBRARY_SLUG.downloadedEpisodes:
      body =
        downloadedEpisodes.length === 0 ? (
          <p className="text-muted search-podcasts-library__empty">
            No downloaded episodes.
          </p>
        ) : (
          <div className="search-podcasts-library__episode-stack">
            {downloadedEpisodes.map((row) => (
              <EpisodeCard
                key={row.episode.id}
                episode={row.episode}
                {...episodeHandlers(row.podcast, row.episode)}
              />
            ))}
          </div>
        );
      break;
    default:
      return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={title}
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="swimlane-more__scroll">{body}</div>
    </main>
  );
}
