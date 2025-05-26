import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import AppSidebar from "../components/app-sidebar";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Toaster } from "sonner";
import { Input } from "./ui/input";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/authentication-context";
import { NotificationDropdown } from "./notification-dropdown";
const Layout = ({ children }) => {
  const [defaultOpen, setDefaultOpen] = useState(true)
  const { currentUser } = useAuth()
  useEffect(() => {
    // Read the sidebar state from cookie when component mounts
    const cookies = document.cookie.split(";")
    const sidebarCookie = cookies.find((cookie) => cookie.trim().startsWith("sidebar:state="))
    if (sidebarCookie) {
      const sidebarState = sidebarCookie.split("=")[1]
      setDefaultOpen(sidebarState === "true")
    }
  }, [])

  return (
    <SidebarProvider defaultOpen={defaultOpen}>
      <AppSidebar className="bg-sidebar" />
      <SidebarInset>
        <header className="sticky top-0 z-10 flex h-16 items-center bg-background border-b border-border p-4 shadow-sm">
          <SidebarTrigger className="-ml-1"/>
          <Separator className="mx-4 h-6 w-px bg-border" orientation="vertical" />
          <div className="flex w-full justify-end">
            <NotificationDropdown />
          </div>
        </header>
        <div className="flex-1 px-4 overflow-auto">
          <div className="container mx-auto px-4">
            {/* Main content goes here */}
            <Toaster richColors/>
            {children}
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default Layout;