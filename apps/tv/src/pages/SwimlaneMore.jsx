import { useCallback, useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  getMusicChannelsByCategory,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import TvDrillGridPage from "../components/drill/TvDrillGridPage.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import { HOME_MUSIC_MORE_CATEGORY } from "@sm-mpr/shared/constants/homeSwimlanes.js";
import {
  getHomeMusicSwimlaneChannels,
  getHomeMusicSwimlaneTitle,
} from "@sm-mpr/shared/data/homeMusicSwimlanes.js";
import { getLimitedHomeFilterLabel } from "../utils/limitedHomeData.js";
import "../components/cards/ContentTileCard.css";

function resolveMoreConfig(pathname, categoryId) {
  if (pathname === "/more/recommendations") {
    return {
      screenId: "more-recommendations",
      title: "Recommendations",
      getChannels: () => getRecommendationsMusicChannels(),
    };
  }

  if (pathname === `/more/${HOME_MUSIC_MORE_CATEGORY.newReleases}`) {
    return {
      screenId: "more-new-releases",
      title: getHomeMusicSwimlaneTitle("newReleases"),
      getChannels: () => getHomeMusicSwimlaneChannels("newReleases"),
    };
  }

  if (pathname === `/more/${HOME_MUSIC_MORE_CATEGORY.countryEssentials}`) {
    return {
      screenId: "more-country-essentials",
      title: getHomeMusicSwimlaneTitle("countryEssentials"),
      getChannels: () => getHomeMusicSwimlaneChannels("countryEssentials"),
    };
  }

  if (pathname.startsWith("/more/music")) {
    if (categoryId) {
      return {
        screenId: `more-music-${categoryId}`,
        title: getLimitedHomeFilterLabel(categoryId),
        getChannels: () => getMusicChannelsByCategory(categoryId),
      };
    }

    return {
      screenId: "more-music",
      title: "Most popular music",
      getChannels: () => MUSIC_CHANNELS,
    };
  }

  return null;
}

export default function SwimlaneMore() {
  const { pathname } = useLocation();
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const config = useMemo(
    () => resolveMoreConfig(pathname, categoryId),
    [pathname, categoryId],
  );

  const channels = useMemo(
    () => (config ? config.getChannels() : []),
    [config],
  );

  const handleChannelSelect = useCallback(
    (channel) => {
      navigate(`/music/${channel.id}`);
    },
    [navigate],
  );

  if (!config) {
    return <Navigate to="/" replace />;
  }

  return (
    <TvDrillGridPage
      screenId={config.screenId}
      title={config.title}
      items={channels}
      emptyMessage="No channels to show."
      onSelectItem={handleChannelSelect}
      renderItem={(channel, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={channel}
          onSelect={() => onSelect(channel)}
          {...gridCellKeyboardProps(cellNav)}
        >
          {(focusProps) => (
            <MusicChannelCard
              {...focusProps}
              channel={channel}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
