import axios from "axios";

//const API_BASE_URL = process.env.VITE_API_BASE_URL_TEACHER_SERVICE
const API_BASE_URL = 'http://localhost:5173/api/spreadsheet'

export const uploadSpreadsheet = async (data) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("teacherId", data.teacherId);

    try {
        const response = await axios.post(`${API_BASE_URL}/upload`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response.data;
    } catch (error) {
        console.error("Error uploading spreadsheet:", error);
        throw error;
    }
}

export const getSpreadsheetById = async (id) => {
    try {
        const formData = new FormData();
        formData.append("id", id);
        console.log(id)
        const response = await axios.get(`${API_BASE_URL}/get`, {
            params: {
                id: id
            }
        });
        console.log(response.data)
        return response.data;
    } catch (error) {
        console.error("Error fetching spreadsheet by ID:", error);
        throw error;
    }
}