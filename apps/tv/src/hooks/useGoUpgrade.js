import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useUserType } from "../context/UserTypeContext.jsx";

/**
 * Prototype Upgrade navigation: from guest, assume sign-in works and promote to
 * freeStingray before the paywall (mobile `useGoUpgrade` parity).
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
