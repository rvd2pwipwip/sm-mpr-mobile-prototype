import { useNavigate } from "react-router-dom";
import { useUserType } from "../context/UserTypeContext";
import "./UpgradeStoreMock.css";

/**
 * Mock App / Play Store subscription sheet — Figma `9548:86399`.
 * Prototype: after Stingray account creation (external), user lands here; tap anywhere to finish as subscribed.
 */
export default function UpgradeStoreMock() {
  const navigate = useNavigate();
  const { setUserType } = useUserType();

  const completeJourney = () => {
    setUserType("subscribed");
    navigate("/", { replace: true });
  };

  return (
    <button
      type="button"
      className="upgrade-store-mock"
      onClick={completeJourney}
      aria-label="Prototype: tap anywhere after store subscription to return home as subscribed"
    >
      <span className="upgrade-store-mock__bg" aria-hidden={true}>
        <img
          src="/upgradeStoreMock.png"
          alt=""
          className="upgrade-store-mock__img"
          width="762"
          height="1021"
          loading="eager"
          decoding="async"
        />
      </span>
      <span className="upgrade-store-mock__titles">
        <span className="upgrade-store-mock__title-line">App/Play Store</span>
        <span className="upgrade-store-mock__title-line">Subscription</span>
      </span>
    </button>
  );
}
