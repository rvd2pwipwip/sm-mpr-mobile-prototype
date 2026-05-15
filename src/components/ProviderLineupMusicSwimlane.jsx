import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import CategoryPillsRail from "./CategoryPillsRail";
import ContentSwimlane from "./ContentSwimlane";
import MusicChannelCard from "./MusicChannelCard";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import {
  MUSIC_GENRES,
  getMusicChannelsByCategory,
} from "../data/musicChannels";
import { useCategoryRailMemorySlug } from "../hooks/useCategoryRailMemorySlug";

const MEMORY_KEY = "home-provider-lineup-music";

/**
 * Home-only: cable / TV provider tier sees genre pills (limited lineup mirrors Browse music taxonomy).
 */
export default function ProviderLineupMusicSwimlane() {
  const navigate = useNavigate();

  const pillRows = useMemo(
    () =>
      MUSIC_GENRES.filter((g) => getMusicChannelsByCategory(g.id).length > 0).map(
        (g) => ({ slug: g.id, label: g.label }),
      ),
    [],
  );

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    MEMORY_KEY,
    pillRows,
  );

  const channels = useMemo(() => {
    if (!selectedSlug) return [];
    return getMusicChannelsByCategory(selectedSlug);
  }, [selectedSlug]);

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
