import { useMemo } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
import EpisodeCard from "../components/EpisodeCard";
import MusicArtistCard from "../components/MusicArtistCard";
import MusicChannelCard from "../components/MusicChannelCard";
import MusicTagCard from "../components/MusicTagCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "../constants/userContentGates";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";
import {
  normalizeSearchNeedle,
  searchEpisodeRows,
  searchMatchingMusicTagLabels,
  searchMusicArtists,
  searchMusicChannels,
  searchPodcasts,
  searchRadioStations,
} from "../search/searchCatalog";
import "./Search.css";
import "./SwimlaneMore.css";

const LANE_LABELS = {
  channels: "Channels",
  artists: "Artists",
  tags: "Tags",
  podcasts: "Podcasts",
  episodes: "Episodes",
  radio: "Radio",
};

/** @type {(keyof typeof LANE_LABELS)[]} */
const VALID_LANES = [
  "channels",
  "artists",
  "tags",
  "podcasts",
  "episodes",
  "radio",
];

/**
 * Full list for a Search results **More** rail (`?lane=&q=`). Tags lane lists **matching tag labels**
 * (square label tiles, same substring filter as Search). Other lanes unchanged.
 */
export default function SearchCatalogMore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { enabledSearchResultLanes } = useContentProfile();
  const rawLane = params.get("lane") ?? "channels";
  const lane =
    rawLane !== null && VALID_LANES.includes(/** @type {any} */ (rawLane))
      ? rawLane
      : "channels";
  const laneAllowed = enabledSearchResultLanes.includes(lane);
  const activeLane = laneAllowed
    ? lane
    : (enabledSearchResultLanes[0] ?? SEARCH_RESULT_LANE.channels);

  const rawQ = params.get("q") ?? "";
  const needle = useMemo(() => normalizeSearchNeedle(rawQ), [rawQ]);

  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

  const {
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const title = LANE_LABELS[activeLane];

  const channels = useMemo(
    () => (activeLane === "channels" ? searchMusicChannels(needle) : []),
    [activeLane, needle],
  );
  const tagLabels = useMemo(
    () => (activeLane === "tags" ? searchMatchingMusicTagLabels(needle) : []),
    [activeLane, needle],
  );
  const artists = useMemo(
    () => (activeLane === "artists" ? searchMusicArtists(needle) : []),
    [activeLane, needle],
  );
  const podcasts = useMemo(
    () => (activeLane === "podcasts" ? searchPodcasts(needle) : []),
    [activeLane, needle],
  );
  const episodeRows = useMemo(
    () => (activeLane === "episodes" ? searchEpisodeRows(needle) : []),
    [activeLane, needle],
  );
  const radioStations = useMemo(
    () => (activeLane === "radio" ? searchRadioStations(needle) : []),
    [activeLane, needle],
  );

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

  const listForLane =
    activeLane === "channels"
      ? channels
      : activeLane === "tags"
        ? tagLabels
        : activeLane === "artists"
          ? artists
          : activeLane === "podcasts"
            ? podcasts
            : activeLane === "episodes"
              ? episodeRows
              : radioStations;

  if (!laneAllowed) {
    const q = params.get("q");
    const search = q
      ? `?lane=${activeLane}&q=${encodeURIComponent(q)}`
      : `?lane=${activeLane}`;
    return <Navigate to={`/search/more/catalog${search}`} replace />;
  }

  const emptyCopy = !needle
    ? "Enter a search to see results."
    : listForLane.length === 0
      ? `No ${title.toLowerCase()} match “${rawQ.trim()}”.`
      : null;

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={needle ? `${title}: ${rawQ.trim()}` : title}
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

      <div className="swimlane-more__scroll">
        {emptyCopy ? (
          <p className="text-muted" style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}>
            {emptyCopy}
          </p>
        ) : activeLane === "episodes" ? (
          <div className="search-catalog-more__episode-stack">
            {episodeRows.map(({ podcast, episode }) => (
              <EpisodeCard
                key={episode.id}
                episode={episode}
                {...episodeHandlers(podcast, episode)}
              />
            ))}
          </div>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {activeLane === "channels" &&
              channels.map((channel) => (
                <li key={channel.id} className="swimlane-more__cell">
                  <MusicChannelCard
                    channel={channel}
                    onSelect={() => navigate(`/music/${channel.id}`)}
                  />
                </li>
              ))}
            {activeLane === "tags" &&
              tagLabels.map((label) => (
                <li key={label} className="swimlane-more__cell">
                  <MusicTagCard
                    tagLabel={label}
                    onSelect={() =>
                      navigate(`/search/more/tags?q=${encodeURIComponent(label)}`)
                    }
                  />
                </li>
              ))}
            {activeLane === "artists" &&
              artists.map((artist) => (
                <li key={artist.id} className="swimlane-more__cell">
                  <MusicArtistCard
                    artist={artist}
                    onSelect={() =>
                      navigate(`/search/browse/music/artist/${artist.id}`)
                    }
                  />
                </li>
              ))}
            {activeLane === "podcasts" &&
              podcasts.map((podcast) => (
                <li key={podcast.id} className="swimlane-more__cell">
                  <PodcastCard
                    podcast={podcast}
                    onSelect={() => navigate(`/podcast/${podcast.id}`)}
                  />
                </li>
              ))}
            {activeLane === "radio" &&
              radioStations.map((station) => (
                <li key={station.id} className="swimlane-more__cell">
                  <RadioStationCard
                    station={station}
                    onSelect={() => navigate(`/radio/${station.id}`)}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </main>
  );
}
