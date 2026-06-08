import { useContentProfile } from "../context/ContentProfileContext";
import ContentTypeUnavailable from "../pages/ContentTypeUnavailable";

/**
 * Route guard: render children when `contentType` is enabled; else unavailable stub.
 * @param {{ contentType: string, children: import("react").ReactNode }} props
 */
export default function RequireContentType({ contentType, children }) {
  const { isContentTypeEnabled } = useContentProfile();
  if (!isContentTypeEnabled(contentType)) {
    return <ContentTypeUnavailable />;
  }
  return children;
}
