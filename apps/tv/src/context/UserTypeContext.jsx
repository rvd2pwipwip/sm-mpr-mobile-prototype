import { createContext, useContext, useMemo, useState } from "react";

/** Matches mobile prototype user types until shared package hoists constants. */
export const USER_TYPES = [
  "guest",
  "freeStingray",
  "freeProvided",
  "subscribed",
];

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
