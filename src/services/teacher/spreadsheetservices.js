import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_TEACHER_SERVICE

export const uploadSpreadsheet = async (data, headers) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("teacherId", data.teacherId);
    console.log(headers)
    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
                ...headers,
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading spreadsheet:", error);
        throw error;
    }
}

export const getSpreadsheetById = async (id, header) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        console.log(id)
        const response = await axios.get(`${API_BASE_URL}/get/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...header,
            },
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching spreadsheet by ID:", error);
        throw error;
    }
}