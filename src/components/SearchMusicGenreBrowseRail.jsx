import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane.jsx";
import MusicChannelCard from "./MusicChannelCard.jsx";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import {
  getBroadSubsMeta,
  getChildTagsForBroadVibe,
} from "../data/musicBrowseTaxonomy.js";
import {
  getMusicChannelsByCategory,
  getMusicChannelsWithTag,
} from "../data/musicChannels.js";
import "./AppInfoSwimlane.css";

const GENRE_VIBE_ID = "genre";

/** Broad Search/Browse: Genre swimlane with pills; subs as FAQ tiles, leaf genres as channel cards + trailing More. */
export default function SearchMusicGenreBrowseRail() {
  const navigate = useNavigate();

  const genreRows = useMemo(
    () =>
      getChildTagsForBroadVibe(GENRE_VIBE_ID).filter((r) => r.kind === "genre"),
    [],
  );

  const [selectedSlug, setSelectedSlug] = useState(() => {
    const initial = genreRows.find((r) => r.slug === "pop");
    return initial?.slug ?? genreRows[0]?.slug ?? "";
  });

  const selectedRow = genreRows.find((r) => r.slug === selectedSlug);

  const leafChannels = useMemo(() => {
    if (!selectedRow || selectedRow.hasSubs) return [];
    if (selectedRow.id) return getMusicChannelsByCategory(selectedRow.id);
    return getMusicChannelsWithTag(selectedRow.label);
  }, [selectedRow]);

  const subsMeta =
    selectedSlug && selectedRow?.hasSubs
      ? getBroadSubsMeta(GENRE_VIBE_ID, selectedSlug)
      : null;
  const subTiles = subsMeta?.hasSubs ? subsMeta.subs : [];

  function navigateGenreMore() {
    if (!selectedRow) return;
    if (selectedRow.id) {
      navigate(`/search/browse/music/category/${selectedRow.id}`);
      return;
    }
    navigate(
      `/search/browse/music/vibe/${GENRE_VIBE_ID}/tag/${selectedRow.slug}`,
    );
  }

  if (genreRows.length === 0 || !selectedSlug || !selectedRow) {
    return null;
  }

  const isLeaf = !selectedRow.hasSubs;
  const visibleLeaf = leafChannels.slice(0, SWIMLANE_CARD_MAX);
  const leafNeedsTrailingMore = isLeaf && leafChannels.length > SWIMLANE_CARD_MAX;

  return (
    <ContentSwimlane
      title="Genre"
      categoryRail={
        <GenrePillsRail
          genreRows={genreRows}
          selectedSlug={selectedSlug}
          onSelect={setSelectedSlug}
        />
      }
      showMore={false}
      sourceCount={isLeaf ? leafChannels.length : undefined}
      maxVisible={SWIMLANE_CARD_MAX}
      trailingMoreCard={leafNeedsTrailingMore}
      onMore={navigateGenreMore}
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
                  `/search/browse/music/vibe/${GENRE_VIBE_ID}/tag/${selectedSlug}/sub/${s.slug}`,
                )
              }
            >
              <span className="app-info-swimlane__tile-label">{s.label}</span>
            </button>
          ))}
    </ContentSwimlane>
  );
}

/** @param {{ genreRows: { slug: string, label: string }[], selectedSlug: string, onSelect: (slug: string) => void }} props */
function GenrePillsRail({ genreRows, selectedSlug, onSelect }) {
  return (
    <>
      {genreRows.map((row) => (
        <button
          key={row.slug}
          type="button"
          className={
            selectedSlug === row.slug
              ? "content-swimlane__category-pill content-swimlane__category-pill--active"
              : "content-swimlane__category-pill"
          }
          aria-pressed={selectedSlug === row.slug}
          onClick={() => onSelect(row.slug)}
        >
          {row.label}
        </button>
      ))}
    </>
  );
}
