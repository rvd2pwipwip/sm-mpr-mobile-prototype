import { Navigate, useNavigate, useParams } from "react-router-dom";
import {
  PODCAST_LIBRARY_RAIL_TITLES,
  PODCAST_LIBRARY_SLUG,
  isPodcastLibrarySlug,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import TvSearchEpisodeDrillPage from "../components/search/TvSearchEpisodeDrillPage.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { getActivePodcastShowId } from "../utils/playbackMiniPlayer.js";

/** Search -> Browse -> Podcasts -> one library shelf (episode list or show grid). */
export default function SearchPodcastsLibrary() {
  const { librarySection } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session } = usePlayback();
  const playingPodcastId = getActivePodcastShowId(session);

  const {
    continueListening,
    subscribedPodcasts,
    bookmarkedEpisodes,
    downloadedEpisodes,
    newEpisodeRows,
    getEpisodeProgress,
  } = usePodcastUserState();

  if (!isPodcastLibrarySlug(librarySection)) {
    return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  const title = PODCAST_LIBRARY_RAIL_TITLES[librarySection];
  const screenId = `search-podcasts-library-${librarySection}`;

  const playEpisode = ({ podcast, episode }) => {
    enterContent();
    navigate(`/podcast/${podcast.id}/play/${episode.id}`);
  };

  if (librarySection === PODCAST_LIBRARY_SLUG.yourPodcasts) {
    return (
      <TvSearchBrowseDrillPage
        screenId={screenId}
        title={title}
        items={subscribedPodcasts}
        emptyMessage="No subscriptions yet."
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
                playing={playingPodcastId === podcast.id}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

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
      return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  return (
    <TvSearchEpisodeDrillPage
      screenId={screenId}
      title={title}
      rows={rows}
      emptyMessage={emptyMessage}
      onSelectRow={playEpisode}
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
