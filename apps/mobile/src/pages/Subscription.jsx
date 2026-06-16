import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import OpenInNewIcon from "../components/OpenInNewIcon";
import ScreenHeader, {
  ScreenHeaderChevronBack,
} from "../components/ScreenHeader";
import { PROVIDER_SSO_URL, STINGRAY_SIGNUP_EMAIL_URL } from "../constants/externalLinks";
import { LEGAL_LINKS } from "../constants/legalLinks";
import { RESTORE_PURCHASE_PROTOTYPE_DIALOG } from "../constants/infoAccount";
import {
  CONTENT_PROFILE_MODE,
  useContentProfile,
} from "../context/ContentProfileContext";
import { useListenHistory } from "../context/ListenHistoryContext";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { useUserType } from "../context/UserTypeContext";
import { CLEAR_MORE_DEMO_ITEM_COUNT } from "@sm-mpr/shared/utils/seedClearMoreSwimlaneDemo.js";
import { useRestorePurchasePrototypeDialog } from "../hooks/useRestorePurchasePrototypeDialog";
import RestorePurchasePrototypeDialog from "../components/RestorePurchasePrototypeDialog";
import "./Subscription.css";

const BENEFITS = [
  "No ads",
  "Superior audio quality",
  "Like your favorite channels",
  "Unlimited skips",
];

const USER_TYPE_OPTIONS = [
  { value: "guest", label: "Guest" },
  { value: "freeStingray", label: "Free Stingray" },
  { value: "freeProvided", label: "Free provider" },
  { value: "subscribed", label: "Subscribed" },
];

const CONTENT_PROFILE_OPTIONS = [
  { value: CONTENT_PROFILE_MODE.musicOnly, label: "Music only" },
  { value: CONTENT_PROFILE_MODE.fullMpr, label: "Full MPR" },
];

/** Subscription (Upgrade) — Figma `220:40551`; "Upgrade now" opens Stingray signup then `/upgrade/store` mock (`9548:86399`). */
export default function Subscription() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();
  const { contentProfileMode, setContentProfileMode } = useContentProfile();
  const { seedClearMoreDemo: seedListenHistoryDemo } = useListenHistory();
  const { seedClearMoreDemo: seedPodcastLibraryDemo } = usePodcastUserState();
  const [clearMoreSeedStatus, setClearMoreSeedStatus] = useState("");
  const {
    dialogOpen: restoreDialogOpen,
    working: restoreWorking,
    triggerRestore,
    closeDialog: closeRestoreDialog,
  } = useRestorePurchasePrototypeDialog();

  const goBack = () => navigate(-1);

  const handleSubscribe = () => {
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
    navigate("/upgrade/store");
  };

  const handleProvider = () => {
    setUserType("freeProvided");
    window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
    navigate("/");
  };

  const handleSeedClearMoreSwimlanes = () => {
    seedListenHistoryDemo();
    seedPodcastLibraryDemo();
    setClearMoreSeedStatus(
      `Seeded ${CLEAR_MORE_DEMO_ITEM_COUNT} random items per rail. Open Home (Listen again), Search (Limited podcasts), or My Library (Full MPR).`,
    );
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
            <Button
              variant="secondary"
              className="subscription-screen__btn-restore"
              disabled={restoreWorking}
              onClick={triggerRestore}
            >
              {restoreWorking
                ? RESTORE_PURCHASE_PROTOTYPE_DIALOG.workingLabel
                : RESTORE_PURCHASE_PROTOTYPE_DIALOG.buttonLabel}
            </Button>

            <div className="subscription-screen__provider-block">
              <p className="subscription-screen__provider-label text-muted">
                Get access with my provider
              </p>
              <Button
                variant="secondary"
                className="subscription-screen__btn-secondary"
                onClick={handleProvider}
                endIcon={<OpenInNewIcon />}
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
              {LEGAL_LINKS.map(({ id, label, href }) => (
                <a
                  key={id}
                  className="subscription-screen__legal-link"
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                  <OpenInNewIcon size={12} />
                </a>
              ))}
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

          <div
            className="subscription-screen__prototype"
            role="group"
            aria-label="Prototype: content profile"
          >
            <p className="subscription-screen__prototype-label">
              Content profile
            </p>
            <div className="subscription-screen__prototype-toggles">
              {CONTENT_PROFILE_OPTIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={
                    contentProfileMode === value
                      ? "subscription-screen__prototype-btn subscription-screen__prototype-btn--on"
                      : "subscription-screen__prototype-btn"
                  }
                  onClick={() => setContentProfileMode(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div
            className="subscription-screen__prototype"
            role="group"
            aria-label="Prototype: seed Clear and More swimlanes"
          >
            <p className="subscription-screen__prototype-label">
              Seed Clear / More swimlanes
            </p>
            <p className="subscription-screen__prototype-lead">
              Fills listen history (music, podcast, radio) and podcast library
              rails with {CLEAR_MORE_DEMO_ITEM_COUNT} random catalog items each.
              Use <strong>Full MPR</strong>, then visit Home, Limited podcasts
              browse, or My Library.
            </p>
            <Button
              variant="secondary"
              className="subscription-screen__btn-secondary subscription-screen__prototype-seed-btn"
              onClick={handleSeedClearMoreSwimlanes}
            >
              Populate Clear / More demo data
            </Button>
            {clearMoreSeedStatus ? (
              <p
                className="subscription-screen__prototype-status"
                aria-live="polite"
              >
                {clearMoreSeedStatus}
              </p>
            ) : null}
          </div>
        </div>
      </div>

      <RestorePurchasePrototypeDialog
        open={restoreDialogOpen}
        onClose={closeRestoreDialog}
      />
    </main>
  );
}
