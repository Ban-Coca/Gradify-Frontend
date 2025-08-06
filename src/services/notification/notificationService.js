import axios from "axios";
const API_URL = "http://localhost:8080/api/notification";
const axiosInstance = axios.create({
    timeout: 10000, // 10 seconds timeout
    headers: {
        'Connection': 'close'
    }
});
export const getUserNotifications = async (userId, header) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/get-notifications/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnread = async (userId, header) => {
    try {
        const response = await axiosInstance.get(`${API_URL}/unread/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getUnreadCount = async (userId, header) => {
    try{
        const response = await axiosInstance.get(`${API_URL}/unread/count/${userId}`, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const readNotification = async (notificationId, header) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/${notificationId}/read`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const markAllAsRead = async (userId, header) => {
    try {
        const response = await axiosInstance.put(`${API_URL}/read-all/${userId}`, {}, { headers: header });
        return response.data;
    } catch (error) {
        throw error;
    }
}