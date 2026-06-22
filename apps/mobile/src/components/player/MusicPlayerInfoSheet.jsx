import { useEffect, useState } from "react";
import { getMusicChannelById } from "../../data/musicChannels";
import ButtonSmall from "../ButtonSmall";
import MusicChannelCard from "../MusicChannelCard";
import { useDescriptionClampOverflow } from "../../hooks/useDescriptionClampOverflow";
import { useMusicRadioLikeAction } from "../../hooks/useMusicRadioLikeAction";
import PlayerInfoBottomSheet from "./PlayerInfoBottomSheet";
import "../../pages/MusicChannelInfo.css";

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

export default function MusicPlayerInfoSheet({
  open,
  onClose,
  channelId,
  playing,
  onTogglePlay,
  onLeavePlayer,
}) {
  const [descExpanded, setDescExpanded] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const musicLike = useMusicRadioLikeAction("music", channel?.id);

  useEffect(() => {
    if (open) return;
    setDescExpanded(false);
  }, [open, channelId]);

  const { ref: descRef, overflows: descOverflows } = useDescriptionClampOverflow(
    channel?.description ?? "",
    !descExpanded,
    open,
  );

  if (!channel) return null;

  const titleId = `music-player-info-sheet-title-${channel.id}`;

  const leaveForTag = (tag) => {
    onClose();
    onLeavePlayer(`/search/more/tags?q=${encodeURIComponent(tag)}`);
  };

  const leaveForChannel = (targetId) => {
    onClose();
    onLeavePlayer(`/music/${targetId}`);
  };

  return (
    <PlayerInfoBottomSheet
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <div className="music-info__column player-info-bottom-sheet__content">
        <div className="music-info__inset">
          <h2 id={titleId} className="music-info__name">
            {channel.name}
          </h2>

          <div className="music-info__hero">
            <div className="music-info__thumb-wrap">
              <img
                className="music-info__thumb"
                src={channel.thumbnail}
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
                  <ActionIconMask variant={musicLike.iconVariant} />
                }
                onClick={musicLike.onPress}
              >
                {musicLike.label}
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
              {channel.description}
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
                    onClick={() => leaveForTag(tag)}
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
            <h3 className="music-info__swimlane-title">Related</h3>
            <div className="music-info__h-scroll">
              <div className="music-info__h-scroll-inner music-info__h-scroll-inner--cards">
                {channel.relatedChannels.map((rel) => (
                  <MusicChannelCard
                    key={rel.id}
                    channel={rel}
                    onSelect={() => leaveForChannel(rel.id)}
                  />
                ))}
              </div>
            </div>
          </section>
        ) : null}
      </div>
    </PlayerInfoBottomSheet>
  );
}
