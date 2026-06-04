import { useEffect, useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import { showPlayerPreroll } from "@sm-mpr/shared/utils/userTierRules.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import TvMusicSkipButton from "../components/player/TvMusicSkipButton.jsx";
import TvPlayerPrerollAd from "../components/player/TvPlayerPrerollAd.jsx";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "./MusicPlayer.css";

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

function PlayerPlayPauseIcon({ playing }) {
  return (
    <span
      className={[
        "tv-music-player__play-icon",
        playing
          ? "tv-music-player__play-icon--pause"
          : "tv-music-player__play-icon--play",
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

/** Full-screen music player — Figma `23:20013`; primary nav hidden on this route. */
export default function MusicPlayer() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session, upsertMusicSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { userType } = useUserType();

  const needsPreroll = showPlayerPreroll(userType);
  const skipPrerollGate = !needsPreroll || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const likeAction = useMusicRadioLikeAction("music", channel?.id);

  const itemCounts = useMemo(
    () => ({
      [META_GROUP]: 2,
      [TRANSPORT_GROUP]: 2,
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
  } = useScreenContentFocus(`music-player-${channelId}`, {
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
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    if (session.channelId === channel.id) setPlaying(!session.isPaused);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel?.id, needsPreroll, prerollComplete]);

  useEffect(() => {
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    upsertMusicSession({
      channelId: channel.id,
      thumbnail: channel.thumbnail,
      title: "Song title (prototype)",
      subtitle: "Artist name",
      isPaused: !playing,
    });
  }, [channel, needsPreroll, prerollComplete, playing, upsertMusicSession]);

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const leaveForChannelInfo = () => {
    navigate(`/music/${channel.id}`, { replace: true });
  };

  const showPreroll = needsPreroll && !prerollComplete;

  return (
    <div className="tv-page tv-music-player">
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
          <h1 className="tv-music-player__channel-name">{channel.name}</h1>
          <div className="tv-music-player__meta-actions">
            <KeyboardWrapper
              ref={(node) => registerItemRef(META_GROUP, 0, node)}
              onSelect={leaveForChannelInfo}
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
                  aria-label="Channel info"
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
            <img src={channel.thumbnail} alt="" width={360} height={360} />
          </div>
          <div className="tv-music-player__track-text">
            <p className="tv-music-player__song">Song title (prototype)</p>
            <p className="tv-music-player__artist">Artist name</p>
            <p className="tv-music-player__album">Album name</p>
          </div>
        </div>

        <div className="tv-music-player__controls">
          <div className="tv-music-player__progress">
            <div className="tv-music-player__progress-track">
              <div className="tv-music-player__progress-fill" />
            </div>
          </div>
          <div className="tv-music-player__transport">
            <KeyboardWrapper
              ref={(node) => registerItemRef(TRANSPORT_GROUP, 0, node)}
              onSelect={() => setPlaying((p) => !p)}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            >
              {(focusProps) => (
                <FocusableButton
                  {...focusProps}
                  type="button"
                  className="tv-music-player__play-toggle"
                  focused={isItemFocused(TRANSPORT_GROUP, 0)}
                  aria-label={playing ? "Pause" : "Play"}
                >
                  <PlayerPlayPauseIcon playing={playing} />
                </FocusableButton>
              )}
            </KeyboardWrapper>

            <TvMusicSkipButton
              groupIndex={TRANSPORT_GROUP}
              itemIndex={1}
              focused={isItemFocused(TRANSPORT_GROUP, 1)}
              registerItemRef={registerItemRef}
              onMoveUp={handleMoveUp}
              onMoveDown={handleMoveDown}
              onMoveLeft={handleMoveLeft}
              onMoveRight={handleMoveRight}
            />
          </div>
        </div>
      </div>
      ) : null}

      <p className="tv-page__lede tv-music-player__hint">Press Esc to go back.</p>
    </div>
  );
}
