import {
  SHARE_PROTOTYPE_DIALOG_WEB_IMG,
  SHARE_PROTOTYPE_FACEBOOK_IMG,
} from "../constants/sharePrototypeAssets";
import { useSharePrototype } from "../context/SharePrototypeContext";
import "./SharePrototypeOverlays.css";

/**
 * Full-screen tap-through mocks for dumb share UX — mount once near app root.
 */
export default function SharePrototypeOverlays() {
  const { step, advanceToFacebookMock, closeSharePrototype } =
    useSharePrototype();

  if (step === "web-share-mock") {
    return (
      <button
        type="button"
        className="share-prototype-overlay"
        aria-label="Continue prototype share flow"
        onClick={advanceToFacebookMock}
      >
        <img
          className="share-prototype-overlay__img"
          src={SHARE_PROTOTYPE_DIALOG_WEB_IMG}
          alt=""
          width={560}
          height={620}
          decoding="async"
        />
      </button>
    );
  }

  if (step === "facebook-mock") {
    return (
      <button
        type="button"
        className="share-prototype-overlay"
        aria-label="Close share prototype"
        onClick={closeSharePrototype}
      >
        <img
          className="share-prototype-overlay__img"
          src={SHARE_PROTOTYPE_FACEBOOK_IMG}
          alt=""
          width={560}
          height={900}
          decoding="async"
        />
      </button>
    );
  }

  return null;
}
