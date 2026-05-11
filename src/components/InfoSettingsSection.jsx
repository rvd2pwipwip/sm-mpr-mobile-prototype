import { useCallback, useEffect, useState } from "react";
import AppStackedDialog from "./AppStackedDialog";
import SearchBrowseContentSwitcher from "./SearchBrowseContentSwitcher";
import {
  AUDIO_QUALITY_SEGMENTS,
  AUDIO_QUALITY_UPSELL,
  COMMUNICATION_PREFERENCES_HREF,
  INFO_AUTOPLAY_DESCRIPTION,
} from "../constants/infoSettings";
import { STINGRAY_ACCOUNT_LOGIN_URL } from "../constants/externalLinks";
import { useUserType } from "../context/UserTypeContext";
import { useGoUpgrade } from "../hooks/useGoUpgrade";
import "./InfoSettingsSection.css";

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

function hasTieredAudioQualityAccess(userType) {
  return userType === "subscribed" || userType === "freeProvided";
}

export default function InfoSettingsSection() {
  const { userType } = useUserType();
  const goUpgrade = useGoUpgrade();
  const hasAccess = hasTieredAudioQualityAccess(userType);

  const [autoplayEnabled, setAutoplayEnabled] = useState(true);
  const [audioQualityId, setAudioQualityId] = useState(
    AUDIO_QUALITY_SEGMENTS[0].id,
  );
  const [audioExpanded, setAudioExpanded] = useState(hasAccess);
  const [audioUpsellOpen, setAudioUpsellOpen] = useState(false);

  useEffect(() => {
    if (hasAccess) {
      setAudioExpanded(true);
    } else {
      setAudioExpanded(false);
    }
  }, [hasAccess]);

  const handleAudioRowClick = useCallback(() => {
    if (hasAccess) {
      setAudioExpanded((prev) => !prev);
    } else {
      setAudioUpsellOpen(true);
    }
  }, [hasAccess]);

  const closeAudioUpsell = useCallback(() => setAudioUpsellOpen(false), []);

  const onUpsellUpgrade = useCallback(() => {
    setAudioUpsellOpen(false);
    goUpgrade();
  }, [goUpgrade]);

  const onUpsellLogin = useCallback(() => {
    setAudioUpsellOpen(false);
    window.open(STINGRAY_ACCOUNT_LOGIN_URL, "_blank", "noopener,noreferrer");
  }, []);

  const commIsHttp = /^https?:\/\//i.test(COMMUNICATION_PREFERENCES_HREF);

  return (
    <div className="info-settings">
      <label className="info-settings__row info-settings__row--autoplay">
        <div className="info-settings__autoplay-copy">
          <span className="info-settings__label">Autoplay</span>
          <span className="info-settings__description">
            {INFO_AUTOPLAY_DESCRIPTION}
          </span>
        </div>
        <span className="info-settings__switch-slot">
          <input
            type="checkbox"
            className="info-settings__switch-input"
            checked={autoplayEnabled}
            onChange={(e) => setAutoplayEnabled(e.target.checked)}
          />
          <span className="info-settings__switch-track" aria-hidden={true} />
        </span>
      </label>

      <div className="info-settings__audio-wrap">
        <button
          type="button"
          className="info-settings__audio-row"
          onClick={handleAudioRowClick}
          aria-expanded={hasAccess ? audioExpanded : undefined}
          aria-haspopup={hasAccess ? undefined : "dialog"}
        >
          <span className="info-settings__audio-row-label">Audio Quality</span>
          <span
            className={[
              "info-settings__chevron",
              hasAccess && audioExpanded
                ? "info-settings__chevron--expanded"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-hidden={true}
          />
        </button>
        {hasAccess && audioExpanded ? (
          <div className="info-settings__audio-expanded">
            <SearchBrowseContentSwitcher
              mode="local"
              ariaLabel="Audio Quality"
              segments={AUDIO_QUALITY_SEGMENTS}
              activeId={audioQualityId}
              onActiveIdChange={setAudioQualityId}
            />
          </div>
        ) : null}
      </div>

      <a
        href={COMMUNICATION_PREFERENCES_HREF}
        className="info-settings__comm-link"
        {...(commIsHttp
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        <span className="info-settings__comm-label">
          Communication preferences
        </span>
        <span className="info-settings__comm-icon" aria-hidden={true}>
          <IconOpenInNew />
        </span>
      </a>

      <AppStackedDialog
        open={audioUpsellOpen}
        onClose={closeAudioUpsell}
        title={AUDIO_QUALITY_UPSELL.title}
        titleId="info-audio-upsell-title"
        descriptionId="info-audio-upsell-body"
        primaryButton={{
          label: AUDIO_QUALITY_UPSELL.primaryLabel,
          onClick: onUpsellUpgrade,
          variant: "subscribe-primary",
        }}
        secondaryButton={{
          label: AUDIO_QUALITY_UPSELL.secondaryLabel,
          onClick: onUpsellLogin,
          appearance: "outline",
        }}
      >
        <p>{AUDIO_QUALITY_UPSELL.body}</p>
      </AppStackedDialog>
    </div>
  );
}
