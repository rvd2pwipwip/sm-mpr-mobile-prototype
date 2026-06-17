import { useState } from "react";
import {
  COMMUNICATION_PREFERENCES_HREF,
  INFO_AUTOPLAY_DESCRIPTION,
} from "../../../../mobile/src/constants/infoSettings.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FocusableButton from "../focus/FocusableButton.jsx";
import TvButton from "../TvButton.jsx";
import {
  SETTINGS_AUTOPLAY_GROUP_OFFSET,
  SETTINGS_COMM_PREFS_GROUP_OFFSET,
  SETTINGS_ITEM_INDEX,
} from "../../utils/tvInfoSettingsFocus.js";
import "./TvInfoSettingsSection.css";

/**
 * Settings block for TV Info screens — mobile `InfoSettingsSection` minus audio quality.
 */
export default function TvInfoSettingsSection({
  settingsGroupOffset,
  registerItemRef,
  isItemFocused,
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
}) {
  const [autoplayEnabled, setAutoplayEnabled] = useState(true);

  const autoplayGroupIndex =
    settingsGroupOffset + SETTINGS_AUTOPLAY_GROUP_OFFSET;
  const commPrefsGroupIndex =
    settingsGroupOffset + SETTINGS_COMM_PREFS_GROUP_OFFSET;

  const autoplayFocused = isItemFocused(autoplayGroupIndex, SETTINGS_ITEM_INDEX);
  const commPrefsFocused = isItemFocused(
    commPrefsGroupIndex,
    SETTINGS_ITEM_INDEX,
  );

  const openCommunicationPreferences = () => {
    window.open(COMMUNICATION_PREFERENCES_HREF, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="tv-info-settings">
      <KeyboardWrapper
        ref={(node) =>
          registerItemRef(autoplayGroupIndex, SETTINGS_ITEM_INDEX, node)
        }
        onSelect={() => setAutoplayEnabled((prev) => !prev)}
        onUp={handleMoveUp}
        onDown={handleMoveDown}
        onLeft={handleMoveLeft}
        onRight={handleMoveRight}
      >
        {(focusProps) => (
          <FocusableButton
            {...focusProps}
            focused={autoplayFocused}
            className="tv-info-settings__autoplay-row"
            aria-pressed={autoplayEnabled}
            aria-label={`Autoplay, ${autoplayEnabled ? "on" : "off"}. ${INFO_AUTOPLAY_DESCRIPTION}`}
          >
            <span className="tv-info-settings__autoplay-copy">
              <span className="tv-info-settings__label">Autoplay</span>
              <span className="tv-info-settings__description">
                {INFO_AUTOPLAY_DESCRIPTION}
              </span>
            </span>
            <span
              className={[
                "tv-info-settings__switch-track",
                autoplayEnabled ? "tv-info-settings__switch-track--on" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              aria-hidden="true"
            />
          </FocusableButton>
        )}
      </KeyboardWrapper>

      <KeyboardWrapper
        ref={(node) =>
          registerItemRef(commPrefsGroupIndex, SETTINGS_ITEM_INDEX, node)
        }
        onSelect={openCommunicationPreferences}
        onUp={handleMoveUp}
        onDown={handleMoveDown}
        onLeft={handleMoveLeft}
        onRight={handleMoveRight}
      >
        {(focusProps) => (
          <TvButton
            {...focusProps}
            variant="secondary"
            label="Communication preferences"
            endIconMaskVariant="open-in-new"
            focused={commPrefsFocused}
            className="tv-info-settings__comm-action"
          />
        )}
      </KeyboardWrapper>
    </div>
  );
}
