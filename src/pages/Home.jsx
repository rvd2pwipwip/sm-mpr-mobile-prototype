import { MUSIC_CHANNELS } from "../data/musicChannels";
import { PODCASTS } from "../data/podcasts";
import { RADIO_STATIONS } from "../data/radioStations";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "../components/ContentSwimlane";
import HomeBanner from "../components/HomeBanner";
import HomeHeader from "../components/HomeHeader";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";

const LANE_SIZE = 8;

/** Home: fixed `HomeHeader` (top chrome); `home-body-scroll` is the main column so lanes scroll under the header. */
export default function Home() {
  const navigate = useNavigate();

  return (
    <main className="app-shell app-shell--home">
      <HomeHeader onUpgrade={() => navigate("/upgrade")} />
      <div className="home-body-scroll">
        <div className="home-screen">
          <div className="content-inset">
            <HomeBanner />
          </div>

          <ContentSwimlane title="Music">
            {MUSIC_CHANNELS.slice(0, LANE_SIZE).map((channel) => (
              <MusicChannelCard key={channel.id} channel={channel} />
            ))}
          </ContentSwimlane>

          <ContentSwimlane title="Podcasts">
            {PODCASTS.slice(0, LANE_SIZE).map((podcast) => (
              <PodcastCard key={podcast.id} podcast={podcast} />
            ))}
          </ContentSwimlane>

          <ContentSwimlane title="Radio">
            {RADIO_STATIONS.slice(0, LANE_SIZE).map((station) => (
              <RadioStationCard key={station.id} station={station} />
            ))}
          </ContentSwimlane>
        </div>
      </div>
    </main>
  );
}
