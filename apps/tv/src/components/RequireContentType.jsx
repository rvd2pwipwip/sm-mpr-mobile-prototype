import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { useContentProfile } from "../context/ContentProfileContext.jsx";
import TvContentTypeUnavailable from "../pages/TvContentTypeUnavailable.jsx";

const CONTENT_LABELS = {
  [CONTENT_TYPE.podcasts]: "Podcast",
  [CONTENT_TYPE.radio]: "Radio",
};

/**
 * Route guard: render children when `contentType` is enabled; else unavailable stub.
 */
export default function RequireContentType({ contentType, children }) {
  const { isContentTypeEnabled } = useContentProfile();
  if (!isContentTypeEnabled(contentType)) {
    return (
      <TvContentTypeUnavailable
        contentLabel={CONTENT_LABELS[contentType] ?? "This content"}
      />
    );
  }
  return children;
}
