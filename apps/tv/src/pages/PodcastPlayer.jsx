import { useEffect, useMemo, useRef, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { PODCAST_SPEED_STEPS } from "@sm-mpr/shared/constants/podcastPlayback.js";
import { usePodcastUserState } from "@sm-mpr/shared/context/PodcastUserStateContext.jsx";
import {
  userMayBookmarkEpisodes,
  userMaySubscribePodcasts,
} from "@sm-mpr/shared/utils/userContentGates.js";
import {
  approxDurationSecondsFromLabel,
  formatPlaybackClock,
} from "@sm-mpr/shared/utils/podcastDuration.js";
import { showPlayerPreroll, showUpgradeInFullPlayerHeader } from "@sm-mpr/shared/utils/userTierRules.js";
import {
  getPodcastById,
  getPodcastEpisodeById,
} from "@sm-mpr/shared/data/podcasts.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import TvPlayerPrerollAd from "../components/player/TvPlayerPrerollAd.jsx";
import TvPlayerScreensaver from "../components/player/TvPlayerScreensaver.jsx";
import TvPlayerUpgradeCta from "../components/player/TvPlayerUpgradeCta.jsx";
import TvPodcastPlayerTransport from "../components/player/TvPodcastPlayerTransport.jsx";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext.jsx";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useGoUpgrade } from "../hooks/useGoUpgrade.js";
import { useTvPlayerScreenFocus } from "../hooks/useTvPlayerScreenFocus.js";
import { useTvPlayerScreensaver } from "../hooks/useTvPlayerScreensaver.js";
import "./MusicPlayer.css";
import "./PodcastPlayer.css";

const TRANSPORT_SLOT = {
  speed: 0,
  seekBack: 1,
  play: 2,
  seekForward: 3,
  bookmark: 4,
};

function PlayerMetaIcon({ variant }) {
  return (
    <span
      className={[
        "tv-music-player__meta-icon",
        `tv-music-player__meta-icon--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** Full-screen podcast player — Figma `7531:342033`; music player structural parity. */
export default function PodcastPlayer() {
  const { podcastId, episodeId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session, upsertPodcastSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { recordPodcastShowListen } = useListenHistory();
  const { userType } = useUserType();
  const goUpgrade = useGoUpgrade();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

  const needsPreroll = showPlayerPreroll(userType);
  const showPlayerUpgrade = showUpgradeInFullPlayerHeader(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);
  const [speedIdx, setSpeedIdx] = useState(() =>
    Math.max(0, PODCAST_SPEED_STEPS.indexOf(1)),
  );

  const {
    toggleSubscribe,
    toggleBookmark,
    isSubscribed,
    isBookmarked,
    episodeProgressById,
    setEpisodeProgress,
    getEpisodeProgress,
  } = usePodcastUserState();

  const getEpisodeProgressRef = useRef(getEpisodeProgress);
  getEpisodeProgressRef.current = getEpisodeProgress;
  const setEpisodeProgressRef = useRef(setEpisodeProgress);
  setEpisodeProgressRef.current = setEpisodeProgress;
  const listenHistoryRecordedForEpisodeRef = useRef(null);

  const podcast =
    podcastId && typeof podcastId === "string"
      ? getPodcastById(podcastId)
      : null;
  const bundle =
    podcast && episodeId
      ? getPodcastEpisodeById(podcast.id, episodeId)
      : null;
  const episode = bundle?.episode ?? null;

  const durationSec = useMemo(() => {
    if (!episode) return 0;
    return approxDurationSecondsFromLabel(episode.duration);
  }, [episode?.duration]);

  const position01Raw = episode ? episodeProgressById[episode.id] : undefined;
  const position01 =
    typeof position01Raw === "number" && !Number.isNaN(position01Raw)
      ? Math.min(1, Math.max(0, position01Raw))
      : 0;

  const showPreroll = needsPreroll && !prerollComplete;
  const screensaverEnabled = !showPreroll && prerollComplete;

  const screensaverModel = useMemo(
    () => ({
      thumbnail: episode?.thumbnail ?? "",
      line1: podcast?.title ?? "",
      line2: episode?.title ?? "",
    }),
    [episode?.thumbnail, episode?.title, podcast?.title],
  );

  const syncDomFocusRef = useRef(() => {});

  const { isActive: screensaverActive } = useTvPlayerScreensaver({
    enabled: screensaverEnabled && Boolean(podcast && episode),
    onWake: () => syncDomFocusRef.current(),
  });

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    syncDomFocus,
    metaGroup,
    transportGroup,
    upgradeGroup,
  } = useTvPlayerScreenFocus(
    `podcast-player-${podcastId}-${episodeId}`,
    {
      showUpgrade: showPlayerUpgrade,
      metaItemCount: 2,
      transportItemCount: 5,
      defaultTransportItemIndex: TRANSPORT_SLOT.play,
      contentKeysEnabled: prerollComplete && !screensaverActive,
      suspendDomFocus: !prerollComplete || screensaverActive,
    },
  );

  syncDomFocusRef.current = syncDomFocus;

  useEffect(() => {
    enterContent();
  }, [enterContent]);

  useEffect(() => {
    if (!prerollComplete) return;
    syncDomFocus();
  }, [prerollComplete, syncDomFocus]);

  useEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    if (
      session.podcastId === podcast.id &&
      session.podcastEpisodeId === episode.id
    ) {
      setPlaying(!session.isPaused);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [podcast?.id, episode?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    upsertPodcastSession({
      podcastId: podcast.id,
      episodeId: episode.id,
      thumbnail: episode.thumbnail,
      title: episode.title,
      subtitle: podcast.title,
      isPaused: !playing,
    });
  }, [
    podcast,
    episode,
    playing,
    needsPreroll,
    prerollComplete,
    upsertPodcastSession,
  ]);

  useEffect(() => {
    if (!episode) return;
    if (!playing) return;
    if (needsPreroll && !prerollComplete) return;
    if (durationSec <= 0) return;
    if (position01 >= 1) return;
    const eid = episode.id;
    const tick = PODCAST_SPEED_STEPS[speedIdx] / durationSec;
    const id = window.setInterval(() => {
      const frac = getEpisodeProgressRef.current(eid, 0);
      if (frac >= 1) return;
      const next = frac + tick;
      if (next >= 1) {
        setEpisodeProgressRef.current(eid, 1);
        setPlaying(false);
      } else {
        setEpisodeProgressRef.current(eid, next);
      }
    }, 1000);
    return () => window.clearInterval(id);
  }, [
    episode?.id,
    playing,
    speedIdx,
    durationSec,
    needsPreroll,
    prerollComplete,
    position01,
  ]);

  useEffect(() => {
    listenHistoryRecordedForEpisodeRef.current = null;
  }, [episode?.id]);

  useEffect(() => {
    if (!podcast || !episode) return;
    if (needsPreroll && !prerollComplete) return;
    if (listenHistoryRecordedForEpisodeRef.current === episode.id) return;
    if (!playing && position01 <= 0.05) return;
    listenHistoryRecordedForEpisodeRef.current = episode.id;
    recordPodcastShowListen(podcast.id);
  }, [
    podcast?.id,
    episode?.id,
    needsPreroll,
    prerollComplete,
    playing,
    position01,
    recordPodcastShowListen,
  ]);

  if (!podcastId) {
    return <Navigate to="/" replace />;
  }
  if (!podcast) {
    return <Navigate to="/" replace />;
  }
  if (!bundle || !episode) {
    return <Navigate to={`/podcast/${podcast.id}`} replace />;
  }

  const elapsedSec = position01 * durationSec;
  const speed = PODCAST_SPEED_STEPS[speedIdx] ?? 1;
  const subscribedHere = isSubscribed(podcast.id);
  const bookmarkedHere = isBookmarked(episode.id);

  const leaveForPodcastInfo = () => {
    if (expandFromMini) {
      navigate(-1);
      return;
    }
    navigate(`/podcast/${podcast.id}`, { replace: true });
  };

  const onSubscribePress = () => {
    if (!subscribedHere && !userMaySubscribePodcasts(userType)) {
      openAccountRequiredDialog("podcastSubscribe");
      return;
    }
    toggleSubscribe(podcast.id);
  };

  const onBookmarkPress = () => {
    if (!bookmarkedHere && !userMayBookmarkEpisodes(userType)) {
      openAccountRequiredDialog("episodeBookmark");
      return;
    }
    toggleBookmark(episode.id);
  };

  const adjustSeconds = (delta) => {
    const frac = getEpisodeProgress(episode.id, 0);
    const posSec = frac * durationSec + delta;
    const next01 = Math.min(1, Math.max(0, posSec / durationSec));
    setEpisodeProgress(episode.id, next01);
  };

  const cycleSpeed = () => {
    setSpeedIdx((i) => (i + 1) % PODCAST_SPEED_STEPS.length);
  };

  return (
    <div
      className={[
        "tv-page",
        "tv-music-player",
        "tv-podcast-player",
        screensaverActive ? "tv-music-player--screensaver" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {showPreroll ? (
        <TvPlayerPrerollAd
          onComplete={() => {
            setPrerollComplete(true);
            setPlaying(true);
          }}
        />
      ) : null}

      {!showPreroll ? (
        <>
        {showPlayerUpgrade ? (
          <TvPlayerUpgradeCta
            groupIndex={upgradeGroup}
            registerItemRef={registerItemRef}
            isItemFocused={isItemFocused}
            onSelect={goUpgrade}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
          />
        ) : null}
        <div className="tv-music-player__column">
          <header className="tv-music-player__channel-block">
            <h1 className="tv-music-player__channel-name">{podcast.title}</h1>

            <div className="tv-music-player__meta-actions">
              <KeyboardWrapper
                ref={(node) => registerItemRef(metaGroup, 0, node)}
                onSelect={leaveForPodcastInfo}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              >
                {(focusProps) => (
                  <FocusableButton
                    {...focusProps}
                    type="button"
                    className="tv-music-player__meta-btn"
                    focused={isItemFocused(metaGroup, 0)}
                    aria-label="Podcast info"
                  >
                    <PlayerMetaIcon variant="info" />
                  </FocusableButton>
                )}
              </KeyboardWrapper>

              <KeyboardWrapper
                ref={(node) => registerItemRef(metaGroup, 1, node)}
                onSelect={onSubscribePress}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              >
                {(focusProps) => (
                  <FocusableButton
                    {...focusProps}
                    type="button"
                    className={[
                      "tv-music-player__meta-btn",
                      subscribedHere ? "tv-podcast-player__meta-btn--active" : "",
                    ].join(" ")}
                    focused={isItemFocused(metaGroup, 1)}
                    aria-label={
                      subscribedHere ? "Unsubscribe from podcast" : "Subscribe"
                    }
                    aria-pressed={subscribedHere}
                  >
                    <PlayerMetaIcon
                      variant={
                        subscribedHere
                          ? "unsubscribe-podcast"
                          : "subscribe-podcast"
                      }
                    />
                  </FocusableButton>
                )}
              </KeyboardWrapper>
            </div>
          </header>

          <div className="tv-music-player__cover-block">
            <div className="tv-music-player__cover">
              <img
                src={episode.thumbnail}
                alt=""
                width={360}
                height={360}
                decoding="async"
              />
            </div>
            <div className="tv-music-player__track-text">
              <p className="tv-music-player__song tv-podcast-player__episode-title">
                {episode.title}
              </p>
              <p className="tv-music-player__artist">
                {episode.releaseDate}
                {" · "}
                {episode.duration}
              </p>
            </div>
          </div>

          <div className="tv-music-player__controls tv-podcast-player__controls">
            <div className="tv-podcast-player__scrub">
              <div className="tv-podcast-player__time-row">
                <span className="tv-podcast-player__time">
                  {formatPlaybackClock(elapsedSec)}
                </span>
                <span className="tv-podcast-player__time">
                  −{formatPlaybackClock(Math.max(0, durationSec - elapsedSec))}
                </span>
              </div>
              <div className="tv-music-player__progress tv-podcast-player__progress">
                <div className="tv-music-player__progress-track">
                  <div
                    className="tv-music-player__progress-fill"
                    style={{ width: `${position01 * 100}%` }}
                  />
                </div>
              </div>
            </div>

            <TvPodcastPlayerTransport
              groupIndex={transportGroup}
              transportSlots={TRANSPORT_SLOT}
              playing={playing}
              speed={speed}
              isBookmarked={bookmarkedHere}
              isItemFocused={isItemFocused}
              registerItemRef={registerItemRef}
              onCycleSpeed={cycleSpeed}
              onSeekBack={() => adjustSeconds(-15)}
              onSeekForward={() => adjustSeconds(30)}
              onTogglePlayPause={() => setPlaying((p) => !p)}
              onToggleBookmark={onBookmarkPress}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            />
          </div>
        </div>
        </>
      ) : null}

      {screensaverActive ? <TvPlayerScreensaver model={screensaverModel} /> : null}
    </div>
  );
}
