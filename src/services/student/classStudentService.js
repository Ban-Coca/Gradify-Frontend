import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

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
export const getStudentCourseTableData = async (studentId, classId, header = {}) => {
  try {
    const response = await api.get(
      `${API_ENDPOINTS.STUDENT.CLASS_GRADES}/${studentId}/classes/${classId}/grades`,
      { headers: header }
    );``
    return response.data;
  } catch (error) {
    console.error("Error fetching student course table data:", error);
    throw error;
  }
};