"use client";

import { ThemeToggle } from "@/components/partial/theme-toggle";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { MobileNavItems } from "@/util/config";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AlignJustify, LogIn, LogOut, Sparkle } from "lucide-react";
import { Fragment } from "react";
import { SideNavItem } from "./side-nav";
import { Button } from "../ui/button";
import { useAuth } from "../provider/auth-provider";

import {
  NavigationMenu,
  NavigationMenuContent,
  // NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  // NavigationMenuViewport,
} from "@/components/ui/navigation-menu";
import axios from "axios";
import SelcetComp from "./select-comp";
import CreateComp from "./create-comp";
import { toast } from "sonner";

const Header = ({ root }: { root?: boolean }) => {
  const auth = useAuth();
  const handleClick = () => {
    axios
      .get("/api/user")
      .then((res) => {
        console.log(res);
        const { message } = res.data;
        toast.success(message);
      })
      .catch((err) => {
        console.log(err);
        const { message } = err.response.data;
        toast.error(message);
      });
  };
  return (
    <header className="flex items-center h-16 px-4 border-b border-b-neutral-200 dark:border-b-neutral-800 shrink-0 md:px-6 justify-between">
      {root && (
        <div className="hidden sm:flex sm:w-[50%] justify-center z-10">
          <DesktopNav />
          <div className="flex gap-4 items-center">
            <Button onClick={handleClick}>user</Button>
            {auth?.isAuthenticated ? (
              <Button onClick={auth?.signOut}>logout</Button>
            ) : (
              <>
                <Link href="/login"> login</Link>
                <Link href="/register"> register</Link>
              </>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-center gap-4">
        <div className="flex justify-center items-center">
          <Skeleton className="h-9 w-9 rounded-full" />
        </div>
        <div>
          <ThemeToggle />
        </div>
        <div>
          {auth?.user?.roleInfo && auth.user.roleInfo.length > 0 && (
            <SelcetComp roleInfo={auth.user.roleInfo} />
          )}
        </div>
        <div>
          {auth?.user?.roleInfo && auth.user.roleInfo.length === 0 && (
            <CreateComp userId={auth.user._id} />
          )}
        </div>
      </div>
      <div className={`flex sm:hidden z-10 items-center`}>
        <MobileNav />
      </div>
    </header>
  );
};

export const DesktopNav = () => {
  // const auth = useAuth();
  return (
    <div>
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <NavigationMenuTrigger className="px-4">
              Get Stated
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <ul className="grid gap-3 p-4 sm:w-[400px] sm:grid-cols-[1fr_.75fr]">
                <li className="row-span-3">
                  <NavigationMenuLink asChild>
                    <Link
                      className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md hover:bg-slate-50 cursor-pointer"
                      href="/dashboard"
                    >
                      <Sparkle className="h-6 w-6" />
                      <div className="mb-2 mt-4 text-lg font-medium">
                        potential dash!
                      </div>
                      <p className="text-sm leading-tight text-muted-foreground">
                        Your personalized dashboard to manage all your tasks
                        efficiently.
                      </p>
                    </Link>
                  </NavigationMenuLink>
                </li>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/register"}
                    className="flex p-4 items-center hover:bg-slate-50 rounded-md cursor-pointer"
                  >
                    Get Started
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/login"}
                    className="flex p-4 items-center hover:bg-slate-50 rounded-md cursor-pointer"
                  >
                    Log In
                  </Link>
                </NavigationMenuLink>
                <NavigationMenuLink asChild>
                  <Link
                    href={"/"}
                    className="flex p-4 items-center hover:bg-slate-50 rounded-md cursor-pointer"
                  >
                    Login via Google
                  </Link>
                </NavigationMenuLink>
              </ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </div>
  );
};

export const MobileNav = () => {
  const auth = useAuth();
  const mobileNavItems = MobileNavItems();
  return (
    <Sheet>
      <SheetTrigger>
        <AlignJustify />
      </SheetTrigger>
      <SheetContent className="w-60 sm:w-96 bg-white dark:bg-zinc-700">
        <SheetHeader>
          {auth?.isAuthenticated ? (
            <SheetTitle className="h-32 flex justify-start items-center gap-4">
              <Skeleton className="w-14 h-14 rounded-full" />
              <span>{auth.user?.givenName}</span>
            </SheetTitle>
          ) : (
            <SheetTitle className="h-72 flex flex-col items-start justify-center gap-4">
              <Link
                href={"/login"}
                className={`h-fit w-full py-2 px-4 relative flex items-center justify-start whitespace-nowrap rounded-md hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white`}
              >
                <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                  {<LogIn size={20} />}
                  <span className="font-medium">Log In</span>
                </div>
              </Link>
              <Link
                href={"/register"}
                className={`h-fit w-full py-2 px-4 relative flex items-center justify-start whitespace-nowrap rounded-md hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white`}
              >
                <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                  {<Sparkle size={20} />}
                  <span className="font-medium">Get Started</span>
                </div>
              </Link>
            </SheetTitle>
          )}
          <SheetDescription></SheetDescription>
          {auth?.isAuthenticated &&
            mobileNavItems.map((item, idx) => {
              return (
                <Fragment key={idx}>
                  <div className="flex flex-col my-2 px-2">
                    <SideNavItem
                      label={item.name}
                      icon={item.icon}
                      path={item.href}
                      active={item.active}
                      isSidebarExpanded={true}
                    />
                  </div>
                </Fragment>
              );
            })}
        </SheetHeader>
        {auth?.isAuthenticated && (
          <SheetFooter className="absolute sm:flex-col sm:justify-center bottom-4 left-4 right-4">
            <Button
              onClick={auth?.signOut}
              variant={"secondary"}
              className={`h-full relative flex items-center whitespace-nowrap rounded-md hover:bg-neutral-200 hover:text-neutral-700 text-neutral-500 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-white`}
            >
              <div className="relative font-base text-sm py-1.5 px-2 flex flex-row items-center space-x-2 rounded-md duration-100">
                {<LogOut size={20} />}
                <span className="font-medium">LogOut</span>
              </div>
            </Button>
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default Header;
