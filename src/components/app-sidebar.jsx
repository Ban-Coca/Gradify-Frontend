import {
  Calendar,
  LineChart,
  FileSpreadsheet,
  Inbox,
  Folder,
  LayoutDashboard,
  ClipboardList,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import NavUser from "@/components/nav-user";
import { useEffect, useRef, useState } from "react";
import GradifyLogo from "@/assets/gradifyLogo.svg?react";
import { Separator } from "./ui/separator";

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
    icon: FileSpreadsheet,
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
  const sidebarWrapperRef = useRef(null);
  const prevFocusRef = useRef(null);
  const [isOverlay, setIsOverlay] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { logout, currentUser } = useAuth();
  const { state, isMobile, setOpen, setOpenMobile } = useSidebar();

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
    if (isMobile) {
      // Blur focused element if it's inside the sidebar to prevent aria-hidden error
      const sidebar = document.querySelector('[data-sidebar="sidebar"]');
      if (sidebar && sidebar.contains(document.activeElement)) {
        document.activeElement.blur();
      }
      setOpenMobile(false);
    } else {
      setOpen(false);
    }
    logout();
    navigate("/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="p-2 group-data-[collapsible=icon]:flex group-data-[collapsible=icon]:justify-center">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground h-16 justify-start group-data-[collapsible=icon]:!justify-center group-data-[collapsible=icon]:px-0 hover:bg-white hover:dark:bg-card cursor-pointer"
              onClick={() => navigate(items[0].url)}
            >
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:w-full">
                <div className="flex items-center justify-center">
                  <GradifyLogo style={{ width: "2rem", height: "2rem" }} />
                </div>
                <span className="text-2xl font-medium text-emerald-700 group-data-[collapsible=icon]:sr-only">
                  Gradify
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <Separator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="mt-4">
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    className="text-base h-12 hover:bg-primary hover:text-white data-[active=true]:bg-primary"
                    isActive={isActive(item.url)}
                    asChild
                  >
                    <Link
                      to={Array.isArray(item.url) ? item.url[0] : item.url}
                      className="gap-4"
                    >
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          currentUser={currentUser}
          onLogout={handleLogout}
          isCollapsed={state === "collapsed"}
        />
      </SidebarFooter>
    </Sidebar>
  );
}
