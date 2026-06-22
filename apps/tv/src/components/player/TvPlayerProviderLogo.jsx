import {
  PROVIDER_LOGO_DARK_URL,
  PROVIDER_LOGO_LIGHT_URL,
} from "@sm-mpr/shared/constants/externalLinks.js";
import { useUserType } from "../../context/UserTypeContext.jsx";
import "./TvPlayerProviderLogo.css";

/** Top-right provider logo on full-screen players for `freeProvided` tier. */
export default function TvPlayerProviderLogo() {
  const { userType } = useUserType();

  if (userType !== "freeProvided") {
    return null;
  }

  return (
    <div className="tv-player-provider-logo" aria-hidden={true}>
      <img
        className="tv-player-provider-logo__img tv-player-provider-logo__img--light"
        src={PROVIDER_LOGO_LIGHT_URL}
        alt=""
        width="201"
        height="63"
        decoding="async"
      />
      <img
        className="tv-player-provider-logo__img tv-player-provider-logo__img--dark"
        src={PROVIDER_LOGO_DARK_URL}
        alt=""
        width="201"
        height="63"
        decoding="async"
      />
    </div>
  );
}
