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
