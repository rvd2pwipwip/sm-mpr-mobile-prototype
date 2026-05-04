import { MUSIC_CHANNELS } from "../data/musicChannels";
import { PODCASTS } from "../data/podcasts";
import { RADIO_STATIONS } from "../data/radioStations";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import ContentTileCard from "../components/ContentTileCard";
import HomeBanner from "../components/HomeBanner";
import HomeHeader from "../components/HomeHeader";
import ListenAgainCard from "../components/ListenAgainCard";
import SwimlaneBannerAd from "../components/SwimlaneBannerAd";
import { LISTEN_AGAIN_RAIL_SLOT_CAP } from "../constants/listenHistory";
import { useListenHistory } from "../context/ListenHistoryContext";
import { useUserType } from "../context/UserTypeContext";
import { showVisualAds } from "../utils/showVisualAds";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";

const LANE_SIZE = 8;

/** Home: fixed `HomeHeader` (top chrome); `home-body-scroll` is the main column so lanes scroll under the header. */
export default function Home() {
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { items: listenAgainItems } = useListenHistory();
  const showBannerAd = showVisualAds(userType);

  const listenGhostCount =
    listenAgainItems.length >= LISTEN_AGAIN_RAIL_SLOT_CAP
      ? 0
      : LISTEN_AGAIN_RAIL_SLOT_CAP - listenAgainItems.length;

  return (
    <main className="app-shell app-shell--home">
      <HomeHeader onUpgrade={() => navigate("/upgrade")} />
      <div className="home-body-scroll">
        <div className="home-screen">
          <div className="content-inset">
            <HomeBanner />
          </div>

          {/* Favorites (future): render a swimlane here when the user has likes. */}

          {listenAgainItems.length > 0 ? (
            <ContentSwimlane
              title="Listen again"
              onMore={() => navigate("/more/listen-again")}
            >
              {listenAgainItems.map((item) => (
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
          ) : null}

          <ContentSwimlane
            title="Music"
            onMore={() => navigate("/more/music")}
          >
            {MUSIC_CHANNELS.slice(0, LANE_SIZE).map((channel) => (
              <MusicChannelCard
                key={channel.id}
                channel={channel}
                onSelect={() => navigate(`/music/${channel.id}`)}
              />
            ))}
          </ContentSwimlane>

          <ContentSwimlane
            title="Podcasts"
            onMore={() => navigate("/more/podcasts")}
          >
            {PODCASTS.slice(0, LANE_SIZE).map((podcast) => (
              <PodcastCard
                key={podcast.id}
                podcast={podcast}
                onSelect={() => navigate(`/podcast/${podcast.id}`)}
              />
            ))}
          </ContentSwimlane>
          <div className="content-inset">
            {showBannerAd ? <SwimlaneBannerAd /> : null}
          </div>
          <ContentSwimlane
            title="Radio"
            onMore={() => navigate("/more/radio")}
          >
            {RADIO_STATIONS.slice(0, LANE_SIZE).map((station) => (
              <RadioStationCard key={station.id} station={station} />
            ))}
          </ContentSwimlane>
        </div>
      </div>
    </main>
  );
}
