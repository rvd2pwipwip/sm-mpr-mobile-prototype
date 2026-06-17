import { useEffect, useMemo, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { resolveRadioStationForStub } from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import { showPlayerPreroll } from "@sm-mpr/shared/utils/userTierRules.js";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import TvPlayerPrerollAd from "../components/player/TvPlayerPrerollAd.jsx";
import TvPlayerTransport from "../components/player/TvPlayerTransport.jsx";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "./MusicPlayer.css";
import "./RadioPlayer.css";

const META_GROUP = 0;
const TRANSPORT_GROUP = 1;

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

/** Full-screen radio player — TV layout from `23:20013`; live transport from mobile `RadioPlayer`. */
export default function RadioPlayer() {
  const { stationId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session, upsertRadioSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { recordRadioStationListen } = useListenHistory();
  const { userType } = useUserType();

  const needsPreroll = showPlayerPreroll(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);

  const station = stationId ? resolveRadioStationForStub(stationId) : null;
  const likeAction = useMusicRadioLikeAction("radio", station?.id);

  const subtitleLine =
    station?.frequencyLabel ?? station?.categoryLabel ?? "";

  const itemCounts = useMemo(
    () => ({
      [META_GROUP]: 2,
      [TRANSPORT_GROUP]: 1,
    }),
    [],
  );

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    syncDomFocus,
  } = useScreenContentFocus(`radio-player-${stationId}`, {
    groupCount: 2,
    itemCounts,
    defaultGroupIndex: TRANSPORT_GROUP,
    defaultItemIndex: 0,
    navEnterEnabled: false,
    contentKeysEnabled: prerollComplete,
    suspendDomFocus: !prerollComplete,
  });

  useEffect(() => {
    enterContent();
  }, [enterContent]);

  useEffect(() => {
    if (!prerollComplete) return;
    syncDomFocus();
  }, [prerollComplete, syncDomFocus]);

  useEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    if (session.radioStationId === station.id) {
      setPlaying(!session.isPaused);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [station?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    upsertRadioSession({
      stationId: station.id,
      thumbnail: station.thumbnail,
      title: station.name,
      subtitle: "Now playing (prototype)",
      isPaused: !playing,
    });
  }, [station, needsPreroll, prerollComplete, playing, upsertRadioSession]);

  useEffect(() => {
    if (!station) return;
    if (needsPreroll && !prerollComplete) return;
    recordRadioStationListen(station.id);
  }, [station?.id, needsPreroll, prerollComplete, recordRadioStationListen]);

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  const leaveForStationInfo = () => {
    navigate(`/radio/${station.id}`, { replace: true });
  };

  const showPreroll = needsPreroll && !prerollComplete;

  return (
    <div className="tv-page tv-music-player tv-radio-player">
      {showPreroll ? (
        <TvPlayerPrerollAd
          onComplete={() => {
            setPrerollComplete(true);
            setPlaying(true);
          }}
        />
      ) : null}

      {!showPreroll ? (
        <div className="tv-music-player__column">
          <header className="tv-music-player__channel-block">
            <h1 className="tv-music-player__channel-name">{station.name}</h1>
            <div className="tv-music-player__meta-actions">
              <KeyboardWrapper
                ref={(node) => registerItemRef(META_GROUP, 0, node)}
                onSelect={leaveForStationInfo}
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
                    focused={isItemFocused(META_GROUP, 0)}
                    aria-label="Station info"
                  >
                    <PlayerMetaIcon variant="info" />
                  </FocusableButton>
                )}
              </KeyboardWrapper>

              <KeyboardWrapper
                ref={(node) => registerItemRef(META_GROUP, 1, node)}
                onSelect={() => likeAction.onPress()}
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
                    focused={isItemFocused(META_GROUP, 1)}
                    aria-label={likeAction.ariaLabel}
                  >
                    <PlayerMetaIcon variant={likeAction.iconVariant} />
                  </FocusableButton>
                )}
              </KeyboardWrapper>
            </div>
          </header>

          <div className="tv-music-player__cover-block">
            <div className="tv-music-player__cover">
              <img
                src={station.thumbnail}
                alt=""
                width={360}
                height={360}
              />
            </div>
            <div className="tv-music-player__track-text">
              <p className="tv-music-player__song">Now playing (prototype)</p>
              <p className="tv-music-player__artist">{station.name}</p>
              <p className="tv-music-player__album">{subtitleLine}</p>
            </div>
          </div>

          <div className="tv-music-player__controls tv-radio-player__controls">
            <div className="tv-radio-player__progress">
              <div className="tv-music-player__progress-track tv-radio-player__progress-track">
                <div className="tv-music-player__progress-fill tv-radio-player__progress-fill" />
              </div>
              <p className="tv-radio-player__live-label">Live</p>
            </div>
            <TvPlayerTransport
              playing={playing}
              playPauseAriaLabel={playing ? "Pause" : "Play"}
              playPauseFocused={isItemFocused(TRANSPORT_GROUP, 0)}
              registerPlayPauseRef={(node) =>
                registerItemRef(TRANSPORT_GROUP, 0, node)
              }
              onTogglePlayPause={() => setPlaying((p) => !p)}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            />
          </div>
        </div>
      ) : null}
    </div>
  );
}
