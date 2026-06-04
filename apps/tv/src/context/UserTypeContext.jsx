import { createContext, useContext, useMemo, useState } from "react";
import { USER_TYPES } from "@sm-mpr/shared/constants/userTypes.js";

export { USER_TYPES };

const UserTypeContext = createContext(null);

export function UserTypeProvider({ children }) {
  const [userType, setUserType] = useState("guest");

  const value = useMemo(
    () => ({
      userType,
      setUserType,
    }),
    [userType],
  );

  return (
    <UserTypeContext.Provider value={value}>{children}</UserTypeContext.Provider>
  );
}

export function useUserType() {
  const ctx = useContext(UserTypeContext);
  if (!ctx) {
    throw new Error("useUserType must be used within UserTypeProvider");
  }
  return ctx;
}
