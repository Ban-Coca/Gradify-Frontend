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
      if (classData.room) params.append('room', classData.room);
      if (classData.schedule) params.append('schedule', classData.schedule);
      
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
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteClass/${id}`,
            {
                headers: header
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}

export const getClassById = async (id, header) => {
    console.log("Header in getClassById", header)
    console.log("ID in getClassById", id)
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
        const response = await axios.put(`${API_BASE_URL}/putclasses/${id}`, data, {
            headers: {
                "Content-Type": "application/json",
                ...header,
            },
        });
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
        console.log(response.data)
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
        console.log(response.data)
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
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching student count:", error);
        throw error;
    }
}