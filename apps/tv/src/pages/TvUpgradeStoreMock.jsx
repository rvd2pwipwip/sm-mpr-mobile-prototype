import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import "./TvUpgradeStoreMock.css";

/**
 * Mock App / Play Store subscription sheet — mobile `UpgradeStoreMock.jsx`.
 * Tap anywhere (or activate focused control) to finish as subscribed.
 */
export default function TvUpgradeStoreMock() {
  const navigate = useNavigate();
  const { setUserType } = useUserType();
  const buttonRef = useRef(/** @type {HTMLButtonElement | null} */ (null));

  const completeJourney = () => {
    setUserType("subscribed");
    navigate("/", { replace: true });
  };

  useEffect(() => {
    const frameId = requestAnimationFrame(() => {
      buttonRef.current?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frameId);
  }, []);

  return (
    <FocusableButton
      ref={buttonRef}
      type="button"
      className="tv-upgrade-store-mock"
      focused={true}
      aria-label="Prototype: activate after store subscription to return home as subscribed"
      onClick={completeJourney}
    >
      <span className="tv-upgrade-store-mock__bg" aria-hidden={true}>
        <img
          src="/upgradeStoreMock.png"
          alt=""
          className="tv-upgrade-store-mock__img"
          width="762"
          height="1021"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="tv-upgrade-store-mock__titles">
        <span className="tv-upgrade-store-mock__title-line">App/Play Store</span>
        <span className="tv-upgrade-store-mock__title-line">Subscription</span>
      </span>
    </FocusableButton>
  );
}
