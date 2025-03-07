import { Outlet, useLocation } from "react-router-dom";
import { Navbar, NavbarProps } from "@/custom_components/leftnav";
const noPaddingRoutes = ["/accountsettings",'/dashboard','/devices'];

export function HomeLayout(props: NavbarProps) {
  const location = useLocation();

  const applyPadding = !noPaddingRoutes.some((route) =>
    location.pathname.startsWith(route)
  );
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Navbar navItems={props.navItems} />
      <div className="flex flex-col sm:gap-4 sm:pl-14 w-full">
        <div className={applyPadding ? "p-4" : "p-0"}>
          <Outlet />
        </div>
      </div>
    </div>
  );
}
