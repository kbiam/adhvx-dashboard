import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/login";
import { HomeLayout } from "./layout/home.layout";
import { CircuitBoardIcon, Home, LineChart, UserPenIcon } from "lucide-react";
import { PrivateRoute } from "./routes/protected";
import { ProfileSettings } from "./pages/profile_settings";
import { SettingLayout } from "./layout/setting.layout";
import { UserManagement } from "./pages/account_settings/user_management";
import { ResetPassword } from "./pages/reset_password";
import { DataExplorer } from "./pages/data_explorer";
import { Dashboard } from "./pages/dashboard";

const navItems = [
  {
    label: "Dashboard",
    link: "dashboard",
    icon: Home,
  },

  {
    label: "Data Explorer",
    link: "explorer",
    icon: LineChart,
  },
];

const accountSettingItems = [
  {
    title: "User Management",
    url: "usermanagement",
    icon: UserPenIcon,
  },
  {
    title: "Connected Devices",
    url: "devices",
    icon: CircuitBoardIcon,
  },
];

export const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/" element={<HomeLayout navItems={navItems} />}>
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="explorer" element={<DataExplorer />} />
            <Route path="profilesettings" element={<ProfileSettings />} />
          </Route>
          <Route element={<PrivateRoute role="admin" />}>
            <Route
              path="accountsettings"
              element={
                <SettingLayout
                  items={accountSettingItems}
                  title="Account Settings"
                />
              }
            >
              <Route
                index
                element={
                  <Navigate to="/accountsettings/usermanagement" replace />
                }
              />
              <Route path="usermanagement" element={<UserManagement />} />
              <Route path="devices" element={<>Connected Devices</>} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </Router>
  );
};
