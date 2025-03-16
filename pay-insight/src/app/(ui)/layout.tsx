"use client";

import "../globals.css";
import Header from "@/components/partial/header";
import SideNav from "@/components/partial/side-nav";
import { useAuth } from "@/components/provider/auth-provider";
import { redirect } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const auth = useAuth();
  console.log(auth);
  if (!auth?.loading && !auth?.isAuthenticated) {
    redirect("/login");
  }
  return (
    <div>
      <Header />
      <div className="flex">
        <SideNav />
        <div className="w-full overflow-x-auto bg-accent dark:bg-primary">
          <div className="sm:h-[calc(99vh-60px)] overflow-auto">
            <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh-120px)] overflow-y-auto relative">
              <div className="w-full md:max-w-6xl xl:max-w-none xl:w-7xl pt-1 pl-1">
                {children}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
