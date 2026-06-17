import { useCallback, useMemo } from "react";
import { useUserType } from "../context/UserTypeContext.jsx";
import { useScreenContentFocus } from "./useScreenContentFocus.js";
import { useTvScreenHeaderOffset } from "./useTvScreenHeaderOffset.js";
import { useTvVerticalGroupScroll } from "./useTvVerticalGroupScroll.js";
import { getTvInfoAccountActionCount } from "../utils/tvInfoAccountFocus.js";

/**
 * Shared overlay chrome + account-section focus for Info / Account and settings.
 * Each account action is its own vertical focus group (Down/Up moves between buttons).
 */
export function useTvInfoScreenFocus(screenId) {
  const { userType } = useUserType();

  const accountActionCount = useMemo(
    () => getTvInfoAccountActionCount(userType),
    [userType],
  );

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
    groupCount: Math.max(accountActionCount, 1),
    itemCount: 1,
    defaultGroupIndex: 0,
    defaultItemIndex: 0,
  });

  const { shellRef, headerRef } = useTvScreenHeaderOffset();

  const getFocusedElement = useCallback(
    () => getItemElement(focusedGroupIndex, focusedIndex),
    [getItemElement, focusedGroupIndex, focusedIndex],
  );

  const lastAccountGroupIndex = Math.max(0, accountActionCount - 1);

  const {
    viewportRef,
    innerRef,
    innerClassName,
    offsetY,
  } = useTvVerticalGroupScroll(focusedGroupIndex, {
    firstFocusableGroupIndex: 0,
    lastFocusableGroupIndex: lastAccountGroupIndex,
    getFocusedElement,
    screenId,
    scrollEnabled: accountActionCount > 0,
  });

  return {
    shellRef,
    headerRef,
    viewportRef,
    innerRef,
    innerClassName,
    offsetY,
    registerItemRef,
    isItemFocused,
    handleMoveUp,
    handleMoveDown,
    handleMoveLeft,
    handleMoveRight,
  };
}
