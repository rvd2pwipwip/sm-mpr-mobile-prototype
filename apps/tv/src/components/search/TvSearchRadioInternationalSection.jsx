import { useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getInternationalBrowseLaneRows,
} from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import { INTERNATIONAL_CONTINENTS_PLANNED } from "@sm-mpr/shared/data/radioStations.js";
import { radioInternationalPath } from "../../constants/radioBrowsePaths.js";
import { useCategoryRailMemorySlug } from "../../hooks/useCategoryRailMemorySlug.js";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import GenreFilterSwimlane from "../swimlanes/GenreFilterSwimlane.jsx";
import TvSearchLabelTileSwimlane from "./TvSearchLabelTileSwimlane.jsx";
import { DEFAULT_RADIO_INTL_CONTINENT } from "../../utils/searchRadioBrowseLayout.js";
import "./TvSearchMusicVibeSection.css";

/**
 * Radio browse International row — continent pills + country/tag label tiles (mobile IA).
 */
export default function TvSearchRadioInternationalSection({
  title = "International",
  memoryKey,
  pillsGroup,
  cardsGroup,
  registerGroupRef,
  registerItemRef,
  isContentGroupActive,
  getItemFocusIndex,
  setFocusedIndex,
  onMoveUp,
  onMoveDown,
  enterNavFromContent,
  onContinentChange,
}) {
  const navigate = useNavigate();

  const pillRows = useMemo(
    () =>
      INTERNATIONAL_CONTINENTS_PLANNED.map((continent) => ({
        slug: continent.id,
        label: continent.label,
      })),
    [],
  );

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    memoryKey,
    pillRows,
    { preferredSlug: DEFAULT_RADIO_INTL_CONTINENT },
  );

  useEffect(() => {
    onContinentChange?.(selectedSlug);
  }, [selectedSlug, onContinentChange]);

  const lane = useMemo(
    () => getInternationalBrowseLaneRows(selectedSlug),
    [selectedSlug],
  );

  const tiles = useMemo(
    () =>
      lane.rows.slice(0, SWIMLANE_CARD_MAX).map((row) => ({
        slug: row.id,
        label: row.label,
      })),
    [lane.rows],
  );

  const handlePillSelect = (slug) => {
    setSelectedSlug(slug);
  };

  const handleTileSelect = (tile) => {
    if (!selectedSlug) return;
    if (lane.usesPlaceholderCountries) {
      navigate(radioInternationalPath([selectedSlug]));
      return;
    }
    navigate(radioInternationalPath([selectedSlug, tile.slug]));
  };

  if (pillRows.length === 0 || !selectedSlug) {
    return null;
  }

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
          ariaLabel={`${title} continents`}
        />
      </div>

      <div
        className="tv-home__scroll-group"
        ref={(node) => registerGroupRef?.(cardsGroup, node)}
      >
        <TvSearchLabelTileSwimlane
          key={selectedSlug}
          tiles={tiles}
          groupIndex={cardsGroup}
          focused={isContentGroupActive(cardsGroup)}
          focusedIndex={getItemFocusIndex(cardsGroup)}
          onFocusChange={(index) => setFocusedIndex(cardsGroup, index)}
          onSelectTile={handleTileSelect}
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={onMoveUp}
          onMoveDown={onMoveDown}
          ariaLabel={`${title} regions`}
          sourceCount={lane.rows.length}
          onMore={() => navigate(radioInternationalPath([selectedSlug]))}
        />
      </div>
    </section>
  );
}
