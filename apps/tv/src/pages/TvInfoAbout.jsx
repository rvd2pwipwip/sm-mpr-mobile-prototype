import { LEGAL_LINKS } from "../../../mobile/src/constants/legalLinks.js";
import {
  INFO_ABOUT_COPYRIGHT_LINES,
  INFO_ABOUT_TRADEMARK,
  INFO_APP_VERSION,
} from "../../../mobile/src/constants/infoAboutCopy.js";
import KeyboardWrapper from "../components/focus/KeyboardWrapper.jsx";
import TvButton from "../components/TvButton.jsx";
import TvInfoSubPageLayout from "../components/info/TvInfoSubPageLayout.jsx";
import { useScreenContentFocus } from "../hooks/useScreenContentFocus.js";
import "./TvInfoAbout.css";

const LEGAL_ITEM_INDEX = 0;

/** About — mobile `InfoAbout.jsx` copy on TV overlay shell. */
export default function TvInfoAbout() {
  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  } = useScreenContentFocus("tv-info-about", {
    groupCount: LEGAL_LINKS.length,
    itemCount: 1,
    defaultGroupIndex: 0,
    defaultItemIndex: LEGAL_ITEM_INDEX,
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
          {LEGAL_LINKS.map(({ id, label, href }, groupIndex) => (
            <KeyboardWrapper
              key={id}
              ref={(node) =>
                registerItemRef(groupIndex, LEGAL_ITEM_INDEX, node)
              }
              onSelect={() => {
                window.open(href, "_blank", "noopener,noreferrer");
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
                  endIconMaskVariant="open-in-new"
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
