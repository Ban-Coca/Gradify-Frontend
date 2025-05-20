import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/class'

// Modified to handle the teacher ID association
export const createClass = async (classData) => {
    try {
      // Get authentication headers - either from parameter or from your auth context
      const authHeader = classData.authHeader || {};
      
      // Create FormData to send as URL parameters as expected by backend
      const params = new URLSearchParams();
      params.append('className', classData.className);
      params.append('semester', classData.semester);
      params.append('schoolYear', classData.schoolYear);
      params.append('section', classData.section);
      params.append('classCode', classData.classCode);
      
      // Add optional parameters if present
      if (classData.room != null) params.append('room', classData.room);
      if (classData.schedule != null) params.append('schedule', classData.schedule);
      
      // Important: Backend expects 'teacher.userId' but you're passing 'teacherId'
      params.append('teacher.userId', classData.teacherId);
      
      // Make the API call with the correct parameters and auth headers
      const response = await axios.post(
        `${API_BASE_URL}/createclass`, 
        params,
        { 
          headers: {
            ...authHeader,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      return response.data;
    } catch (error) {
      console.error('Error creating class:', error);
      throw error;
    }
  };

export const getAllClasses = async (header) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getallclasses`, 
            {
                headers: header
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching all classes:", error);
        throw error;
    }
}

export const deleteClass = async (id, header) => {
    console.log("Header in deleteClass", header)
    console.log("ID in deleteClass", id)
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteclass/${id}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}

export const getClassById = async (id, header) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getclassbyid/${id}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching class by ID:", error);
        throw error;
    }
}

export const updateClassById = async (id, data, header) => {
    try {
        const payload = {
            className: data.className,
            classCode: data.classCode,
            semester: data.semester,
            schoolYear: data.schoolYear,
            section: data.section,
            schedule: data.schedule,
            room: data.room,
        };
        console.log("Header in updateClassById", header)
        const response = await axios.put(
            `${API_BASE_URL}/putclasses/${id}`,
            payload,
            {
                headers: {
                    ...header,
                    'Content-Type': 'application/json'
                }
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating class:", error);
        throw error;
    }
};

export const getSpreadsheetByClassId = async (classId, header) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getspreadsheetbyclassid/${classId}`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching spreadsheet by class ID:", error);
        throw error;
    }
}

export const getClassByTeacherId = async (teacherId, header) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getclassbyteacherid/${teacherId}`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching class by teacher ID:", error);
        throw error;
    }
}

export const getClassRoster = async (classId, header) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${classId}/roster`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching class roster:", error);
        throw error;
    }
}

export const getClassAverage = async (classId, header) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${classId}/avgclassgrade`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching class average:", error);
        throw error;
    }
}

export const getStudentCount = async (classId, header) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${classId}/studentcount`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching student count:", error);
        throw error;
    }
}

export const getStudentByClass = async (classId, header) => {
    try{
        const response = await axios.get(`${API_BASE_URL}/${classId}/students`, {
            headers: header
        });
        return response.data;
    } catch (error) {
        console.error("Error fetching students by class:", error);
        throw error;
    }
}