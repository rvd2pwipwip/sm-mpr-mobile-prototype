import PlayerProvidedBrandRow from "./PlayerProvidedBrandRow";
import VisualAdStrip from "./VisualAdStrip";
import "./FullScreenPlayerShell.css";

/**
 * Shared fullscreen player chrome below `<main>` (header + body column + optional provider row + optional fixed ad strip).
 * Preroll overlay stays on each route (`PlayerPrerollAd`) as the first child of `<main>`.
 *
 * @param {object} props
 * @param {import('react').ReactNode} props.header — `<header className="music-player__header">…`
 * @param {import('react').ReactNode} props.hero — Primary column (music/radio: `.music-player__top`; podcast: wrapped in `.podcast-player__scroll` when `podcastLayout`)
 * @param {import('react').ReactNode} props.footer — Controls block (`music-player__controls` subtree); shell wraps footer stack + extras.
 * @param {boolean} props.showProviderBrand — `freeProvided` provider row above fixed ad / below controls.
 * @param {boolean} props.showPlayerAd — footer **`VisualAdStrip--player`** + music/radio body reserve modifiers.
 * @param {boolean} [props.podcastLayout=false] — Use **`podcast-player__body`** + scroll + **`podcast-player__footer-stack`** instead of music/radio column.
 */
export default function FullScreenPlayerShell({
  header,
  hero,
  footer,
  showProviderBrand,
  showPlayerAd,
  podcastLayout = false,
}) {
  if (podcastLayout) {
    const bodyClass = [
      "podcast-player__body",
      showPlayerAd ? "podcast-player__body--with-ad" : "",
      !showPlayerAd ? "podcast-player__body--no-ad" : "",
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <>
        {header}
        <div className={bodyClass}>
          <div className="podcast-player__scroll">{hero}</div>
          <div className="podcast-player__footer-stack">
            {footer}
            {showProviderBrand ? <PlayerProvidedBrandRow /> : null}
            {showPlayerAd ? <VisualAdStrip variant="player" /> : null}
          </div>
        </div>
      </>
    );
  }

  const bodyClass = [
    "music-player__body",
    !showPlayerAd ? "music-player__body--no-player-ad" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      {header}
      <div className={bodyClass}>
        {hero}
        <div className="music-player__bottom-player-stack">
          {footer}
          {showProviderBrand ? <PlayerProvidedBrandRow /> : null}
        </div>
        {showPlayerAd ? <VisualAdStrip variant="player" /> : null}
      </div>
    </>
  );
}
