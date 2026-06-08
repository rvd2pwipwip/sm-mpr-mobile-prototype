import { useParams } from "react-router-dom";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { useContentProfile } from "../context/ContentProfileContext";
import ContentTypeUnavailable from "../pages/ContentTypeUnavailable";

const SEGMENT_TO_CONTENT_TYPE = {
  music: CONTENT_TYPE.music,
  podcasts: CONTENT_TYPE.podcasts,
  radio: CONTENT_TYPE.radio,
};

/** Guards `/my-library/history/:historySegment` for music-only profile. */
export default function RequireLibraryHistorySegment({ children }) {
  const { historySegment } = useParams();
  const { isContentTypeEnabled } = useContentProfile();
  const contentType = SEGMENT_TO_CONTENT_TYPE[historySegment];
  if (!contentType || !isContentTypeEnabled(contentType)) {
    return <ContentTypeUnavailable />;
  }
  return children;
}
