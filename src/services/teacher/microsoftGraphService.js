import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/graph";

export const getDriveRoot = async (userId, header) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/drive/root?userId=${userId}`,
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
    const response = await axios.get(`${API_BASE_URL}/drive/folder/${folderId}/files?userId=${userId}`, {
      headers: header
    });
    return response.data;
  } catch(error){
    throw error
  }
}

export const saveExcelData = async (userId, folderName, fileName, header) => {
  try{
    const response = await axios.post(`${API_BASE_URL}/save/${folderName}/${fileName}?userId=${userId}`, {}, {
      headers: header
    })
    return response.data;
  } catch(error){
    console.log("ERROR SAVING EXCEL: ", error);
    throw error;
  }
}