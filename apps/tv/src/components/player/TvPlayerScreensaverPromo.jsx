import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
} from "@sm-mpr/shared/constants/externalLinks.js";

/** TV provider promo footer on the screensaver frame — always shown (not tier-gated). */
export default function TvPlayerScreensaverPromo() {
  return (
    <footer className="tv-player-screensaver-promo" aria-label="Provider promotion">
      <img
        className="tv-player-screensaver-promo__logo tv-player-screensaver-promo__logo--light"
        src={PROVIDER_LOGO_LIGHT_URL}
        alt="Provider"
        width="201"
        height="63"
        decoding="async"
      />
      <img
        className="tv-player-screensaver-promo__logo tv-player-screensaver-promo__logo--dark"
        src={PROVIDER_LOGO_DARK_URL}
        alt=""
        width="201"
        height="63"
        decoding="async"
        aria-hidden="true"
      />
      <p className="tv-player-screensaver-promo__label">Provider promo (prototype)</p>
    </footer>
  );
}
