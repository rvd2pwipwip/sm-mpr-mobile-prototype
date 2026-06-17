import { useCallback, useMemo } from "react";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useScreenContentFocus } from "./useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "./useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "./useTvVerticalGroupScroll.js";
import { getTvInfoAccountActionCount } from "../utils/tvInfoAccountFocus.js";
import { getTvInfoSettingsGroupCount } from "../utils/tvInfoSettingsFocus.js";

/**
 * Shared overlay chrome + account/settings focus for Info / Account and settings.
 * Each action or control is its own vertical focus group (Down/Up moves between items).
 */
export function useTvInfoScreenFocus(screenId) {
  const { userType } = useUserType();

  const accountActionCount = useMemo(
    () => getTvInfoAccountActionCount(userType),
    [userType],
  );

  const settingsGroupCount = getTvInfoSettingsGroupCount();
  const totalGroupCount = accountActionCount + settingsGroupCount;

  const {
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
    focusedGroupIndex,
    focusedIndex,
    getItemElement,
  } = useScreenContentFocus(screenId, {
    groupCount: Math.max(totalGroupCount, 1),
    itemCount: 1,
    defaultGroupIndex: 0,
    defaultItemIndex: 0,
  });

  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const lastFocusableGroupIndex = Math.max(0, totalGroupCount - 1);

  const {
    viewportRef,
    innerRef,
    innerClassName,
    offsetY,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    firstFocusableGroupIndex: 0,
    lastFocusableGroupIndex: lastFocusableGroupIndex,
    getFocusedElement,
    screenId,
    scrollEnabled: totalGroupCount > 0,
  });

  return {
    shellRef,
    headerRef,
    viewportRef,
    innerRef,
    innerClassName,
    offsetY,
    settingsGroupOffset: accountActionCount,
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  };
}
