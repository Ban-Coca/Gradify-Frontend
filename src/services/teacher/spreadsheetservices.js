import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL_TEACHER_SERVICE;
const SPREADSHEET_API_URL = "http://localhost:8080/api/spreadsheet";

export const uploadSpreadsheet = async (data, headers) => {
    const formData = new FormData();
    formData.append("file", data.file);
    formData.append("teacherId", data.teacherId);
    console.log(headers);
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

/**
 * Process a spreadsheet URL (e.g., Google Sheets)
 * @param {Object} data - Object containing url and teacherId
 * @param {Object} headers - Auth headers
 * @returns {Promise<Object>} - Response from API
 */
export const processSpreadsheetUrl = async (data, headers) => {
    try {
        // Build the URL with query parameters
        const url = `${SPREADSHEET_API_URL}/process-url`;
        
        console.log("Sending request to:", url);
        console.log("With data:", data);
        
        // Create URL-encoded form data (matching @RequestParam in Spring)
        const params = new URLSearchParams();
        params.append('url', data.url);
        params.append('teacherId', data.teacherId);
        
        // Try with URLSearchParams which matches how @RequestParam works
        const response = await axios.post(url, params, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                ...headers,
            }
        });
        
        console.log("Success response:", response);
        return response.data;
    } catch (error) {
        console.error("Error processing spreadsheet URL:", error);
        
        // Log request details to help debug
        console.log("Request URL:", `${API_BASE_URL}/process-url`);
        console.log("Request data:", data);
        console.log("Request headers:", headers);
        
        if (error.response) {
            console.error("Response error data:", error.response.data);
            console.error("Response error status:", error.response.status);
            console.error("Response headers:", error.response.headers);
            
            // Check if the response is HTML (which would indicate a server error page)
            const contentType = error.response.headers['content-type'];
            if (contentType && contentType.includes('text/html')) {
                // Try to extract error message from HTML if possible
                let errorMessage = "Server returned HTML instead of JSON. This usually indicates a server-side error.";
                if (typeof error.response.data === 'string') {
                    const titleMatch = error.response.data.match(/<title>(.*?)<\/title>/i);
                    if (titleMatch && titleMatch[1]) {
                        errorMessage += ` Error: ${titleMatch[1]}`;
                    }
                }
                throw new Error(errorMessage);
            }
            
            // Try to extract a meaningful error message
            const errorMsg = typeof error.response.data === 'string' 
                ? error.response.data 
                : JSON.stringify(error.response.data);
                
            throw new Error(`Server error (${error.response.status}): ${errorMsg}`);
        } else if (error.request) {
            // The request was made but no response was received
            console.error("No response received:", error.request);
            throw new Error("No response from server. Please check your network connection and try again.");
        } else {
            // Something happened in setting up the request that triggered an Error
            console.error("Error setting up request:", error.message);
            throw error;
        }
    }
};

export const getSpreadsheetById = async (id, header) => {
    console.log(`getSpreadsheetById called with ID: ${id}`);
    
    if (!id || id === 'undefined') {
        throw new Error("Invalid ID provided");
    }
    
    try {
        const response = await axios.get(`${SPREADSHEET_API_URL}/get/${id}`, {
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

export const updateClassSpreadsheetData = async (classId, data, headers) => {
    try {
        const formData = new FormData();
        formData.append("file", data.file);
        formData.append("teacherId", data.teacherId);

        const response = await axios.put(
            `${SPREADSHEET_API_URL}/update/${classId}`,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data",
                    ...headers,
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error("Error updating class spreadsheet data:", error);
        throw error;
    }
}

// New function to check if a spreadsheet exists
export const checkIfSpreadsheetExists = async (fileName, teacherId, headers) => {
    try {
        const response = await axios.get(`${SPREADSHEET_API_URL}/check-exists`, {
            params: { fileName, teacherId },
            headers: {
                ...headers,
            },
        });
        return response.data; // Should return true or false
    } catch (error) {
        console.error("Error checking if spreadsheet exists:", error);
        // It's safer to assume it might exist or let user proceed with caution
        // depending on how critical this check is for the workflow.
        // For now, re-throw to allow the caller to handle.
        throw error;
    }
};


/**
 * MODIFIED FUNCTION
 * Updates grades for one or more records.
 * The fetch URL is now corrected to point to the spreadsheet controller.
 * @param {Array} updatedRecords - The records to update.
 * @param {Object} headers - The authorization headers.
 * @returns {Promise<string>} - A success message.
 */
export const updateGrades = async (updatedRecords, headers) => {
    // This URL is now corrected to point to the correct backend controller
    const response = await fetch(`${SPREADSHEET_API_URL}/update-grades`, {
        method: 'PUT',
        headers: {
            ...headers,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedRecords),
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Failed to update grades');
    }
    return response.text();
};