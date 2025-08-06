import { useQuery, useMutation } from "@tanstack/react-query";
import {
  getUserNotifications,
  getUnread,
  getUnreadCount,
  markAllAsRead,
  readNotification,
} from "@/services/notification/notificationService";

export function useNotification({ currentUser, queryClient, getAuthHeader }) {
  const getUserNotificationsQuery = useQuery({
    queryKey: ["notifications", currentUser?.userId],
    queryFn: () => getUserNotifications(currentUser.userId, getAuthHeader()),
    enabled: !!currentUser?.userId,
    refetchOnWindowFocus: false, // Disable to reduce requests
    refetchInterval: 60000, // Increase to 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getUnreadCountQuery = useQuery({
    queryKey: ["unreadCount", currentUser?.userId],
    queryFn: () => getUnreadCount(currentUser.userId, getAuthHeader()),
    enabled: !!currentUser?.userId,
    refetchOnWindowFocus: false, // Disable to reduce requests
    refetchInterval: 60000, // Increase to 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const getUnreadQuery = useQuery({
    queryKey: ["unread", currentUser?.userId],
    queryFn: () => getUnread(currentUser.userId, getAuthHeader()),
    enabled: !!currentUser?.userId,
    refetchOnWindowFocus: false, // Disable to reduce requests
    refetchInterval: 60000, // Increase to 1 minute
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });


  const markAllAsReadMutation = useMutation({
    mutationFn: () => markAllAsRead(currentUser.userId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(["unreadCount", currentUser?.userId]);
      queryClient.invalidateQueries(["unread", currentUser?.userId]);
      queryClient.invalidateQueries(["notifications", currentUser?.userId]);
    },
  });

  const readNotificationMutation = useMutation({
    mutationFn: (notificationId) =>
      readNotification(notificationId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries(["unreadCount", currentUser?.userId]);
      queryClient.invalidateQueries(["unread", currentUser?.userId]);
      queryClient.invalidateQueries(["notifications", currentUser?.userId]);
    },
  });

  return {
    notifications: getUserNotificationsQuery.data,
    isLoadingNotifications: getUserNotificationsQuery.isLoading,
    notificationsError: getUserNotificationsQuery.error,
    unreadCount: getUnreadCountQuery.data,
    isLoadingUnreadCount: getUnreadCountQuery.isLoading,
    unreadCountError: getUnreadCountQuery.error,
    unread: getUnreadQuery.data,
    isLoadingUnread: getUnreadQuery.isLoading,
    unreadError: getUnreadQuery.error,
    markAllAsReadMutation,
    readNotificationMutation,
  };
}
