import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { STINGRAY_SIGNUP_EMAIL_URL } from "@sm-mpr/shared/constants/externalLinks.js";
import FocusableButton from "../focus/FocusableButton.jsx";
import { useAccountRequiredDialog } from "../../context/AccountRequiredDialogContext.jsx";
import { useUserType } from "../../context/UserTypeContext.jsx";
import { useTvStackedDialogOpenFlag } from "../../utils/tvStackedDialogFocus.js";
import "./TvAccountRequiredDialog.css";

/** @type {Record<string, { title: string; body: string }>} */
const ACCOUNT_REQUIRED_COPY = {
  favorites: {
    title: "Add to Favorites",
    body: "Create free account or log in to add music channels and radio stations to your favorites.",
  },
  podcastSubscribe: {
    title: "Subscribe to podcasts",
    body: "Create free account or log in to subscribe to shows and see new episodes in your library.",
  },
  episodeBookmark: {
    title: "Bookmark episodes",
    body: "Create free account or log in to bookmark episodes for quick access later.",
  },
  episodeOfflineDownload: {
    title: "Download episodes",
    body: "Create free account or log in to download episodes for offline listening.",
  },
};

const BUTTON = {
  create: 0,
  login: 1,
  dismiss: 2,
};

const BUTTON_COUNT = 3;

/**
 * Guest blocked from a user-library action — sign in / create account.
 * D-pad is trapped to the three action buttons while open.
 */
export default function TvAccountRequiredDialog() {
  const navigate = useNavigate();
  const { setUserType } = useUserType();
  const {
    accountRequiredDialogOpen,
    accountRequiredDialogVariant,
    dismissAccountRequiredDialog,
  } = useAccountRequiredDialog();

  const [focusedButton, setFocusedButton] = useState(BUTTON.dismiss);
  const focusedButtonRef = useRef(BUTTON.dismiss);
  const buttonRefs = useRef(
    /** @type {(HTMLButtonElement | null)[]} */ ([null, null, null]),
  );

  useTvStackedDialogOpenFlag(accountRequiredDialogOpen);

  const copy =
    ACCOUNT_REQUIRED_COPY[accountRequiredDialogVariant] ??
    ACCOUNT_REQUIRED_COPY.favorites;

  const focusButton = useCallback((index) => {
    const next = Math.min(Math.max(index, 0), BUTTON_COUNT - 1);
    focusedButtonRef.current = next;
    setFocusedButton(next);
    buttonRefs.current[next]?.focus({ preventScroll: true });
  }, []);

  const createFreeAccount = useCallback(() => {
    dismissAccountRequiredDialog();
    setUserType("freeStingray");
    window.open(STINGRAY_SIGNUP_EMAIL_URL, "_blank", "noopener,noreferrer");
  }, [dismissAccountRequiredDialog, setUserType]);

  const goLogin = useCallback(() => {
    dismissAccountRequiredDialog();
    navigate("/login");
  }, [dismissAccountRequiredDialog, navigate]);

  const activateFocusedButton = useCallback(() => {
    const current = focusedButtonRef.current;
    if (current === BUTTON.create) {
      createFreeAccount();
      return;
    }
    if (current === BUTTON.login) {
      goLogin();
      return;
    }
    dismissAccountRequiredDialog();
  }, [createFreeAccount, goLogin, dismissAccountRequiredDialog]);

  useEffect(() => {
    if (!accountRequiredDialogOpen) return undefined;
    focusedButtonRef.current = BUTTON.dismiss;
    setFocusedButton(BUTTON.dismiss);
    const frameId = requestAnimationFrame(() => {
      buttonRefs.current[BUTTON.dismiss]?.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frameId);
  }, [accountRequiredDialogOpen]);

  useEffect(() => {
    if (!accountRequiredDialogOpen) return undefined;

    const onKeyDown = (event) => {
      const key = event.key;
      const isNav =
        key === "ArrowLeft" ||
        key === "ArrowRight" ||
        key === "ArrowUp" ||
        key === "ArrowDown";
      const isActivate = key === "Enter" || key === " " || key === "Select";
      const isBack = key === "Escape" || key === "Backspace";

      if (!isNav && !isActivate && !isBack) return;

      event.preventDefault();
      event.stopImmediatePropagation();

      if (isBack) {
        dismissAccountRequiredDialog();
        return;
      }

      if (isActivate) {
        activateFocusedButton();
        return;
      }

      const delta =
        key === "ArrowRight" || key === "ArrowDown" ? 1 : -1;
      focusButton(focusedButtonRef.current + delta);
    };

    window.addEventListener("keydown", onKeyDown, true);
    return () => window.removeEventListener("keydown", onKeyDown, true);
  }, [
    accountRequiredDialogOpen,
    activateFocusedButton,
    dismissAccountRequiredDialog,
    focusButton,
  ]);

  if (!accountRequiredDialogOpen) return null;

  return (
    <div
      className="tv-account-required-dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tv-account-required-title"
    >
      <div className="tv-account-required-dialog__backdrop" aria-hidden={true} />
      <div className="tv-account-required-dialog__panel">
        <h2 id="tv-account-required-title" className="tv-account-required-dialog__title">
          {copy.title}
        </h2>
        <p className="tv-account-required-dialog__body">{copy.body}</p>
        <div className="tv-account-required-dialog__actions">
          <FocusableButton
            ref={(node) => {
              buttonRefs.current[BUTTON.create] = node;
            }}
            type="button"
            className="tv-account-required-dialog__btn tv-account-required-dialog__btn--primary"
            focused={focusedButton === BUTTON.create}
            onClick={createFreeAccount}
          >
            Create free account
          </FocusableButton>
          <FocusableButton
            ref={(node) => {
              buttonRefs.current[BUTTON.login] = node;
            }}
            type="button"
            className="tv-account-required-dialog__btn"
            focused={focusedButton === BUTTON.login}
            onClick={goLogin}
          >
            Log in
          </FocusableButton>
          <FocusableButton
            ref={(node) => {
              buttonRefs.current[BUTTON.dismiss] = node;
            }}
            type="button"
            className="tv-account-required-dialog__btn"
            focused={focusedButton === BUTTON.dismiss}
            onClick={dismissAccountRequiredDialog}
          >
            Not now
          </FocusableButton>
        </div>
      </div>
    </div>
  );
}
