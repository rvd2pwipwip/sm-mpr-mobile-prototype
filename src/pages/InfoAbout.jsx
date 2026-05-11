import { useNavigate } from "react-router-dom";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import "./InfoSubPage.css";

/** About — stack under Info tab (Figma `5683:78416`); body fills in a later phase. */
export default function InfoAbout() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  return (
    <main className="app-shell app-shell--footer-fixed info-sub-page">
      <ScreenHeader
        title="About"
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

      <div className="info-sub-page__scroll">
        <div className="content-inset">
          <p className="text-muted" style={{ margin: 0 }}>
            About content coming in a later phase.
          </p>
        </div>
      </div>
    </main>
  );
}
