import { useLayoutEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane.jsx";
import MusicChannelCard from "./MusicChannelCard.jsx";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane.js";
import { useCategoryRailMemory } from "../context/CategoryRailMemoryContext.jsx";
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

/** Ease-out cubic: stronger deceleration at the end of the scroll (~280ms). */
function easeOutCubic(t) {
  return 1 - (1 - t) ** 3;
}

const CATEGORY_PILL_SCROLL_MS = 280;

/**
 * Target scrollLeft for the active pill; respects inner row padding (category gutters).
 * @returns {number | null}
 */
function computeGenrePillTargetScrollLeft(scrollEl, slug, genreRows) {
  if (!scrollEl || slug == null || genreRows.length === 0) return null;
  const raw = String(slug);
  const escaped =
    typeof CSS !== "undefined" && typeof CSS.escape === "function"
      ? CSS.escape(raw)
      : raw.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
  const pillEl = scrollEl.querySelector(`[data-genre-pill="${escaped}"]`);
  if (!pillEl) return null;

  const idx = genreRows.findIndex((r) => r.slug === raw);
  if (idx < 0) return null;

  const inner = scrollEl.querySelector(".content-swimlane__categories-inner");
  if (!inner) return null;

  const innerCs = getComputedStyle(inner);
  const padStart = parseFloat(innerCs.paddingInlineStart) || 0;
  const padEnd = parseFloat(innerCs.paddingInlineEnd) || 0;

  const pillRect = pillEl.getBoundingClientRect();
  const scrollRect = scrollEl.getBoundingClientRect();

  const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);

  let delta = 0;
  if (idx <= 0) {
    delta = pillRect.left - scrollRect.left - padStart;
  } else if (idx >= genreRows.length - 1) {
    delta = pillRect.right - scrollRect.right + padEnd;
  } else {
    const pillMid = pillRect.left + pillRect.width / 2;
    const portMid = scrollRect.left + scrollRect.width / 2;
    delta = pillMid - portMid;
  }

  const rawNext = scrollEl.scrollLeft + delta;
  return Math.max(0, Math.min(maxScroll, rawNext));
}

/**
 * Animate scrollLeft to target with ease-out deceleration (cancel prior runs via returned cleanup).
 * @returns {(() => void) | undefined}
 */
function startAnimatedGenrePillScroll(scrollEl, targetLeft) {
  const maxScroll = Math.max(0, scrollEl.scrollWidth - scrollEl.clientWidth);
  const clamped = Math.max(0, Math.min(maxScroll, targetLeft));

  const prefersReduced =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReduced) {
    scrollEl.scrollLeft = clamped;
    return undefined;
  }

  const start = scrollEl.scrollLeft;
  const delta = clamped - start;
  if (Math.abs(delta) < 2) {
    scrollEl.scrollLeft = clamped;
    return undefined;
  }

  const durationMs = CATEGORY_PILL_SCROLL_MS;
  const startTime = performance.now();
  let frameId = 0;

  function tick(now) {
    const elapsed = now - startTime;
    const t = Math.min(1, elapsed / durationMs);
    scrollEl.scrollLeft = start + delta * easeOutCubic(t);
    if (t < 1) {
      frameId = requestAnimationFrame(tick);
    } else {
      scrollEl.scrollLeft = clamped;
    }
  }

  frameId = requestAnimationFrame(tick);

  return () => {
    cancelAnimationFrame(frameId);
    scrollEl.scrollLeft = clamped;
  };
}

/** Padding-aware scrollLeft before paint (no tween). Navigate-back / remount / layout churn. */
function snapGenrePillIntoScroll(scrollEl, slug, genreRows) {
  const target = computeGenrePillTargetScrollLeft(scrollEl, slug, genreRows);
  if (target !== null) scrollEl.scrollLeft = target;
}

/** Animated alignment only after user taps a different pill; returns cancel */
function animateGenrePillIntoScroll(scrollEl, slug, genreRows) {
  const target = computeGenrePillTargetScrollLeft(scrollEl, slug, genreRows);
  if (target === null) return undefined;
  return startAnimatedGenrePillScroll(scrollEl, target);
}

/** Stable key for Search Music Genre rail memory (`CategoryRailMemoryContext`). */
const SEARCH_MUSIC_GENRE_MEMORY_KEY = "search-music-genre";

