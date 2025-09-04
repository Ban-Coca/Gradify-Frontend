import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const getDriveRoot = async (userId, header) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.GET_ROOT_FILES}?userId=${userId}`,
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getFolderFiles = async (userId, folderId, header) => {
  try{
    const response = await api.get(`${API_ENDPOINTS.MICROSOFT_GRAPH.GET_FOLDER_FILES}/${folderId}/files?userId=${userId}`, {
      headers: header
    });
    return response.data;
  } catch(error){
    throw error
  }
}

export const saveExcelData = async (userId, folderName, fileName, folderId, itemId, header) => {
  try{
    const response = await api.post(`${API_ENDPOINTS.MICROSOFT_GRAPH.SAVE_EXCEL}/${folderName}/${fileName}?userId=${userId}&folderId=${folderId}&itemId=${itemId}`, {}, {
      headers: header
    })
    return response.data;
  } catch(error){
    console.log("ERROR SAVING EXCEL: ", error);
    throw error;
  }
}

// Subscription Management APIs
export const createNotificationSubscription = async (userId, header) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.CREATE_SUBSCRIPTION}/${userId}`,
      {},
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getSubscriptionStatus = async (userId, header) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.SUBSCRIPTION_STATUS}?userId=${userId}`,
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const renewSubscription = async (userId, header) => {
  try {
    const response = await api.post(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.RENEW_SUBSCRIPTION}?userId=${userId}`,
      {},
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const cancelSubscription = async (userId, header) => {
  try {
    const response = await api.delete(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.UNSUBSCRIBE}?userId=${userId}`,
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getTrackedFiles = async (userId, header) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.TRACKED_FILES}?userId=${userId}`,
      {
        headers: header,
      }
    );
    return response.data;
  } catch (error) {
    throw error;
  }
};

