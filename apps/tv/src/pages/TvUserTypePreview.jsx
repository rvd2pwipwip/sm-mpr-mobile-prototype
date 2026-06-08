import { useNavigate } from "react-router-dom";
import { MUSIC_CHANNELS } from "@sm-mpr/shared/data/musicChannels.js";
import { USER_TYPES } from "@sm-mpr/shared/constants/userTypes.js";
import { showPlayerPreroll } from "@sm-mpr/shared/utils/userTierRules.js";
import {
  CONTENT_PROFILE_MODE,
  useContentProfile,
} from "../context/ContentProfileContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import "./TvUserTypePreview.css";

const LABELS = {
  guest: "Guest",
  freeStingray: "Free Stingray",
  freeProvided: "Free provider",
  subscribed: "Subscribed",
};

const CONTENT_PROFILE_LABELS = {
  [CONTENT_PROFILE_MODE.musicOnly]: "Music only",
  [CONTENT_PROFILE_MODE.fullMpr]: "Full MPR",
};

/** Stable channel for music-player tier QA (first catalog row). */
const TEST_CHANNEL = MUSIC_CHANNELS[0];

/** Prototype tier toggles — mirror mobile `Subscription` preview block. */
export default function TvUserTypePreview() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();
  const { contentProfileMode, setContentProfileMode } = useContentProfile();
  const prerollOnPlay = showPlayerPreroll(userType);
  const testPlayPath = TEST_CHANNEL
    ? `/music/${TEST_CHANNEL.id}/play`
    : null;

  return (
    <main className="tv-user-type-preview">
      <header className="tv-user-type-preview__header">
        <FocusableButton type="button" onClick={() => navigate(-1)}>
          Back
        </FocusableButton>
        <h1 className="tv-user-type-preview__title">Preview user type</h1>
      </header>
      <p className="tv-user-type-preview__lead">
        Same tiers as mobile. Changing type here updates the whole app immediately.
        The music player route remounts when tier changes (see{" "}
        <code className="tv-user-type-preview__code">MusicPlayerRoute</code> in{" "}
        <code className="tv-user-type-preview__code">App.jsx</code>).
      </p>
      <p className="tv-user-type-preview__status" aria-live="polite">
        Current: <strong>{LABELS[userType] ?? userType}</strong> — music preroll on
        play: <strong>{prerollOnPlay ? "yes" : "no"}</strong>
      </p>
      <ul className="tv-user-type-preview__list">
        {USER_TYPES.map((value) => (
          <li key={value}>
            <FocusableButton
              type="button"
              className={
                userType === value
                  ? "tv-user-type-preview__option tv-user-type-preview__option--active"
                  : "tv-user-type-preview__option"
              }
              onClick={() => setUserType(value)}
            >
              {LABELS[value] ?? value}
            </FocusableButton>
          </li>
        ))}
      </ul>
      <h2 className="tv-user-type-preview__section-title">Content profile</h2>
      <p className="tv-user-type-preview__lead">
        Music-only hides podcast and radio surfaces. Full MPR restores them for
        internal review (shared with mobile via session storage).
      </p>
      <ul className="tv-user-type-preview__list">
        {[CONTENT_PROFILE_MODE.musicOnly, CONTENT_PROFILE_MODE.fullMpr].map(
          (value) => (
            <li key={value}>
              <FocusableButton
                type="button"
                className={
                  contentProfileMode === value
                    ? "tv-user-type-preview__option tv-user-type-preview__option--active"
                    : "tv-user-type-preview__option"
                }
                onClick={() => setContentProfileMode(value)}
              >
                {CONTENT_PROFILE_LABELS[value] ?? value}
              </FocusableButton>
            </li>
          ),
        )}
      </ul>
      {testPlayPath ? (
        <section
          className="tv-user-type-preview__test"
          aria-labelledby="tv-user-type-preview-test-heading"
        >
          <h2
            id="tv-user-type-preview-test-heading"
            className="tv-user-type-preview__test-title"
          >
            Test music player
          </h2>
          <p className="tv-user-type-preview__test-lead">
            Open{" "}
            <span className="tv-user-type-preview__test-channel">
              {TEST_CHANNEL.name}
            </span>{" "}
            with the tier selected above. Guest / Free Stingray: 15s preroll.
            Subscribed / Free provider: straight to controls.
          </p>
          <FocusableButton
            type="button"
            className="tv-user-type-preview__test-btn"
            onClick={() => navigate(testPlayPath)}
          >
            Open music player
          </FocusableButton>
        </section>
      ) : null}
    </main>
  );
}
