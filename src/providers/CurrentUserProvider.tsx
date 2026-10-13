"use client";
import { createContext, useContext, type ReactNode } from "react";
import type { IUser } from "@/types/auth.type";
const CurrentUserContext = createContext<IUser | null>(null);
export function CurrentUserProvider({ user, children }: { user: IUser | null; children: ReactNode }) {
  return <CurrentUserContext.Provider value={user}>{children}</CurrentUserContext.Provider>;
}
export const useCurrentUser = () => useContext(CurrentUserContext);
