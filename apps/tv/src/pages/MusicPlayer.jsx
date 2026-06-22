import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import {
  showPlayerPreroll,
  showUpgradeInFullPlayerHeader,
} from "@sm-mpr/shared/utils/userTierRules.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import TvMusicSkipButton from "../components/player/TvMusicSkipButton.jsx";
import TvPlayerPrerollAd from "../components/player/TvPlayerPrerollAd.jsx";
import TvPlayerTransport from "../components/player/TvPlayerTransport.jsx";
import TvMusicPlayerInfoSheet from "../components/player/TvMusicPlayerInfoSheet.jsx";
import TvPlayerProviderLogo from "../components/player/TvPlayerProviderLogo.jsx";
import TvPlayerUpgradeCta from "../components/player/TvPlayerUpgradeCta.jsx";
import { useGuestPrerollGrace } from "../context/GuestPrerollGraceContext.jsx";
import { useListenHistory } from "@sm-mpr/shared/context/ListenHistoryContext.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import {
  useTvScreensaver,
  useTvScreensaverSuppression,
} from "../context/TvScreensaverContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import { useGoUpgrade } from "../hooks/useGoUpgrade.js";
import { useMusicRadioLikeAction } from "../hooks/useMusicRadioLikeAction.js";
import { useTvPlayerScreenFocus } from "../hooks/useTvPlayerScreenFocus.js";
import "./MusicPlayer.css";

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

/** Full-screen music player — Figma `23:20013`; primary nav hidden on this route. */
export default function MusicPlayer() {
  const { channelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const { session, upsertMusicSession } = usePlayback();
  const { graceActive } = useGuestPrerollGrace();
  const { recordMusicChannelListen } = useListenHistory();
  const { userType } = useUserType();
  const goUpgrade = useGoUpgrade();

  const needsPreroll = showPlayerPreroll(userType);
  const showPlayerUpgrade = showUpgradeInFullPlayerHeader(userType);
  const expandFromMini = location.state?.expandFromMiniPlayer === true;
  const skipPrerollGate = !needsPreroll || expandFromMini || graceActive;
  const [prerollComplete, setPrerollComplete] = useState(() => skipPrerollGate);
  const [playing, setPlaying] = useState(() => skipPrerollGate);
  const [infoSheetOpen, setInfoSheetOpen] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const likeAction = useMusicRadioLikeAction("music", channel?.id);

  const showPreroll = needsPreroll && !prerollComplete;

  const syncDomFocusRef = useRef(() => {});

  useTvScreensaverSuppression(
    showPreroll || infoSheetOpen,
    () => syncDomFocusRef.current(),
  );
  const { isActive: screensaverActive } = useTvScreensaver();

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
  } = useTvPlayerScreenFocus(`music-player-${channelId}`, {
    showUpgrade: showPlayerUpgrade,
    metaItemCount: 2,
    transportItemCount: 2,
    contentKeysEnabled:
      prerollComplete && !screensaverActive && !infoSheetOpen,
    suspendDomFocus: !prerollComplete || screensaverActive || infoSheetOpen,
  });

  syncDomFocusRef.current = syncDomFocus;

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

  useEffect(() => {
    if (!channel) return;
    if (needsPreroll && !prerollComplete) return;
    recordMusicChannelListen(channel.id);
  }, [channel?.id, needsPreroll, prerollComplete, recordMusicChannelListen]);

  useEffect(() => {
    if (infoSheetOpen) return;
    if (!prerollComplete) return;
    syncDomFocus();
  }, [infoSheetOpen, prerollComplete, syncDomFocus]);

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const leavePlayer = (path) => {
    navigate(path, { replace: true });
  };

  return (
    <div
      className={[
        "tv-page",
        "tv-music-player",
        infoSheetOpen ? "tv-music-player--info-sheet" : "",
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
      <TvPlayerProviderLogo />
      <div className="tv-music-player__column">
        <header className="tv-music-player__channel-block">
          <h1 className="tv-music-player__channel-name">{channel.name}</h1>
          <div className="tv-music-player__meta-actions">
            <KeyboardWrapper
              ref={(node) => registerItemRef(metaGroup, 0, node)}
              onSelect={() => setInfoSheetOpen(true)}
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
                  aria-label="Channel info"
                >
                  <PlayerMetaIcon variant="info" />
                </FocusableButton>
              )}
            </KeyboardWrapper>

            <KeyboardWrapper
              ref={(node) => registerItemRef(metaGroup, 1, node)}
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
                  focused={isItemFocused(metaGroup, 1)}
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
          <TvPlayerTransport
            playing={playing}
            playPauseAriaLabel={playing ? "Pause" : "Play"}
            playPauseFocused={isItemFocused(transportGroup, 0)}
            registerPlayPauseRef={(node) =>
              registerItemRef(transportGroup, 0, node)
            }
            onTogglePlayPause={() => setPlaying((p) => !p)}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            endSlot={
              <TvMusicSkipButton
                groupIndex={transportGroup}
                itemIndex={1}
                focused={isItemFocused(transportGroup, 1)}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onMoveLeft={handleMoveLeft}
                onMoveRight={handleMoveRight}
              />
            }
          />
        </div>
      </div>
      </>
      ) : null}

      <TvMusicPlayerInfoSheet
        open={infoSheetOpen}
        onClose={() => setInfoSheetOpen(false)}
        channelId={channel.id}
        playing={playing}
        onTogglePlay={() => setPlaying((p) => !p)}
        onLeavePlayer={leavePlayer}
      />
    </div>
  );
}
