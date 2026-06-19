import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPillsRail from "./CategoryPillsRail";
import ContentSwimlane from "./ContentSwimlane";
import MusicChannelCard from "./MusicChannelCard";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useTerritory } from "../context/TerritoryContext";
import {
  getProviderLineupChannels,
  getProviderLineupPillRows,
  PROVIDER_LINEUP_MEMORY_KEY,
} from "@sm-mpr/shared/data/providerLineupMusic.js";
import { useCategoryRailMemorySlug } from "../hooks/useCategoryRailMemorySlug";

const MEMORY_KEY = PROVIDER_LINEUP_MEMORY_KEY;

/**
 * **`freeProvided`** tier: genre pills + channels — broad **`Home`** and limited Browse **music** tab (`MEMORY_KEY` keeps pill choice in sync).
 */
export default function ProviderLineupMusicSwimlane() {
  const navigate = useNavigate();
  const { catalogScope } = useTerritory();

  const pillRows = useMemo(
    () => getProviderLineupPillRows(catalogScope),
    [catalogScope],
  );

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    MEMORY_KEY,
    pillRows,
  );

  const channels = useMemo(
    () => getProviderLineupChannels(selectedSlug, catalogScope),
    [selectedSlug, catalogScope],
  );

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
