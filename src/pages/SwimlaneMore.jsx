import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import PodcastCard from "../components/PodcastCard";
import RadioStationCard from "../components/RadioStationCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { MUSIC_CHANNELS } from "../data/musicChannels";
import { PODCASTS } from "../data/podcasts";
import { RADIO_STATIONS } from "../data/radioStations";
import "./SwimlaneMore.css";

/** URL segment → data + header title (swimlane title only, matches Home). */
const CATEGORIES = {
  music: {
    title: "Music",
    render: (navigate) =>
      MUSIC_CHANNELS.map((channel) => (
        <li key={channel.id} className="swimlane-more__cell">
          <MusicChannelCard
            channel={channel}
            onSelect={() => navigate(`/music/${channel.id}`)}
          />
        </li>
      )),
  },
  podcasts: {
    title: "Podcasts",
    render: (navigate) =>
      PODCASTS.map((podcast) => (
        <li key={podcast.id} className="swimlane-more__cell">
          <PodcastCard
            podcast={podcast}
            onSelect={() => navigate(`/podcast/${podcast.id}`)}
          />
        </li>
      )),
  },
  radio: {
    title: "Radio",
    render: () =>
      RADIO_STATIONS.map((station) => (
        <li key={station.id} className="swimlane-more__cell">
          <RadioStationCard station={station} />
        </li>
      )),
  },
};

/** Full swimlane: 2-column grid, same card width as horizontal swimlane (`--card-tile-width`). */
export default function SwimlaneMore() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const config = categoryId && CATEGORIES[categoryId];

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={config.title}
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
        <ul className="swimlane-more__grid" role="list">
          {config.render(navigate)}
        </ul>
      </div>
    </main>
  );
}
