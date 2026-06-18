import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPillsRail from "./CategoryPillsRail";
import ContentSwimlane from "./ContentSwimlane";
import MusicChannelCard from "./MusicChannelCard";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext";
import {
  getMusicChannelsByCategory,
  getLimitedMusicChannelsByCategory,
  getLimitedMusicGenres,
  MUSIC_GENRES,
} from "../data/musicChannels";
import { useCategoryRailMemorySlug } from "../hooks/useCategoryRailMemorySlug";

const MEMORY_KEY = "home-provider-lineup-music";

/**
 * **`freeProvided`** tier: genre pills + channels — broad **`Home`** and limited Browse **music** tab (`MEMORY_KEY` keeps pill choice in sync).
 */
export default function ProviderLineupMusicSwimlane() {
  const navigate = useNavigate();
  const { catalogScope } = useTerritory();
  const isLimitedCatalog = catalogScope === CATALOG_SCOPE.limited;

  const pillRows = useMemo(() => {
    const genres = isLimitedCatalog
      ? getLimitedMusicGenres()
      : MUSIC_GENRES.filter((g) => getMusicChannelsByCategory(g.id).length > 0);
    return genres.map((g) => ({ slug: g.id, label: g.label }));
  }, [isLimitedCatalog]);

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    MEMORY_KEY,
    pillRows,
  );

  const channels = useMemo(() => {
    if (!selectedSlug) return [];
    return isLimitedCatalog
      ? getLimitedMusicChannelsByCategory(selectedSlug)
      : getMusicChannelsByCategory(selectedSlug);
  }, [selectedSlug, isLimitedCatalog]);

  if (pillRows.length === 0 || !selectedSlug) {
    return null;
  }

  const visible = channels.slice(0, SWIMLANE_CARD_MAX);

  return (
    <ContentSwimlane
      title="Your provider lineup"
      categoryRail={
        <CategoryPillsRail
          rows={pillRows}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
          radiogroupFallbackLabel="Genres"
        />
      }
      sourceCount={channels.length}
      maxVisible={SWIMLANE_CARD_MAX}
      onMore={() =>
        navigate(`/search/browse/music/category/${selectedSlug}`)
      }
      cardScrollerResetKey={selectedSlug}
      categoryPillAlignKey={selectedSlug}
    >
      {visible.map((channel) => (
        <MusicChannelCard
          key={channel.id}
          channel={channel}
          onSelect={() => navigate(`/music/${channel.id}`)}
        />
      ))}
    </ContentSwimlane>
  );
}
