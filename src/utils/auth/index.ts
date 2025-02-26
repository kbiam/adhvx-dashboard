import { USER_ROLE_MAPPING } from "@/constants";
import { useUserStore } from "@/store/user.store";

export const isAuthenticated = () => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem("projectx-token")) {
    return JSON.parse(localStorage.getItem("projectx-token") || "");
  } else {
    return false;
  }
};

export const authenticate = (token: string) => {
  if (typeof window !== "undefined") {
    localStorage.setItem("projectx-token", JSON.stringify(token));
  }
};

export const signOut = async () => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("projectx-token");
  }
};

export function getResolvedRole(roleName: string): number {
  return USER_ROLE_MAPPING[roleName] || 0;
}

export function getCurrentUserRole(): number {
  const userRole = useUserStore.getState().Role || "invalid";
  return USER_ROLE_MAPPING[userRole] || 0;
}
