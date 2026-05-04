import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import ButtonSmall from "../components/ButtonSmall";
import ContentTileCard from "../components/ContentTileCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { playOverDetailNavigateState } from "../constants/fullPlayerNavigation";
import { getMusicChannelById } from "../data/musicChannels";
import "./MusicChannelInfo.css";

/** Icons from `public/*.svg` via CSS mask so they follow `ButtonSmall` `currentColor`. */
function ActionIconMask({ variant }) {
  return (
    <span
      className={["music-info__action-icon-mask", `music-info__action-icon-mask--${variant}`].join(
        " "
      )}
      aria-hidden={true}
    />
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
  const goPlay = () =>
    navigate(`/music/${channel.id}/play`, {
      state: playOverDetailNavigateState(),
    });

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
                <ButtonSmall
                  variant="cta"
                  fullWidth
                  startIcon={<ActionIconMask variant="play" />}
                  onClick={goPlay}
                >
                  Play
                </ButtonSmall>
                <ButtonSmall
                  variant="secondary"
                  fullWidth
                  startIcon={<ActionIconMask variant="like" />}
                >
                  Like
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
                    <ButtonSmall
                      key={tag}
                      variant="secondary"
                      className="music-info__tag"
                    >
                      {tag}
                    </ButtonSmall>
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
