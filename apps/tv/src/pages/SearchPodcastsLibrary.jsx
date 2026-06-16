import { Navigate, useParams } from "react-router-dom";
import {
  PODCAST_LIBRARY_SLUG,
  isPodcastLibrarySlug,
} from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import TvPodcastEpisodeLibraryShelf from "../components/podcasts/TvPodcastEpisodeLibraryShelf.jsx";
import MyLibraryYourPodcastsMore from "./MyLibraryYourPodcastsMore.jsx";

/** Search -> Browse -> Podcasts -> one library shelf (episode list or show grid). */
export default function SearchPodcastsLibrary() {
  const { librarySection } = useParams();

  if (!isPodcastLibrarySlug(librarySection)) {
    return <Navigate to={SEARCH_BROWSE.podcasts} replace />;
  }

  if (librarySection === PODCAST_LIBRARY_SLUG.yourPodcasts) {
    return <MyLibraryYourPodcastsMore />;
  }

  return (
    <TvPodcastEpisodeLibraryShelf
      librarySection={librarySection}
      screenIdPrefix="search-podcasts-library"
    />
  );
}
