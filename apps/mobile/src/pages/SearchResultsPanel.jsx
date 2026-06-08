import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import EpisodeCard from "../components/EpisodeCard";
import MusicArtistCard from "../components/MusicArtistCard";
import MusicChannelCard from "../components/MusicChannelCard";
import MusicTagCard from "../components/MusicTagCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
} from "../constants/userContentGates";
import { SEARCH_RESULT_LANE } from "@sm-mpr/shared/constants/productProfile.js";
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

/**
 * @param {{ debouncedQuery: string }} props
 */
export default function SearchResultsPanel({ debouncedQuery }) {
  const navigate = useNavigate();
  const { enabledSearchResultLanes, isMusicOnlyProfile } = useContentProfile();
  const showChannels = enabledSearchResultLanes.includes(
    SEARCH_RESULT_LANE.channels,
  );
  const showArtists = enabledSearchResultLanes.includes(
    SEARCH_RESULT_LANE.artists,
  );
  const showTags = enabledSearchResultLanes.includes(SEARCH_RESULT_LANE.tags);
  const showPodcasts = enabledSearchResultLanes.includes(
    SEARCH_RESULT_LANE.podcasts,
  );
  const showEpisodes = enabledSearchResultLanes.includes(
    SEARCH_RESULT_LANE.episodes,
  );
  const showRadio = enabledSearchResultLanes.includes(
    SEARCH_RESULT_LANE.radio,
  );

  const needle = useMemo(
    () => normalizeSearchNeedle(debouncedQuery),
    [debouncedQuery],
  );

  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

  const {
    toggleBookmark,
    toggleDownload,
    getEpisodeProgress,
    isBookmarked,
    isDownloaded,
  } = usePodcastUserState();

  const channels = useMemo(
    () => (showChannels ? searchMusicChannels(needle) : []),
    [needle, showChannels],
  );
  const matchingTagLabels = useMemo(
    () => (showTags ? searchMatchingMusicTagLabels(needle) : []),
    [needle, showTags],
  );
  const artists = useMemo(
    () => (showArtists ? searchMusicArtists(needle) : []),
    [needle, showArtists],
  );
  const podcasts = useMemo(
    () => (showPodcasts ? searchPodcasts(needle) : []),
    [needle, showPodcasts],
  );
  const episodeRows = useMemo(
    () => (showEpisodes ? searchEpisodeRows(needle) : []),
    [needle, showEpisodes],
  );
  const radioStations = useMemo(
    () => (showRadio ? searchRadioStations(needle) : []),
    [needle, showRadio],
  );

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

  const qEnc = encodeURIComponent(debouncedQuery.trim());

  const navigateCatalogMore = (lane) => {
    navigate(`/search/more/catalog?lane=${lane}&q=${qEnc}`);
  };

  const anyHits =
    (showChannels && channels.length > 0) ||
    (showTags && matchingTagLabels.length > 0) ||
    (showArtists && artists.length > 0) ||
    (showPodcasts && podcasts.length > 0) ||
    (showEpisodes && episodeRows.length > 0) ||
    (showRadio && radioStations.length > 0);

  const emptyHint = isMusicOnlyProfile
    ? "Type to search channels, artists, or tags."
    : "Type to search channels, artists, tags, podcasts, episodes, and radio.";

  return (
    <div className="home-screen search-results-panel">
      {!needle ? (
        <div className="content-inset search-page__body">
          <p className="text-muted" style={{ margin: 0 }}>
            {emptyHint}
          </p>
        </div>
      ) : !anyHits ? (
        <div className="content-inset search-page__body">
          <p className="text-muted" style={{ margin: 0 }}>
            No results for “{debouncedQuery.trim()}”.
          </p>
        </div>
      ) : null}

      {showChannels && channels.length > 0 ? (
        <ContentSwimlane
          title="Channels"
          sourceCount={channels.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("channels")}
        >
          {channels.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
            <MusicChannelCard
              key={channel.id}
              channel={channel}
              onSelect={() => navigate(`/music/${channel.id}`)}
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {showArtists && artists.length > 0 ? (
        <ContentSwimlane
          title="Artists"
          sourceCount={artists.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("artists")}
        >
          {artists.slice(0, SWIMLANE_CARD_MAX).map((artist) => (
            <MusicArtistCard
              key={artist.id}
              artist={artist}
              onSelect={() =>
                navigate(`/search/browse/music/artist/${artist.id}`)
              }
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {showTags && matchingTagLabels.length > 0 ? (
        <ContentSwimlane
          title="Tags"
          sourceCount={matchingTagLabels.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("tags")}
        >
          {matchingTagLabels.slice(0, SWIMLANE_CARD_MAX).map((label) => (
            <MusicTagCard
              key={label}
              tagLabel={label}
              onSelect={() =>
                navigate(`/search/more/tags?q=${encodeURIComponent(label)}`)
              }
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {showPodcasts && podcasts.length > 0 ? (
        <ContentSwimlane
          title="Podcasts"
          sourceCount={podcasts.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("podcasts")}
        >
          {podcasts.slice(0, SWIMLANE_CARD_MAX).map((podcast) => (
            <PodcastCard
              key={podcast.id}
              podcast={podcast}
              onSelect={() => navigate(`/podcast/${podcast.id}`)}
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {showEpisodes && episodeRows.length > 0 ? (
        <ContentSwimlane
          title="Episodes"
          sourceCount={episodeRows.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("episodes")}
        >
          {episodeRows.slice(0, SWIMLANE_CARD_MAX).map(({ podcast, episode }) => (
            <div key={episode.id} className="search-results-panel__episode-tile">
              <EpisodeCard
                episode={episode}
                {...episodeHandlers(podcast, episode)}
              />
            </div>
          ))}
        </ContentSwimlane>
      ) : null}

      {showRadio && radioStations.length > 0 ? (
        <ContentSwimlane
          title="Radio"
          sourceCount={radioStations.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => navigateCatalogMore("radio")}
        >
          {radioStations.slice(0, SWIMLANE_CARD_MAX).map((station) => (
            <RadioStationCard
              key={station.id}
              station={station}
              onSelect={() => navigate(`/radio/${station.id}`)}
            />
          ))}
        </ContentSwimlane>
      ) : null}
    </div>
  );
}
