import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ContentSwimlane from "./ContentSwimlane";
import MusicChannelCard from "./MusicChannelCard";
import { myLibraryLikesMorePath } from "../constants/myLibraryLikes";
import { SWIMLANE_CARD_MAX } from "../constants/swimlane";
import { useLikes } from "../context/LikesContext";
import { getMusicChannelById } from "../data/musicChannels";

/** Your music channels — liked channels only; hidden when empty (`My-Library-story`). */
export default function LibraryLikedMusicSwimlane() {
  const navigate = useNavigate();
  const { items } = useLikes();

  const channels = useMemo(() => {
    const out = [];
    for (const entry of items) {
      if (entry.kind !== "music") continue;
      const ch = getMusicChannelById(entry.id);
      if (ch) out.push(ch);
    }
    return out;
  }, [items]);

  if (channels.length === 0) {
    return null;
  }

  return (
    <ContentSwimlane
      title="Your music channels"
      sourceCount={channels.length}
      maxVisible={SWIMLANE_CARD_MAX}
      onMore={() => navigate(myLibraryLikesMorePath("music"))}
    >
      {channels.slice(0, SWIMLANE_CARD_MAX).map((channel) => (
        <MusicChannelCard
          key={channel.id}
          channel={channel}
          onSelect={() => navigate(`/music/${channel.id}`)}
        />
      ))}
    </ContentSwimlane>
  );
}
