import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import ScreenHeader, {
  ScreenHeaderChevronBack,
} from "../components/ScreenHeader";
import { useUserType } from "../context/UserTypeContext";
import "./Subscription.css";

const PROVIDER_SSO_URL =
  "https://login.stingray.com/welcome/topproviders?client_id=zBUI4wDBNR1Ikz8L&language=en&redirect_uri=https://webplayer.stingray.com%2Fen%2Fplay%2Faccount-settings%2Faccount%3Fstate%3D&response_type=code";

const TERMS_URL = "https://legal.stingray.com/en/terms-and-conditions";
const PRIVACY_URL = "https://www.stingray.com/en/privacy-policy";

const BENEFITS = [
  "No ads",
  "Superior audio quality",
  "Like your favorite channels",
  "Unlimited skips",
];

const USER_TYPE_OPTIONS = [
  { value: "guest", label: "Guest" },
  { value: "provided", label: "Provided" },
  { value: "subscribed", label: "Subscribed" },
];

function IconOpenInNew({ className = "", size = 16 }) {
  return (
    <svg
      className={className}
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden={true}
    >
      <path d="M19 19H5V5h7V3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2v-7h-2v7zM14 3v2h3.59l-9.83 9.83 1.41 1.41L19 6.41V10h2V3h-7z" />
    </svg>
  );
}

/** Subscription (Upgrade) — Figma `220:40551`; CTAs set prototype user type and return Home. */
export default function Subscription() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();

  const goBack = () => navigate(-1);

  const handleSubscribe = () => {
    setUserType("subscribed");
    navigate("/");
  };

  const handleProvider = () => {
    setUserType("provided");
    window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
    navigate("/");
  };

  return (
    <main className="app-shell app-shell--footer-fixed subscription-screen">
      <ScreenHeader
        title="Upgrade"
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="subscription-screen__scroll">
        <div className="subscription-screen__inner">
          <div className="subscription-screen__hero">
            <h1 className="subscription-screen__title">Enjoy Premium</h1>
            <p className="subscription-screen__price-intro">For only</p>
            <p className="subscription-screen__price">$3.99 / month!</p>
          </div>

          <ul className="subscription-screen__benefits">
            {BENEFITS.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>

          <div className="subscription-screen__actions">
            <Button
              variant="subscribe-primary"
              className="subscription-screen__btn-primary"
              onClick={handleSubscribe}
            >
              Upgrade now
            </Button>

            <div className="subscription-screen__provider-block">
              <p className="subscription-screen__provider-label text-muted">
                Get access with my provider
              </p>
              <Button
                variant="secondary"
                className="subscription-screen__btn-secondary"
                onClick={handleProvider}
                endIcon={<IconOpenInNew size={30} />}
              >
                Select provider
              </Button>
            </div>
          </div>

          <div className="subscription-screen__legal">
            <p className="subscription-screen__legal-text">
              Payment will be charged to your [platform] account at confirmation
              of purchase. Subscription automatically renews unless auto-renew
              is turned off at least 24 hours before the end of the current
              period. Your [platform] account will be charged for renewal within
              24 hours prior to the end of the current period. You may manage
              your subscription to turn off auto-renewal, by clicking on My
              Account &gt; Manage Subscription after purchase.
            </p>
            <p className="subscription-screen__legal-text">
              * Some advertising exclusions apply
            </p>
            <p className="subscription-screen__legal-text">
              For more information about your subscription fees and renewals,
              please consult our Terms and Conditions.
            </p>

            <div className="subscription-screen__legal-links">
              <a
                className="subscription-screen__legal-link"
                href={TERMS_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms and Conditions
                <IconOpenInNew size={12} />
              </a>
              <a
                className="subscription-screen__legal-link"
                href={PRIVACY_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
                <IconOpenInNew size={12} />
              </a>
            </div>
          </div>

          <div
            className="subscription-screen__prototype"
            role="group"
            aria-label="Prototype: preview user type"
          >
            <p className="subscription-screen__prototype-label">Preview as</p>
            <div className="subscription-screen__prototype-toggles">
              {USER_TYPE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={
                    userType === value
                      ? "subscription-screen__prototype-btn subscription-screen__prototype-btn--on"
                      : "subscription-screen__prototype-btn"
                  }
                  onClick={() => setUserType(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
