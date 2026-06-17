import { useNavigate } from "react-router-dom";
import { STINGRAY_SIGNUP_EMAIL_URL } from "@sm-mpr/shared/constants/externalLinks.js";
import { PROVIDER_SSO_URL } from "../../../mobile/src/constants/externalLinks.js";
import { LEGAL_LINKS } from "../../../mobile/src/constants/legalLinks.js";
import { RESTORE_PURCHASE_PROTOTYPE_DIALOG } from "../../../mobile/src/constants/infoAccount.js";
import TvDrillScreenHeader from "../components/drill/TvDrillScreenHeader.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import TvRestorePurchasePrototypeDialog from "../components/info/TvRestorePurchasePrototypeDialog.jsx";
import TvUpgradeButton from "../components/TvUpgradeButton.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useRestorePurchasePrototypeDialog } from "../hooks/useRestorePurchasePrototypeDialog.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "../hooks/useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "../hooks/useTvVerticalGroupScroll.js";
import "../components/drill/TvDrillScreen.css";
import "./TvSubscription.css";

const BENEFITS = [
  "No ads",
  "Superior audio quality",
  "Like your favorite channels",
  "Unlimited skips",
];

const ACTION_GROUP = 0;
const SLOT_UPGRADE = 0;
const SLOT_RESTORE = 1;
const SLOT_PROVIDER = 2;

/**
 * Subscription (Upgrade) stub — mobile `Subscription.jsx` without prototype tier blocks.
 * Tier preview lives on `/settings/user-type` (title easter egg on Info screens, Phase 1).
 */
export default function TvSubscription() {
  const navigate = useNavigate();
  const { setUserType } = useUserType();
  const {
    dialogOpen: restoreDialogOpen,
    working: restoreWorking,
    triggerRestore,
    closeDialog: closeRestoreDialog,
  } = useRestorePurchasePrototypeDialog();

  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("tv-subscription", {
    groupCount: 1,
    itemCounts: [3],
    defaultGroupIndex: 0,
    defaultItemIndex: 0,
  });

  const handleSubscribe = () => {
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
    navigate("/upgrade/store");
  };

  const handleProvider = () => {
    setUserType("freeProvided");
    window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
    navigate("/");
  };

  return (
    <div ref={shellRef} className="tv-drill-screen tv-subscription tv-screen-overlay">
      <TvDrillScreenHeader title="Upgrade" headerRef={headerRef} />

      <div className="tv-drill-screen__scroll tv-home__scroll tv-screen-overlay__scroll">
        <div className="tv-home__scroll-inner tv-subscription__inner">
          <div className="tv-subscription__column">
            <div className="tv-subscription__hero">
              <h2 className="tv-subscription__title">Enjoy Premium</h2>
              <p className="tv-subscription__price-intro">For only</p>
              <p className="tv-subscription__price">$3.99 / month!</p>
            </div>

            <ul className="tv-subscription__benefits">
              {BENEFITS.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>

            <div className="tv-subscription__actions">
              <KeyboardWrapper
                ref={(node) => registerItemRef(ACTION_GROUP, SLOT_UPGRADE, node)}
                onSelect={handleSubscribe}
                onUp={handleMoveUp}
                onDown={handleMoveDown}
                onLeft={handleMoveLeft}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <TvUpgradeButton
                    {...focusProps}
                    variant="subscribe"
                    label="Upgrade now"
                    focused={isItemFocused(ACTION_GROUP, SLOT_UPGRADE)}
                    className="tv-subscription__btn-primary"
                  />
                )}
              </KeyboardWrapper>

              <KeyboardWrapper
                ref={(node) => registerItemRef(ACTION_GROUP, SLOT_RESTORE, node)}
                onSelect={triggerRestore}
                onUp={handleMoveUp}
                onDown={handleMoveDown}
                onLeft={handleMoveLeft}
                onRight={handleMoveRight}
              >
                {(focusProps) => (
                  <FocusableButton
                    {...focusProps}
                    type="button"
                    className="tv-subscription__btn-secondary focusable-button"
                    focused={isItemFocused(ACTION_GROUP, SLOT_RESTORE)}
                    disabled={restoreWorking}
                  >
                    {restoreWorking
                      ? RESTORE_PURCHASE_PROTOTYPE_DIALOG.workingLabel
                      : RESTORE_PURCHASE_PROTOTYPE_DIALOG.buttonLabel}
                  </FocusableButton>
                )}
              </KeyboardWrapper>

              <div className="tv-subscription__provider-block">
                <p className="tv-subscription__provider-label">
                  Get access with my provider
                </p>
                <KeyboardWrapper
                  ref={(node) =>
                    registerItemRef(ACTION_GROUP, SLOT_PROVIDER, node)
                  }
                  onSelect={handleProvider}
                  onUp={handleMoveUp}
                  onDown={handleMoveDown}
                  onLeft={handleMoveLeft}
                  onRight={handleMoveRight}
                >
                  {(focusProps) => (
                    <FocusableButton
                      {...focusProps}
                      type="button"
                      className="tv-subscription__btn-secondary focusable-button"
                      focused={isItemFocused(ACTION_GROUP, SLOT_PROVIDER)}
                    >
                      Select provider
                    </FocusableButton>
                  )}
                </KeyboardWrapper>
              </div>
            </div>

            <div className="tv-subscription__legal">
              <p className="tv-subscription__legal-text">
                Payment will be charged to your [platform] account at confirmation
                of purchase. Subscription automatically renews unless auto-renew is
                turned off at least 24 hours before the end of the current period.
                Your [platform] account will be charged for renewal within 24 hours
                prior to the end of the current period. You may manage your
                subscription to turn off auto-renewal, by clicking on My Account
                &gt; Manage Subscription after purchase.
              </p>
              <p className="tv-subscription__legal-text">
                * Some advertising exclusions apply
              </p>
              <p className="tv-subscription__legal-text">
                For more information about your subscription fees and renewals,
                please consult our Terms and Conditions.
              </p>

              <div className="tv-subscription__legal-links">
                {LEGAL_LINKS.map(({ id, label, href }) => (
                  <a
                    key={id}
                    className="tv-subscription__legal-link"
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    tabIndex={-1}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <TvRestorePurchasePrototypeDialog
        open={restoreDialogOpen}
        onClose={closeRestoreDialog}
      />
    </div>
  );
}
