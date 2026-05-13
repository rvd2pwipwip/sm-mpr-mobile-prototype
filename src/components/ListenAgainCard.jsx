import { getMusicChannelById } from "../data/musicChannels";
import { getPodcastById } from "../data/podcasts";
import { getRadioStationById } from "../data/radioStations";
import MusicChannelCard from "./MusicChannelCard";
import PodcastCard from "./PodcastCard";
import RadioStationCard from "./RadioStationCard";

/**
 * @param {{ kind: string, id: string }} item
 * @param {import("react-router-dom").NavigateFunction} navigate
 * @param {boolean} [compact]
 * @returns {import("react").ReactNode}
 */
export function renderListenAgainTile(item, navigate, compact = false) {
  if (item.kind === "music") {
    const ch = getMusicChannelById(item.id);
    if (!ch) return null;
    return (
      <MusicChannelCard
        channel={ch}
        compact={compact}
        onSelect={() => navigate(`/music/${ch.id}`)}
      />
    );
  }
  if (item.kind === "podcast") {
    const podcast = getPodcastById(item.id);
    if (!podcast) return null;
    return (
      <PodcastCard
        podcast={podcast}
        compact={compact}
        onSelect={() => navigate(`/podcast/${podcast.id}`)}
      />
    );
  }
  if (item.kind === "radio") {
    const station = getRadioStationById(item.id);
    if (!station) return null;
    return (
      <RadioStationCard
        station={station}
        compact={compact}
        onSelect={() => navigate(`/radio/${station.id}`)}
      />
    );
  }
  return null;
}

/**
 * Single “Listen again” entry: music channel, podcast show, or radio station card.
 *
 * @param {{
 *   item: { kind: string, id: string },
 *   navigate: import("react-router-dom").NavigateFunction,
 *   compact?: boolean,
 * }} props
 */
export default function ListenAgainCard({ item, navigate, compact = false }) {
  return renderListenAgainTile(item, navigate, compact);
}
