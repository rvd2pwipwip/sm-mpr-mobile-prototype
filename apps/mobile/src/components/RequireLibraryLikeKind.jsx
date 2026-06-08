import { useParams } from "react-router-dom";
import { CONTENT_TYPE } from "@sm-mpr/shared/constants/contentTypes.js";
import { useContentProfile } from "../context/ContentProfileContext";
import ContentTypeUnavailable from "../pages/ContentTypeUnavailable";

const LIKE_KIND_TO_CONTENT_TYPE = {
  music: CONTENT_TYPE.music,
  radio: CONTENT_TYPE.radio,
};

/** Guards `/my-library/likes/:likeKind` for music-only profile. */
export default function RequireLibraryLikeKind({ children }) {
  const { likeKind } = useParams();
  const { isContentTypeEnabled } = useContentProfile();
  const contentType = LIKE_KIND_TO_CONTENT_TYPE[likeKind];
  if (!contentType || !isContentTypeEnabled(contentType)) {
    return <ContentTypeUnavailable />;
  }
  return children;
}
