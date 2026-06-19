import { useEffect, useState } from "react";
import ButtonSmall from "../ButtonSmall";
import EpisodeCard from "../EpisodeCard";
import { useAccountRequiredDialog } from "../../context/AccountRequiredDialogContext";
import { usePodcastUserState } from "../../context/PodcastUserStateContext";
import { useUserType } from "../../context/UserTypeContext";
import { getPodcastById } from "../../data/podcasts";
import { useDescriptionClampOverflow } from "../../hooks/useDescriptionClampOverflow";
import {
  userMayBookmarkEpisodes,
  userMayDownloadEpisodesOffline,
  userMaySubscribePodcasts,
} from "../../constants/userContentGates";
import PlayerInfoBottomSheet from "./PlayerInfoBottomSheet";
import "../../pages/MusicChannelInfo.css";
import "../../pages/PodcastInfo.css";

function ActionIconMask({ variant }) {
  return (
    <span
      className={[
        "music-info__action-icon-mask",
        `music-info__action-icon-mask--${variant}`,
      ].join(" ")}
      aria-hidden={true}
    />
  );
}

export default function PodcastPlayerInfoSheet({
  open,
  onClose,
  podcastId,
  currentEpisodeId,
  playing,
  onTogglePlay,
  onSelectEpisode,
}) {
  const { userType } = useUserType();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();
  const [descExpanded, setDescExpanded] = useState(false);

  const {
    toggleSubscribe,
    toggleBookmark,
    toggleDownload,
    setEpisodeProgress,
    getEpisodeProgress,
    isSubscribed,
    isBookmarked,
    isDownloaded,
    continueListening,
    bookmarkedEpisodes,
    downloadedEpisodes,
  } = usePodcastUserState();

  const podcast = podcastId ? getPodcastById(podcastId) : null;

  useEffect(() => {
    if (open) return;
    setDescExpanded(false);
  }, [open, podcastId]);

  const { ref: descRef, overflows: descOverflows } = useDescriptionClampOverflow(
    podcast?.description ?? "",
    !descExpanded,
    open,
  );

  if (!podcast) return null;

  const subscribedHere = isSubscribed(podcast.id);
  const titleId = `podcast-player-info-sheet-title-${podcast.id}`;

  const onSubscribePress = () => {
    if (!subscribedHere && !userMaySubscribePodcasts(userType)) {
      openAccountRequiredDialog("podcastSubscribe");
      return;
    }
    toggleSubscribe(podcast.id);
  };

  const switchEpisode = (episodeId) => {
    if (episodeId === currentEpisodeId) {
      onClose();
      return;
    }
    onClose();
    onSelectEpisode(episodeId);
  };

  const toggleStubResume = (episodeId) => {
    const frac = getEpisodeProgress(episodeId);
    setEpisodeProgress(episodeId, frac > 0 && frac < 1 ? 0 : 0.35);
  };

  const previewBits = [];
  if (continueListening.length > 0) {
    previewBits.push(`${continueListening.length} continue listening`);
  }
  if (bookmarkedEpisodes.length > 0) {
    previewBits.push(`${bookmarkedEpisodes.length} bookmarks`);
  }
  if (downloadedEpisodes.length > 0) {
    previewBits.push(`${downloadedEpisodes.length} downloads`);
  }

  return (
    <PlayerInfoBottomSheet
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <div className="music-info__column player-info-bottom-sheet__content">
        <div className="music-info__inset">
          <h2 id={titleId} className="music-info__name">
            {podcast.title}
          </h2>

          <div className="music-info__hero">
            <div className="music-info__thumb-wrap">
              <img
                className="music-info__thumb"
                src={podcast.thumbnail}
                alt=""
                width={230}
                height={230}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div className="music-info__actions-col">
              <ButtonSmall
                variant="cta"
                fullWidth
                startIcon={
                  <ActionIconMask variant={playing ? "pause" : "play"} />
                }
                onClick={onTogglePlay}
              >
                {playing ? "Pause" : "Play"}
              </ButtonSmall>
              <ButtonSmall
                variant="secondary"
                fullWidth
                startIcon={
                  <ActionIconMask
                    variant={
                      subscribedHere
                        ? "unsubscribe-podcast"
                        : "subscribe-podcast"
                    }
                  />
                }
                onClick={onSubscribePress}
              >
                {subscribedHere ? "Unsubscribe" : "Subscribe"}
              </ButtonSmall>
            </div>
          </div>

          <div className="music-info__desc-block">
            <p
              ref={descRef}
              className={
                descExpanded
                  ? "music-info__description"
                  : "music-info__description music-info__description--clamped"
              }
            >
              {podcast.description}
            </p>
            {descOverflows ? (
              <button
                type="button"
                className="music-info__more"
                onClick={() => setDescExpanded((expanded) => !expanded)}
              >
                {descExpanded ? "Less" : "More..."}
              </button>
            ) : null}
          </div>

          {previewBits.length > 0 ? (
            <p className="podcast-info__library-preview" aria-live="polite">
              Your library (any show): {previewBits.join(" · ")}.
            </p>
          ) : null}
        </div>

        <section
          className="music-info__swimlane podcast-info__episodes-section"
          aria-labelledby="podcast-player-info-sheet-episodes-heading"
        >
          <h3
            id="podcast-player-info-sheet-episodes-heading"
            className="music-info__swimlane-title podcast-info__episodes-section-title"
          >
            Episodes
          </h3>
          <div className="podcast-info__episodes-scroll">
            <div className="podcast-info__episodes-stack">
              {podcast.episodes.map((ep) => (
                <EpisodeCard
                  key={ep.id}
                  episode={ep}
                  isBookmarked={isBookmarked(ep.id)}
                  isDownloaded={isDownloaded(ep.id)}
                  progressFraction={getEpisodeProgress(ep.id)}
                  onNavigate={() => switchEpisode(ep.id)}
                  onToggleBookmark={() => {
                    if (
                      !isBookmarked(ep.id) &&
                      !userMayBookmarkEpisodes(userType)
                    ) {
                      openAccountRequiredDialog("episodeBookmark");
                      return;
                    }
                    toggleBookmark(ep.id);
                  }}
                  onToggleDownload={() => {
                    if (
                      !isDownloaded(ep.id) &&
                      !userMayDownloadEpisodesOffline(userType)
                    ) {
                      openAccountRequiredDialog("episodeOfflineDownload");
                      return;
                    }
                    toggleDownload(ep.id);
                  }}
                  onStubResumeToggle={() => toggleStubResume(ep.id)}
                />
              ))}
            </div>
          </div>
        </section>
      </div>
    </PlayerInfoBottomSheet>
  );
}
