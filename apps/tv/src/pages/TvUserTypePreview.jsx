import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  LIMITED_HOME_LAYOUT,
  readLimitedHomeLayout,
  writeLimitedHomeLayout,
} from "../constants/limitedHomeLayout.js";
import { MUSIC_CHANNELS } from "@sm-mpr/shared/data/musicChannels.js";
import { PODCASTS } from "@sm-mpr/shared/data/podcasts.js";
import { SWIMLANE_CARD_MAX } from "@sm-mpr/shared/constants/swimlane.js";
import { CLEAR_MORE_DEMO_ITEM_COUNT } from "@sm-mpr/shared/utils/seedClearMoreSwimlaneDemo.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import { USER_TYPES } from "@sm-mpr/shared/constants/userTypes.js";
import {
  showPlayerPreroll,
  showUpgradeInFullPlayerHeader,
} from "@sm-mpr/shared/utils/userTierRules.js";
import {
  userMayBookmarkEpisodes,
  userMaySubscribePodcasts,
} from "@sm-mpr/shared/utils/userContentGates.js";
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

/** Stable podcast + episode for podcast-player tier QA. */
const TEST_PODCAST = PODCASTS[0] ?? null;
const TEST_PODCAST_EPISODE = TEST_PODCAST?.episodes[0] ?? null;

/** Prototype tier toggles — mirror mobile `Subscription` preview block. */
const LIMITED_LAYOUT_LABELS = {
  [LIMITED_HOME_LAYOUT.stacked]: "B — Stacked swimlanes (default)",
  [LIMITED_HOME_LAYOUT.filter]: "A — Filter + single rail",
};

