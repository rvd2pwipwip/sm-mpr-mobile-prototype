import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { getMusicChannelById } from "@sm-mpr/shared/data/musicChannels.js";
import { myLibraryLikesMorePath } from "@sm-mpr/shared/constants/myLibraryLikes.js";
import { useLikes } from "../../context/LikesContext.jsx";
import { usePlayback } from "../../context/PlaybackContext.jsx";
import MusicChannelSwimlane from "../swimlanes/MusicChannelSwimlane.jsx";
import "../cards/ContentTileCard.css";

/** Your music channels — liked channels only; hidden when empty. */
export default function TvLibraryLikedMusicSection({
  groupIndex,
  focused,
  focusedIndex,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const navigate = useNavigate();
  const { items } = useLikes();
  const { session } = usePlayback();
  const playingChannelId =
    session.active && session.channelId ? session.channelId : null;

  const channels = useMemo(() => {
    const out = [];
    for (const entry of items) {
      if (entry.kind !== "music") continue;
      const channel = getMusicChannelById(entry.id);
      if (channel) out.push(channel);
    }
    return out;
  }, [items]);

  if (channels.length === 0) return null;

  return (
    <MusicChannelSwimlane
      title="Your music channels"
      channels={channels}
      sourceCount={channels.length}
      groupIndex={groupIndex}
      playingChannelId={playingChannelId}
      focused={focused}
      focusedIndex={focusedIndex}
      onFocusChange={onFocusChange}
      onBoundaryLeft={onBoundaryLeft}
      registerItemRef={registerItemRef}
      onMoveUp={onMoveUp}
      onMoveDown={onMoveDown}
      onMore={() => navigate(myLibraryLikesMorePath("music"))}
    />
  );
}
