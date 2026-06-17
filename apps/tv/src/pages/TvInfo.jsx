import { Navigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import TvInfoScreenLayout from "../components/info/TvInfoScreenLayout.jsx";
import TvInfoSection from "../components/info/TvInfoSection.jsx";
import "../components/info/TvInfoScreen.css";

/** Limited catalog Info hub — Account, Settings, Info (Phase 1 placeholders). */
export default function TvInfo() {
  const { catalogScope } = useTerritory();

  if (catalogScope === CATALOG_SCOPE.broad) {
    return <Navigate to="/my-library" replace />;
  }

  return (
    <TvInfoScreenLayout
      title="Info"
      titleEasterEgg={{
        ariaLabel:
          "Info. Click for prototype user type and layout settings.",
      }}
    >
      <TvInfoSection sectionId="account" title="Account">
        <p className="tv-info-section__placeholder">
          Account actions ship in Phase 2.
        </p>
      </TvInfoSection>

      <TvInfoSection sectionId="settings" title="Settings">
        <p className="tv-info-section__placeholder">
          Autoplay and communication preferences ship in Phase 3.
        </p>
      </TvInfoSection>

      <TvInfoSection sectionId="help" title="Info">
        <p className="tv-info-section__placeholder">
          FAQ, Contact us, and About links ship in Phase 4.
        </p>
      </TvInfoSection>
    </TvInfoScreenLayout>
  );
}