export default function TvUserTypePreview() {
  const navigate = useNavigate();
  const [limitedHomeLayout, setLimitedHomeLayout] = useState(() =>
    readLimitedHomeLayout(),
  );
  const { userType, setUserType } = useUserType();
  const { contentProfileMode, setContentProfileMode } = useContentProfile();
  const { seedClearMoreDemo: seedListenHistoryDemo } = useListenHistory();
  const { seedClearMoreDemo: seedPodcastLibraryDemo } = usePodcastUserState();
  const [clearMoreSeedStatus, setClearMoreSeedStatus] = useState("");
  const prerollOnPlay = showPlayerPreroll(userType);
  const upgradeInPlayer = showUpgradeInFullPlayerHeader(userType);
  const maySubscribe = userMaySubscribePodcasts(userType);
  const mayBookmark = userMayBookmarkEpisodes(userType);
  const testPlayPath = TEST_CHANNEL
    ? `/music/${TEST_CHANNEL.id}/play`
    : null;
  const testPodcastPlayPath =
    TEST_PODCAST && TEST_PODCAST_EPISODE
      ? `/podcast/${TEST_PODCAST.id}/play/${TEST_PODCAST_EPISODE.id}`
      : null;

  const handleSeedClearMoreSwimlanes = () => {
    seedListenHistoryDemo();
    seedPodcastLibraryDemo();
    setClearMoreSeedStatus(
      `Seeded ${CLEAR_MORE_DEMO_ITEM_COUNT} random items per Clear/More rail. Open Home (Listen again), Limited Home Podcasts tab, or My Library (Full MPR).`,
    );
  };

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
        Current: <strong>{LABELS[userType] ?? userType}</strong> — preroll on play:{" "}
        <strong>{prerollOnPlay ? "yes" : "no"}</strong> — upgrade in player:{" "}
        <strong>{upgradeInPlayer ? "yes" : "no"}</strong>
      </p>
      <table className="tv-user-type-preview__tier-table">
        <caption className="tv-user-type-preview__tier-caption">
          Podcast play tier rules (current selection)
        </caption>
        <thead>
          <tr>
            <th scope="col">Rule</th>
            <th scope="col">This tier</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>15s preroll before episode play</td>
            <td>{prerollOnPlay ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Upgrade button in podcast player</td>
            <td>{upgradeInPlayer ? "Yes" : "No"}</td>
          </tr>
          <tr>
            <td>Subscribe to shows</td>
            <td>{maySubscribe ? "Allowed" : "Account dialog"}</td>
          </tr>
          <tr>
            <td>Bookmark episodes</td>
            <td>{mayBookmark ? "Allowed" : "Account dialog"}</td>
          </tr>
        </tbody>
      </table>
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
      {testPodcastPlayPath ? (
        <section
          className="tv-user-type-preview__test"
          aria-labelledby="tv-user-type-preview-podcast-test-heading"
        >
          <h2
            id="tv-user-type-preview-podcast-test-heading"
            className="tv-user-type-preview__test-title"
          >
            Test podcast player
          </h2>
          <p className="tv-user-type-preview__test-lead">
            Open{" "}
            <span className="tv-user-type-preview__test-channel">
              {TEST_PODCAST.title}
            </span>{" "}
            / {TEST_PODCAST_EPISODE.title} with the tier selected above. Guest /
            Free Stingray: 15s preroll + Upgrade in player. Subscribed: no preroll,
            no Upgrade. Guest: Subscribe and bookmark open account dialog.
          </p>
          <FocusableButton
            type="button"
            className="tv-user-type-preview__test-btn"
            onClick={() => navigate(testPodcastPlayPath)}
          >
            Open podcast player
          </FocusableButton>
        </section>
      ) : null}
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
      <section
        className="tv-user-type-preview__test"
        aria-labelledby="tv-user-type-preview-clear-more-heading"
      >
        <h2
          id="tv-user-type-preview-clear-more-heading"
          className="tv-user-type-preview__test-title"
        >
          Seed Clear / More swimlanes
        </h2>
        <p className="tv-user-type-preview__test-lead">
          Fills listen history (music, podcast, radio) and podcast library rails
          with {CLEAR_MORE_DEMO_ITEM_COUNT} random catalog items each —{" "}
          {SWIMLANE_CARD_MAX} cards plus a <strong>More</strong> tile. Use{" "}
          <strong>Full MPR</strong> and
          visit Home, Limited Home (Podcasts tab), or My Library.
        </p>
        <FocusableButton
          type="button"
          className="tv-user-type-preview__test-btn"
          onClick={handleSeedClearMoreSwimlanes}
        >
          Populate Clear / More demo data
        </FocusableButton>
        {clearMoreSeedStatus ? (
          <p className="tv-user-type-preview__status" aria-live="polite">
            {clearMoreSeedStatus}
          </p>
        ) : null}
      </section>
      <section
        className="tv-user-type-preview__prototype"
        aria-labelledby="tv-user-type-preview-limited-layout-heading"
      >
        <h2
          id="tv-user-type-preview-limited-layout-heading"
          className="tv-user-type-preview__section-title"
        >
          Limited Home layout (prototype)
        </h2>
        <p className="tv-user-type-preview__lead">
          Click only — not in D-pad focus order. Session storage; reload resets.
          Current: <strong>{LIMITED_LAYOUT_LABELS[limitedHomeLayout]}</strong>
        </p>
        <div className="tv-user-type-preview__prototype-actions">
          {[LIMITED_HOME_LAYOUT.stacked, LIMITED_HOME_LAYOUT.filter].map(
            (mode) => (
              <button
                key={mode}
                type="button"
                tabIndex={-1}
                className={[
                  "tv-user-type-preview__prototype-btn",
                  limitedHomeLayout === mode
                    ? "tv-user-type-preview__prototype-btn--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => {
                  writeLimitedHomeLayout(mode);
                  setLimitedHomeLayout(mode);
                  navigate(`/?limitedHome=${mode}`);
                }}
              >
                {LIMITED_LAYOUT_LABELS[mode]}
              </button>
            ),
          )}
        </div>
      </section>
    </main>
  );
}
