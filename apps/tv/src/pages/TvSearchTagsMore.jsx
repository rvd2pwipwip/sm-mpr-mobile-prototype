import { useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getMusicChannelsWithTag } from "@sm-mpr/shared/data/musicChannels.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";

/** Channel grid for an exact vibe tag (`/search/more/tags?q=`). */
export default function TvSearchTagsMore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rawQ = params.get("q") ?? "";
  const tag = rawQ.trim();
  const channels = useMemo(
    () => (tag ? getMusicChannelsWithTag(tag) : []),
    [tag],
  );

  const screenId = useMemo(() => {
    const slug = tag.slice(0, 48).replace(/\s+/g, "-") || "missing";
    return `search-more-tags-${slug}`;
  }, [tag]);

  return (
    <TvSearchBrowseDrillPage
      screenId={screenId}
      title={tag || "Tags"}
      items={channels}
      emptyMessage={
        !tag
          ? "Missing tag query."
          : `No channels with tag "${tag}".`
      }
      onSelectItem={(channel) => navigate(`/music/${channel.id}`)}
      renderItem={(channel, isFocused, setRef, onSelect, cellNav) => (
        <KeyboardWrapper
          ref={setRef}
          selectData={channel}
          onSelect={() => onSelect(channel)}
          {...gridCellKeyboardProps(cellNav)}

        >
          {(focusProps) => (
            <MusicChannelCard
              {...focusProps}
              channel={channel}
              focused={isFocused}
            />
          )}
        </KeyboardWrapper>
      )}
    />
  );
}
