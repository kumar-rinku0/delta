import {
  Bell,
  Briefcase,
  Home,
  LayoutDashboard,
  Settings,
  User,
} from "lucide-react";
import { usePathname } from "next/navigation";

// after login desktop!
export const NavItems = () => {
  const pathname = usePathname();
  function isNavItemActive(pathname: string, path: string) {
    return pathname.includes(path);
  }
  return [
    {
      groupName: "menu",
      position: "top",
      groupContent: [
        {
          name: "Dashboard",
          href: "/dashboard",
          icon: <LayoutDashboard size={20} />,
          active: pathname === "/dashboard",
        },
        {
          name: "Projects",
          href: "/projects",
          icon: <Briefcase size={20} />,
          active: isNavItemActive(pathname, "/projects"),
        },
      ],
    },
    {
      groupName: "overview",
      position: "top",
      groupContent: [
        {
          name: "Profile",
          href: "/profile",
          icon: <User size={20} />,
          active: isNavItemActive(pathname, "/profile"),
        },
        {
          name: "Notifications",
          href: "/notifications",
          icon: <Bell size={20} />,
          active: isNavItemActive(pathname, "/notifications"),
        },
      ],
    },
    {
      groupName: "",
      position: "bottom",
      groupContent: [
        {
          name: "Settings",
          href: "/settings",
          icon: <Settings size={20} />,
          active: isNavItemActive(pathname, "/settings"),
        },
      ],
    },
  ];
};

// before login

export const MobileNavItems = () => {
  const pathname = usePathname();
  function isNavItemActive(pathname: string, path: string) {
    return pathname.includes(path);
  }

  return [
    {
      name: "Home",
      href: "/",
      icon: <Home size={20} />,
      active: pathname === "/",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
      active: isNavItemActive(pathname, "/dashboard"),
    },
    {
      name: "Projects",
      href: "/projects",
      icon: <Briefcase size={20} />,
      active: isNavItemActive(pathname, "/projects"),
    },
    {
      name: "Profile",
      href: "/profile",
      icon: <User size={20} />,
      active: isNavItemActive(pathname, "/profile"),
    },
    {
      name: "Notifications",
      href: "/notifications",
      icon: <Bell size={20} />,
      active: isNavItemActive(pathname, "/notifications"),
    },
    {
      name: "Settings",
      href: "/settings",
      icon: <Settings size={20} />,
      active: isNavItemActive(pathname, "/settings"),
    },
  ];
};
