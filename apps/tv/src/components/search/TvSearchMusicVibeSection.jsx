import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getBroadSubsMeta,
  getChildTagsForBroadVibe,
} from "@sm-mpr/shared/data/musicBrowseTaxonomy.js";
import {
  getMusicChannelsByCategory,
  getMusicChannelsWithTag,
} from "@sm-mpr/shared/data/musicChannels.js";
import { useCategoryRailMemorySlug } from "../../hooks/useCategoryRailMemorySlug.js";
import GenreFilterSwimlane from "../swimlanes/GenreFilterSwimlane.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import TvSearchLabelTileSwimlane from "./TvSearchLabelTileSwimlane.jsx";
import "./TvSearchMusicVibeSection.css";

/**
 * Broad Search music: one vibe stack (pills group + cards group).
 *
 * Focus map (per section):
 * - pillsGroup: FilterButton row via GenreFilterSwimlane / VariableSwimlane
 * - cardsGroup: sub-tag label tiles OR MusicChannelSwimlane
 */
export default function TvSearchMusicVibeSection({
  vibeId,
  title,
  memoryKey,
  preferredSlug,
  pillsGroup,
  cardsGroup,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onPillChange,
  registerGroupRef,
}) {
  const navigate = useNavigate();

  const pillRows = useMemo(() => getChildTagsForBroadVibe(vibeId), [vibeId]);

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    memoryKey,
    pillRows,
    preferredSlug != null && preferredSlug !== ""
      ? { preferredSlug }
      : {},
  );

  const selectedRow = pillRows.find((r) => r.slug === selectedSlug);

  const leafChannels = useMemo(() => {
    if (!selectedRow || selectedRow.hasSubs) return [];
    if (selectedRow.kind === "genre") {
      if (selectedRow.id) return getMusicChannelsByCategory(selectedRow.id);
      return getMusicChannelsWithTag(selectedRow.label);
    }
    return getMusicChannelsWithTag(
      selectedRow.tagLabel ?? selectedRow.label,
    );
  }, [selectedRow]);

  const subsMeta =
    selectedSlug && selectedRow?.hasSubs
      ? getBroadSubsMeta(vibeId, selectedSlug)
      : null;
  const subTiles = subsMeta?.hasSubs ? subsMeta.subs : [];

  function handlePillSelect(slug) {
    setSelectedSlug(slug);
    onPillChange?.(vibeId, slug, cardsGroup);
    setFocusedIndex(cardsGroup, 0);
  }

  function navigateVibeMore() {
    if (!selectedRow) return;
    if (selectedRow.kind === "genre" && selectedRow.id) {
      navigate(`/search/browse/music/category/${selectedRow.id}`);
      return;
    }
    navigate(`/search/browse/music/vibe/${vibeId}/tag/${selectedRow.slug}`);
  }

  if (pillRows.length === 0 || !selectedSlug || !selectedRow) {
    return null;
  }

  const isLeaf = !selectedRow.hasSubs;
  const pillFilters = pillRows.map((row) => ({
    id: row.slug,
    label: row.label,
  }));

  return (
    <section className="tv-search-vibe-section" aria-label={title}>
      <h2 className="tv-search-vibe-section__title">{title}</h2>

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
        ariaLabel={`${title} tags`}
      />
      </div>

      <div
        className="tv-home__scroll-group"
        ref={(node) => registerGroupRef?.(cardsGroup, node)}
      >
      {isLeaf ? (
        <MusicChannelSwimlane
          key={selectedSlug}
          title=""
          showTitle={false}
          channels={leafChannels}
          sourceCount={leafChannels.length}
          groupIndex={cardsGroup}
          focused={isContentGroupActive(cardsGroup)}
          focusedIndex={getItemFocusIndex(cardsGroup)}
          onFocusChange={(index) => setFocusedIndex(cardsGroup, index)}
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          onMore={navigateVibeMore}
        />
      ) : (
        <TvSearchLabelTileSwimlane
          key={selectedSlug}
          tiles={subTiles}
          groupIndex={cardsGroup}
          focused={isContentGroupActive(cardsGroup)}
          focusedIndex={getItemFocusIndex(cardsGroup)}
          onFocusChange={(index) => setFocusedIndex(cardsGroup, index)}
          onSelectTile={(tile) =>
            navigate(
              `/search/browse/music/vibe/${vibeId}/tag/${selectedSlug}/sub/${tile.slug}`,
            )
          }
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          ariaLabel={`${title} sub-tags`}
        />
      )}
      </div>
    </section>
  );
}
