import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import EpisodeCard from "./EpisodeCard";
import PodcastCard from "./PodcastCard";
import {
  PODCAST_LIBRARY_SLUG,
  podcastLibraryBrowsePath,
} from "../constants/podcastSearchLibrary";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "../constants/userContentGates";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";

const RAIL_TITLE = {
  [PODCAST_LIBRARY_SLUG.yourPodcasts]: "Your Podcasts",
  [PODCAST_LIBRARY_SLUG.continueListening]: "Continue listening",
  [PODCAST_LIBRARY_SLUG.yourEpisodes]: "Your Episodes",
  [PODCAST_LIBRARY_SLUG.newEpisodes]: "New Episodes",
  [PODCAST_LIBRARY_SLUG.downloadedEpisodes]: "Downloaded Episodes",
};

/**
 * Podcast library swimlanes from `PodcastUserStateContext` — omitted when empty; More uses
 * Search browse library grids (`docs/Stories/My-Library-story`).
 */
export default function LibraryPodcastUserSwimlanes() {
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();
  const {
    subscribedPodcasts,
    continueListening,
    bookmarkedEpisodes,
    newEpisodeRows,
    downloadedEpisodes,
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const episodeHandlers = (podcast, episode, progressFraction) => ({
    isBookmarked: isBookmarked(episode.id),
    isDownloaded: isDownloaded(episode.id),
    progressFraction,
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

  const rails = [];

  if (subscribedPodcasts.length > 0) {
    const slug = PODCAST_LIBRARY_SLUG.yourPodcasts;
    rails.push(
      <ContentSwimlane
        key={slug}
        title={RAIL_TITLE[slug]}
        sourceCount={subscribedPodcasts.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(podcastLibraryBrowsePath(slug))}
      >
        {subscribedPodcasts.slice(0, SWIMLANE_CARD_MAX).map((podcast) => (
          <PodcastCard
            key={podcast.id}
            podcast={podcast}
            onSelect={() => navigate(`/podcast/${podcast.id}`)}
          />
        ))}
      </ContentSwimlane>,
    );
  }

  if (continueListening.length > 0) {
    const slug = PODCAST_LIBRARY_SLUG.continueListening;
    rails.push(
      <ContentSwimlane
        key={slug}
        title={RAIL_TITLE[slug]}
        sourceCount={continueListening.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(podcastLibraryBrowsePath(slug))}
      >
        {continueListening
          .slice(0, SWIMLANE_CARD_MAX)
          .map(({ podcast, episode, position01 }) => (
            <div
              key={episode.id}
              className="my-library__episode-tile"
            >
              <EpisodeCard
                episode={episode}
                {...episodeHandlers(podcast, episode, position01)}
              />
            </div>
          ))}
      </ContentSwimlane>,
    );
  }

  if (bookmarkedEpisodes.length > 0) {
    const slug = PODCAST_LIBRARY_SLUG.yourEpisodes;
    rails.push(
      <ContentSwimlane
        key={slug}
        title={RAIL_TITLE[slug]}
        sourceCount={bookmarkedEpisodes.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(podcastLibraryBrowsePath(slug))}
      >
        {bookmarkedEpisodes
          .slice(0, SWIMLANE_CARD_MAX)
          .map((row) => (
            <div
              key={row.episode.id}
              className="my-library__episode-tile"
            >
              <EpisodeCard
                episode={row.episode}
                {...episodeHandlers(
                  row.podcast,
                  row.episode,
                  getEpisodeProgress(row.episode.id),
                )}
              />
            </div>
          ))}
      </ContentSwimlane>,
    );
  }

  if (newEpisodeRows.length > 0) {
    const slug = PODCAST_LIBRARY_SLUG.newEpisodes;
    rails.push(
      <ContentSwimlane
        key={slug}
        title={RAIL_TITLE[slug]}
        sourceCount={newEpisodeRows.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(podcastLibraryBrowsePath(slug))}
      >
        {newEpisodeRows
          .slice(0, SWIMLANE_CARD_MAX)
          .map(({ podcast, episode }) => (
            <div
              key={`${podcast.id}-${episode.id}`}
              className="my-library__episode-tile"
            >
              <EpisodeCard
                episode={episode}
                {...episodeHandlers(
                  podcast,
                  episode,
                  getEpisodeProgress(episode.id),
                )}
              />
            </div>
          ))}
      </ContentSwimlane>,
    );
  }

  if (downloadedEpisodes.length > 0) {
    const slug = PODCAST_LIBRARY_SLUG.downloadedEpisodes;
    rails.push(
      <ContentSwimlane
        key={slug}
        title={RAIL_TITLE[slug]}
        sourceCount={downloadedEpisodes.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(podcastLibraryBrowsePath(slug))}
      >
        {downloadedEpisodes
          .slice(0, SWIMLANE_CARD_MAX)
          .map((row) => (
            <div
              key={row.episode.id}
              className="my-library__episode-tile"
            >
              <EpisodeCard
                episode={row.episode}
                {...episodeHandlers(
                  row.podcast,
                  row.episode,
                  getEpisodeProgress(row.episode.id),
                )}
              />
            </div>
          ))}
      </ContentSwimlane>,
    );
  }

  return <>{rails}</>;
}
