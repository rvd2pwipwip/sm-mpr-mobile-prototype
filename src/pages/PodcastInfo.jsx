import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ButtonSmall from "../components/ButtonSmall";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getPodcastById } from "../data/podcasts";
import "./MusicChannelInfo.css";
import "./PodcastInfo.css";

/** Podcast show detail — Phase 1 shell (Figma `podcastInfo` `19585:135699`); episode list arrives in Phase 3. */
export default function PodcastInfo() {
  const { podcastId } = useParams();
  const navigate = useNavigate();
  const [descExpanded, setDescExpanded] = useState(false);

  const podcast = podcastId ? getPodcastById(podcastId) : null;

  if (!podcast) {
    return <Navigate to="/" replace />;
  }

  const goBack = () => navigate(-1);
  const firstEpisode = podcast.episodes[0] ?? null;
  const playFirstEpisode = () => {
    if (firstEpisode) {
      navigate(`/podcast/${podcast.id}/play/${firstEpisode.id}`);
    }
  };

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
                  onClick={playFirstEpisode}
                >
                  {firstEpisode ? "Play latest episode (stub)" : "No episodes"}
                </ButtonSmall>
                <ButtonSmall variant="secondary" fullWidth>
                  Subscribe
                </ButtonSmall>
                <ButtonSmall variant="secondary" fullWidth>
                  Share
                </ButtonSmall>
              </div>
            </div>

            <div className="music-info__desc-block">
              <p
                className={
                  descExpanded
                    ? "music-info__description"
                    : "music-info__description music-info__description--clamped"
                }
              >
                {podcast.description}
              </p>
              <button
                type="button"
                className="music-info__more"
                onClick={() => setDescExpanded((e) => !e)}
              >
                {descExpanded ? "Less" : "More..."}
              </button>
            </div>

            <p className="podcast-info-phase1__note">
              Phase 1 — episode cards in Phase 3. Try an episode:
            </p>
            <ul className="podcast-info-phase1__ep-list">
              {podcast.episodes.slice(0, 3).map((ep) => (
                <li key={ep.id} className="podcast-info-phase1__ep-item">
                  <button
                    type="button"
                    className="podcast-info-phase1__ep-link"
                    onClick={() =>
                      navigate(`/podcast/${podcast.id}/play/${ep.id}`)
                    }
                  >
                    {ep.title}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
