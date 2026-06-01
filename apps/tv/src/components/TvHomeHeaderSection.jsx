import { HOME_HEADER_GROUP } from "../constants/homeFocusGroups.js";
import TvHomeHeader from "./TvHomeHeader.jsx";

/**
 * Placement wrapper for Home header AB test.
 * sticky (A): renders TvHomeHeader only — parent mounts it above the scrollport.
 * scroll (B): wraps header in the first scroll group and registers vertical parking ref.
 */
export default function TvHomeHeaderSection({
  scrollable = false,
  registerGroupRef,
  ...headerProps
}) {
  const header = <TvHomeHeader {...headerProps} />;

  if (!scrollable) {
    return header;
  }

  return (
    <div
      className="tv-home__scroll-group"
      ref={(node) => registerGroupRef?.(HOME_HEADER_GROUP, node)}
    >
      {header}
    </div>
  );
}
