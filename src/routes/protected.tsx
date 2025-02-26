import { dataService } from "@/dataservice";
import { useUserStore } from "@/store/user.store";
import { isEmpty } from "@/utils";
import {
  getCurrentUserRole,
  getResolvedRole,
  isAuthenticated,
} from "@/utils/auth";
import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface PrivateRouteProps {
  role?: string;
}

export const PrivateRoute = ({ role = "user" }: PrivateRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const authInfo = isAuthenticated();

  useEffect(() => {
    async function fetchUserDetails() {
      if (!isEmpty(useUserStore.getState())) {
        setIsLoading(false);
        return;
      }
      try {
        const userData = await dataService.get("/user/info");
        if (userData) {
          useUserStore.setState(userData);
        }
      } catch (error) {
        console.error("Error fetching account details:", error);
      } finally {
        setIsLoading(false);
      }
    }
    // fetchUserDetails();
  }, []);

  // if (isEmpty(authInfo)) return <Navigate to="/login" />;

  // if (isLoading) {
  //   return <div>Loading...</div>;
  // }

  const userRole = getCurrentUserRole();
  const requiredRole = getResolvedRole(role);

  // if (userRole < requiredRole) return <>No Access</>;

  return <Outlet />;
};
