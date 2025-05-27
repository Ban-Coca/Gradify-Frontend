import { LogOut, Settings, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip"
import { useAuth } from "@/contexts/authentication-context" // Import your auth context

export default function NavUser({ currentUser, onLogout, isCollapsed = false }) {
    const navigate = useNavigate()
    const { userRole } = useAuth() // Get user role from context
  
    // Get user initials for avatar fallback
    const getUserInitials = () => {
      if (!currentUser?.firstName && !currentUser?.lastName) return "U"
      return `${currentUser?.firstName?.charAt(0) || ""}${currentUser?.lastName?.charAt(0) || ""}`
    }

    // Navigate to profile based on user role
    const handleProfileClick = () => {
      if (userRole === 'TEACHER') {
        navigate("/teacher/profile")
      } else if (userRole === 'STUDENT') {
        navigate("/student/profile")
      }
    }

    // Navigate to settings based on user role (if you have role-specific settings)
    const handleSettingsClick = () => {
      if (userRole === 'TEACHER') {
        navigate("/teacher/settings") 
      } else if (userRole === 'STUDENT') {
        navigate("/student/settings") 
      } else {
        navigate("/settings") // Generic settings
      }
    }
  
    // Collapsed state - only show avatar with tooltip
    if (isCollapsed) {
      return (
        <div className="p-2 flex justify-center border-t">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={currentUser?.profileImage} alt={currentUser?.firstName} />
                        <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuLabel>
                      {currentUser?.firstName} {currentUser?.lastName}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleProfileClick}>
                      <User className="mr-2 h-4 w-4 group-hover:text-white" />
                      <span>Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleSettingsClick}>
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
      )
    }
  
    // Expanded state - show full user info
    return (
      <div className="p-4 border-t">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-full flex items-center justify-start gap-3 h-14 px-3 hover:bg-primary/10 hover:text-primary">
              <Avatar className="h-9 w-9">
                <AvatarImage src={currentUser?.profileImage} alt={currentUser?.firstName} />
                <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials()}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left min-w-0">
                <span className="font-medium">
                  {currentUser?.firstName} {currentUser?.lastName}
                </span>
                <p className="text-xs text-muted-foreground truncate w-full">{currentUser?.email}</p>
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleProfileClick}>
              <User className="mr-2 h-4 w-4 group-hover:text-white" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSettingsClick}>
              <Settings className="mr-2 h-4 w-4 group-hover:text-white" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onLogout} 
              className="text-red-600 hover:text-red-700 hover:bg-red-100 focus:text-red-700 focus:bg-red-50"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    )
}