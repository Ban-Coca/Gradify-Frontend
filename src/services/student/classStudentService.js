import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/student";

// Remove axiosInstance, use axios directly

export const getStudentClasses = async (studentId, header = {}) => {
  try {
    console.log(`Getting classes for studentId: ${studentId}`);
    const response = await axios.get(
      `${API_BASE_URL}/${studentId}/classes`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student classes:", error);
    throw error;
  }
};

// Get course table data for a student in a class
export const getStudentCourseTableData = async (studentId, classId, header = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${studentId}/classes/${classId}/grades`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student course table data:", error);
    throw error;
  }
};