import { useMemo } from "react";
import { getRecommendationsMusicChannels, MUSIC_CHANNELS } from "../data/musicChannels";
import { PODCASTS } from "../data/podcasts";
import { RADIO_STATIONS } from "../data/radioStations";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import ContentTileCard from "../components/ContentTileCard";
import HomeBanner from "../components/HomeBanner";
import HomeHeader from "../components/HomeHeader";
import ListenAgainCard from "../components/ListenAgainCard";
import SwimlaneBannerAd from "../components/SwimlaneBannerAd";
import UpgradeButton from "../components/UpgradeButton";
import { LISTEN_AGAIN_RAIL_SLOT_CAP } from "../constants/listenHistory";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useContentProfile } from "../context/ContentProfileContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import { useUserType } from "../context/UserTypeContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import { showVisualAds } from "../utils/showVisualAds";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import ProviderLineupMusicSwimlane from "../components/ProviderLineupMusicSwimlane";
import RadioStationCard from "../components/RadioStationCard";
import {
  BROAD_HOME_SWIMLANE_ID,
  getVisibleBroadHomeSwimlanes,
  HOME_MUSIC_MORE_CATEGORY,
} from "@sm-mpr/shared/constants/homeSwimlanes.js";
import {
  getHomeMusicSwimlaneChannels,
  getHomeMusicSwimlaneTitle,
} from "@sm-mpr/shared/data/homeMusicSwimlanes.js";

/** Home: fixed `HomeHeader` (top chrome); `home-body-scroll` is the main column so lanes scroll under the header. */
export default function Home() {
  const navigate = useNavigate();
  const goUpgrade = useGoUpgrade();
  const { userType } = useUserType();
  const { enabledContentTypes, filterListenHistory, isMusicOnlyProfile } =
    useContentProfile();
  const { items: listenAgainItems } = useListenHistory();
  const showBannerAd = showVisualAds(userType);

  const listenAgainFiltered = useMemo(
    () => filterListenHistory(listenAgainItems),
    [filterListenHistory, listenAgainItems],
  );

  const listenGhostCount =
    listenAgainFiltered.length >= LISTEN_AGAIN_RAIL_SLOT_CAP
      ? 0
      : LISTEN_AGAIN_RAIL_SLOT_CAP - listenAgainFiltered.length;

  const recommendedChannels = useMemo(
    () => getRecommendationsMusicChannels(),
    [],
  );

  const newReleaseChannels = useMemo(
    () => getHomeMusicSwimlaneChannels("newReleases"),
    [],
  );

  const countryEssentialChannels = useMemo(
    () => getHomeMusicSwimlaneChannels("countryEssentials"),
    [],
  );

  const visibleSwimlanes = useMemo(
    () =>
      getVisibleBroadHomeSwimlanes(
        enabledContentTypes,
        userType,
        isMusicOnlyProfile,
      ),
    [enabledContentTypes, userType, isMusicOnlyProfile],
  );

  function renderSwimlane(swimlaneId) {
    switch (swimlaneId) {
      case BROAD_HOME_SWIMLANE_ID.listenAgain:
        if (listenAgainFiltered.length === 0) return null;
        return (
          <ContentSwimlane
            key={swimlaneId}
            title="Listen again"
            alwaysShowMore
            onMore={() => navigate("/more/listen-again")}
          >
            {listenAgainFiltered.map((item) => (
              <ListenAgainCard
                key={`${item.kind}-${item.id}`}
                item={item}
                navigate={navigate}
                compact
              />
            ))}
            {Array.from({ length: listenGhostCount }).map((_, i) => (
              <ContentTileCard
                key={`listen-again-ghost-${i}`}
                ghost
                compact
                imageUrl=""
                title=""
              />
            ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.providerLineup:
        return <ProviderLineupMusicSwimlane key={swimlaneId} />;

      case BROAD_HOME_SWIMLANE_ID.mostPopularMusic:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title="Most popular music"
            sourceCount={MUSIC_CHANNELS.length}
            onMore={() => navigate("/more/music")}
          >
            {MUSIC_CHANNELS.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
              <MusicChannelCard
                key={channel.id}
                channel={channel}
                onSelect={() => navigate(`/music/${channel.id}`)}
              />
            ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.newReleases:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title={getHomeMusicSwimlaneTitle("newReleases")}
            sourceCount={newReleaseChannels.length}
            onMore={() =>
              navigate(`/more/${HOME_MUSIC_MORE_CATEGORY.newReleases}`)
            }
          >
            {newReleaseChannels.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
              <MusicChannelCard
                key={channel.id}
                channel={channel}
                onSelect={() => navigate(`/music/${channel.id}`)}
              />
            ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.countryEssentials:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title={getHomeMusicSwimlaneTitle("countryEssentials")}
            sourceCount={countryEssentialChannels.length}
            onMore={() =>
              navigate(`/more/${HOME_MUSIC_MORE_CATEGORY.countryEssentials}`)
            }
          >
            {countryEssentialChannels
              .slice(0, SWIMLANE_CARD_MAX)
              .map((channel) => (
                <MusicChannelCard
                  key={channel.id}
                  channel={channel}
                  onSelect={() => navigate(`/music/${channel.id}`)}
                />
              ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.popularPodcasts:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title="Popular podcasts in your area"
            sourceCount={PODCASTS.length}
            onMore={() => navigate("/more/podcasts")}
          >
            {PODCASTS.slice(0, SWIMLANE_CARD_MAX).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onSelect={() => navigate(`/podcast/${podcast.id}`)}
              />
            ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.midBannerAd:
        if (!showBannerAd) return null;
        return (
          <div key={swimlaneId} className="content-inset">
            <SwimlaneBannerAd />
          </div>
        );

      case BROAD_HOME_SWIMLANE_ID.topRadio:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title="Top radio stations"
            sourceCount={RADIO_STATIONS.length}
            onMore={() => navigate("/more/radio")}
          >
            {RADIO_STATIONS.slice(0, SWIMLANE_CARD_MAX).map((station) => (
              <RadioStationCard
                key={station.id}
                station={station}
                onSelect={() => navigate(`/radio/${station.id}`)}
              />
            ))}
          </ContentSwimlane>
        );

      case BROAD_HOME_SWIMLANE_ID.recommendations:
        return (
          <ContentSwimlane
            key={swimlaneId}
            title="Recommendations"
            sourceCount={recommendedChannels.length}
            onMore={() => navigate("/more/recommendations")}
          >
            {recommendedChannels
              .slice(0, SWIMLANE_CARD_MAX)
              .map((channel) => (
                <MusicChannelCard
                  key={channel.id}
                  channel={channel}
                  onSelect={() => navigate(`/music/${channel.id}`)}
                />
              ))}
          </ContentSwimlane>
        );

      default:
        return null;
    }
  }

  return (
    <main className="app-shell app-shell--home">
      <HomeHeader onUpgrade={goUpgrade} />
      <div className="home-body-scroll">
        <div className="home-screen">
          <div className="content-inset">
            {userType === "freeProvided" ? (
              <div className="home-free-provided-upgrade-row">
                <UpgradeButton onClick={goUpgrade} />
              </div>
            ) : null}
            <HomeBanner />
          </div>

          {visibleSwimlanes.map((swimlane) => renderSwimlane(swimlane.id))}
        </div>
      </div>
    </main>
  );
}
