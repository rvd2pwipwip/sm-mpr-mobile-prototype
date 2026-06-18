import { useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LEGAL_LINKS } from "../../../mobile/src/constants/legalLinks.js";
import {
  INFO_ABOUT_COPYRIGHT_LINES,
  INFO_ABOUT_TRADEMARK,
  INFO_APP_VERSION,
} from "../../../mobile/src/constants/infoAboutCopy.js";
import {
  INFO_ABOUT_PATH,
  INFO_PRIVACY_PATH,
  INFO_TERMS_PATH,
} from "@sm-mpr/shared/constants/infoHelpLinks.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvButton from "../components/TvButton.jsx";
import TvInfoSubPageLayout from "../components/info/TvInfoSubPageLayout.jsx";
import { TV_INFO_ABOUT_RETURN_FOCUS } from "../constants/tvInfoAboutFocus.js";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import { useTvRestoreFocusOnMount } from "../hooks/useTvRestoreFocusOnMount.js";
import { navigateToEmbeddedDoc } from "../utils/tvEmbeddedDocNavigation.js";
import "./TvInfoAbout.css";

const LEGAL_ITEM_INDEX = 0;

const LEGAL_DOC_PATH_BY_ID = {
  terms: INFO_TERMS_PATH,
  privacy: INFO_PRIVACY_PATH,
};

const LEGAL_RETURN_FOCUS_BY_ID = {
  terms: TV_INFO_ABOUT_RETURN_FOCUS.terms,
  privacy: TV_INFO_ABOUT_RETURN_FOCUS.privacy,
};

/** About — mobile `InfoAbout.jsx` copy on TV overlay shell. */
export default function TvInfoAbout() {
  const navigate = useNavigate();
  const location = useLocation();
  const restoreFocus = location.state?.restoreFocus ?? null;

  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
  } = useScreenContentFocus("tv-info-about", {
    groupCount: LEGAL_LINKS.length,
    itemCount: 1,
    defaultGroupIndex: 0,
    defaultItemIndex: LEGAL_ITEM_INDEX,
  });

  const clearRestoreState = useCallback(() => {
    navigate(".", { replace: true, state: {} });
  }, [navigate]);

  useTvRestoreFocusOnMount({
    restoreFocus,
    setFocusedGroupIndex,
    setFocusedIndex,
    getItemElement,
    onRestored: clearRestoreState,
  });

  return (
    <TvInfoSubPageLayout title="About">
      <div className="tv-info-about">
        <div className="tv-info-about__brand" aria-hidden={true}>
          <img
            className="tv-info-about__wordmark tv-info-about__wordmark--light"
            src="/stingrayMusic.svg"
            alt=""
            width="210"
            height="61"
            loading="lazy"
            decoding="async"
          />
          <img
            className="tv-info-about__wordmark tv-info-about__wordmark--dark"
            src="/stingrayMusicDark.svg"
            alt=""
            width="210"
            height="61"
            loading="lazy"
            decoding="async"
          />
        </div>

        <p className="tv-info-about__version">Version {INFO_APP_VERSION}</p>

        <div className="tv-info-about__copyright">
          {INFO_ABOUT_COPYRIGHT_LINES.map((line) => (
            <p key={line} className="tv-info-about__copyright-line">
              {line}
            </p>
          ))}
        </div>

        <p className="tv-info-about__trademark">{INFO_ABOUT_TRADEMARK}</p>

        <div className="tv-info-about__legal-btns">
          {LEGAL_LINKS.map(({ id, label }, groupIndex) => (
            <KeyboardWrapper
              key={id}
              ref={(node) =>
                registerItemRef(groupIndex, LEGAL_ITEM_INDEX, node)
              }
              onSelect={() => {
                navigateToEmbeddedDoc(
                  navigate,
                  LEGAL_DOC_PATH_BY_ID[id],
                  {
                    returnTo: INFO_ABOUT_PATH,
                    returnFocus: LEGAL_RETURN_FOCUS_BY_ID[id],
                  },
                );
              }}
              onUp={handleMoveUp}
              onDown={handleMoveDown}
              onLeft={handleMoveLeft}
              onRight={handleMoveRight}
            >
              {(focusProps) => (
                <TvButton
                  {...focusProps}
                  variant="secondary"
                  label={label}
                  focused={isItemFocused(groupIndex, LEGAL_ITEM_INDEX)}
                  className="tv-info-about__legal-btn"
                />
              )}
            </KeyboardWrapper>
          ))}
        </div>
      </div>
    </TvInfoSubPageLayout>
  );
}
