import { forwardRef } from "react";
import ContentTileCard from "./ContentTileCard.jsx";

/**
 * Music channel tile from `@sm-mpr/shared` catalog data.
 */
const MusicChannelCard = forwardRef(function MusicChannelCard(
  {
    channel,
    focused = false,
    playing = false,
    onKeyDown,
    onClick,
  },
  ref,
) {
  return (
    <ContentTileCard
      ref={ref}
      title={channel.name}
      imageUrl={channel.thumbnail}
      focused={focused}
      playing={playing}
      onKeyDown={onKeyDown}
      onClick={onClick}
    />
  );
});

export default MusicChannelCard;
