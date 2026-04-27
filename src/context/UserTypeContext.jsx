import { createContext, useContext, useMemo, useState } from "react";

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
