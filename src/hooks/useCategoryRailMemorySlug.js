import { useLayoutEffect, useState } from "react";
import { useCategoryRailMemory } from "../context/CategoryRailMemoryContext.jsx";

/**
 * Selected pill slug with CategoryRailMemoryContext persistence (prototype session only).
 *
 * @param {string} memoryKey Stable id per rail instance (e.g. search-music-genre)
 * @param {{ slug: string }[]} rows Current pill rows; slug must be stable across visits
 * @param {{ preferredSlug?: string }} [options] First choice when memory empty (e.g. "pop")
 * @returns {[string, (slug: string) => void]}
 */
export function useCategoryRailMemorySlug(memoryKey, rows, options = {}) {
  const { preferredSlug } = options;
  const memory = useCategoryRailMemory();

  function fallbackSlug() {
    if (rows.length === 0) return "";
    const prefer =
      preferredSlug != null && preferredSlug !== ""
        ? rows.find((r) => r.slug === preferredSlug)?.slug
        : undefined;
    return prefer ?? rows[0]?.slug ?? "";
  }

  const [selectedSlug, setSelectedSlugInternal] = useState(() => {
    const fb = fallbackSlug();
    const candidate = memory.get(memoryKey, fb);
    return rows.some((r) => r.slug === candidate) ? candidate : fb;
  });

  function setSelectedSlug(slug) {
    memory.set(memoryKey, slug);
    setSelectedSlugInternal(slug);
  }

  useLayoutEffect(() => {
    if (rows.length === 0 || !selectedSlug) return;
    if (!rows.some((r) => r.slug === selectedSlug)) {
      const fb = fallbackSlug();
      memory.set(memoryKey, fb);
      setSelectedSlugInternal(fb);
    }
  }, [rows, selectedSlug, memory, memoryKey, preferredSlug]);

  return [selectedSlug, setSelectedSlug];
}
