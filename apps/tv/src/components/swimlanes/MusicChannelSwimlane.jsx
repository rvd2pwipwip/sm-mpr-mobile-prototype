import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import MusicChannelCard from "../cards/MusicChannelCard.jsx";
import SwimlaneMoreTile from "./SwimlaneMoreTile.jsx";
import SwimlaneRow from "./SwimlaneRow.jsx";
import "../cards/ContentTileCard.css";

/**
 * Music channel fixed swimlane — channels + optional More tile.
 */
export default function MusicChannelSwimlane({
  title,
  channels,
  sourceCount,
  groupIndex = 0,
  playingChannelId = null,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
  onSelectChannel,
  onMore,
  hint,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();

  const showMoreTile = sourceCount > SWIMLANE_CARD_MAX;
  const visibleChannels = useMemo(
    () => channels.slice(0, SWIMLANE_CARD_MAX),
    [channels],
  );
  const slotCount = visibleChannels.length + (showMoreTile ? 1 : 0);
  const moreIndex = showMoreTile ? visibleChannels.length : -1;

  const registerSlotRef = (index, node) => {
    registerItemRef(groupIndex, index, node);
  };

  const renderSlot = (index, isFocused, setRef) => {
    if (showMoreTile && index === moreIndex) {
      return (
        <KeyboardWrapper
          key="more"
          ref={setRef}
          onSelect={() => {
            enterContent();
            if (onMore) onMore();
            else navigate("/more/music");
          }}
          onUp={onMoveUp}
          onDown={onMoveDown}
        >
          {(focusProps) => (
            <SwimlaneMoreTile {...focusProps} focused={isFocused} />
          )}
        </KeyboardWrapper>
      );
    }

    const channel = visibleChannels[index];
    if (!channel) return null;

    return (
      <KeyboardWrapper
        key={channel.id}
        ref={setRef}
        selectData={channel}
        onSelect={() => {
          enterContent();
          if (onSelectChannel) onSelectChannel(channel);
          else navigate(`/music/${channel.id}`);
        }}
        onUp={onMoveUp}
        onDown={onMoveDown}
      >
        {(focusProps) => (
          <MusicChannelCard
            {...focusProps}
            channel={channel}
            focused={isFocused}
            playing={playingChannelId === channel.id}
          />
        )}
      </KeyboardWrapper>
    );
  };

  return (
    <SwimlaneRow
      title={title}
      hint={hint}
      swimlaneProps={{
        slotCount,
        focusedIndex,
        onFocusChange,
        focused,
        onBoundaryLeft,
        registerSlotRef,
        renderSlot,
      }}
    />
  );
}
