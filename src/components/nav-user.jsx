import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  TooltipProvider,
} from "@/components/ui/tooltip";
import { useAuth } from "@/contexts/authentication-context"; 
import { useSidebar } from "@/components/ui/sidebar";
import { useState, useEffect, useRef } from "react";

export default function NavUser({
  currentUser,
  onLogout,
  isCollapsed = false,
}) {
  const navigate = useNavigate();
  const { userRole } = useAuth(); // Get user role from context
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { state, openMobile, setOpen, isMobile } = useSidebar();

  // For desktop only - close dropdown when sidebar state changes
  useEffect(() => {
    if (!isMobile && (state === 'collapsed' || isCollapsed)) {
      setIsDropdownOpen(false);
    }
  }, [state, isCollapsed, isMobile]);

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (!currentUser?.firstName && !currentUser?.lastName) return "U";
    return `${currentUser?.firstName?.charAt(0) || ""}${
      currentUser?.lastName?.charAt(0) || ""
    }`;
  };

  // Navigate to profile based on user role
  const handleProfileClick = () => {
    if (userRole === "TEACHER") {
      navigate("/teacher/profile");
    } else if (userRole === "STUDENT") {
      navigate("/student/profile");
    }
  };

  // Navigate to settings based on user role (if you have role-specific settings)
  const handleSettingsClick = () => {
    if (userRole === "TEACHER") {
      navigate("/teacher/settings");
    } else if (userRole === "STUDENT") {
      navigate("/student/settings");
    } else {
      navigate("/settings"); // Generic settings
    }
  };

  const handleLogout = () => {
    setIsDropdownOpen(false); // Close dropdown first
    
    // On mobile, ensure focus is cleared before logout
    if (isMobile) {
      const activeElement = document.activeElement;
      if (activeElement && activeElement.closest('[data-sidebar="sidebar"]')) {
        activeElement.blur();
      }
    }
    
    onLogout();
  };

  const handleDropdownOpenChange = (open) => {
    // Only allow dropdown on desktop
    if (!isMobile) {
      setIsDropdownOpen(open);
    }
  };

  // Collapsed state - only show avatar with tooltip
  if (isCollapsed) {
    return (
      <div className="p-2 flex justify-center border-t">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenu 
                open={isDropdownOpen} 
                onOpenChange={handleDropdownOpenChange}
              >
                <DropdownMenuTrigger asChild>
                  <Button
                    data-focus-target
                    variant="ghost"
                    size="icon"
                    className="h-10 w-10 rounded-full"
                  >
                    <Avatar className="h-9 w-9">
                      <AvatarImage
                        src={currentUser?.profileImage}
                        alt={currentUser?.firstName}
                      />
                      <AvatarFallback className="bg-primary/10 dark:bg-emerald-600 text-primary">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    {currentUser?.firstName} {currentUser?.lastName}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="hover:dark:bg-emerald-600" onClick={handleSettingsClick}>
                    <Settings className="mr-2 h-4 w-4 group-hover:text-white" />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={onLogout}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 focus:text-red-700 focus:bg-red-50"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Logout</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>
                {currentUser?.firstName} {currentUser?.lastName}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );
  }

  // Mobile state - show user info and simple buttons
  if (isMobile) {
    return (
      <div className="p-4 border-t space-y-3">
        {/* User Info */}
        <div className="flex items-center gap-3 px-2">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={currentUser?.profilePictureUrl}
              alt={currentUser?.firstName}
            />
            <AvatarFallback className="bg-primary/10 dark:bg-emerald-700 text-primary dark:text-emerald-400">
              {getUserInitials()}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col items-start text-left min-w-0 flex-1">
            <span className="font-medium text-sm truncate w-full">
              {currentUser?.firstName} {currentUser?.lastName}
            </span>
            <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate w-full">
              {currentUser?.email}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={handleSettingsClick}
              variant="ghost"
              size="sm"
              className="h-12 flex-col gap-1 bg-sidebar-accent/10 hover:bg-sidebar-accent/30 border border-sidebar-border/30 rounded-xl text-sidebar-foreground/80 hover:text-sidebar-foreground transition-all duration-200 hover:scale-[1.02] dark:hover:bg-primary"
            >
              <Settings className="h-4 w-4" />
              <span className="text-xs font-medium">Settings</span>
            </Button>

            <Button
              onClick={onLogout}
              variant="ghost"
              size="sm"
              className="h-12 flex-col gap-1 bg-red-50/50 hover:bg-red-100/80 dark:bg-red-950/30 dark:hover:bg-red-950/50 border border-red-200/50 dark:border-red-800/50 rounded-xl text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-all duration-200 hover:scale-[1.02]"
            >
              <LogOut className="h-4 w-4" />
              <span className="text-xs font-medium">Logout</span>
            </Button>
          </div>
      </div>
    );
  }

  // Desktop expanded state - show full user info with dropdown
  return (
    <div className="p-4 border-t">
      <DropdownMenu
        open={isDropdownOpen} 
        onOpenChange={handleDropdownOpenChange}
      >
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            aria-label="More options"
            className="w-full flex items-center justify-start gap-3 h-14 px-3 hover:bg-primary/10 dark:hover:bg-emerald-700 hover:text-primary hover:dark:text-emerald-200"
            aria-expanded={isDropdownOpen}
            aria-haspopup="menu"
          >
            <Avatar className="h-9 w-9">
              <AvatarImage
                src={currentUser?.profilePictureUrl}
                alt={currentUser?.firstName}
              />
              <AvatarFallback className="bg-primary/10 dark:bg-emerald-700 text-primary dark:text-emerald-400">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start text-left min-w-0">
              <span className="font-medium truncate w-full max-w-[150px]">
                {currentUser?.firstName} {currentUser?.lastName}
              </span>
              <p className="text-xs text-muted-foreground dark:text-muted-foreground truncate w-full">
                {currentUser?.email}
              </p>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          align="end" 
          className="w-56"
          onCloseAutoFocus={(e) => {
            e.preventDefault();
          }}  
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleSettingsClick}
            className="hover:dark:bg-emerald-600"
          >
            <Settings className="mr-2 h-4 w-4 group-hover:text-white" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={(e) => {
              e.stopPropagation();
              setIsDropdownOpen(false)
              handleLogout()
            }}
            className="text-red-600 hover:text-red-700 hover:bg-red-100 focus:text-red-700 focus:bg-red-50 hover:dark:bg-red-500 hover:dark:text-red-50 cursor-pointer"
          >
            <LogOut className="mr-2 h-4 w-4 hover:dark:text-destructive" />
            <span>Logout</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
