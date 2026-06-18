import { useCallback, useMemo } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  getRecommendationsMusicChannels,
  getLimitedMusicChannelsByCategory,
  MUSIC_CHANNELS,
} from "@sm-mpr/shared/data/musicChannels.js";
import { RADIO_STATIONS } from "@sm-mpr/shared/data/radioStations.js";
import ContentTileCard from "../components/cards/ContentTileCard.jsx";
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
  if (pathname === "/more/radio") {
    return {
      screenId: "more-radio",
      title: "Top radio stations",
      variant: "radio",
      getItems: () => RADIO_STATIONS,
    };
  }

  if (pathname === "/more/recommendations") {
    return {
      screenId: "more-recommendations",
      title: "Recommendations",
      variant: "music",
      getItems: () => getRecommendationsMusicChannels(),
    };
  }

  if (pathname === `/more/${HOME_MUSIC_MORE_CATEGORY.newReleases}`) {
    return {
      screenId: "more-new-releases",
      title: getHomeMusicSwimlaneTitle("newReleases"),
      variant: "music",
      getItems: () => getHomeMusicSwimlaneChannels("newReleases"),
    };
  }

  if (pathname === `/more/${HOME_MUSIC_MORE_CATEGORY.countryEssentials}`) {
    return {
      screenId: "more-country-essentials",
      title: getHomeMusicSwimlaneTitle("countryEssentials"),
      variant: "music",
      getItems: () => getHomeMusicSwimlaneChannels("countryEssentials"),
    };
  }

  if (pathname.startsWith("/more/music")) {
    if (categoryId) {
      return {
        screenId: `more-music-${categoryId}`,
        title: getLimitedHomeFilterLabel(categoryId),
        variant: "music",
        getItems: () => getLimitedMusicChannelsByCategory(categoryId),
      };
    }

    return {
      screenId: "more-music",
      title: "Most popular music",
      variant: "music",
      getItems: () => MUSIC_CHANNELS,
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

  const items = useMemo(
    () => (config ? config.getItems() : []),
    [config],
  );

  const handleSelect = useCallback(
    (item) => {
      if (config?.variant === "radio") {
        navigate(`/radio/${item.id}`);
        return;
      }
      navigate(`/music/${item.id}`);
    },
    [config?.variant, navigate],
  );

  if (!config) {
    return <Navigate to="/" replace />;
  }

  const emptyMessage =
    config.variant === "radio" ? "No stations to show." : "No channels to show.";

  return (
    <TvDrillGridPage
      screenId={config.screenId}
      title={config.title}
      items={items}
      emptyMessage={emptyMessage}
      onSelectItem={handleSelect}
      renderItem={(item, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={item}
          onSelect={() => onSelect(item)}
          {...gridCellKeyboardProps(cellNav)}
        >
          {(focusProps) =>
            config.variant === "radio" ? (
              <ContentTileCard
                {...focusProps}
                title={item.name}
                imageUrl={item.thumbnail}
                focused={isFocused}
              />
            ) : (
              <MusicChannelCard
                {...focusProps}
                channel={item}
                focused={isFocused}
              />
            )
          }
        </KeyboardWrapper>
      )}
    />
  );
}
