import { useNavigate } from "react-router-dom";
import ScreenHeader, {
  ScreenHeaderChevronBack,
} from "../components/ScreenHeader";
import "./ContentTypeUnavailable.css";

/**
 * Shown when a podcast/radio route is opened while music-only profile is active.
 */
export default function ContentTypeUnavailable() {
  const navigate = useNavigate();

  return (
    <main className="app-shell app-shell--footer-fixed content-type-unavailable">
      <ScreenHeader
        title="Not available in this build"
        startSlot={
          <button
            type="button"
            className="screen-header__icon-btn"
            onClick={() => navigate(-1)}
            aria-label="Back"
          >
            <ScreenHeaderChevronBack />
          </button>
        }
      />
      <div className="content-type-unavailable__body content-inset">
        <p className="content-type-unavailable__lead">
          Podcasts and radio are not included in this prototype build. Switch to
          <strong> Full MPR</strong> on the Upgrade screen to preview them for
          internal review.
        </p>
        <button
          type="button"
          className="content-type-unavailable__home-btn"
          onClick={() => navigate("/")}
        >
          Return to Home
        </button>
      </div>
    </main>
  );
}
