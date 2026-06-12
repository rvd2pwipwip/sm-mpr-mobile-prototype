import { useMemo, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import ChannelInfoDescription from "../components/channel-info/ChannelInfoDescription.jsx";
import ChannelInfoDescriptionDialog from "../components/channel-info/ChannelInfoDescriptionDialog.jsx";
import ChannelInfoRelatedRow from "../components/channel-info/ChannelInfoRelatedRow.jsx";
import ChannelInfoTagsSwimlane from "../components/channel-info/ChannelInfoTagsSwimlane.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvUpgradeButton from "../components/TvUpgradeButton.jsx";
import {
  CHANNEL_INFO_RELATED_MAX,
  withChannelInfoTagScrollTest,
} from "../constants/channelInfo.js";
import { useDescriptionClampOverflow } from "../hooks/useDescriptionClampOverflow.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvNavFocus } from "../context/TvNavFocusContext.jsx";
import "./MusicChannelInfo.css";

const ACTIONS_GROUP = 0;
const EMPTY_RELATED = [];

export default function MusicChannelInfo() {
  const { channelId } = useParams();
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const descriptionText = channel?.description ?? "";
  const hasDescription = Boolean(descriptionText);
  const { ref: descriptionRef, overflows: descriptionOverflows } =
    useDescriptionClampOverflow(descriptionText, hasDescription);

  const tags = useMemo(() => {
    if (!channel) return [];
    return withChannelInfoTagScrollTest(channel.tags ?? []);
  }, [channel]);
  const hasTags = tags.length > 0;
  const relatedChannels = useMemo(
    () =>
      (channel?.relatedChannels ?? EMPTY_RELATED).slice(0, CHANNEL_INFO_RELATED_MAX),
    [channel?.relatedChannels],
  );
  const relatedCount = relatedChannels.length;
  const hasRelated = relatedCount > 0;

  const {
    descriptionGroup,
    tagsGroup,
    relatedGroup,
    groupCount,
    itemCounts,
    swimlaneGroups,
  } = useMemo(() => {
    let next = 1;
    const descG =
      hasDescription && descriptionOverflows ? next++ : null;
    const tagsG = hasTags ? next++ : null;
    const relatedG = hasRelated ? next++ : null;
    const counts = { [ACTIONS_GROUP]: 1 };
    if (descG != null) counts[descG] = 1;
    if (tagsG != null) counts[tagsG] = tags.length;
    if (relatedG != null) counts[relatedG] = relatedCount;
    return {
      descriptionGroup: descG,
      tagsGroup: tagsG,
      relatedGroup: relatedG,
      groupCount: next,
      itemCounts: counts,
      swimlaneGroups: tagsG != null ? [tagsG] : [],
    };
  }, [
    hasDescription,
    descriptionOverflows,
    hasTags,
    hasRelated,
    tags.length,
    relatedCount,
  ]);

  const {
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    registerItemRef,
    isItemFocused,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNavFromContent,
  } = useScreenContentFocus(`channel-info-${channelId}`, {
    groupCount,
    itemCounts,
    swimlaneGroups,
    contentKeysEnabled: !descriptionDialogOpen,
    suspendDomFocus: descriptionDialogOpen,
  });

  if (!channel) {
    return <Navigate to="/" replace />;
  }

  const openChannel = (targetChannel) => {
    enterContent();
    navigate(`/music/${targetChannel.id}`);
  };

  const playDownTarget =
    descriptionGroup ?? tagsGroup ?? relatedGroup;
  const descriptionDownTarget = tagsGroup ?? relatedGroup;

  return (
    <div className="tv-page music-channel-info">
      <div className="music-channel-info__stack">
        <div className="music-channel-info__hero">
          <div className="music-channel-info__thumb-wrap">
            <img
              className="music-channel-info__thumb"
              src={channel.thumbnail}
              alt=""
            />
          </div>

          <div className="music-channel-info__details">
            <h1 className="music-channel-info__title tv-screen-header-title">
              {channel.name}
            </h1>

            <div className="music-channel-info__actions-row">
              <KeyboardWrapper
                ref={(node) => registerItemRef(ACTIONS_GROUP, 0, node)}
                onSelect={() => navigate(`/music/${channel.id}/play`)}
                onMoveUp={handleMoveUp}
                onMoveDown={playDownTarget != null ? handleMoveDown : undefined}
              >
                {(focusProps) => (
                  <TvUpgradeButton
                    {...focusProps}
                    focused={isItemFocused(ACTIONS_GROUP, 0)}
                    iconSrc="/play.svg"
                    label="Play"
                  />
                )}
              </KeyboardWrapper>

            </div>

            {hasDescription ? (
              <ChannelInfoDescription
                text={descriptionText}
                descriptionRef={descriptionRef}
                overflows={descriptionOverflows}
                groupIndex={descriptionGroup}
                focused={
                  descriptionGroup != null &&
                  isItemFocused(descriptionGroup, 0)
                }
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={
                  descriptionDownTarget != null ? handleMoveDown : undefined
                }
                onSelect={() => setDescriptionDialogOpen(true)}
              />
            ) : null}

            {hasTags && tagsGroup != null ? (
              <ChannelInfoTagsSwimlane
                tags={tags}
                groupIndex={tagsGroup}
                focused={isContentGroupActive(tagsGroup)}
                focusedIndex={getItemFocusIndex(tagsGroup)}
                onFocusChange={(index) => setFocusedIndex(tagsGroup, index)}
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={
                  relatedGroup != null ? handleMoveDown : undefined
                }
              />
            ) : null}
          </div>
        </div>

        {hasRelated && relatedGroup != null ? (
          <ChannelInfoRelatedRow
            channels={relatedChannels}
            groupIndex={relatedGroup}
            focused={isContentGroupActive(relatedGroup)}
            focusedIndex={getItemFocusIndex(relatedGroup)}
            registerItemRef={registerItemRef}
            onMoveUp={handleMoveUp}
            onMoveDown={handleMoveDown}
            onMoveLeft={handleMoveLeft}
            onMoveRight={handleMoveRight}
            onSelectChannel={openChannel}
          />
        ) : null}
      </div>

      <ChannelInfoDescriptionDialog
        open={descriptionDialogOpen}
        channelName={channel.name}
        description={descriptionText}
        onClose={() => setDescriptionDialogOpen(false)}
      />

      <p className="tv-page__lede">Press Esc to go back.</p>
    </div>
  );
}
