import { useLayoutEffect, useRef } from "react";
import { useUserType } from "../context/UserTypeContext";
import UpgradeButton from "./UpgradeButton";
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

function WordmarkPair() {
  return (
    <>
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
    </>
  );
}

/**
 * Home top bar: wordmark; guest sees Upgrade — provided / subscribed per `docs/Home-screen-story.md`.
 */
export default function HomeHeader({ onUpgrade }) {
  const headerRef = useHomeHeaderOffset();
  const { userType } = useUserType();

  if (userType === "subscribed") {
    return (
      <header ref={headerRef} className="home-header--fixed home-header--subscribed">
        <div className="home-header__brand home-header__brand--solo">
          <WordmarkPair />
        </div>
      </header>
    );
  }

  return (
    <header ref={headerRef} className="home-header--fixed">
      <div className="home-header__brand">
        <WordmarkPair />
      </div>
      <div className="home-header__actions">
        {userType === "guest" ? (
          <UpgradeButton onClick={onUpgrade} />
        ) : (
          <span className="home-header__provider-pill" title="Provider access (prototype)">
            Provider
          </span>
        )}
      </div>
    </header>
  );
}
