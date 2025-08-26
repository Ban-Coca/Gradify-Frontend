import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const getDriveRoot = async (userId, header) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.MICROSOFT_GRAPH.GET_ROOT_FILES}/drive/root?userId=${userId}`,
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
    const response = await api.get(`${API_ENDPOINTS.MICROSOFT_GRAPH.GET_FOLDER_FILES}/drive/folder/${folderId}/files?userId=${userId}`, {
      headers: header
    });
    return response.data;
  } catch(error){
    throw error
  }
}

export const saveExcelData = async (userId, folderName, fileName, header) => {
  try{
    const response = await api.post(`${API_ENDPOINTS.MICROSOFT_GRAPH.SAVE_EXCEL}/save/${folderName}/${fileName}?userId=${userId}`, {}, {
      headers: header
    })
    return response.data;
  } catch(error){
    console.log("ERROR SAVING EXCEL: ", error);
    throw error;
  }
}