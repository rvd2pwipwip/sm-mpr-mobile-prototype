import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
  STINGRAY_ACCOUNT_LOGIN_URL,
} from "@sm-mpr/shared/constants/externalLinks.js";
import { PROVIDER_SSO_URL } from "../../../../mobile/src/constants/externalLinks.js";
import {
  INFO_ACCOUNT_COPY,
  RESTORE_PURCHASE_PROTOTYPE_DIALOG,
} from "../../../../mobile/src/constants/infoAccount.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvButton from "../TvButton.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import { useGoUpgrade } from "../../hooks/useGoUpgrade.js";
import { useRestorePurchasePrototypeDialog } from "../../hooks/useRestorePurchasePrototypeDialog.js";
import {
  ACCOUNT_ACTION_ITEM_INDEX,
  TV_INFO_ACCOUNT_ACTIONS,
} from "../../utils/tvInfoAccountFocus.js";
import TvRestorePurchasePrototypeDialog from "./TvRestorePurchasePrototypeDialog.jsx";
import "./TvInfoAccountSection.css";

const ACTION_LABELS = {
  upgrade: "Upgrade",
  restore: RESTORE_PURCHASE_PROTOTYPE_DIALOG.buttonLabel,
  createAccount: "Create account",
  login: "Log in",
  providerAccess: "Provider access",
  logout: "Log out",
  manageAccount: "Manage account",
  changeProvider: "Change provider",
};

const EXTERNAL_ACTIONS = new Set([
  "providerAccess",
  "manageAccount",
  "changeProvider",
]);

function actionLabel(actionId, restoreWorking) {
  if (actionId === "restore" && restoreWorking) {
    return RESTORE_PURCHASE_PROTOTYPE_DIALOG.workingLabel;
  }
  return ACTION_LABELS[actionId] ?? actionId;
}

/**
 * Account block for TV Info screens — mobile `InfoAccountSection` (four user types).
 */
export default function TvInfoAccountSection({
  registerItemRef,
  isItemFocused,
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
}) {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();
  const goUpgrade = useGoUpgrade();
  const {
    dialogOpen: restoreDialogOpen,
    working: restoreWorking,
    triggerRestore,
    closeDialog: closeRestoreDialog,
  } = useRestorePurchasePrototypeDialog();

  const copy = INFO_ACCOUNT_COPY[userType] ?? INFO_ACCOUNT_COPY.guest;
  const actionIds = TV_INFO_ACCOUNT_ACTIONS[userType] ?? [];

  const handlers = useMemo(
    () => ({
      upgrade: goUpgrade,
      restore: triggerRestore,
      createAccount: () => navigate("/create-account"),
      login: () => navigate("/login"),
      providerAccess: () => {
        setUserType("freeProvided");
        window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
        navigate("/");
      },
      logout: () => setUserType("guest"),
      manageAccount: () => {
        window.open(STINGRAY_ACCOUNT_LOGIN_URL, "_blank", "noopener,noreferrer");
      },
      changeProvider: () => {
        window.open(PROVIDER_SSO_URL, "_blank", "noopener,noreferrer");
      },
    }),
    [goUpgrade, navigate, setUserType, triggerRestore],
  );

  const renderAction = (actionId, groupIndex) => {
    const focused = isItemFocused(groupIndex, ACCOUNT_ACTION_ITEM_INDEX);
    const isUpgrade = actionId === "upgrade";
    const isRestore = actionId === "restore";
    const showExternal = EXTERNAL_ACTIONS.has(actionId);
    const onSelect = handlers[actionId];

    return (
      <KeyboardWrapper
        key={actionId}
        ref={(node) =>
          registerItemRef(groupIndex, ACCOUNT_ACTION_ITEM_INDEX, node)
        }
        onSelect={onSelect}
        onUp={handleMoveUp}
        onDown={handleMoveDown}
        onLeft={handleMoveLeft}
        onRight={handleMoveRight}
      >
        {(focusProps) => (
          <TvButton
            {...focusProps}
            variant={isUpgrade ? "subscribe" : "secondary"}
            label={actionLabel(actionId, restoreWorking)}
            focused={focused}
            disabled={isRestore && restoreWorking}
            iconSrc={isUpgrade ? "/upgrade.svg" : null}
            endIconMaskVariant={showExternal ? "open-in-new" : null}
            className="tv-info-account__action"
          />
        )}
      </KeyboardWrapper>
    );
  };

  const guestGrouped =
    userType === "guest" || userType === "freeStingray";

  let groupIndex = 0;

  const renderGuestLayout = () => {
    if (userType === "guest") {
      return (
        <div className="tv-info-account__actions tv-info-account__actions--grouped">
          <div className="tv-info-account__action-group">
            {renderAction("upgrade", groupIndex++)}
            {/* {renderAction("restore", groupIndex++)} */}
          </div>
          <div className="tv-info-account__action-group">
            {renderAction("createAccount", groupIndex++)}
            {renderAction("login", groupIndex++)}
          </div>
          <div className="tv-info-account__action-group">
            {renderAction("providerAccess", groupIndex++)}
          </div>
        </div>
      );
    }

    return (
      <div className="tv-info-account__actions tv-info-account__actions--grouped">
        <div className="tv-info-account__action-group">
          {renderAction("upgrade", groupIndex++)}
          {/* {renderAction("restore", groupIndex++)} */}
          {renderAction("logout", groupIndex++)}
        </div>
        <div className="tv-info-account__action-group">
          {renderAction("providerAccess", groupIndex++)}
        </div>
      </div>
    );
  };

  return (
    <div className="tv-info-account">
      <p className="tv-info-account__headline">{copy.headline}</p>

      {copy.subline ? (
        <p className="tv-info-account__subline">{copy.subline}</p>
      ) : null}

      {userType === "freeProvided" ? (
        <span className="tv-info-account__provider-logos">
          <img
            src={PROVIDER_LOGO_LIGHT_URL}
            alt=""
            className="tv-info-account__provider-logo tv-info-account__provider-logo--light"
            width={201}
            height={63}
          />
          <img
            src={PROVIDER_LOGO_DARK_URL}
            alt=""
            className="tv-info-account__provider-logo tv-info-account__provider-logo--dark"
            width={201}
            height={63}
          />
        </span>
      ) : null}

      {guestGrouped ? (
        renderGuestLayout()
      ) : (
        <div className="tv-info-account__actions">
          {actionIds.map((actionId, index) => renderAction(actionId, index))}
        </div>
      )}

      {/* Restore purchases — hidden for now; hook + dialog kept for later.
      <TvRestorePurchasePrototypeDialog
        open={restoreDialogOpen}
        onClose={closeRestoreDialog}
      />
      */}
    </div>
  );
}
