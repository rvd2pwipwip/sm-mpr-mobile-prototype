import { useNavigate } from "react-router-dom";
import {
  INFO_ABOUT_PATH,
  INFO_CONTACT_PATH,
} from "@sm-mpr/shared/constants/infoHelpLinks.js";
import { navigateToTvFaq } from "../../utils/tvFaqNavigation.js";
import KeyboardWrapper from "../focus/KeyboardWrapper.jsx";
import TvButton from "../TvButton.jsx";
import {
  HELP_ABOUT_GROUP_OFFSET,
  HELP_CONTACT_GROUP_OFFSET,
  HELP_FAQ_GROUP_OFFSET,
  HELP_ITEM_INDEX,
} from "../../utils/tvInfoHelpFocus.js";
import "./TvInfoHelpSection.css";

const HELP_ROWS = [
  {
    id: "faq",
    label: "FAQ",
    groupOffset: HELP_FAQ_GROUP_OFFSET,
    endIconMaskVariant: "chevron-forward",
    onSelect: (navigate) => navigateToTvFaq(navigate),
  },
  {
    id: "contact",
    label: "Contact us",
    groupOffset: HELP_CONTACT_GROUP_OFFSET,
    endIconMaskVariant: "chevron-forward",
    onSelect: (navigate) => navigate(INFO_CONTACT_PATH),
  },
  {
    id: "about",
    label: "About",
    groupOffset: HELP_ABOUT_GROUP_OFFSET,
    endIconMaskVariant: "chevron-forward",
    onSelect: (navigate) => navigate(INFO_ABOUT_PATH),
  },
];

/**
 * Info help rows for limited `/info` — mobile `InfoHelpSection` parity.
 */
export default function TvInfoHelpSection({
  helpGroupOffset,
  registerItemRef,
  isItemFocused,
  handleMoveUp,
  handleMoveDown,
  handleMoveLeft,
  handleMoveRight,
}) {
  const navigate = useNavigate();

  return (
    <div className="tv-info-help">
      {HELP_ROWS.map((row) => {
        const groupIndex = helpGroupOffset + row.groupOffset;
        const focused = isItemFocused(groupIndex, HELP_ITEM_INDEX);

        return (
          <KeyboardWrapper
            key={row.id}
            ref={(node) =>
              registerItemRef(groupIndex, HELP_ITEM_INDEX, node)
            }
            onSelect={() => row.onSelect(navigate)}
            onUp={handleMoveUp}
            onDown={handleMoveDown}
            onLeft={handleMoveLeft}
            onRight={handleMoveRight}
          >
            {(focusProps) => (
              <TvButton
                {...focusProps}
                variant="secondary"
                label={row.label}
                endIconMaskVariant={row.endIconMaskVariant}
                focused={focused}
                className="tv-info-help__action"
              />
            )}
          </KeyboardWrapper>
        );
      })}
    </div>
  );
}
