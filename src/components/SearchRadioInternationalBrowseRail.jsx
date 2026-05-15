import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import BrowseTagCard from "./BrowseTagCard.jsx";
import CategoryPillsRail from "./CategoryPillsRail.jsx";
import ContentSwimlane from "./ContentSwimlane.jsx";
import { radioInternationalPath } from "../constants/radioBrowsePaths.js";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import { useCategoryRailMemorySlug } from "../hooks/useCategoryRailMemorySlug.js";
import { getInternationalBrowseLaneRows } from "../data/radioInternationalBrowse.js";
import { INTERNATIONAL_CONTINENTS_PLANNED } from "../data/radioStations.js";

const MEMORY_KEY = "search-radio-international";

/** Default continent when rail memory is empty (prototype listener in North America). */
const DEFAULT_CONTINENT_SLUG = "north-america";

/**
 * Browse Radio: International row with continent pills and country/tag cards.
 * North America uses real geo children; other continents show placeholder cards until mock/API markets exist.
 * Placeholder taps open the continent hub (`/international/{continent}`).
 *
 * @param {{ title?: string }} props
 */
export default function SearchRadioInternationalBrowseRail({
  title = "International",
}) {
  const navigate = useNavigate();

  const pillRows = useMemo(
    () =>
      INTERNATIONAL_CONTINENTS_PLANNED.map((c) => ({
        slug: c.id,
        label: c.label,
      })),
    [],
  );

  const [selectedSlug, setSelectedSlug] = useCategoryRailMemorySlug(
    MEMORY_KEY,
    pillRows,
    { preferredSlug: DEFAULT_CONTINENT_SLUG },
  );

  const lane = useMemo(
    () => getInternationalBrowseLaneRows(selectedSlug),
    [selectedSlug],
  );
  const countries = lane.rows;
  const usesPlaceholderCountries = lane.usesPlaceholderCountries;

  const visible = countries.slice(0, SWIMLANE_CARD_MAX);
  const trailingMore = countries.length > SWIMLANE_CARD_MAX;

  function navigateMore() {
    if (!selectedSlug) return;
    navigate(radioInternationalPath([selectedSlug]));
  }

  function navigateToRow(row) {
    if (!selectedSlug) return;
    if (usesPlaceholderCountries) {
      navigate(radioInternationalPath([selectedSlug]));
      return;
    }
    navigate(radioInternationalPath([selectedSlug, row.id]));
  }

  if (pillRows.length === 0 || !selectedSlug) {
    return null;
  }

  return (
    <ContentSwimlane
      title={title}
      categoryRail={
        <CategoryPillsRail
          rows={pillRows}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
          radiogroupFallbackLabel={title}
        />
      }
      showMore={false}
      sourceCount={countries.length}
      maxVisible={SWIMLANE_CARD_MAX}
      trailingMoreCard={trailingMore}
      onMore={navigateMore}
      cardScrollerResetKey={selectedSlug}
      categoryPillAlignKey={selectedSlug}
    >
      {visible.map((row) => (
        <BrowseTagCard
          key={row.id}
          label={row.label}
          geoType={row.type}
          onSelect={() => navigateToRow(row)}
        />
      ))}
    </ContentSwimlane>
  );
}
