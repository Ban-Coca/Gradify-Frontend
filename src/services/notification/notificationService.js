import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const getUserNotifications = async (userId, header) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS.GET_USER_NOTIFICATIONS}/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnread = async (userId, header) => {
    try {
        const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS.GET_UNREAD}/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnreadCount = async (userId, header) => {
    try{
        const response = await api.get(`${API_ENDPOINTS.NOTIFICATIONS.GET_UNREAD_COUNT}/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const readNotification = async (notificationId, header) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.NOTIFICATIONS.MARK_AS_READ}/${notificationId}/read`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async (userId, header) => {
    try {
        const response = await api.put(`${API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_AS_READ}/${userId}`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}