import { api } from "@/config/api";
import { API_ENDPOINTS } from "@/config/constants";

export const getStudentClasses = async (studentId, header = {}) => {
  try {
    console.log(`Getting classes for studentId: ${studentId}`);
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CLASSES}/${studentId}/classes`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching student classes:", error);
    throw error;
  }
};

// Get course table data for a student in a class
export const getStudentCourseTableData = async (
  studentId,
  classId,
  header = {}
) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CLASS_GRADES}/${studentId}/classes/${classId}/grades`,
      { headers: header }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching student course table data:", error);
    throw error;
  }
};

// Get grading scheme for a class
export const getSchemesByClass = async (classId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.GRADING_SCHEME}/${classId}/grading-scheme`,
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
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CLASS_TEACHER}/${classId}/teacher`,
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
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.REPORTS}/${studentId}/reports`,
      { headers: header }
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching student reports:", error);
    throw error;
  }
};

// Get calculated grade for a student in a class
export const getCalculatedGrade = async (studentId, classId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CALCULATED_GRADE}/${studentId}/classes/${classId}/calculated-grade`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching calculated grade:", error);
    throw error;
  }
};

// Get calculated grade for a student in a class
export const getCalculatedGPA = async (studentId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.AVERAGE_PERCENTAGE}/${studentId}/average-percentage`,
      { headers: header }
    );
    console.log("GPA response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching calculated GPA:", error);
    throw error;
  }
};

// Get calculated grade for a student in a class
export const getClassGradesByStudent = async (studentId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.ALL_GRADES}/${studentId}/all-grades`,
      { headers: header }
    );
    console.log("Class grades response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching calculated GPA:", error);
    throw error;
  }
};

export const getClassAveragesByStudent = async (studentId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CLASS_AVERAGES}/${studentId}/class-averages`,
      { headers: header }
    );
    console.log("Class averages response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching class averages:", error);
    throw error;
  }
};

export const getVisibleStudentGrades = async (
  studentNumber,
  classId,
  header = {}
) => {
  console.log(
    "Fetching visible student grades for:",
    studentNumber,
    "in class:",
    classId
  );
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.BY_STUDENT_NUMBER_CLASS}/${studentNumber}/class/${classId}`,
      { headers: header }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching visible student grades:", error);
    throw error;
  }
};
