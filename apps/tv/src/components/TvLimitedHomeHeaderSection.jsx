import { HOME_HEADER_GROUP } from "../constants/homeFocusGroups.js";
import { LIMITED_HOME_LAYOUT } from "../constants/limitedHomeLayout.js";
import TvLimitedHomeHeader from "./TvLimitedHomeHeader.jsx";
import TvLimitedHomeHeaderStacked from "./TvLimitedHomeHeaderStacked.jsx";

/**
 * Placement wrapper for limited Home header (sticky vs scroll AB test).
 */
export default function TvLimitedHomeHeaderSection({
  scrollable = false,
  registerGroupRef,
  layoutMode = LIMITED_HOME_LAYOUT.stacked,
  ...headerProps
}) {
  const Header =
    layoutMode === LIMITED_HOME_LAYOUT.stacked
      ? TvLimitedHomeHeaderStacked
      : TvLimitedHomeHeader;

  const header = <Header {...headerProps} />;

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
