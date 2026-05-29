import { useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import FocusableButton from "../components/focus/FocusableButton.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import MusicChannelSwimlane from "../components/swimlanes/MusicChannelSwimlane.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import "./MusicChannelInfo.css";

const ACTIONS_GROUP = 0;
const RELATED_GROUP = 1;
const EMPTY_RELATED = [];

export default function MusicChannelInfo() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const [playPressed, setPlayPressed] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const relatedChannels = channel?.relatedChannels ?? EMPTY_RELATED;
  const relatedCount = relatedChannels.length;
  const hasRelated = relatedCount > 0;

  const {
    handleMoveUp,
    handleMoveDown,
    registerItemRef,
    isItemFocused,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNavFromContent,
  } = useScreenContentFocus(`channel-info-${channelId}`, {
    groupCount: hasRelated ? 2 : 1,
    itemCounts: hasRelated
      ? { [ACTIONS_GROUP]: 1, [RELATED_GROUP]: relatedCount }
      : { [ACTIONS_GROUP]: 1 },
    swimlaneGroups: hasRelated ? [RELATED_GROUP] : [],
  });

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const openChannel = (targetChannel) => {
    enterContent();
    navigate(`/music/${targetChannel.id}`);
  };

  return (
    <div className="tv-page music-channel-info">
      <h1 className="tv-page__title">{channel.name}</h1>

      <div className="music-channel-info__hero">
        <div className="music-channel-info__thumb-wrap">
          <img
            className="music-channel-info__thumb"
            src={channel.thumbnail}
            alt=""
          />
        </div>

        <div className="music-channel-info__actions">
          <KeyboardWrapper
            ref={(node) => registerItemRef(ACTIONS_GROUP, 0, node)}
            onSelect={() => setPlayPressed(true)}
            onMoveUp={handleMoveUp}
            onMoveDown={hasRelated ? handleMoveDown : undefined}
          >
            {(focusProps) => (
              <FocusableButton
                {...focusProps}
                focused={isItemFocused(ACTIONS_GROUP, 0)}
                className="music-channel-info__play focusable-button--cta"
              >
                Play
              </FocusableButton>
            )}
          </KeyboardWrapper>

          {playPressed ? (
            <p className="music-channel-info__play-note" role="status">
              Play prototype — full-screen player ships later.
            </p>
          ) : null}
        </div>
      </div>

      {channel.description ? (
        <p className="music-channel-info__description">{channel.description}</p>
      ) : null}

      {channel.tags?.length ? (
        <ul className="music-channel-info__tags" aria-label="Tags">
          {channel.tags.map((tag) => (
            <li key={tag} className="music-channel-info__tag">
              {tag}
            </li>
          ))}
        </ul>
      ) : null}

      {hasRelated ? (
        <MusicChannelSwimlane
          title="Related"
          channels={relatedChannels}
          sourceCount={relatedCount}
          groupIndex={RELATED_GROUP}
          focused={isContentGroupActive(RELATED_GROUP)}
          focusedIndex={getItemFocusIndex(RELATED_GROUP)}
          onFocusChange={(index) => setFocusedIndex(RELATED_GROUP, index)}
          onBoundaryLeft={enterNavFromContent}
          registerItemRef={registerItemRef}
          onMoveUp={handleMoveUp}
          onMoveDown={handleMoveDown}
          onSelectChannel={openChannel}
        />
      ) : null}

      <p className="tv-page__lede">Press Esc to go back.</p>
    </div>
  );
}
