import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import ContentTileCard from "./ContentTileCard";
import LibraryLikedMusicSwimlane from "./LibraryLikedMusicSwimlane";
import LibraryLikedRadioSwimlane from "./LibraryLikedRadioSwimlane";
import LibraryPodcastUserSwimlanes from "./LibraryPodcastUserSwimlanes";
import ListenAgainCard from "./ListenAgainCard";
import MusicChannelCard from "./MusicChannelCard";
import PodcastCard from "./PodcastCard";
import RadioStationCard from "./RadioStationCard";
import SwimlaneBannerAd from "./SwimlaneBannerAd";
import { LISTEN_AGAIN_RAIL_SLOT_CAP } from "../constants/listenHistory";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useUserType } from "../context/UserTypeContext";
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
import { showVisualAds } from "../utils/showVisualAds";

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

/** In-feed banner after the second taxonomy swimlane (3rd taxonomy row; `showVisualAds`); scrolls with content. */
function LimitedBrowseMidStackAd({ showBannerAd }) {
  if (!showBannerAd) return null;
  return (
    <div className="content-inset">
      <SwimlaneBannerAd />
    </div>
  );
}

function LimitedMusicTaxonomySwimlanes({ navigate, showBannerAd }) {
  const genres = MUSIC_GENRES.filter(
    (g) => getMusicChannelsByCategory(g.id).length > 0,
  );
  if (genres.length === 0) return null;

  const renderLane = (genre) => {
    const channels = getMusicChannelsByCategory(genre.id);
    return (
      <ContentSwimlane
        key={`limited-music-${genre.id}`}
        title={genre.label}
        sourceCount={channels.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(`/search/browse/music/category/${genre.id}`)}
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
  };

  const first = genres[0];
  const second = genres[1];
  const rest = genres.slice(2);

  return (
    <>
      {renderLane(first)}
      {second ? renderLane(second) : null}
      <LimitedBrowseMidStackAd showBannerAd={showBannerAd} />
      {rest.map((genre) => renderLane(genre))}
    </>
  );
}

function LimitedPodcastsTaxonomySwimlanes({ navigate, showBannerAd }) {
  const categories = PODCAST_CATEGORIES.filter(
    (cat) => getPodcastsByCategory(cat.id).length > 0,
  );
  if (categories.length === 0) return null;

  const renderLane = (cat) => {
    const shows = getPodcastsByCategory(cat.id);
    return (
      <ContentSwimlane
        key={`limited-pod-${cat.id}`}
        title={cat.label}
        sourceCount={shows.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(`/search/browse/podcasts/category/${cat.id}`)}
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
  };

  const first = categories[0];
  const second = categories[1];
  const rest = categories.slice(2);

  return (
    <>
      {renderLane(first)}
      {second ? renderLane(second) : null}
      <LimitedBrowseMidStackAd showBannerAd={showBannerAd} />
      {rest.map((cat) => renderLane(cat))}
    </>
  );
}

function LimitedRadioTaxonomySwimlanes({ navigate, showBannerAd }) {
  const categories = RADIO_FORMAT_CATEGORIES.filter(
    (cat) => getRadioStationsByCategory(cat.id).length > 0,
  );
  if (categories.length === 0) return null;

  const renderLane = (cat) => {
    const stations = getRadioStationsByCategory(cat.id);
    return (
      <ContentSwimlane
        key={`limited-radio-${cat.id}`}
        title={cat.label}
        sourceCount={stations.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(`/search/browse/radio/format/${cat.id}`)}
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
  };

  const first = categories[0];
  const second = categories[1];
  const rest = categories.slice(2);

  return (
    <>
      {renderLane(first)}
      {second ? renderLane(second) : null}
      <LimitedBrowseMidStackAd showBannerAd={showBannerAd} />
      {rest.map((cat) => renderLane(cat))}
    </>
  );
}

/**
 * Stacked taxonomy swimlanes for limited-catalog Browse (per plan: genre / topic / format rows).
 * **`activeBrowseTab`** filters which stack is shown (switcher lives on `LimitedBrowse.jsx`).
 * **User-driven rails** prepend per tab; **Listen again** when that tab's history kind is non-empty.
 * **In-feed** `SwimlaneBannerAd` after the **second** taxonomy lane (third taxonomy row) when `showVisualAds(userType)` (single lane: banner still follows that lane).
 *
 * @param {{ activeBrowseTab: 'music' | 'podcasts' | 'radio' }} props
 */
export default function LimitedBrowseTaxonomyRails({ activeBrowseTab }) {
  const navigate = useNavigate();
  const { userType } = useUserType();
  const showBannerAd = showVisualAds(userType);
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
      {activeBrowseTab === "music" ? <LibraryLikedMusicSwimlane /> : null}
      {activeBrowseTab === "podcasts" ? <LibraryPodcastUserSwimlanes /> : null}
      {activeBrowseTab === "radio" ? <LibraryLikedRadioSwimlane /> : null}

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

      {activeBrowseTab === "music" ? (
        <LimitedMusicTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}

      {activeBrowseTab === "podcasts" ? (
        <LimitedPodcastsTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}

      {activeBrowseTab === "radio" ? (
        <LimitedRadioTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}
    </div>
  );
}
