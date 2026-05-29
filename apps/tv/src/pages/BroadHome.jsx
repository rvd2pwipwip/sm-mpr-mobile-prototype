import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import { musicLineupLabel } from "@sm-mpr/shared/constants/musicLineup.js";
import TvHomeHeader from "../components/TvHomeHeader.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
import { getMusicSwimlaneSlotCount } from "../utils/swimlaneUtils.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";

const POPULAR_GROUP = 0;
const RECOMMENDATIONS_GROUP = 1;

export default function BroadHome() {
  const navigate = useNavigate();
  const { catalogScope, musicLineupMode } = useTerritory();

  const recommendations = useMemo(() => getRecommendationsMusicChannels(), []);

  const popularSlotCount = getMusicSwimlaneSlotCount(MUSIC_CHANNELS.length);
  const recommendationsSlotCount = getMusicSwimlaneSlotCount(
    recommendations.length,
  );

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNav,
  } = useScreenContentFocus("home-broad", {
    groupCount: 2,
    itemCounts: {
      [POPULAR_GROUP]: popularSlotCount,
      [RECOMMENDATIONS_GROUP]: recommendationsSlotCount,
    },
    swimlaneGroups: [POPULAR_GROUP, RECOMMENDATIONS_GROUP],
  });

  const playingChannelId = MUSIC_CHANNELS[0]?.id ?? null;

  const openChannelInfo = (channel) => {
    navigate(`/music/${channel.id}`);
  };

  return (
    <div className="tv-home">
      <TvHomeHeader />
      <div className="tv-home__scroll">
        <div className="tv-home__banner" aria-hidden="true">
          Promo Banner
        </div>

        <MusicChannelSwimlane
          title="Most popular music"
          channels={MUSIC_CHANNELS}
          sourceCount={MUSIC_CHANNELS.length}
          groupIndex={POPULAR_GROUP}
          playingChannelId={playingChannelId}
          focused={isContentGroupActive(POPULAR_GROUP)}
          focusedIndex={getItemFocusIndex(POPULAR_GROUP)}
          onFocusChange={(index) => setFocusedIndex(POPULAR_GROUP, index)}
          onBoundaryLeft={enterNav}
          registerItemRef={registerItemRef}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onSelectChannel={openChannelInfo}
          onMore={() => navigate("/more/music")}
        />

        <MusicChannelSwimlane
          title="Recommendations"
          channels={recommendations}
          sourceCount={recommendations.length}
          groupIndex={RECOMMENDATIONS_GROUP}
          focused={isContentGroupActive(RECOMMENDATIONS_GROUP)}
          focusedIndex={getItemFocusIndex(RECOMMENDATIONS_GROUP)}
          onFocusChange={(index) =>
            setFocusedIndex(RECOMMENDATIONS_GROUP, index)
          }
          onBoundaryLeft={enterNav}
          registerItemRef={registerItemRef}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onSelectChannel={openChannelInfo}
          onMore={() => navigate("/more/recommendations")}
        />

        <p className="tv-home__catalog-proof">
          Shared catalog: <strong>{MUSIC_CHANNELS.length}</strong> music channels
          from <code>@sm-mpr/shared</code>. Territory:{" "}
          <strong>{musicLineupLabel(musicLineupMode)}</strong> (
          <code>{catalogScope}</code>). Wordmark click toggles limited / broad
          (mouse only).
        </p>
      </div>
    </div>
  );
}
