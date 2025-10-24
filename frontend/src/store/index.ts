import type { LoginResultData } from "@/types/api";
import { create } from "zustand";

interface AppState {
  userInfo: LoginResultData | null;
  setUserInfo: (userInfo: LoginResultData | null) => void;
}

export const useAppStore = create<AppState>((set) => ({
  userInfo: null,
  setUserInfo: (userInfo: LoginResultData | null) => set({ userInfo }),
}));
