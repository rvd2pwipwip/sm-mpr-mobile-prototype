import { useLayoutEffect, useRef } from "react";
import { useUserType } from "../context/UserTypeContext";
import { PROVIDER_LOGO_DARK_URL, PROVIDER_LOGO_LIGHT_URL } from "../constants/externalLinks";
import { showUpgradeCallToAction } from "../utils/showVisualAds";
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

function ProviderLogoPair() {
  return (
    <>
      <img
        className="home-header__provider-logo home-header__provider-logo--light"
        src={PROVIDER_LOGO_LIGHT_URL}
        alt=""
        width={201}
        height={63}
        loading="eager"
        decoding="async"
      />
      <img
        className="home-header__provider-logo home-header__provider-logo--dark"
        src={PROVIDER_LOGO_DARK_URL}
        alt=""
        width={201}
        height={63}
        loading="eager"
        decoding="async"
      />
    </>
  );
}

/**
 * Home top bar: wordmark; guest + freeStingray see Upgrade, otherwise provider logo (freeProvided), subscribed solo wordmark.
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
        {showUpgradeCallToAction(userType) ? (
          <UpgradeButton onClick={onUpgrade} />
        ) : (
          <ProviderLogoPair />
        )}
      </div>
    </header>
  );
}
