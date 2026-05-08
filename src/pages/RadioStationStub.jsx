import { Navigate, useNavigate, useParams } from "react-router-dom";
import Button from "../components/Button.jsx";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader.jsx";
import { usePlayback } from "../context/PlaybackContext.jsx";
import { resolveRadioStationForStub } from "../data/radioInternationalBrowse.js";
import "./RadioStationStub.css";

/** Minimal station detail + “Play preview” for Radio browse (prototype). */
export default function RadioStationStub() {
  const { stationId } = useParams();
  const navigate = useNavigate();
  const { startRadioStationPreview } = usePlayback();
  const station = stationId ? resolveRadioStationForStub(stationId) : null;

  if (!station) {
    return <Navigate to="/search/radio" replace />;
  }

  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed radio-station-stub">
      <ScreenHeader
        title={station.name}
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
      <div className="radio-station-stub__body">
        <div className="radio-station-stub__thumb-wrap">
          <img
            src={station.thumbnail}
            alt=""
            className="radio-station-stub__thumb"
          />
        </div>
        <p className="text-muted radio-station-stub__meta">
          {station.frequencyLabel ?? station.categoryLabel}
        </p>
        <p className="radio-station-stub__desc">{station.description}</p>
        <Button
          variant="cta"
          className="radio-station-stub__play"
          onClick={() =>
            startRadioStationPreview({
              title: station.name,
              subtitle: station.frequencyLabel ?? station.categoryLabel ?? "",
              thumbnail: station.thumbnail ?? "",
            })
          }
        >
          Play preview
        </Button>
      </div>
    </main>
  );
}
