import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane.jsx";
import CategoryPillsRail from "./CategoryPillsRail.jsx";
import MusicChannelCard from "./MusicChannelCard.jsx";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import { useCategoryRailMemorySlug } from "../hooks/useCategoryRailMemorySlug.js";
import {
  getBroadSubsMeta,
  getChildTagsForBroadVibe,
} from "../data/musicBrowseTaxonomy.js";
import {
  getMusicChannelsByCategory,
  getMusicChannelsWithTag,
} from "../data/musicChannels.js";
import "./AppInfoSwimlane.css";

/**
 * Broad Search/Browse: one vibe row (Genre / Activity / Mood / Era / Theme) with category pills,
 * subs as FAQ tiles, leaf tags as channel cards + trailing More when capped.
 *
 * @param {{
 *   vibeId: string,
 *   title: string,
 *   memoryKey: string,
 *   preferredSlug?: string,
 * }} props
 */
export default function SearchMusicVibeBrowseRail({
  vibeId,
  title,
  memoryKey,
  preferredSlug,
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
  const visibleLeaf = leafChannels.slice(0, SWIMLANE_CARD_MAX);
  const leafNeedsTrailingMore = isLeaf && leafChannels.length > SWIMLANE_CARD_MAX;

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
      sourceCount={isLeaf ? leafChannels.length : undefined}
      maxVisible={SWIMLANE_CARD_MAX}
      trailingMoreCard={leafNeedsTrailingMore}
      onMore={navigateVibeMore}
      cardScrollerResetKey={selectedSlug}
      categoryPillAlignKey={selectedSlug}
    >
      {isLeaf
        ? visibleLeaf.map((channel) => (
            <MusicChannelCard
              key={channel.id}
              channel={channel}
              onSelect={() => navigate(`/music/${channel.id}`)}
            />
          ))
        : subTiles.map((s) => (
            <button
              key={s.slug}
              type="button"
              className="app-info-swimlane__tile"
              aria-label={`Browse ${s.label}`}
              onClick={() =>
                navigate(
                  `/search/browse/music/vibe/${vibeId}/tag/${selectedSlug}/sub/${s.slug}`,
                )
              }
            >
              <span className="app-info-swimlane__tile-label">{s.label}</span>
            </button>
          ))}
    </ContentSwimlane>
  );
}
