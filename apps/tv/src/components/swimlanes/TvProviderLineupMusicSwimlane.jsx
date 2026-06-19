import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getProviderLineupChannels,
  getProviderLineupPillRows,
  PROVIDER_LINEUP_MEMORY_KEY,
} from "@sm-mpr/shared/data/providerLineupMusic.js";
import { useCategoryRailMemorySlug } from "../../hooks/useCategoryRailMemorySlug.js";
import GenreFilterSwimlane from "./GenreFilterSwimlane.jsx";
import MusicChannelSwimlane from "./MusicChannelSwimlane.jsx";
import "../search/TvSearchMusicVibeSection.css";

/**
 * **`freeProvided`** tier: genre pills + channels (mobile `ProviderLineupMusicSwimlane` parity).
 */
export default function TvProviderLineupMusicSwimlane({
  catalogScope,
  pillsGroup,
  cardsGroup,
  playingChannelId = null,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
}) {
  const navigate = useNavigate();

  const pillRows = useMemo(
    () => getProviderLineupPillRows(catalogScope),
    [catalogScope],
  );

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    PROVIDER_LINEUP_MEMORY_KEY,
    pillRows,
  );

  const channels = useMemo(
    () => getProviderLineupChannels(selectedSlug, catalogScope),
    [selectedSlug, catalogScope],
  );

  if (pillRows.length === 0 || !selectedSlug) {
    return null;
  }

  const pillFilters = pillRows.map((row) => ({
    id: row.slug,
    label: row.label,
  }));

  const handlePillSelect = (slug) => {
    setSelectedSlug(slug);
    setFocusedIndex(cardsGroup, 0);
  };

  return (
    <section
      className="tv-search-vibe-section"
      aria-label="Your provider lineup"
    >
      <h2 className="tv-search-vibe-section__title">Your provider lineup</h2>

      <div
        className="tv-home__scroll-group"
        ref={(node) => registerGroupRef?.(pillsGroup, node)}
      >
        <GenreFilterSwimlane
          filters={pillFilters}
          activeFilterId={selectedSlug}
          groupIndex={pillsGroup}
          focused={isContentGroupActive(pillsGroup)}
          focusedIndex={getItemFocusIndex(pillsGroup)}
          onFocusChange={(index) => setFocusedIndex(pillsGroup, index)}
          onSelectFilter={handlePillSelect}
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          showTitle={false}
          ariaLabel="Your provider lineup genres"
        />
      </div>

      <div
        className="tv-home__scroll-group"
        ref={(node) => registerGroupRef?.(cardsGroup, node)}
      >
        <MusicChannelSwimlane
          key={selectedSlug}
          title=""
          showTitle={false}
          channels={channels}
          sourceCount={channels.length}
          groupIndex={cardsGroup}
          playingChannelId={playingChannelId}
          focused={isContentGroupActive(cardsGroup)}
          focusedIndex={getItemFocusIndex(cardsGroup)}
          onFocusChange={(index) => setFocusedIndex(cardsGroup, index)}
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onSelectChannel={(channel) => navigate(`/music/${channel.id}`)}
          onMore={() =>
            navigate(`/search/browse/music/category/${selectedSlug}`)
          }
        />
      </div>
    </section>
  );
}
