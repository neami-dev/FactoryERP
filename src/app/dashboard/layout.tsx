import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Toaster } from "@/components/ui/sonner";

export const metadata = {
  title: "Dashborad",
  description: "Dashborad",
  robots: {
    index: false,
    follow: false,
  },
  icons: {
    icon: "/icons/big-tuna.svg",
  },
};
export default function Dashboradlayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider className=" w-full overflow-x-hidden">
      <DashboardSidebar />
      <main className="w-full flex flex-col">
        <div className="  bg-amber-50 w-[50px]  relative z-50 ">
          <SidebarTrigger className="absolute left-3 top-3 " />
        </div>{" "}
        <DashboardHeader />
        <div className=" "> {children}</div>
      </main>
      <Toaster />
    </SidebarProvider>
  );
}
