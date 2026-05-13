import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import EpisodeCard from "../components/EpisodeCard";
import MusicArtistCard from "../components/MusicArtistCard";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "../constants/userContentGates";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";
import {
  normalizeSearchNeedle,
  searchEpisodeRows,
  searchMusicArtists,
  searchMusicChannels,
  searchMusicChannelsByTagSubstring,
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
 * Full list for a Search results **More** rail (`?lane=&q=`). Tags lane uses substring tag match
 * (same filter as Search) so partial queries still populate the grid.
 */
export default function SearchCatalogMore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rawLane = params.get("lane") ?? "channels";
  const lane =
    rawLane !== null && VALID_LANES.includes(/** @type {any} */ (rawLane))
      ? rawLane
      : "channels";

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

  const title = LANE_LABELS[lane];

  const channels = useMemo(
    () => (lane === "channels" ? searchMusicChannels(needle) : []),
    [lane, needle],
  );
  const tagsChannels = useMemo(
    () => (lane === "tags" ? searchMusicChannelsByTagSubstring(needle) : []),
    [lane, needle],
  );
  const artists = useMemo(
    () => (lane === "artists" ? searchMusicArtists(needle) : []),
    [lane, needle],
  );
  const podcasts = useMemo(
    () => (lane === "podcasts" ? searchPodcasts(needle) : []),
    [lane, needle],
  );
  const episodeRows = useMemo(
    () => (lane === "episodes" ? searchEpisodeRows(needle) : []),
    [lane, needle],
  );
  const radioStations = useMemo(
    () => (lane === "radio" ? searchRadioStations(needle) : []),
    [lane, needle],
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
    lane === "channels"
      ? channels
      : lane === "tags"
        ? tagsChannels
        : lane === "artists"
          ? artists
          : lane === "podcasts"
            ? podcasts
            : lane === "episodes"
              ? episodeRows
              : radioStations;

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
        ) : lane === "episodes" ? (
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
            {lane === "channels" &&
              channels.map((channel) => (
                <li key={channel.id} className="swimlane-more__cell">
                  <MusicChannelCard
                    channel={channel}
                    onSelect={() => navigate(`/music/${channel.id}`)}
                  />
                </li>
              ))}
            {lane === "tags" &&
              tagsChannels.map((channel) => (
                <li key={channel.id} className="swimlane-more__cell">
                  <MusicChannelCard
                    channel={channel}
                    onSelect={() => navigate(`/music/${channel.id}`)}
                  />
                </li>
              ))}
            {lane === "artists" &&
              artists.map((artist) => (
                <li key={artist.id} className="swimlane-more__cell">
                  <MusicArtistCard
                    artist={artist}
                    onSelect={() => {
                      const id = artist.representativeChannelIds[0];
                      if (id) navigate(`/music/${id}`);
                    }}
                  />
                </li>
              ))}
            {lane === "podcasts" &&
              podcasts.map((podcast) => (
                <li key={podcast.id} className="swimlane-more__cell">
                  <PodcastCard
                    podcast={podcast}
                    onSelect={() => navigate(`/podcast/${podcast.id}`)}
                  />
                </li>
              ))}
            {lane === "radio" &&
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
