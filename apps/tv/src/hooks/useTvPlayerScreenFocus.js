import { useCallback, useMemo } from "react";
import { useScreenContentFocus } from "./useScreenContentFocus.js";

export const TV_PLAYER_UPGRADE_GROUP = 0;
export const TV_PLAYER_META_GROUP_WITH_UPGRADE = 1;
export const TV_PLAYER_TRANSPORT_GROUP_WITH_UPGRADE = 2;

export const TV_PLAYER_META_GROUP = 0;
export const TV_PLAYER_TRANSPORT_GROUP = 1;

/**
 * Player focus: optional upgrade overlay group (top-left), meta actions, transport.
 * Left from meta/transport index 0 and Up from meta row reach upgrade when shown.
 */
export function useTvPlayerScreenFocus(
  screenId,
  {
    showUpgrade,
    metaItemCount,
    transportItemCount,
    defaultTransportItemIndex = 0,
    ...screenFocusOptions
  },
) {
  const metaGroup = showUpgrade
    ? TV_PLAYER_META_GROUP_WITH_UPGRADE
    : TV_PLAYER_META_GROUP;
  const transportGroup = showUpgrade
    ? TV_PLAYER_TRANSPORT_GROUP_WITH_UPGRADE
    : TV_PLAYER_TRANSPORT_GROUP;
  const upgradeGroup = showUpgrade ? TV_PLAYER_UPGRADE_GROUP : null;

  const groupCount = showUpgrade ? 3 : 2;

  const itemCounts = useMemo(() => {
    if (showUpgrade) {
      return {
        [TV_PLAYER_UPGRADE_GROUP]: 1,
        [TV_PLAYER_META_GROUP_WITH_UPGRADE]: metaItemCount,
        [TV_PLAYER_TRANSPORT_GROUP_WITH_UPGRADE]: transportItemCount,
      };
    }
    return {
      [TV_PLAYER_META_GROUP]: metaItemCount,
      [TV_PLAYER_TRANSPORT_GROUP]: transportItemCount,
    };
  }, [showUpgrade, metaItemCount, transportItemCount]);

  const resolveMoveLeft = useCallback(
    (groupIndex, itemIndex) => {
      if (!showUpgrade) return undefined;
      if (
        groupIndex === TV_PLAYER_META_GROUP_WITH_UPGRADE &&
        itemIndex === 0
      ) {
        return { groupIndex: TV_PLAYER_UPGRADE_GROUP, itemIndex: 0 };
      }
      if (
        groupIndex === TV_PLAYER_TRANSPORT_GROUP_WITH_UPGRADE &&
        itemIndex === 0
      ) {
        return { groupIndex: TV_PLAYER_UPGRADE_GROUP, itemIndex: 0 };
      }
      return undefined;
    },
    [showUpgrade],
  );

  const resolveMoveRight = useCallback(
    (groupIndex, itemIndex) => {
      if (!showUpgrade) return undefined;
      if (groupIndex === TV_PLAYER_UPGRADE_GROUP && itemIndex === 0) {
        return { groupIndex: TV_PLAYER_META_GROUP_WITH_UPGRADE, itemIndex: 0 };
      }
      return undefined;
    },
    [showUpgrade],
  );

  const focus = useScreenContentFocus(screenId, {
    groupCount,
    itemCounts,
    defaultGroupIndex: transportGroup,
    defaultItemIndex: defaultTransportItemIndex,
    navEnterEnabled: false,
    resolveMoveLeft,
    resolveMoveRight,
    ...screenFocusOptions,
  });

  return {
    ...focus,
    metaGroup,
    transportGroup,
    upgradeGroup,
    showUpgrade,
  };
}
