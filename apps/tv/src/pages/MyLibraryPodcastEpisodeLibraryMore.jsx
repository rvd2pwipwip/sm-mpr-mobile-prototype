import { Navigate, useParams } from "react-router-dom";
import { isPodcastEpisodeLibrarySlug } from "@sm-mpr/shared/constants/podcastSearchLibrary.js";
import TvPodcastEpisodeLibraryShelf from "../components/podcasts/TvPodcastEpisodeLibraryShelf.jsx";

/** Full episode-library shelf from My Library swimlane More (`/my-library/continue-listening`, …). */
export default function MyLibraryPodcastEpisodeLibraryMore() {
  const { librarySection } = useParams();

  if (!isPodcastEpisodeLibrarySlug(librarySection)) {
    return <Navigate to="/my-library" replace />;
  }

  return (
    <TvPodcastEpisodeLibraryShelf
      librarySection={librarySection}
      screenIdPrefix="my-library"
    />
  );
}
