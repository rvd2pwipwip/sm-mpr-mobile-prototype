import { MUSIC_CHANNELS } from "../data/musicChannels";
import { PODCASTS } from "../data/podcasts";
import { RADIO_STATIONS } from "../data/radioStations";
import ContentSwimlane from "../components/ContentSwimlane";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";

const LANE_SIZE = 8;

/** Home screen: inset intro + full-bleed swimlanes (siblings). Routed at `/`. */
export default function Home() {
  return (
    <main className="app-shell">
      <div className="home-screen">
        <div className="content-inset">
          <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
            Stingray Music Mobile Prototype
          </h1>
          <p className="text-muted" style={{ margin: 0 }}>
            Global tokens and layout shell are in <code>src/index.css</code> — see{" "}
            <code>docs/design-tokens.md</code>.
          </p>
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
    </main>
  );
}
