import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { SEARCH_BROWSE } from "../constants/searchBrowsePaths.js";
import { SearchBrowseTile, SearchBrowseTileGrid } from "../components/SearchBrowseTile.jsx";
import {
  getBroadSubsMeta,
  getBroadTagLabelFromSlug,
  getBroadVibeById,
} from "../data/musicBrowseTaxonomy.js";
import { getMusicChannelsWithTag } from "../data/musicChannels";
import "./Search.css";
import "./SwimlaneMore.css";

/** Broad lineup: sub-tag picker under a tag with children, or channel grid for one leaf tag/sub-tag. */
export default function SearchMusicBroadTagChannels() {
  const { vibeId, tagSlug, subSlug } = useParams();
  const navigate = useNavigate();

  const vibe = vibeId ? getBroadVibeById(vibeId) : null;
  const meta = vibeId && tagSlug ? getBroadSubsMeta(vibeId, tagSlug) : null;

  if (!vibeId || !tagSlug || !vibe || !meta) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  const goBack = () => navigate(-1);

  /** Sub-tag grid (IA has subcategories). */
  if (meta.hasSubs && !subSlug) {
    const headingId = "search-broad-tag-subs-title";
    return (
      <main className="app-shell app-shell--footer-fixed swimlane-more">
        <ScreenHeader
          title={meta.label}
          startSlot={
            <button
              type="button"
              className="screen-header__icon-btn"
              onClick={goBack}
              aria-label="Back"
            >
              <ScreenHeaderChevronBack />
            </button>
          }
        />

        <div className="swimlane-more__scroll">
          <div className="content-inset search-page__body">
            <p id={headingId} className="text-muted" style={{ margin: "0 0 var(--space-4)" }}>
              Choose a sub-tag
            </p>
            <SearchBrowseTileGrid labelId={headingId}>
              {meta.subs.map((s) => (
                <SearchBrowseTile
                  key={s.slug}
                  onClick={() =>
                    navigate(`/search/browse/music/vibe/${vibeId}/tag/${tagSlug}/sub/${s.slug}`)
                  }
                >
                  {s.label}
                </SearchBrowseTile>
              ))}
            </SearchBrowseTileGrid>
          </div>
        </div>
      </main>
    );
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

  const channelTagLabel = getBroadTagLabelFromSlug(vibeId, tagSlug, subSlug);

  if (!channelTagLabel) {
    return <Navigate to={SEARCH_BROWSE.music} replace />;
  }

  const channels = getMusicChannelsWithTag(channelTagLabel);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={channelTagLabel}
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={goBack}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />

      <div className="swimlane-more__scroll">
        {channels.length === 0 ? (
          <p className="text-muted" style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}>
            No channels with tag “{channelTagLabel}”.
          </p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {channels.map((channel) => (
              <li key={channel.id} className="swimlane-more__cell">
                <MusicChannelCard
                  channel={channel}
                  onSelect={() => navigate(`/music/${channel.id}`)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
