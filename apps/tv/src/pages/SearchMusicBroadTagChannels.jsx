import { Navigate, useNavigate, useParams } from "react-router-dom";
import { SEARCH_BROWSE } from "@sm-mpr/shared/constants/searchBrowsePaths.js";
import {
  getBroadSubsMeta,
  getBroadTagLabelFromSlug,
  getBroadVibeById,
} from "@sm-mpr/shared/data/musicBrowseTaxonomy.js";
import { getMusicChannelsWithTag } from "@sm-mpr/shared/data/musicChannels.js";
import MusicChannelCard from "../components/cards/MusicChannelCard.jsx";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import { gridCellKeyboardProps } from "../components/grid/contentGridKeyboard.js";
import TvSearchBrowseDrillPage from "../components/search/TvSearchBrowseDrillPage.jsx";
import TvSearchLabelTile from "../components/search/TvSearchLabelTile.jsx";

/** Broad lineup: sub-tag picker or channel grid for one leaf tag/sub-tag. */
export default function SearchMusicBroadTagChannels() {
  const { vibeId, tagSlug, subSlug } = useParams();
  const navigate = useNavigate();

  const vibe = vibeId ? getBroadVibeById(vibeId) : null;
  const meta = vibeId && tagSlug ? getBroadSubsMeta(vibeId, tagSlug) : null;

  if (!vibeId || !tagSlug || !vibe || !meta) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  if (meta.hasSubs && subSlug && !meta.subs.some((s) => s.slug === subSlug)) {
    return (
      <Navigate
        to={`/search/browse/music/vibe/${vibeId}/tag/${tagSlug}`}
        replace
      />
    );
  }

  if (!meta.hasSubs && subSlug) {
    return (
      <Navigate
        to={`/search/browse/music/vibe/${vibeId}/tag/${tagSlug}`}
        replace
      />
    );
  }

  if (meta.hasSubs && !subSlug) {
    const tiles = meta.subs.map((s) => ({ id: s.slug, label: s.label, sub: s }));

    return (
      <TvSearchBrowseDrillPage
        screenId={`search-music-tag-${vibeId}-${tagSlug}`}
        title={meta.label}
        items={tiles}
        emptyMessage="No sub-tags."
        onSelectItem={(tile) =>
          navigate(
            `/search/browse/music/vibe/${vibeId}/tag/${tagSlug}/sub/${tile.sub.slug}`,
          )
        }
        renderItem={(tile, isFocused, setRef, onSelect, cellNav) => (
          <KeyboardWrapper
            ref={setRef}
            onSelect={() => onSelect(tile)}
          {...gridCellKeyboardProps(cellNav)}

          >
            {(focusProps) => (
              <TvSearchLabelTile
                {...focusProps}
                label={tile.label}
                focused={isFocused}
              />
            )}
          </KeyboardWrapper>
        )}
      />
    );
  }

  const channelTagLabel = getBroadTagLabelFromSlug(vibeId, tagSlug, subSlug);

  if (!channelTagLabel) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  const channels = getMusicChannelsWithTag(channelTagLabel);

  return (
    <TvSearchBrowseDrillPage
      screenId={`search-music-tag-channels-${vibeId}-${tagSlug}-${subSlug ?? "leaf"}`}
      title={channelTagLabel}
      items={channels}
      emptyMessage={`No channels with tag "${channelTagLabel}".`}
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
