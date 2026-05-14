import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import ContentTileCard from "./ContentTileCard";
import ListenAgainCard from "./ListenAgainCard";
import MusicChannelCard from "./MusicChannelCard";
import PodcastCard from "./PodcastCard";
import RadioStationCard from "./RadioStationCard";
import { LISTEN_AGAIN_RAIL_SLOT_CAP } from "../constants/listenHistory";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useListenHistory } from "../context/ListenHistoryContext";
import {
  MUSIC_GENRES,
  getMusicChannelsByCategory,
} from "../data/musicChannels";
import { PODCAST_CATEGORIES, getPodcastsByCategory } from "../data/podcasts";
import {
  RADIO_STATION_CATEGORIES,
  getRadioStationsByCategory,
} from "../data/radioStations";

/** Radio rows that are format browse (not Near You / International tiles). */
const RADIO_FORMAT_CATEGORIES = RADIO_STATION_CATEGORIES.filter(
  (c) => c.id !== "near-you" && c.id !== "international",
);

/** Maps browse switcher id to `ListenHistoryItem.kind`. */
const HISTORY_KIND_FOR_BROWSE_TAB = {
  music: "music",
  podcasts: "podcast",
  radio: "radio",
};

/**
 * Stacked taxonomy swimlanes for limited-catalog Browse (per plan: genre / topic / format rows).
 * **`activeBrowseTab`** filters which stack is shown (switcher lives on `LimitedBrowse.jsx`).
 * **Listen again** appears only when that tab's history (`music` \| `podcast` \| `radio`) is non-empty.
 *
 * @param {{ activeBrowseTab: 'music' | 'podcasts' | 'radio' }} props
 */
export default function LimitedBrowseTaxonomyRails({ activeBrowseTab }) {
  const navigate = useNavigate();
  const { items: listenAgainItems } = useListenHistory();

  const tabListenItems = useMemo(() => {
    const kind = HISTORY_KIND_FOR_BROWSE_TAB[activeBrowseTab];
    return listenAgainItems.filter((item) => item.kind === kind);
  }, [listenAgainItems, activeBrowseTab]);

  const listenGhostCount =
    tabListenItems.length >= LISTEN_AGAIN_RAIL_SLOT_CAP
      ? 0
      : LISTEN_AGAIN_RAIL_SLOT_CAP - tabListenItems.length;

  return (
    <div className="limited-browse-taxonomy">
      {tabListenItems.length > 0 ? (
        <ContentSwimlane
          title="Listen again"
          alwaysShowMore
          onMore={() => navigate("/more/listen-again")}
        >
          {tabListenItems.map((item) => (
            <ListenAgainCard
              key={`${item.kind}-${item.id}`}
              item={item}
              navigate={navigate}
              compact
            />
          ))}
          {Array.from({ length: listenGhostCount }).map((_, i) => (
            <ContentTileCard
              key={`limited-listen-ghost-${i}`}
              ghost
              compact
              imageUrl=""
              title=""
            />
          ))}
        </ContentSwimlane>
      ) : null}

      {activeBrowseTab === "music"
        ? MUSIC_GENRES.map((genre) => {
            const channels = getMusicChannelsByCategory(genre.id);
            if (channels.length === 0) return null;
            return (
              <ContentSwimlane
                key={`limited-music-${genre.id}`}
                title={genre.label}
                sourceCount={channels.length}
                maxVisible={SWIMLANE_CARD_MAX}
                onMore={() =>
                  navigate(`/search/browse/music/category/${genre.id}`)
                }
              >
                {channels.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
                  <MusicChannelCard
                    key={channel.id}
                    channel={channel}
                    onSelect={() => navigate(`/music/${channel.id}`)}
                  />
                ))}
              </ContentSwimlane>
            );
          })
        : null}

      {activeBrowseTab === "podcasts"
        ? PODCAST_CATEGORIES.map((cat) => {
            const shows = getPodcastsByCategory(cat.id);
            if (shows.length === 0) return null;
            return (
              <ContentSwimlane
                key={`limited-pod-${cat.id}`}
                title={cat.label}
                sourceCount={shows.length}
                maxVisible={SWIMLANE_CARD_MAX}
                onMore={() =>
                  navigate(`/search/browse/podcasts/category/${cat.id}`)
                }
              >
                {shows.slice(0, SWIMLANE_CARD_MAX).map((podcast) => (
                  <PodcastCard
                    key={podcast.id}
                    podcast={podcast}
                    onSelect={() => navigate(`/podcast/${podcast.id}`)}
                  />
                ))}
              </ContentSwimlane>
            );
          })
        : null}

      {activeBrowseTab === "radio"
        ? RADIO_FORMAT_CATEGORIES.map((cat) => {
            const stations = getRadioStationsByCategory(cat.id);
            if (stations.length === 0) return null;
            return (
              <ContentSwimlane
                key={`limited-radio-${cat.id}`}
                title={cat.label}
                sourceCount={stations.length}
                maxVisible={SWIMLANE_CARD_MAX}
                onMore={() =>
                  navigate(`/search/browse/radio/format/${cat.id}`)
                }
              >
                {stations.slice(0, SWIMLANE_CARD_MAX).map((station) => (
                  <RadioStationCard
                    key={station.id}
                    station={station}
                    onSelect={() => navigate(`/radio/${station.id}`)}
                  />
                ))}
              </ContentSwimlane>
            );
          })
        : null}
    </div>
  );
}
