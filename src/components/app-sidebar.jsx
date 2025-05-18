import { Calendar, LineChart, FileSpreadsheet, Inbox, Folder, LayoutDashboard, ClipboardList } from "lucide-react";

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
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import NavUser from "@/components/nav-user";

const teacherItems = [
  {
    title: "Dashboard",
    url: "/teacher/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Classes",
    url: "/teacher/classes",
    icon: Inbox,
  },
  {
    title: "Reports",
    url: "/teacher/reports",
    icon: Folder,
  },
  {
    title: "Class Spreadsheets",
    url: "/teacher/spreadsheets/",
    icon: Calendar,
  },
];

const studentItems = [
  {
    title: "Dashboard",
    url: "/student/dashboard", // Multiple URLs for the Dashboard
    icon: LayoutDashboard,
  },
  {
    title: "Grades",
    url: "/student/grades",
    icon: FileSpreadsheet, // Spreadsheet icon for grades
  },
  {
    title: "Feedback",
    url: "/student/feedback",
    icon: ClipboardList, // Clipboard icon for feedback
  },
  {
    title: "Progress Trends",
    url: "/student/progress-trends",
    icon: LineChart, // Line chart icon for progress trends
  },
];

export default function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { state } = useSidebar();

  // Determine the items to display based on the user's role
  const items = currentUser?.role === "TEACHER" ? teacherItems : studentItems;

  const isActive = (path) => {
    // Handle multiple URLs (array)
    if (Array.isArray(path)) {
      return path.some((p) => location.pathname.startsWith(p));
    }
  
    // Handle specific conditions
    if (path === "/" && location.pathname === "/") {
      return true;
    }
    if (location.pathname === "/notifications") {
      return path === "/home";
    }
  
    // Default condition for single URL
    return location.pathname.startsWith(path);
  };

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
                <SidebarMenuButton
                  className="text-base h-12 hover:bg-primary hover:text-white"
                  isActive={isActive(item.url)}
                  asChild
                >
                  <a href={Array.isArray(item.url) ? item.url[0] : item.url} className="gap-4">
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
      <SidebarFooter>
        <NavUser currentUser={currentUser} onLogout={handleLogout} isCollapsed={state === "collapsed"} />
      </SidebarFooter>
    </Sidebar>
  );
}