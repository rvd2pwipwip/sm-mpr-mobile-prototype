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
import ProviderLineupMusicSwimlane from "./ProviderLineupMusicSwimlane";
import RadioStationCard from "./RadioStationCard";
import SearchRadioInternationalBrowseRail from "./SearchRadioInternationalBrowseRail";
import SwimlaneBannerAd from "./SwimlaneBannerAd";
import { LISTEN_AGAIN_RAIL_SLOT_CAP } from "../constants/listenHistory";
import { RADIO_BROWSE_PATH } from "../constants/radioBrowsePaths";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import { useUserType } from "../context/UserTypeContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import {
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
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
  const genres = getLimitedMusicGenres();
  if (genres.length === 0) return null;

  const renderLane = (genre) => {
    const channels = getLimitedMusicChannelsByCategory(genre.id);
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
  const nearYouCategory = RADIO_STATION_CATEGORIES.find(
    (c) => c.id === "near-you",
  );
  const nearYouStations = nearYouCategory
    ? getRadioStationsByCategory("near-you")
    : [];
  const nearYouLane =
    nearYouCategory && nearYouStations.length > 0 ? (
      <ContentSwimlane
        key="limited-radio-near-you"
        title={nearYouCategory.label}
        sourceCount={nearYouStations.length}
        maxVisible={SWIMLANE_CARD_MAX}
        onMore={() => navigate(RADIO_BROWSE_PATH.nearYou)}
      >
        {nearYouStations.slice(0, SWIMLANE_CARD_MAX).map((station) => (
          <RadioStationCard
            key={station.id}
            station={station}
            onSelect={() => navigate(`/radio/${station.id}`)}
          />
        ))}
      </ContentSwimlane>
    ) : null;

  const categories = RADIO_FORMAT_CATEGORIES.filter(
    (cat) => getRadioStationsByCategory(cat.id).length > 0,
  );

  const renderFormatLane = (cat) => {
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

  /** Same International rail as broad Search / Browse / Radio (`SearchRadioBrowse.jsx`). */
  const internationalRail = <SearchRadioInternationalBrowseRail />;

  /** After two taxonomy lanes: Near You + International, or International + first format if no Near You. */
  const midStack = (
    <LimitedBrowseMidStackAd showBannerAd={showBannerAd} />
  );

  if (categories.length === 0) {
    return (
      <>
        {nearYouLane}
        {internationalRail}
        {midStack}
      </>
    );
  }

  const first = categories[0];
  const second = categories[1];
  const rest = categories.slice(2);

  if (nearYouLane) {
    return (
      <>
        {nearYouLane}
        {internationalRail}
        {midStack}
        {renderFormatLane(first)}
        {second ? renderFormatLane(second) : null}
        {rest.map((cat) => renderFormatLane(cat))}
      </>
    );
  }

  return (
    <>
      {internationalRail}
      {renderFormatLane(first)}
      {midStack}
      {second ? renderFormatLane(second) : null}
      {rest.map((cat) => renderFormatLane(cat))}
    </>
  );
}

/**
 * Stacked taxonomy swimlanes for limited-catalog Browse (per plan: genre / topic / format rows).
 * **`activeBrowseTab`** filters which stack is shown (switcher lives on `LimitedBrowse.jsx`).
 * **User-driven rails** prepend per tab; **Listen again** when that tab's history kind is non-empty.
 * **Radio** tab: **Near You** swimlane, then **`SearchRadioInternationalBrowseRail`**, then format rows (same stack order as broad **`SearchRadioBrowse`**). **In-feed** ad after **Near You + International** when Near You renders; otherwise after **International + first format** (two taxonomy lanes, then banner).
 * **`freeProvided`** + music tab: **`ProviderLineupMusicSwimlane`** after Listen again, before liked music + genre taxonomy (same order as broad **`Home.jsx`**).
 * **In-feed** `SwimlaneBannerAd` after the **second** taxonomy lane (third taxonomy row) when `showVisualAds(userType)` (single lane: banner still follows that lane).
 *
 * @param {{ activeBrowseTab: 'music' | 'podcasts' | 'radio' }} props
 */
export default function LimitedBrowseTaxonomyRails({ activeBrowseTab }) {
  const navigate = useNavigate();
  const { userType } = useUserType();
  const { isContentTypeEnabled, filterListenHistory } = useContentProfile();
  const showMusic = isContentTypeEnabled(CONTENT_TYPE.music);
  const showPodcasts = isContentTypeEnabled(CONTENT_TYPE.podcasts);
  const showRadio = isContentTypeEnabled(CONTENT_TYPE.radio);
  const showBannerAd = showVisualAds(userType);
  const { items: listenAgainItems } = useListenHistory();

  const tabListenItems = useMemo(() => {
    const kind = HISTORY_KIND_FOR_BROWSE_TAB[activeBrowseTab];
    return filterListenHistory(
      listenAgainItems.filter((item) => item.kind === kind),
    );
  }, [listenAgainItems, activeBrowseTab, filterListenHistory]);

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

      {activeBrowseTab === "music" && showMusic && userType === "freeProvided" ? (
        <ProviderLineupMusicSwimlane />
      ) : null}

      {activeBrowseTab === "music" && showMusic ? (
        <LibraryLikedMusicSwimlane />
      ) : null}
      {activeBrowseTab === "podcasts" && showPodcasts ? (
        <LibraryPodcastUserSwimlanes />
      ) : null}
      {activeBrowseTab === "radio" && showRadio ? (
        <LibraryLikedRadioSwimlane />
      ) : null}

      {activeBrowseTab === "music" && showMusic ? (
        <LimitedMusicTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}

      {activeBrowseTab === "podcasts" && showPodcasts ? (
        <LimitedPodcastsTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}

      {activeBrowseTab === "radio" && showRadio ? (
        <LimitedRadioTaxonomySwimlanes
          navigate={navigate}
          showBannerAd={showBannerAd}
        />
      ) : null}
    </div>
  );
}
