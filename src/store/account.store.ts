import { BasicAccountInfo } from "@/utils/types";
import { create } from "zustand";

export const useAccountStore = create<Partial<BasicAccountInfo>>(() => ({
  _id: undefined,
  Domain: undefined,
  CompanyName: undefined,
}));
