import { Calendar, FileSpreadsheet , Inbox, Folder, LayoutDashboard, ClipboardList   } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar
} from "@/components/ui/sidebar"
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import NavUser from "@/components/nav-user"
const items = [
    {
      title: "Dashboard",
      url: "/teacher/dashboard",
      icon: LayoutDashboard,
    },
    {
      title: "Classes",
      url: "/classes",
      icon: Inbox,
    },
    {
      title: "Reports",
      url: "/reports",
      icon: Folder,
    },
    {
      title: "Class Spreadsheets",
      url: "/teacher/spreadsheets/",
      icon: Calendar,
    },
  ]
  
  export default function AppSidebar() {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout, currentUser } = useAuth();
    const { state } = useSidebar()
    const isActive = (path) => {
      if (path === "/" && location.pathname === "/") {
        return true
      }
  
      if (path !== "/" && location.pathname.endsWith(path)) {
        return true
      }
  
      return false
    }
    const handleLogout = () => {
      logout();
      navigate("/login");
    };
    return (
      <Sidebar collapsible="icon">
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-2xl text-primary p-4 font-bold mt-5">
              GRADIFY
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu className="mt-6">
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton className="text-base h-12 hover:bg-primary hover:text-white" isActive={isActive(item.url)}asChild>
                      <a href={item.url} className="gap-4">
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter >
          <NavUser currentUser={currentUser} onLogout={handleLogout} isCollapsed={state === "collapsed"} />
        </SidebarFooter>
      </Sidebar>
    )
  }