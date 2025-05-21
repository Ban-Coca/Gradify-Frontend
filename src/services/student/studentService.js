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

// Get grading scheme for a class
export const getSchemesByClass = async (classId, header = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/classes/${classId}/gradingscheme`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student course table data:", error);
    throw error;
  }
};

// Get teacher by classId
export const getTeacherByClass = async (classId, header = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/classes/${classId}/teacher`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student course table data:", error);
    throw error;
  }
};

//Get student reports by studentId
export const getReportsByStudentId = async (studentId, header = {}) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/api/student/${studentId}/reports`,
      { headers: header }
    );
    console.log(response.data)
    return response.data;
  } catch (error) {
    console.error("Error fetching student reports:", error);
    throw error;
  }
};

// Get calculated grade for a student in a class
export const getCalculatedGrade = async (studentId, classId, header = {}) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/${studentId}/classes/${classId}/calculated-grade`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching calculated grade:", error);
    throw error;
  }
};