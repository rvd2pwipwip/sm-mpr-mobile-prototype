import { useNavigate, useSearchParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMusicChannelsWithTag } from "../data/musicChannels";
import "./SwimlaneMore.css";

/**
 * Full grid for Search **Tags** lane **More** — same 2-col layout as `SwimlaneMore`.
 * Opened from Search results or by tapping a `.music-info__tag` on Channel Info (`?q=` = tag label).
 */
export default function SearchTagsMore() {
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const rawQ = params.get("q") ?? "";
  const q = rawQ.trim();
  const channels = q ? getMusicChannelsWithTag(q) : [];

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={q || "Tags"}
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
        {!q ? (
          <p className="text-muted" style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}>
            Missing tag query.
          </p>
        ) : channels.length === 0 ? (
          <p className="text-muted" style={{ padding: "0 var(--swimlane-more-inline, 40px)" }}>
            No channels with tag “{q}”.
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
