import { useNavigate } from "react-router-dom";
import Button from "./Button";
import ExternalSecondaryLink from "./ExternalSecondaryLink";
import OpenInNewIcon from "./OpenInNewIcon";
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

/**
 * Account block for Info tab — Figma `5518:74009` (four user types).
 */
export default function InfoAccountSection() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();
  const goUpgrade = useGoUpgrade();
  const logOut = () => setUserType("guest");

  const mockProviderAccess = () => {
    setUserType("freeProvided");
    window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
    navigate("/");
  };

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
            <ExternalSecondaryLink
              href={STINGRAY_SIGNUP_EMAIL_URL}
              className="info-account__action-full"
              onClick={() => setUserType("freeStingray")}
            >
              Create account
            </ExternalSecondaryLink>
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
            <Button
              variant="secondary"
              className="info-account__action-full"
              onClick={mockProviderAccess}
              endIcon={<OpenInNewIcon />}
            >
              Provider access
            </Button>
          </div>
        </div>
      ) : null}

      {userType === "subscribed" ? (
        <div className="info-account__actions">
          <ExternalSecondaryLink
            href={STINGRAY_ACCOUNT_LOGIN_URL}
            className="info-account__action-full"
          >
            Manage account
          </ExternalSecondaryLink>
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
          <ExternalSecondaryLink
            href={PROVIDER_SSO_URL}
            className="info-account__action-full"
          >
            Change provider
          </ExternalSecondaryLink>
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
            <ExternalSecondaryLink
              href={PROVIDER_SSO_URL}
              className="info-account__action-full"
            >
              Provider access
            </ExternalSecondaryLink>
          </div>
        </div>
      ) : null}
    </div>
  );
}
