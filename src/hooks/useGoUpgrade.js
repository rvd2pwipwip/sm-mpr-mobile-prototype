import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserType } from "../context/UserTypeContext";

/**
 * Prototype Upgrade navigation: from guest, assume account/sign-in works and
 * promote to freeStingray (logged in, no subscription) before the paywall.
 */
export function useGoUpgrade() {
  const navigate = useNavigate();
  const { userType, setUserType } = useUserType();

  return useCallback(() => {
    if (userType === "guest") {
      setUserType("freeStingray");
    }
    navigate("/upgrade");
  }, [navigate, userType, setUserType]);
}
