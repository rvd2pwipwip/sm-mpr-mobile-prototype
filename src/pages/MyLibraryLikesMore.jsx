import { Navigate, useNavigate, useParams } from "react-router-dom";
import MusicChannelCard from "../components/MusicChannelCard";
import RadioStationCard from "../components/RadioStationCard";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { getMusicChannelById } from "../data/musicChannels";
import { getRadioStationById } from "../data/radioStations";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";
import { useLikes } from "../context/LikesContext";
import "./ListenAgainMore.css";
import "./SwimlaneMore.css";

const MORE_TITLE = {
  music: "Your music channels",
  radio: "Your radio stations",
};

/** Full grid for `/my-library/likes/music` or `/my-library/likes/radio`. */
export default function MyLibraryLikesMore() {
  const { likeKind } = useParams();
  const navigate = useNavigate();
  const { items } = useLikes();
  const goBack = () => navigate(-1);

  if (likeKind !== "music" && likeKind !== "radio") {
    return <Navigate to="/my-library" replace />;
  }

  const title = MORE_TITLE[likeKind];

  const rows =
    likeKind === "music"
      ? items
          .filter((x) => x.kind === "music")
          .map((x) => getMusicChannelById(x.id))
          .filter(Boolean)
      : items
          .filter((x) => x.kind === "radio")
          .map((x) => getRadioStationById(x.id) ?? resolveRadioStationForStub(x.id))
          .filter(Boolean);

  return (
    <main className="app-shell app-shell--footer-fixed swimlane-more">
      <ScreenHeader
        title={title}
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
        {rows.length === 0 ? (
          <p className="listen-again-more__empty">Nothing saved yet.</p>
        ) : (
          <ul className="swimlane-more__grid" role="list">
            {likeKind === "music"
              ? rows.map((channel) => (
                  <li key={channel.id} className="swimlane-more__cell">
                    <MusicChannelCard
                      channel={channel}
                      onSelect={() => navigate(`/music/${channel.id}`)}
                    />
                  </li>
                ))
              : rows.map((station) => (
                  <li key={station.id} className="swimlane-more__cell">
                    <RadioStationCard
                      station={station}
                      onSelect={() => navigate(`/radio/${station.id}`)}
                    />
                  </li>
                ))}
          </ul>
        )}
      </div>
    </main>
  );
}
