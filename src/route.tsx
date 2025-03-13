import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import { Login } from "./pages/login";
import { HomeLayout } from "./layout/home.layout";
import { Boxes, CircuitBoardIcon, ClipboardList, Home, icons, LineChart, RefreshCcw, UserPenIcon } from "lucide-react";
import { PrivateRoute } from "./routes/protected";
import { ProfileSettings } from "./pages/profile_settings";
import { SettingLayout } from "./layout/setting.layout";
import { UserManagement } from "./pages/account_settings/user_management";
import { ResetPassword } from "./pages/reset_password";
import { DataExplorer } from "./pages/data_explorer";
import { Dashboard } from "./pages/dashboard";
import { SignUp } from "./pages/signup";
import DeviceManagement from "./pages/device_management";
import Inventory from "./pages/inventory";
import WorkOrders from "./pages/workOrders";
import OTAUpdates from "./pages/otaUpdates";
import MachineDashboard from "./pages/machineDashboard";

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
  {
    label:"Device Management",
    link:"devices",
    icon: CircuitBoardIcon
  },
  {
    label:"Inventory",
    link:"inventory",
    icon: Boxes
  },
  {
    label: "Work Orders",
    link: "workOrders",
    icon: ClipboardList
  },
  {
    label : "OTA Updates",
    link : "ota",
    icon : RefreshCcw

  }
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
        <Route path="/signup" element={<SignUp />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        <Route path="/" element={<HomeLayout navItems={navItems} />}>
          <Route element={<PrivateRoute />}>
            <Route path="dashboard" element={<Dashboard/>} />
            <Route path="explorer" element={<DataExplorer />} />
            <Route path="devices" element={<DeviceManagement />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="workOrders" element={<WorkOrders />} />
            <Route path="ota" element={<OTAUpdates />} />
            <Route path="machine/:machineId" element={<MachineDashboard/>} />
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
