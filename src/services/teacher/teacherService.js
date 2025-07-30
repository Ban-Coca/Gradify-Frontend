import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/teacher";

export const getStudentCount = async (teacherId, header) => {
    try {
        const response = await axios.get(
        `${API_BASE_URL}/${teacherId}/students/count`,
        { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching student count:", error);
        throw error;
    }
};

export const getAtRiskStudents = async (teacherId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${teacherId}/risk/students/count`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching at-risk students count:", error);
        throw error;
    }
};

export const getTopStudents = async (teacherId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${teacherId}/top/students/count`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching top students count:", error);
        throw error;
    }
};

export const getTeacherGradeDistribution = async (teacherId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${teacherId}/grade/distribution`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching teacher grade distribution:", error);
        throw error;
    }
}
export const getClassPerformance = async (teacherId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${teacherId}/class/performance`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching class performance:", error);
        throw error;
    }
};

export const getClassAnalytics = async (classId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${classId}/ai/analytics`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching class AI analytics:", error);
        throw error;
    }
};

export const getAvailableAssesments = async (classId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/class-spreadsheet/${classId}/assessments/available`,
            {headers: header}
        )
        return response.data
    } catch(error){
        throw error;
    }
}

export const getVisibleAssessments = async (classId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/class-spreadsheet/${classId}/assessments/visible`,
            {headers: header}
        )
        return response.data
    } catch(error){
        throw error;
    }
}

export const toggleAssessmentVisibility = async (classSpreadSheetId, assessmentName, header) => {
    try {
        console.log("classspreadsheetID and assessmentName", classSpreadSheetId, assessmentName)
        const response = await axios.post(
            `${API_BASE_URL}/${classSpreadSheetId}/assessments/${assessmentName}/toggle`,
            {}, // Empty body for POST request
            {headers: header} // Headers should be in config object
        )
        return response.data
    } catch(error) {
        throw error;
    }
}

export const updateAssessmentVisibility = async (classSpreadsheetId, visibleAssessments, header) => {
    try {
        const response = await axios.put(
            `${API_BASE_URL}/class-spreadsheet/${classSpreadsheetId}/assessments/visible`,
            visibleAssessments,
            {headers: header}
        )
        return response.data
    } catch(error){
        throw error;
    }
}

export const getAssessmentStatus = async (classSpreadSheetId, header) => {
    try {
        const response = await axios.get(
            `${API_BASE_URL}/${classSpreadSheetId}/assessments/status`,
            {headers: header}
        )
        return response.data
    } catch(error){
        throw error;
    }
}