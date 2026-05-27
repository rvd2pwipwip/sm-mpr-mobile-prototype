import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import InfoAccountSection from "../components/InfoAccountSection";
import InfoCollapsibleSection from "../components/InfoCollapsibleSection";
import InfoSettingsSection from "../components/InfoSettingsSection";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import "./Info.css";
import "./InfoSubPage.css";

/** Account + Settings with both expanded (My Library App Info drill-in — Phase 2). */
export default function MyLibraryAccountSettings() {
  const navigate = useNavigate();
  const goBack = () => navigate(-1);

  const [open, setOpen] = useState({
    account: true,
    settings: true,
  });

  const toggle = useCallback((key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <main className="app-shell app-shell--footer-fixed info-sub-page info-page">
      <ScreenHeader
        title="Account and settings"
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
          <div className="info-page__sections">
            <InfoCollapsibleSection
              sectionId="account"
              title="Account"
              expanded={open.account}
              onToggle={() => toggle("account")}
            >
              <InfoAccountSection />
            </InfoCollapsibleSection>

            <InfoCollapsibleSection
              sectionId="settings"
              title="Settings"
              expanded={open.settings}
              onToggle={() => toggle("settings")}
            >
              <InfoSettingsSection />
            </InfoCollapsibleSection>
          </div>
        </div>
      </div>
    </main>
  );
}
