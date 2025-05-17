import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_TEACHER_SERVICE;

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
    console.log(`getSpreadsheetById called with ID: ${id}`);
    
    if (!id || id === 'undefined') {
        throw new Error("Invalid ID provided");
    }
    
    try {
        // Note: We're not using formData for a GET request
        console.log(`Making GET request to: ${API_BASE_URL}/get/${id}`);
        console.log("Headers:", header);
        
        const response = await axios.get(`${API_BASE_URL}/get/${id}`, {
            headers: {
                "Content-Type": "application/json",
                ...header,
            },
        });
        
        console.log("API response:", response);
        
        // Check if the response has data
        if (!response.data) {
            console.error("No data in response");
            throw new Error("Server returned empty response");
        }
        
        return response.data;
    } catch (error) {
        console.error("Error fetching spreadsheet by ID:", error);
        if (error.response) {
            // The request was made and the server responded with a status code
            // that falls out of the range of 2xx
            console.error("Response error data:", error.response.data);
            console.error("Response error status:", error.response.status);
            console.error("Response error headers:", error.response.headers);
            throw new Error(`Server error: ${error.response.status} - ${JSON.stringify(error.response.data)}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            throw new Error("No response from server");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
            throw error;
        }
    }
};