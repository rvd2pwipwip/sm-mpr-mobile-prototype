import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ButtonSmall from "../components/ButtonSmall";
import EpisodeCard from "../components/EpisodeCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import { usePodcastUserState } from "../context/PodcastUserStateContext";
import { getPodcastById } from "../data/podcasts";
import { useDescriptionClampOverflow } from "../hooks/useDescriptionClampOverflow";
import "./MusicChannelInfo.css";
import "./PodcastInfo.css";

/** Same mask pattern as `MusicChannelInfo` — `public/*.svg` via `currentColor`. */
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

/** Podcast show detail — Figma `podcastInfo` `19585:135699`; episode list uses `EpisodeCard` (Figma `19586:136643`). */
export default function PodcastInfo() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
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
    setDescExpanded(false);
  }, [podcastId]);

  const { ref: descRef, overflows: descOverflows } = useDescriptionClampOverflow(
    podcast?.description ?? "",
    !descExpanded,
  );

  if (!podcast) {
    return <Navigate to="/" replace />;
  }

  const goBack = () => navigate(-1);
  const firstEpisode = podcast.episodes[0] ?? null;
  const playFirstEpisode = () => {
    if (firstEpisode) {
      navigate(`/podcast/${podcast.id}/play/${firstEpisode.id}`, {
        replace: true,
        state: playOverDetailNavigateState(),
      });
    }
  };

  const subscribedHere = isSubscribed(podcast.id);

  const toggleStubResume = (episodeId) => {
    const f = getEpisodeProgress(episodeId);
    setEpisodeProgress(episodeId, f > 0 && f < 1 ? 0 : 0.35);
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
    <main className="app-shell app-shell--footer-fixed music-info">
      <ScreenHeader
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="music-info__scroll">
        <div className="music-info__column">
          <div className="music-info__inset">
            <h1 className="music-info__name">{podcast.title}</h1>

            <div className="music-info__hero">
              <div className="music-info__thumb-wrap">
                <img
                  className="music-info__thumb"
                  src={podcast.thumbnail}
                  alt=""
                  width={230}
                  height={230}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="music-info__actions-col">
                <ButtonSmall
                  variant="cta"
                  fullWidth
                  disabled={!firstEpisode}
                  startIcon={<ActionIconMask variant="play" />}
                  onClick={playFirstEpisode}
                >
                  {firstEpisode ? "Play latest" : "No episodes"}
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
                  onClick={() => toggleSubscribe(podcast.id)}
                >
                  {subscribedHere ? "Unsubscribe" : "Subscribe"}
                </ButtonSmall>
                <ButtonSmall
                  variant="secondary"
                  fullWidth
                  startIcon={<ActionIconMask variant="share" />}
                >
                  Share
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
                  onClick={() => setDescExpanded((e) => !e)}
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
            aria-labelledby="podcast-info-episodes-heading"
          >
            <h2
              id="podcast-info-episodes-heading"
              className="music-info__swimlane-title podcast-info__episodes-section-title"
            >
              Episodes
            </h2>
            <div className="podcast-info__episodes-scroll">
              <div className="podcast-info__episodes-stack">
                {podcast.episodes.map((ep) => (
                  <EpisodeCard
                    key={ep.id}
                    episode={ep}
                    isBookmarked={isBookmarked(ep.id)}
                    isDownloaded={isDownloaded(ep.id)}
                    progressFraction={getEpisodeProgress(ep.id)}
                    onNavigate={() =>
                      navigate(`/podcast/${podcast.id}/play/${ep.id}`, {
                        replace: true,
                        state: playOverDetailNavigateState(),
                      })
                    }
                    onToggleBookmark={() => toggleBookmark(ep.id)}
                    onToggleDownload={() => toggleDownload(ep.id)}
                    onStubResumeToggle={() => toggleStubResume(ep.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
