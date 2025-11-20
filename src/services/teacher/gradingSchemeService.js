import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const savingGradingScheme = async (gradingScheme, classId, teacherId, headers) => {
    try {
        
        // Make sure we're sending the data in the expected format
        const dataToSend = {
            schemes: Array.isArray(gradingScheme) ? gradingScheme : gradingScheme.schemes || []
        };
        console.log("Data: ", dataToSend)
        const response = await api.post(
            `${API_ENDPOINTS.GRADING.SAVE_SCHEME}?classId=${classId}&teacherId=${teacherId}`, 
            dataToSend,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error saving grading scheme:', error);
        throw error;
    }
}

export const getGradingScheme = async (classId, headers) => {
    try {
        const response = await api.get(
            `${API_ENDPOINTS.GRADING.GET_SCHEMES}?classId=${classId}`, 
            {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching grading scheme:', error);
        throw error;
    }
}

export const updateGradingScheme = async (gradingScheme, classId, teacherId, headers) => {
    try {
        const dataToSend = {
            schemes: Array.isArray(gradingScheme) ? gradingScheme : gradingScheme.schemes || []
        };

        const response = await api.put(
            `${API_ENDPOINTS.GRADING.UPDATE_SCHEME}/${classId}/teacher/${teacherId}`,
            dataToSend,
            {
                headers: {
                    ...headers,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data;
    } catch (error) {
        console.error('Error updating grading scheme:', error);
        throw error;
    }
}