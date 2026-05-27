import { useCallback } from "react";
import { userMayLikeMusicRadio } from "../constants/userContentGates";
import { useAccountRequiredDialog } from "../context/AccountRequiredDialogContext";
import { useLikes } from "../context/LikesContext";
import { useUserType } from "../context/UserTypeContext";

/**
 * Like / Unlike for music channels and radio stations (info + full player).
 *
 * @param {import('../constants/likes').LikeContentKind} kind
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
