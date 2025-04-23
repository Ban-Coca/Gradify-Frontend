import axios from "axios";

//const API_BASE_URL = process.env.VITE_API_BASE_URL_TEACHER_SERVICE
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

export const getAllClasses = async () => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getallclasses`);
        return response.data;
    } catch (error) {
        console.error("Error fetching all classes:", error);
        throw error;
    }
}

export const deleteClass = async (id) => {
    try {
        const response = await axios.delete(`${API_BASE_URL}/deleteClass/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error deleting class:", error);
        throw error;
    }
}

export const getClassById = async (id) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/getclassbyid/${id}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching class by ID:", error);
        throw error;
    }
}

export const updateClassById = async (id, data) => {
    try {
        const response = await axios.put(`${API_BASE_URL}/putclasses/${id}`, data, {
            headers: {
                "Content-Type": "application/json", // Send data as JSON
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error updating class:", error);
        throw error;
    }
};