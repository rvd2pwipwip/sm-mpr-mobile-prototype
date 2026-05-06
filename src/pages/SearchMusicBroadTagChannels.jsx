import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getBroadTagLabelFromSlug } from "../data/musicBrowseTaxonomy.js";
import { getMusicChannelsWithTag } from "../data/musicChannels";
import "./SwimlaneMore.css";

/** Broad lineup: channel grid for one **tag** under Activity / Mood / Era / Theme. */
export default function SearchMusicBroadTagChannels() {
  const { vibeId, tagSlug } = useParams();
  const navigate = useNavigate();

  const tagLabel =
    vibeId && tagSlug ? getBroadTagLabelFromSlug(vibeId, tagSlug) : null;
  const channels = tagLabel ? getMusicChannelsWithTag(tagLabel) : [];

  if (!vibeId || !tagSlug || !tagLabel) {
    return <Navigate to="/search" replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={tagLabel}
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
            No channels with tag “{tagLabel}”.
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
