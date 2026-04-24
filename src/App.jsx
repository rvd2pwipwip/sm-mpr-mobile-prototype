import { MUSIC_CHANNELS } from "./data/musicChannels";
import { PODCASTS } from "./data/podcasts";
import { RADIO_STATIONS } from "./data/radioStations";
import MusicChannelCard from "./components/MusicChannelCard";
import PodcastCard from "./components/PodcastCard";
import RadioStationCard from "./components/RadioStationCard";

const App = () => {
  return (
    <main className="app-shell">
      <div className="content-inset">
        <h1 style={{ margin: 0, fontSize: "1.5rem", fontWeight: 700 }}>
          Stingray Music Mobile Prototype
        </h1>
        <p className="text-muted" style={{ margin: 0 }}>
          Global tokens and layout shell are in <code>src/index.css</code> — see{" "}
          <code>docs/design-tokens.md</code>.
        </p>

        <section className="home-screen">
          <h2
            className="text-muted"
            style={{ margin: 0, fontSize: "0.75rem", fontWeight: 600 }}
          >
            Card preview (replace with swimlanes on Home)
          </h2>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "var(--space-4)",
            }}
          >
            <MusicChannelCard channel={MUSIC_CHANNELS[0]} />
            <PodcastCard podcast={PODCASTS[0]} />
            <RadioStationCard station={RADIO_STATIONS[0]} />
          </div>
        </section>
      </div>
    </main>
  );
};

export default App;
