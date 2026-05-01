import { getMusicChannelById } from "../data/musicChannels";
import MusicChannelCard from "./MusicChannelCard";

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
  return null;
}

/**
 * Single “Listen again” entry → appropriate domain card (music today; podcast/radio later).
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
