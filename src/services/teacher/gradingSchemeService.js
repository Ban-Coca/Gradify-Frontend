import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/api/grading';

export const savingGradingScheme = async (gradingScheme, classId, teacherId, headers) => {
    try {
        console.log("Saving grading scheme:", gradingScheme);
        console.log("class" , classId);
        console.log("teacher" , teacherId);
        
        // Make sure we're sending the data in the expected format
        const dataToSend = {
            schemes: Array.isArray(gradingScheme) ? gradingScheme : gradingScheme.schemes || []
        };
        
        const response = await axios.post(
            `${API_BASE_URL}/savescheme?classId=${classId}&teacherId=${teacherId}`, 
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
