import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import EpisodeCard from "../components/EpisodeCard";
import MusicArtistCard from "../components/MusicArtistCard";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
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
  primaryTagLabelForSearchMore,
  searchEpisodeRows,
  searchMusicArtists,
  searchMusicChannels,
  searchMusicChannelsByTagSubstring,
  searchPodcasts,
  searchRadioStations,
} from "../search/searchCatalog";

/**
 * @param {{ debouncedQuery: string }} props
 */
export default function SearchResultsPanel({ debouncedQuery }) {
  const navigate = useNavigate();
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

  const channels = useMemo(() => searchMusicChannels(needle), [needle]);
  const tagChannels = useMemo(
    () => searchMusicChannelsByTagSubstring(needle),
    [needle],
  );
  const artists = useMemo(() => searchMusicArtists(needle), [needle]);
  const podcasts = useMemo(() => searchPodcasts(needle), [needle]);
  const episodeRows = useMemo(() => searchEpisodeRows(needle), [needle]);
  const radioStations = useMemo(() => searchRadioStations(needle), [needle]);

  const tagMoreLabel = useMemo(
    () => primaryTagLabelForSearchMore(needle),
    [needle],
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
    channels.length > 0 ||
    tagChannels.length > 0 ||
    artists.length > 0 ||
    podcasts.length > 0 ||
    episodeRows.length > 0 ||
    radioStations.length > 0;

  return (
    <div className="home-screen search-results-panel">
      {!needle ? (
        <div className="content-inset search-page__body">
          <p className="text-muted" style={{ margin: 0 }}>
            Type to search channels, artists, tags, podcasts, episodes, and radio.
          </p>
        </div>
      ) : !anyHits ? (
        <div className="content-inset search-page__body">
          <p className="text-muted" style={{ margin: 0 }}>
            No results for “{debouncedQuery.trim()}”.
          </p>
        </div>
      ) : null}

      {channels.length > 0 ? (
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

      {artists.length > 0 ? (
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
              onSelect={() => {
                const id = artist.representativeChannelIds[0];
                if (id) navigate(`/music/${id}`);
              }}
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {tagChannels.length > 0 ? (
        <ContentSwimlane
          title="Tags"
          sourceCount={tagChannels.length}
          maxVisible={SWIMLANE_CARD_MAX}
          onMore={() => {
            const t = tagMoreLabel;
            if (t) navigate(`/search/more/tags?q=${encodeURIComponent(t)}`);
            else navigateCatalogMore("tags");
          }}
        >
          {tagChannels.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
            <MusicChannelCard
              key={channel.id}
              channel={channel}
              onSelect={() => navigate(`/music/${channel.id}`)}
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {podcasts.length > 0 ? (
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

      {episodeRows.length > 0 ? (
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

      {radioStations.length > 0 ? (
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
