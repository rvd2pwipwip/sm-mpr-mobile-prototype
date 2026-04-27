import { useLayoutEffect, useRef } from "react";
import Button from "./Button";
import "./HomeHeader.css";

/**
 * Measures then publishes actual header height to `--home-header-offset`. Scroll
 * top padding is `calc(offset + var(--home-header-scroll-gap))` in `index.css` so a gap below
 * the bar is not overwritten when this sets `--home-header-offset` on `<html>`.
 */
function useHomeHeaderOffset() {
  const ref = useRef(null);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const publish = () => {
      const h = el.offsetHeight;
      document.documentElement.style.setProperty(
        "--home-header-offset",
        `${h}px`,
      );
    };

    publish();
    const ro = new ResizeObserver(publish);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty("--home-header-offset");
    };
  }, []);

  return ref;
}

function UpgradeStartIcon() {
  return (
    <img
      className="btn__icon-asset"
      src="/upgrade.svg"
      alt=""
      width="30"
      height="30"
      decoding="async"
    />
  );
}

/**
 * Home top bar: logo (`public/stingrayMusic*.svg`) + guest “Upgrade” CTA.
 * User-type variants (subscribed, provider) come later — see `docs/Home-screen-story.md`.
 */
export default function HomeHeader({ onUpgrade }) {
  const headerRef = useHomeHeaderOffset();

  return (
    <header ref={headerRef} className="home-header--fixed">
      <div className="home-header__brand">
        <img
          className="home-header__wordmark home-header__wordmark--light"
          src="/stingrayMusic.svg"
          alt=""
          width="160"
          height="32"
          loading="eager"
          decoding="async"
        />
        <img
          className="home-header__wordmark home-header__wordmark--dark"
          src="/stingrayMusicDark.svg"
          alt=""
          width="160"
          height="32"
          loading="eager"
          decoding="async"
        />
      </div>
      <div className="home-header__actions">
        <Button
          variant="cta"
          onClick={onUpgrade}
          startIcon={<UpgradeStartIcon />}
        >
          Upgrade
        </Button>
      </div>
    </header>
  );
}
