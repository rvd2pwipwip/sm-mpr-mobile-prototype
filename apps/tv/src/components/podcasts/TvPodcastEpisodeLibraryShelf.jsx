import { useNavigate } from "react-router-dom";
import {
  PODCAST_LIBRARY_RAIL_TITLES,
  PODCAST_LIBRARY_SLUG,
  isPodcastEpisodeLibrarySlug,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import {
  mapPodcastEpisodeRailClearConfirm,
  runPodcastEpisodeRailClear,
} from "@sm-mpr/shared/utils/podcastLibraryClear.js";
import TvSearchEpisodeDrillPage from "../search/TvSearchEpisodeDrillPage.jsx";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";

/**
 * Full episode-library shelf (Continue listening, Your Episodes, …).
 * @param {{ librarySection: string, screenIdPrefix?: string }} props
 */
export default function TvPodcastEpisodeLibraryShelf({
  librarySection,
  screenIdPrefix = "podcast-library",
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();

  const podcastUserState = usePodcastUserState();
  const {
    continueListening,
    bookmarkedEpisodes,
    downloadedEpisodes,
    newEpisodeRows,
    getEpisodeProgress,
    clearAllEpisodeProgress,
    clearAllBookmarks,
    clearAllDownloads,
    unsubscribePodcasts,
  } = podcastUserState;

  if (!isPodcastEpisodeLibrarySlug(librarySection)) {
    return null;
  }

  const title = PODCAST_LIBRARY_RAIL_TITLES[librarySection];
  const screenId = `${screenIdPrefix}-${librarySection}`;
  const isMyLibrary = screenIdPrefix === "my-library";

  const playEpisode = ({ podcast, episode }) => {
    enterContent();
    navigate(`/podcast/${podcast.id}/play/${episode.id}`);
  };

  let rows = [];
  let emptyMessage = "Nothing here yet.";

  switch (librarySection) {
    case PODCAST_LIBRARY_SLUG.continueListening:
      rows = continueListening;
      emptyMessage = "Nothing in progress.";
      break;
    case PODCAST_LIBRARY_SLUG.yourEpisodes:
      rows = bookmarkedEpisodes;
      emptyMessage = "No bookmarked episodes.";
      break;
    case PODCAST_LIBRARY_SLUG.newEpisodes:
      rows = newEpisodeRows;
      emptyMessage = "Subscribe to shows to see new episodes here.";
      break;
    case PODCAST_LIBRARY_SLUG.downloadedEpisodes:
      rows = downloadedEpisodes;
      emptyMessage = "No downloaded episodes.";
      break;
    default:
      return null;
  }

  const clearConfirm = isMyLibrary
    ? mapPodcastEpisodeRailClearConfirm(librarySection)
    : undefined;

  const onClear = isMyLibrary
    ? () => {
        runPodcastEpisodeRailClear(
          librarySection,
          {
            clearAllEpisodeProgress,
            clearAllBookmarks,
            clearAllDownloads,
            unsubscribePodcasts,
          },
          rows,
        );
        navigate(-1);
      }
    : undefined;

  return (
    <TvSearchEpisodeDrillPage
      screenId={screenId}
      title={title}
      rows={rows}
      emptyMessage={emptyMessage}
      onSelectRow={playEpisode}
      clearConfirm={clearConfirm}
      onClear={onClear}
      getProgressFraction={(row) => {
        if (
          librarySection === PODCAST_LIBRARY_SLUG.continueListening &&
          typeof row.position01 === "number" &&
          !Number.isNaN(row.position01)
        ) {
          return row.position01;
        }
        return getEpisodeProgress(row.episode.id);
      }}
    />
  );
}
