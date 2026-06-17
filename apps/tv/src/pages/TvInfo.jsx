import { Navigate } from "react-router-dom";
import { CATALOG_SCOPE } from "@sm-mpr/shared/constants/catalogScope.js";
import { useTerritory } from "../context/TerritoryContext.jsx";
import TvInfoAccountSection from "../components/info/TvInfoAccountSection.jsx";
import TvInfoSettingsSection from "../components/info/TvInfoSettingsSection.jsx";
import TvInfoHelpSection from "../components/info/TvInfoHelpSection.jsx";
import TvInfoScreenLayout from "../components/info/TvInfoScreenLayout.jsx";
import TvInfoSection from "../components/info/TvInfoSection.jsx";
import { useTvInfoScreenFocus } from "../hooks/useTvInfoScreenFocus.js";
import "../components/info/TvInfoScreen.css";

/** Limited catalog Info hub — Account, Settings, Info. */
export default function TvInfo() {
  const { catalogScope } = useTerritory();
  const focus = useTvInfoScreenFocus("tv-info", { includeHelpSection: true });

  if (catalogScope === CATALOG_SCOPE.broad) {
    return <Navigate to="/my-library" replace />;
  }

  return (
    <TvInfoScreenLayout
      title="Info"
      hubLayout="symmetric"
      titleEasterEgg={{
        ariaLabel:
          "Info. Click for prototype user type and layout settings.",
      }}
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
        <TvInfoSettingsSection
          settingsGroupOffset={focus.settingsGroupOffset}
          registerItemRef={focus.registerItemRef}
          isItemFocused={focus.isItemFocused}
          handleMoveUp={focus.handleMoveUp}
          handleMoveDown={focus.handleMoveDown}
          handleMoveLeft={focus.handleMoveLeft}
          handleMoveRight={focus.handleMoveRight}
        />
      </TvInfoSection>

      <TvInfoSection sectionId="help" title="Info">
        <TvInfoHelpSection
          helpGroupOffset={focus.helpGroupOffset}
          registerItemRef={focus.registerItemRef}
          isItemFocused={focus.isItemFocused}
          handleMoveUp={focus.handleMoveUp}
          handleMoveDown={focus.handleMoveDown}
          handleMoveLeft={focus.handleMoveLeft}
          handleMoveRight={focus.handleMoveRight}
        />
      </TvInfoSection>
    </TvInfoScreenLayout>
  );
}