/** Broad Search/Browse: Genre swimlane with pills; subs as FAQ tiles, leaf genres as channel cards + trailing More. */
export default function SearchMusicGenreBrowseRail() {
  const navigate = useNavigate();
  const memory = useCategoryRailMemory();

  const genreRows = useMemo(
    () =>
      getChildTagsForBroadVibe(GENRE_VIBE_ID).filter((r) => r.kind === "genre"),
    [],
  );

  const [selectedSlug, setSelectedSlugInternal] = useState(() => {
    const fb =
      genreRows.find((r) => r.slug === "pop")?.slug ?? genreRows[0]?.slug ?? "";
    const candidate = memory.get(SEARCH_MUSIC_GENRE_MEMORY_KEY, fb);
    return genreRows.some((r) => r.slug === candidate) ? candidate : fb;
  });

  function setSelectedSlug(slug) {
    memory.set(SEARCH_MUSIC_GENRE_MEMORY_KEY, slug);
    setSelectedSlugInternal(slug);
  }

  useLayoutEffect(() => {
    if (genreRows.length === 0 || !selectedSlug) return;
    if (!genreRows.some((r) => r.slug === selectedSlug)) {
      const fb =
        genreRows.find((r) => r.slug === "pop")?.slug ?? genreRows[0]?.slug ?? "";
      memory.set(SEARCH_MUSIC_GENRE_MEMORY_KEY, fb);
      setSelectedSlugInternal(fb);
    }
  }, [genreRows, selectedSlug, memory]);

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

/** @param {{ genreRows: { slug: string, label: string }[], selectedSlug: string, onSelect: (slug: string) => void, categoriesScrollEl?: HTMLElement | null, categoryPillAlignKey?: string | number, categoryRailTitleId?: string }} props */
function GenrePillsRail({
  genreRows,
  selectedSlug,
  onSelect,
  categoriesScrollEl,
  categoryPillAlignKey,
  categoryRailTitleId,
}) {
  const cancelPillScrollRef = useRef(undefined);
  const prevAlignedSlugRef = useRef(undefined);

  function handlePillKeyDown(event, rowIndex) {
    const key = event.key;
    if (
      key !== "ArrowRight" &&
      key !== "ArrowLeft" &&
      key !== "Home" &&
      key !== "End"
    ) {
      return;
    }
    event.preventDefault();
    let nextIndex = rowIndex;
    if (key === "ArrowRight") {
      nextIndex = Math.min(rowIndex + 1, genreRows.length - 1);
    } else if (key === "ArrowLeft") {
      nextIndex = Math.max(rowIndex - 1, 0);
    } else if (key === "Home") {
      nextIndex = 0;
    } else if (key === "End") {
      nextIndex = genreRows.length - 1;
    }
    const next = genreRows[nextIndex];
    if (next) onSelect(next.slug);
  }

  useLayoutEffect(() => {
    if (categoriesScrollEl == null || categoryPillAlignKey === undefined) {
      return undefined;
    }

    cancelPillScrollRef.current?.();
    cancelPillScrollRef.current = undefined;

    const slug = String(categoryPillAlignKey);
    const prevSlug = prevAlignedSlugRef.current;
    const userChangedPill = prevSlug !== undefined && prevSlug !== slug;

    prevAlignedSlugRef.current = slug;

    if (!userChangedPill) {
      snapGenrePillIntoScroll(categoriesScrollEl, slug, genreRows);
      return undefined;
    }

    cancelPillScrollRef.current = animateGenrePillIntoScroll(
      categoriesScrollEl,
      slug,
      genreRows,
    );

    return () => {
      cancelPillScrollRef.current?.();
      cancelPillScrollRef.current = undefined;
    };
  }, [categoriesScrollEl, categoryPillAlignKey, genreRows]);

  const labelledBy =
    categoryRailTitleId != null && categoryRailTitleId !== ""
      ? categoryRailTitleId
      : undefined;

  return (
    <div
      role="radiogroup"
      className="content-swimlane__category-radiogroup"
      aria-labelledby={labelledBy}
      aria-label={labelledBy ? undefined : "Genre"}
    >
      {genreRows.map((row, rowIndex) => (
        <button
          key={row.slug}
          type="button"
          role="radio"
          data-genre-pill={row.slug}
          className={
            selectedSlug === row.slug
              ? "content-swimlane__category-pill content-swimlane__category-pill--active"
              : "content-swimlane__category-pill"
          }
          aria-checked={selectedSlug === row.slug}
          tabIndex={selectedSlug === row.slug ? 0 : -1}
          onKeyDown={(event) => handlePillKeyDown(event, rowIndex)}
          onClick={() => onSelect(row.slug)}
        >
          {row.label}
        </button>
      ))}
    </div>
  );
}
