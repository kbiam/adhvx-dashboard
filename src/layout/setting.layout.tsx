import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar, SidebarProps } from "@/custom_components/sidebar";
import { Outlet } from "react-router-dom";

export function SettingLayout({ title, items }: SidebarProps) {
  return (
    <SidebarProvider>
      <AppSidebar title={title} items={items} />
      <div className="w-full p-4">
        <Outlet />
      </div>
    </SidebarProvider>
  );
}
