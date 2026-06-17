import TvInfoAccountSection from "../components/info/TvInfoAccountSection.jsx";
import TvInfoScreenLayout from "../components/info/TvInfoScreenLayout.jsx";
import TvInfoSection from "../components/info/TvInfoSection.jsx";
import { useTvInfoScreenFocus } from "../hooks/useTvInfoScreenFocus.js";
import "../components/info/TvInfoScreen.css";

/** Broad catalog Account and settings — mobile `MyLibraryAccountSettings` parity. */
export default function TvAccountSettings() {
  const focus = useTvInfoScreenFocus("tv-account-settings");

  return (
    <TvInfoScreenLayout
      title="Account and settings"
      shellRef={focus.shellRef}
      headerRef={focus.headerRef}
      scrollViewportRef={focus.viewportRef}
      scrollInnerRef={focus.innerRef}
      scrollInnerClassName={focus.innerClassName}
      scrollInnerStyle={{ transform: `translateY(-${focus.offsetY}px)` }}
    >
      <TvInfoSection sectionId="account" title="Account">
        <TvInfoAccountSection
          registerItemRef={focus.registerItemRef}
          isItemFocused={focus.isItemFocused}
          handleMoveUp={focus.handleMoveUp}
          handleMoveDown={focus.handleMoveDown}
          handleMoveLeft={focus.handleMoveLeft}
          handleMoveRight={focus.handleMoveRight}
        />
      </TvInfoSection>

      <TvInfoSection sectionId="settings" title="Settings">
        <p className="tv-info-section__placeholder">
          Autoplay and communication preferences ship in Phase 3.
        </p>
      </TvInfoSection>
    </TvInfoScreenLayout>
  );
}
