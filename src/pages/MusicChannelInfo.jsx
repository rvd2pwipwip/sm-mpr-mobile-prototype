import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ContentTileCard from "../components/ContentTileCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMusicChannelById } from "../data/musicChannels";
import "./MusicChannelInfo.css";

function IconPlay() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden={true}>
      <path d="M8 5v14l11-7z" />
    </svg>
  );
}

function IconHeart() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden={true}
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}

function IconShare() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden={true}>
      <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z" />
    </svg>
  );
}

/** Channel Info — Figma `musicInfo` `25:7067`. */
export default function MusicChannelInfo() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const [descExpanded, setDescExpanded] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const goBack = () => navigate(-1);
  const goPlay = () => navigate(`/music/${channel.id}/play`);

  return (
    <main className="app-shell music-info">
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
            <h1 className="music-info__name">{channel.name}</h1>

            <div className="music-info__hero">
              <div className="music-info__thumb-wrap">
                <img
                  className="music-info__thumb"
                  src={channel.thumbnail}
                  alt=""
                  width={230}
                  height={230}
                  loading="eager"
                  decoding="async"
                />
              </div>
              <div className="music-info__actions-col">
                <button
                  type="button"
                  className="music-info__btn music-info__btn--play"
                  onClick={goPlay}
                >
                  <IconPlay />
                  Play
                </button>
                <button type="button" className="music-info__btn music-info__btn--outline">
                  <IconHeart />
                  Like
                </button>
                <button type="button" className="music-info__btn music-info__btn--outline">
                  <IconShare />
                  Share
                </button>
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
                {channel.description}
              </p>
              <button
                type="button"
                className="music-info__more"
                onClick={() => setDescExpanded((e) => !e)}
              >
                {descExpanded ? "Less" : "More..."}
              </button>
            </div>
          </div>

          {channel.tags?.length ? (
            <div className="music-info__h-lane">
              <div className="music-info__h-scroll">
                <div className="music-info__h-scroll-inner music-info__h-scroll-inner--tags">
                  {channel.tags.map((tag) => (
                    <span key={tag} className="music-info__tag">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {channel.relatedChannels?.length ? (
            <section
              className="music-info__swimlane"
              aria-label="Related channels"
            >
              <h2 className="music-info__swimlane-title">Related</h2>
              <div className="music-info__h-scroll">
                <div className="music-info__h-scroll-inner music-info__h-scroll-inner--cards">
                  {channel.relatedChannels.map((rel) => (
                    <ContentTileCard
                      key={rel.id}
                      title={rel.name}
                      imageUrl={rel.thumbnail}
                      onSelect={() => navigate(`/music/${rel.id}`)}
                    />
                  ))}
                </div>
              </div>
            </section>
          ) : null}
        </div>
      </div>
    </main>
  );
}
