import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/class'

export const createClass = async (data) => {
    const formData = new FormData();
    formData.append("className", data.className);   
    formData.append("semester", data.semester);
    formData.append("schoolYear", data.schoolYear);
    formData.append("section", data.section);
    formData.append("room", data.room);
    formData.append("classCode", data.classCode);
    formData.append("schedule", data.schedule);

    try {
        const response = await axios.post(`${API_BASE_URL}/createclass`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error creating class:", error);
        throw error;
    }
}

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