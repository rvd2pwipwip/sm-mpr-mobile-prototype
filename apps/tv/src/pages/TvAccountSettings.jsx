import TvInfoScreenLayout from "../components/info/TvInfoScreenLayout.jsx";
import TvInfoSection from "../components/info/TvInfoSection.jsx";
import "../components/info/TvInfoScreen.css";

/** Broad catalog Account and settings — mobile `MyLibraryAccountSettings` parity (Phase 1 shell). */
export default function TvAccountSettings() {
  return (
    <TvInfoScreenLayout title="Account and settings">
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
    </TvInfoScreenLayout>
  );
}
