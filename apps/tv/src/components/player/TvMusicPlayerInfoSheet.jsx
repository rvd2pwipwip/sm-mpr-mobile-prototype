import { useEffect, useMemo, useState } from "react";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import ChannelInfoDescription from "../channel-info/ChannelInfoDescription.jsx";
import ChannelInfoDescriptionDialog from "../channel-info/ChannelInfoDescriptionDialog.jsx";
import ChannelInfoRelatedRow from "../channel-info/ChannelInfoRelatedRow.jsx";
import ChannelInfoTagsSwimlane from "../channel-info/ChannelInfoTagsSwimlane.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvButton from "../TvButton.jsx";
import {
  CHANNEL_INFO_RELATED_MAX,
  withChannelInfoTagScrollTest,
} from "../../constants/channelInfo.js";
import { useDescriptionClampOverflow } from "../../hooks/useDescriptionClampOverflow.js";
import { useMusicRadioLikeAction } from "../../hooks/useMusicRadioLikeAction.js";
import { useScreenContentFocus } from "../../hooks/useScreenContentFocus.js";
import { useTvPlayerInfoSheetSession } from "../../hooks/useTvPlayerInfoSheetSession.js";
import TvPlayerInfoBottomSheet from "./TvPlayerInfoBottomSheet.jsx";
import "../../pages/MusicChannelInfo.css";

const ACTIONS_GROUP = 0;
const PLAY_ACTION = 0;
const LIKE_ACTION = 1;
const EMPTY_RELATED = [];

/**
 * Music channel info inside the player bottom sheet — layout parity with
 * `MusicChannelInfo` without PrimaryNav; deep links exit the player route.
 */
export default function TvMusicPlayerInfoSheet({
  open,
  onClose,
  channelId,
  playing,
  onTogglePlay,
  onLeavePlayer,
}) {
  const [descriptionDialogOpen, setDescriptionDialogOpen] = useState(false);

  const channel = channelId ? getMusicChannelById(channelId) : null;
  const channelLike = useMusicRadioLikeAction("music", channel?.id);
  const descriptionText = channel?.description ?? "";
  const hasDescription = Boolean(descriptionText);
  const { ref: descriptionRef, overflows: descriptionOverflows } =
    useDescriptionClampOverflow(descriptionText, hasDescription, open);

  const tags = useMemo(() => {
    if (!channel) return [];
    return withChannelInfoTagScrollTest(channel.tags ?? []);
  }, [channel]);
  const hasTags = tags.length > 0;
  const relatedChannels = useMemo(
    () =>
      (channel?.relatedChannels ?? EMPTY_RELATED).slice(
        0,
        CHANNEL_INFO_RELATED_MAX,
      ),
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
    const counts = { [ACTIONS_GROUP]: 2 };
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

  const focusScreenId = `music-player-info-sheet-${channelId}`;

  useTvPlayerInfoSheetSession({
    open,
    focusScreenId,
    landingGroupIndex: ACTIONS_GROUP,
    landingItemIndex: PLAY_ACTION,
  });

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
    syncDomFocus,
  } = useScreenContentFocus(focusScreenId, {
    groupCount,
    itemCounts,
    swimlaneGroups,
    defaultGroupIndex: ACTIONS_GROUP,
    defaultItemIndex: PLAY_ACTION,
    navEnterEnabled: false,
    contentKeysEnabled: open && !descriptionDialogOpen,
    suspendDomFocus: !open || descriptionDialogOpen,
  });

  useEffect(() => {
    if (!open || descriptionDialogOpen) return;
    syncDomFocus();
  }, [open, descriptionDialogOpen, descriptionOverflows, syncDomFocus]);

  useEffect(() => {
    if (open) return;
    setDescriptionDialogOpen(false);
  }, [open]);

  if (!channel) return null;

  const playDownTarget = descriptionGroup ?? tagsGroup ?? relatedGroup;
  const descriptionDownTarget = tagsGroup ?? relatedGroup;
  const titleId = `tv-music-player-info-sheet-title-${channel.id}`;

  const leaveForTag = (tag) => {
    onClose();
    onLeavePlayer(`/search/more/tags?q=${encodeURIComponent(tag)}`);
  };

  const leaveForChannel = (targetChannel) => {
    onClose();
    onLeavePlayer(`/music/${targetChannel.id}`);
  };

  return (
    <TvPlayerInfoBottomSheet
      open={open}
      onClose={onClose}
      ariaLabelledBy={titleId}
    >
      <div className="tv-player-info-sheet__scroll">
        <div className="tv-player-info-sheet__content music-channel-info__stack">
          <div className="music-channel-info__hero">
            <div className="music-channel-info__thumb-wrap">
              <img
                className="music-channel-info__thumb"
                src={channel.thumbnail}
                alt=""
              />
            </div>

            <div className="music-channel-info__details">
              <h2
                id={titleId}
                className="music-channel-info__title tv-screen-header-title"
              >
                {channel.name}
              </h2>

              <div className="music-channel-info__actions-row">
                <KeyboardWrapper
                  ref={(node) =>
                    registerItemRef(ACTIONS_GROUP, PLAY_ACTION, node)
                  }
                  onSelect={onTogglePlay}
                  onUp={handleMoveUp}
                  onDown={
                    playDownTarget != null ? handleMoveDown : undefined
                  }
                  onLeft={handleMoveLeft}
                  onRight={handleMoveRight}
                >
                  {(focusProps) => (
                    <TvButton
                      {...focusProps}
                      focused={isItemFocused(ACTIONS_GROUP, PLAY_ACTION)}
                      iconMaskVariant={playing ? "pause" : "play"}
                      label={playing ? "Pause" : "Play"}
                    />
                  )}
                </KeyboardWrapper>

                <KeyboardWrapper
                  ref={(node) =>
                    registerItemRef(ACTIONS_GROUP, LIKE_ACTION, node)
                  }
                  onSelect={() => channelLike.onPress()}
                  onUp={handleMoveUp}
                  onDown={
                    playDownTarget != null ? handleMoveDown : undefined
                  }
                  onLeft={handleMoveLeft}
                  onRight={handleMoveRight}
                >
                  {(focusProps) => (
                    <TvButton
                      {...focusProps}
                      variant="secondary"
                      focused={isItemFocused(ACTIONS_GROUP, LIKE_ACTION)}
                      iconMaskVariant={channelLike.iconVariant}
                      label={channelLike.label}
                      ariaLabel={channelLike.ariaLabel}
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
                  registerItemRef={registerItemRef}
                  onMoveUp={handleMoveUp}
                  onMoveDown={
                    relatedGroup != null ? handleMoveDown : undefined
                  }
                  onSelectTag={leaveForTag}
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
              onSelectChannel={leaveForChannel}
            />
          ) : null}
        </div>
      </div>

      <ChannelInfoDescriptionDialog
        open={descriptionDialogOpen}
        channelName={channel.name}
        description={descriptionText}
        onClose={() => setDescriptionDialogOpen(false)}
      />
    </TvPlayerInfoBottomSheet>
  );
}
