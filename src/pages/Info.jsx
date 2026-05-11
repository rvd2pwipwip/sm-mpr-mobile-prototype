import { useState, useCallback } from "react";
import InfoAccountSection from "../components/InfoAccountSection";
import InfoCollapsibleSection from "../components/InfoCollapsibleSection";
import "./Info.css";

/** Info tab — collapsible Account / Settings / Info. */
export default function Info() {
  const [open, setOpen] = useState({
    account: true,
    settings: false,
    info: false,
  });

  const toggle = useCallback((key) => {
    setOpen((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  return (
    <main className="app-shell app-shell--footer-fixed info-page">
      <div className="app-shell-footer-scroll">
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
              <p className="text-muted info-page__section-placeholder">
                Autoplay, audio quality, and preferences will appear in the next
                phase.
              </p>
            </InfoCollapsibleSection>

            <InfoCollapsibleSection
              sectionId="help"
              title="Info"
              expanded={open.info}
              onToggle={() => toggle("info")}
            >
              <p className="text-muted info-page__section-placeholder">
                FAQ, Contact us, and About links will appear in the next phase.
              </p>
            </InfoCollapsibleSection>
          </div>
        </div>
      </div>
    </main>
  );
}
