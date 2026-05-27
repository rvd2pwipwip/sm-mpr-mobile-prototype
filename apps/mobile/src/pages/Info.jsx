import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import ScreenHeader, { ScreenHeaderChevronBack } from "../components/ScreenHeader";
import { CATALOG_SCOPE } from "../constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import InfoAccountSection from "../components/InfoAccountSection";
import InfoCollapsibleSection from "../components/InfoCollapsibleSection";
import InfoHelpSection from "../components/InfoHelpSection";
import InfoSettingsSection from "../components/InfoSettingsSection";
import "./Info.css";
import "./InfoSubPage.css";

/** Info hub — collapsible Account / Settings / Info. **Limited catalog:** fixed stack header + back (Browse). */
export default function Info() {
  const navigate = useNavigate();
  const { catalogScope } = useTerritory();
  const limitedInfoChrome = catalogScope === CATALOG_SCOPE.limited;

  const [open, setOpen] = useState({
    account: true,
    settings: false,
    info: false,
  });

  const toggle = useCallback((key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const sections = (
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

        <InfoCollapsibleSection
          sectionId="help"
          title="Info"
          expanded={open.info}
          onToggle={() => toggle("info")}
        >
          <InfoHelpSection />
        </InfoCollapsibleSection>
      </div>
    </div>
  );

  if (limitedInfoChrome) {
    return (
      <main className="app-shell app-shell--footer-fixed info-page info-page--limited">
        <ScreenHeader
          title="Info"
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
        <div className="info-sub-page__scroll">{sections}</div>
      </main>
    );
  }

  return (
    <main className="app-shell app-shell--footer-fixed info-page">
      <div className="app-shell-footer-scroll">{sections}</div>
    </main>
  );
}
