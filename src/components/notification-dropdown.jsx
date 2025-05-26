import { useState } from "react";
import { Bell, BellOff, Check, Weight } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/authentication-context";
import { useQueryClient } from "@tanstack/react-query";
import { useNotification } from "@/hooks/use-notifications";

function truncateText(text, maxLength = 80) {
  if (!text) return "";
  return text.length > maxLength ? text.slice(0, maxLength) + "..." : text;
}

export function NotificationDropdown() {
  const { currentUser, getAuthHeader } = useAuth();
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const {
    notifications,
    unread,
    unreadCount,
    markAllAsReadMutation,
    readNotificationMutation,
  } = useNotification({
    currentUser,
    queryClient,
    getAuthHeader,
  });

  const markAsRead = (id) => {
    readNotificationMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications", currentUser?.userId]);
        queryClient.invalidateQueries(["unreadCount", currentUser?.userId]);
        queryClient.invalidateQueries(["unread", currentUser?.userId]);
      },
    });
  };

  const markAllAsRead = () => {
    markAllAsReadMutation.mutate(null, {
      onSuccess: () => {
        queryClient.invalidateQueries(["notifications", currentUser?.userId]);
        queryClient.invalidateQueries(["unreadCount", currentUser?.userId]);
        queryClient.invalidateQueries(["unread", currentUser?.userId]);
      },
    });
  };

  const getTypeStyles = (type) => {
    switch (type) {
      case "info":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20";
      case "success":
        return "bg-green-500/10 text-green-500 border-green-500/20";
      case "warning":
        return "bg-amber-500/10 text-amber-500 border-amber-500/20";
      case "error":
        return "bg-red-500/10 text-red-500 border-red-500/20";
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20";
    }
  };
  const cleanNotificationText = (html) => {
    if (!html) return "";

    try {
      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = html;
      return tempDiv.textContent || tempDiv.innerText || "";
    } catch (error) {
      return html.replace(/<[^>]*>/g, "").trim();
    }
  };
  const formatNotifications = (apiNotifications) => {
    if (!Array.isArray(apiNotifications)) return [];

    return apiNotifications.map((notification) => ({
      id: notification.notificationId,
      title: notification.subject,
      description: cleanNotificationText(notification.message || notification.description),
      time: new Date(notification.date).toLocaleString(),
      type: notification.notificationType || "info",
      read: notification.read,
    }));
  };

  // Format notifications for display
  const formattedNotifications = formatNotifications(
    notifications?.content || []
  );
  const formattedUnread = formatNotifications(unread || []);

  return (
    <Popover>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative z-10 overflow-visible"
              >
                <Bell className="h-5 w-5" />
                {unreadCount?.count > 0 && (
                  <Badge
                    className="absolute -top-2 -right-2 h-5 min-w-[20px] px-1 flex items-center justify-center"
                    variant="destructive"
                  >
                    {unreadCount.count > 99 ? "99+" : unreadCount.count}
                  </Badge>
                )}
                <span className="sr-only">Notifications</span>
              </Button>
            </PopoverTrigger>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <p>Notifications</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <PopoverContent className="w-80 p-0" align="end">
        <div className="flex items-center justify-between border-b p-3">
          <h3 className="font-semibold">Notifications</h3>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 text-xs"
              onClick={markAllAsRead}
              disabled={markAllAsReadMutation.isLoading}
            >
              <Check className="mr-1 h-3 w-3" />
              Mark all as read
            </Button>
          )}
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          {formattedNotifications.length > 0 ? (
            <div className="flex flex-col">
              {formattedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={cn(
                    "flex flex-col p-3 border-b last:border-b-0 transition-colors",
                    notification.read ? "bg-background" : "bg-primary/10 border-l-4 border-primary shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant="outline"
                          className={cn(
                            "h-6 px-2",
                            getTypeStyles(notification.type)
                          )}
                        >
                          {notification.type}
                        </Badge>
                        <h4 className="font-medium text-sm">
                          {notification.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {truncateText(notification.description, 80)}
                      </p>
                      <span className="text-xs text-muted-foreground mt-2 block">
                        {notification.time}
                      </span>
                    </div>

                    {!notification.read && (
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => markAsRead(notification.id)}
                        disabled={readNotificationMutation.isLoading}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center p-6 text-center">
              <BellOff className="h-10 w-10 text-muted-foreground mb-2" />
              <h4 className="font-medium">No notifications</h4>
              <p className="text-sm text-muted-foreground">
                You're all caught up!
              </p>
            </div>
          )}
        </div>
        <div className="border-t p-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-center"
            asChild
          >
            <Link to="/notifications">View all notifications</Link>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
