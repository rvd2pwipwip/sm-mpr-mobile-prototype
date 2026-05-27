import { useLayoutEffect, useState } from "react";

const DEFAULT_MAX = 300;
const DEFAULT_MIN = 160;

function pxLength(raw) {
  if (!raw || raw === "none") return 0;
  const n = Number.parseFloat(raw);
  return Number.isFinite(n) ? n : 0;
}

/**
 * Square thumbnail clamp for fullscreen players: derives `--player-thumb-side` budget from
 * the hero column height minus title/actions/track text overhead (ResizeObserver).
 *
 * Set on `<main>`: `style={{ "--player-thumb-side": `${sidePx}px" }}` (see `MusicPlayer.css`).
 *
 * @param {React.RefObject<HTMLElement | null>} mainRef — `<main class="music-player-screen">`
 * @param {boolean} enabled — false skips observers (e.g. gate until route ready)
 * @param {{ max?: number; min?: number }} [opts]
 */
export function useFullscreenPlayerThumbSidePx(mainRef, enabled, opts = {}) {
  const maxCap = opts.max ?? DEFAULT_MAX;
  const minCap = opts.min ?? DEFAULT_MIN;
  const [sidePx, setSidePx] = useState(maxCap);

  useLayoutEffect(() => {
    if (!enabled) {
      setSidePx(maxCap);
      return undefined;
    }

    const mainEl = mainRef.current;
    if (!mainEl) return undefined;

    const measure = () => {
      const body = mainEl.querySelector(
        ".music-player__body, .podcast-player__body",
      );
      const footerStack = mainEl.querySelector(
        ".music-player__bottom-player-stack, .podcast-player__footer-stack",
      );
      const topEl = body?.querySelector(".music-player__top");
      const coverBlock = topEl?.querySelector(".music-player__cover-block");

      if (!body || !footerStack || !topEl || !coverBlock) {
        setSidePx(maxCap);
        return;
      }

      const trackText = coverBlock.querySelector(".music-player__track-text");
      const csBody = getComputedStyle(body);
      const padInline =
        pxLength(csBody.paddingLeft) + pxLength(csBody.paddingRight);

      const csTop = getComputedStyle(topEl);
      const gapTop =
        pxLength(csTop.rowGap) ||
        pxLength(csTop.columnGap) ||
        pxLength(csTop.gap) ||
        12;

      const children = [...topEl.children];
      const idxCover = children.indexOf(coverBlock);
      if (idxCover < 0) {
        setSidePx(maxCap);
        return;
      }

      let usedBeforeCover = 0;
      for (let i = 0; i < idxCover; i++) {
        usedBeforeCover += children[i].offsetHeight;
      }
      const gapsBeforeCover = idxCover * gapTop;

      const csCoverBlock = getComputedStyle(coverBlock);
      const gapCoverBlock =
        pxLength(csCoverBlock.rowGap) ||
        pxLength(csCoverBlock.columnGap) ||
        pxLength(csCoverBlock.gap) ||
        0;

      const trackH = trackText?.offsetHeight ?? 0;

      const fixedOverhead =
        usedBeforeCover + gapsBeforeCover + gapCoverBlock + trackH;

      const heroBandH = topEl.clientHeight;
      const verticalBudget = Math.floor(heroBandH - fixedOverhead);

      const maxByWidth = Math.floor(body.clientWidth - padInline);

      const raw = Math.min(maxCap, maxByWidth, verticalBudget);
      const next = Math.min(maxCap, Math.max(minCap, raw));
      setSidePx(Number.isFinite(next) ? next : maxCap);
    };

    const ro = new ResizeObserver(() => measure());
    ro.observe(mainEl);

    const body = mainEl.querySelector(
      ".music-player__body, .podcast-player__body",
    );
    const footerStack = mainEl.querySelector(
      ".music-player__bottom-player-stack, .podcast-player__footer-stack",
    );
    const topEl = body?.querySelector(".music-player__top");

    if (body) ro.observe(body);
    if (footerStack) ro.observe(footerStack);
    if (topEl) ro.observe(topEl);

    const vv = window.visualViewport;
    vv?.addEventListener("resize", measure);
    window.addEventListener("resize", measure);

    measure();

    return () => {
      ro.disconnect();
      vv?.removeEventListener("resize", measure);
      window.removeEventListener("resize", measure);
    };
  }, [enabled, maxCap, minCap]);

  return sidePx;
}
