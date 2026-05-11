import Button from "./Button";
import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
  PROVIDER_SSO_URL,
  STINGRAY_ACCOUNT_LOGIN_URL,
  STINGRAY_SIGNUP_EMAIL_URL,
} from "../constants/externalLinks";
import { INFO_ACCOUNT_COPY } from "../constants/infoAccount";
import { useUserType } from "../context/UserTypeContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import "./InfoAccountSection.css";

function IconOpenInNew({ size = 20 }) {
  return (
    <svg
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

function ExternalOutlineButton({ href, children, endIcon = true, onClick }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="btn btn--secondary info-account__action-full"
      target="_blank"
      rel="noopener noreferrer"
    >
      <span className="btn__label">{children}</span>
      {endIcon ? (
        <span className="btn__icon btn__icon--end">
          <IconOpenInNew />
        </span>
      ) : null}
    </a>
  );
}

/**
 * Account block for Info tab — Figma `5518:74009` (four user types).
 */
export default function InfoAccountSection() {
  const { userType, setUserType } = useUserType();
  const goUpgrade = useGoUpgrade();
  const logOut = () => setUserType("guest");

  const copy = INFO_ACCOUNT_COPY[userType] ?? INFO_ACCOUNT_COPY.guest;

  return (
    <div className="info-account">
      <p className="info-account__headline">{copy.headline}</p>

      {copy.subline ? (
        <p className="info-account__subline">{copy.subline}</p>
      ) : null}

      {userType === "freeProvided" ? (
        <span className="info-account__provider-logos">
          <img
            src={PROVIDER_LOGO_LIGHT_URL}
            alt=""
            className="info-account__provider-logo info-account__provider-logo--light"
            width={201}
            height={63}
          />
          <img
            src={PROVIDER_LOGO_DARK_URL}
            alt=""
            className="info-account__provider-logo info-account__provider-logo--dark"
            width={201}
            height={63}
          />
        </span>
      ) : null}

      {userType === "guest" ? (
        <div className="info-account__actions info-account__actions--grouped">
          <div className="info-account__action-group">
            <Button
              variant="subscribe-primary"
              className="info-account__action-full"
              onClick={goUpgrade}
            >
              Upgrade
            </Button>
            <Button
              variant="secondary"
              className="info-account__action-full"
              onClick={() => {
                console.log("Restore purchase");
              }}
            >
              Restore purchase
            </Button>
          </div>
          <div className="info-account__action-group">
            <ExternalOutlineButton
              href={STINGRAY_SIGNUP_EMAIL_URL}
              onClick={() => setUserType("freeStingray")}
            >
              Create account
            </ExternalOutlineButton>
            <a
              href={STINGRAY_ACCOUNT_LOGIN_URL}
              className="btn btn--secondary info-account__action-full"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setUserType("freeStingray")}
            >
              <span className="btn__label">Log in</span>
            </a>
          </div>
          <div className="info-account__action-group">
            <ExternalOutlineButton href={PROVIDER_SSO_URL}>
              Provider access
            </ExternalOutlineButton>
          </div>
        </div>
      ) : null}

      {userType === "subscribed" ? (
        <div className="info-account__actions">
          <ExternalOutlineButton href={STINGRAY_ACCOUNT_LOGIN_URL}>
            Manage account
          </ExternalOutlineButton>
          <Button
            variant="secondary"
            className="info-account__action-full"
            onClick={logOut}
          >
            Log out
          </Button>
        </div>
      ) : null}

      {userType === "freeProvided" ? (
        <div className="info-account__actions">
          <ExternalOutlineButton href={PROVIDER_SSO_URL}>
            Change provider
          </ExternalOutlineButton>
          <Button
            variant="secondary"
            className="info-account__action-full"
            onClick={logOut}
          >
            Log out
          </Button>
        </div>
      ) : null}

      {userType === "freeStingray" ? (
        <div className="info-account__actions info-account__actions--grouped">
          <div className="info-account__action-group">
            <Button
              variant="subscribe-primary"
              className="info-account__action-full"
              onClick={goUpgrade}
            >
              Upgrade
            </Button>
            <Button
              variant="secondary"
              className="info-account__action-full"
              onClick={logOut}
            >
              Log out
            </Button>
          </div>
          <div className="info-account__action-group">
            <ExternalOutlineButton href={PROVIDER_SSO_URL}>
              Provider access
            </ExternalOutlineButton>
          </div>
        </div>
      ) : null}
    </div>
  );
}
