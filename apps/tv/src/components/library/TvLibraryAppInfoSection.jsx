import { useNavigate } from "react-router-dom";
import {
  INFO_ABOUT_PATH,
  INFO_CONTACT_PATH,
  INFO_FAQ_HREF,
  MY_LIBRARY_ACCOUNT_SETTINGS_PATH,
} from "@sm-mpr/shared/constants/infoHelpLinks.js";
import { useTvNavFocus } from "../../context/TvNavFocusContext.jsx";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import FixedSwimlane from "../swimlanes/FixedSwimlane.jsx";
import TvSearchLabelTile from "../search/TvSearchLabelTile.jsx";
import "../search/TvSearchLabelTile.css";
import "../swimlanes/FixedSwimlane.css";
import "./TvLibraryAppInfoSection.css";

const TILES = [
  { id: "account", label: "Account and settings", to: MY_LIBRARY_ACCOUNT_SETTINGS_PATH },
  { id: "faq", label: "FAQ", href: INFO_FAQ_HREF },
  { id: "contact", label: "Contact us", to: INFO_CONTACT_PATH },
  { id: "about", label: "About", to: INFO_ABOUT_PATH },
];

/** App Info row — gear header + four square tiles (mobile {@link AppInfoSwimlane} parity). */
export default function TvLibraryAppInfoSection({
  groupIndex = 0,
  focused = false,
  focusedIndex = 0,
  onFocusChange,
  onBoundaryLeft,
  registerItemRef,
  onMoveUp,
  onMoveDown,
}) {
  const navigate = useNavigate();
  const { enterContent } = useTvNavFocus();

  const registerSlotRef = (index, node) => {
    registerItemRef?.(groupIndex, index, node);
  };

  const handleSelect = (tile) => {
    enterContent();
    if (tile.href) {
      window.open(tile.href, "_blank", "noopener,noreferrer");
      return;
    }
    if (tile.to) navigate(tile.to);
  };

  return (
    <section
      className="tv-library-app-info"
      aria-labelledby="tv-library-app-info-title"
    >
      <div className="tv-library-app-info__header">
        <span className="tv-library-app-info__gear" aria-hidden={true} />
        <h2 id="tv-library-app-info-title" className="tv-library-app-info__title">
          App Info
        </h2>
      </div>

      <FixedSwimlane
        slotCount={TILES.length}
        focusedIndex={focusedIndex}
        onFocusChange={onFocusChange}
        focused={focused}
        onBoundaryLeft={onBoundaryLeft}
        registerSlotRef={registerSlotRef}
        renderSlot={(index, isFocused, setRef) => {
          const tile = TILES[index];
          return (
            <KeyboardWrapper
              key={tile.id}
              ref={setRef}
              onSelect={() => handleSelect(tile)}
              onUp={onMoveUp}
              onDown={onMoveDown}
            >
              {(focusProps) => (
                <TvSearchLabelTile
                  {...focusProps}
                  label={tile.label}
                  focused={isFocused}
                />
              )}
            </KeyboardWrapper>
          );
        }}
      />
    </section>
  );
}
