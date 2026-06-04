import { useCallback } from "react";
import { userMayLikeMusicRadio } from "@sm-mpr/shared/utils/userContentGates.js";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext.jsx";
import { useLikes } from "../context/LikesContext.jsx";
import { useUserType } from "../context/UserTypeContext.jsx";

/**
 * Like / Unlike for music channels and radio stations (info + full player).
 *
 * @param {'music' | 'radio'} kind
 * @param {string | undefined} id
 */
export function useMusicRadioLikeAction(kind, id) {
  const { userType } = useUserType();
  const { isLiked, toggleLike } = useLikes();
  const { openAccountRequiredDialog } = useAccountRequiredDialog();

  const liked = Boolean(id && isLiked(kind, id));

  const onPress = useCallback(() => {
    if (!id) return;
    if (!userMayLikeMusicRadio(userType)) {
      openAccountRequiredDialog("favorites");
      return;
    }
    toggleLike({ kind, id });
  }, [userType, kind, id, toggleLike, openAccountRequiredDialog]);

  const iconVariant = liked ? "unlike" : "like";

  return {
    liked,
    onPress,
    iconVariant,
    label: liked ? "Unlike" : "Like",
    ariaLabel: liked ? "Unlike" : "Like",
  };
}
