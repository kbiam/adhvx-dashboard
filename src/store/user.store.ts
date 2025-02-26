import { BasicUserInfo } from "@/utils/types";
import { create } from "zustand";

export const useUserStore = create<Partial<BasicUserInfo>>(() => ({}));
