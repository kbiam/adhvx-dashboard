import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { LucideProps, Settings, Menu, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ThemeToggle } from "../theme_toggle";
import { dataService } from "@/dataservice";
import { signOut } from "@/utils/auth";
import { useUserStore } from "@/store/user.store";

interface NavItem {
  label: string;
  link: string;
  icon: React.ForwardRefExoticComponent<
    Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>
  >;
}

export interface NavbarProps {
  navItems: NavItem[];
}

export const Navbar = (props: NavbarProps) => {
  const { navItems } = props;
  const { pathname } = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-14 flex-col border-r bg-background sm:flex">
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-4">
          <Link
            to="#"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full  text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base bg-transparent"
          >
            <img
              className="rounded-full"
              src="/logos/logoBlueBg.jpg"
              alt="Sci-Fi Logo"
            />
          </Link>
          <TooltipProvider>
            {navItems.map((item) => (
              <Tooltip key={item.label}>
                <TooltipTrigger asChild>
                  <Link
                    to={item.link}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg transition-colors hover:text-foreground md:h-8 md:w-8 ${
                      pathname.includes(item.link)
                        ? "bg-accent text-accent-foreground"
                        : "text-muted-foreground"
                    }`}
                  >
                    <item.icon className="h-5 w-5" />
                    <span className="sr-only">{item.label}</span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent side="right">{item.label}</TooltipContent>
              </Tooltip>
            ))}
          </TooltipProvider>
        </nav>
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-4">
          <ThemeToggle />
          <SettingsMenu />
        </nav>
      </aside>

      {/* Mobile Navbar */}
      <header className="fixed top-0 left-0 z-20 w-full border-b bg-background sm:hidden">
        <div className="flex h-14 items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              <span className="sr-only">Toggle menu</span>
            </button>
            <Link
              to="#"
              className="flex h-8 w-8 items-center justify-center rounded-full bg-primary"
            >
              <img
                className="rounded-full"
                src="/scifi_logo.jpg"
                alt="Sci-Fi Logo"
              />
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SettingsMenu />
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-14 left-0 w-full border-b bg-background px-4 py-2 shadow-md">
            <nav className="flex flex-col space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.link}
                  className={`flex items-center gap-2 rounded-lg px-3 py-2 transition-colors ${
                    pathname.includes(item.link)
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground hover:bg-accent/50 hover:text-accent-foreground"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <item.icon className="h-5 w-5" />
                  <span className="text-sm">{item.label}</span>
                </Link>
              ))}
            </nav>
          </div>
        )}
      </header>
      
      {/* Spacer for mobile layout */}
      <div className="h-14 sm:hidden" />
    </>
  );
};

function SettingsMenu() {
  async function handleLogOut() {
    await dataService.get("/auth/signout");
    signOut();
    useUserStore.setState({});
    window.location.href = "/login";
  }
  
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
      <span className="flex items-center">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Settings</span>
        </span>

      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Profile</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link className="w-full text-primary" to="profilesettings">
              Preference
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link className="w-full text-primary" to="accountsettings">
              Account Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={handleLogOut}>Log out</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}