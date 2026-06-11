import { useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  getChildGeoNodes,
  getPopularStationsForGeoNode,
} from "@sm-mpr/shared/data/radioInternationalBrowse.js";
import { SWIMLANE_CARD_MAX } from "../../constants/swimlane.js";
import { radioInternationalPath } from "../../constants/radioBrowsePaths.js";
import { HOME_LANDING_ITEM_INDEX } from "../../constants/homeFocusGroups.js";
import { getMusicSwimlaneSlotCount } from "../../utils/swimlaneUtils.js";
import { useScreenContentFocus } from "../../hooks/useScreenContentFocus.js";
import { useTvVerticalGroupScroll } from "../../hooks/useTvVerticalGroupScroll.js";
import ContentTileSwimlane from "../swimlanes/ContentTileSwimlane.jsx";
import TvSearchRadioGeoExploreSwimlane from "./TvSearchRadioGeoExploreSwimlane.jsx";
import "./TvSearchRadioGeoRegion.css";

/** Visual top → bottom matches ascending group index (Up/Down). */
const GROUP_SUBREGIONS = 0;
const GROUP_CHANNELS = 1;

/**
 * International geo subregion — two swimlanes: Explore sub-regions (top) then
 * popular channels (horizontal). Vertical parked nav between lanes.
 */
export default function TvSearchRadioGeoRegion({ node, segments, screenId }) {
  const navigate = useNavigate();

  const popular = useMemo(
    () => getPopularStationsForGeoNode(node.id),
    [node.id],
  );
  const children = useMemo(() => getChildGeoNodes(node), [node]);
  const popularItems = useMemo(
    () =>
      popular.slice(0, SWIMLANE_CARD_MAX).map((station) => ({
        id: station.id,
        thumbnail: station.thumbnail,
        title: station.name,
      })),
    [popular],
  );

  const hasChannels = popular.length > 0;
  const hasSubregions = children.length > 0;

  const itemCounts = useMemo(() => {
    /** @type {Record<number, number>} */
    const counts = {};
    if (hasSubregions) {
      counts[GROUP_SUBREGIONS] = children.length;
    }
    if (hasChannels) {
      counts[GROUP_CHANNELS] = getMusicSwimlaneSlotCount(popular.length);
    }
    return counts;
  }, [hasChannels, hasSubregions, popular.length, children.length]);

  const swimlaneGroups = useMemo(() => {
    const groups = [];
    if (hasSubregions) groups.push(GROUP_SUBREGIONS);
    if (hasChannels) groups.push(GROUP_CHANNELS);
    return groups;
  }, [hasSubregions, hasChannels]);

  const firstGroup = swimlaneGroups[0] ?? GROUP_SUBREGIONS;
  const landingGroup = hasChannels ? GROUP_CHANNELS : GROUP_SUBREGIONS;
  const lastGroup =
    swimlaneGroups[swimlaneGroups.length - 1] ?? GROUP_SUBREGIONS;
  const groupCount = lastGroup + 1;

  const {
    registerItemRef,
    focusedGroupIndex,
    handleMoveUp,
    handleMoveDown,
    isContentGroupActive,
    getItemFocusIndex,
    setFocusedIndex,
    enterNavFromContent,
    getItemElement,
  } = useScreenContentFocus(screenId, {
    groupCount: Math.max(groupCount, 1),
    itemCounts,
    swimlaneGroups,
    defaultGroupIndex: landingGroup,
    defaultItemIndex: HOME_LANDING_ITEM_INDEX,
  });

  const getFocusedElement = useCallback(
    () =>
      getItemElement(focusedGroupIndex, getItemFocusIndex(focusedGroupIndex)),
    [getItemElement, focusedGroupIndex, getItemFocusIndex],
  );

  const { viewportRef, innerRef, registerGroupRef, offsetY, innerClassName } =
    useTvVerticalGroupScroll(focusedGroupIndex, {
      landingGroupIndex: landingGroup,
      firstFocusableGroupIndex: firstGroup,
      lastFocusableGroupIndex: lastGroup,
      getFocusedElement,
      screenId,
    });

  const pathPrefix = [...segments];

  const geoFilters = useMemo(
    () =>
      children.map((child) => ({
        id: child.id,
        label: child.label,
      })),
    [children],
  );

  return (
    <div className="tv-search-radio-geo">
      <header className="tv-search-radio-geo__header">
        <h1 className="tv-search-radio-geo__title">{node.label}</h1>
        {/* {hasChannels ? (
          <p className="tv-search-radio-geo__meta">
            {popular.length} stations in this region
          </p>
        ) : null} */}
      </header>

      <div
        ref={viewportRef}
        className="tv-search-radio-geo__scroll tv-home__scroll"
      >
        <div
          ref={innerRef}
          className={`tv-home__scroll-inner ${innerClassName}`}
          style={{ transform: `translateY(-${offsetY}px)` }}
        >
          {hasSubregions ? (
            <div
              className="tv-home__scroll-group tv-search-radio-geo__subregions"
              ref={(el) => registerGroupRef(GROUP_SUBREGIONS, el)}
            >
              <TvSearchRadioGeoExploreSwimlane
                title={`Explore ${node.label}`}
                filters={geoFilters}
                groupIndex={GROUP_SUBREGIONS}
                focused={isContentGroupActive(GROUP_SUBREGIONS)}
                focusedIndex={getItemFocusIndex(GROUP_SUBREGIONS)}
                onFocusChange={(index) =>
                  setFocusedIndex(GROUP_SUBREGIONS, index)
                }
                onSelectFilter={(childId) =>
                  navigate(radioInternationalPath([...pathPrefix, childId]))
                }
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
              />
            </div>
          ) : null}

          {hasChannels ? (
            <div
              className="tv-home__scroll-group"
              ref={(el) => registerGroupRef(GROUP_CHANNELS, el)}
            >
              <ContentTileSwimlane
                title={`Popular in ${node.label}`}
                items={popularItems}
                sourceCount={popular.length}
                groupIndex={GROUP_CHANNELS}
                focused={isContentGroupActive(GROUP_CHANNELS)}
                focusedIndex={getItemFocusIndex(GROUP_CHANNELS)}
                onFocusChange={(index) =>
                  setFocusedIndex(GROUP_CHANNELS, index)
                }
                onBoundaryLeft={enterNavFromContent}
                registerItemRef={registerItemRef}
                onMoveUp={handleMoveUp}
                onMoveDown={handleMoveDown}
                onSelectItem={(item) => navigate(`/radio/${item.id}`)}
                onMore={() =>
                  navigate(`${radioInternationalPath(pathPrefix)}/stations`)
                }
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
