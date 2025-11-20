import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const getStudentCount = async (teacherId, header) => {
    try {
        const response = await api.get(
        `${API_ENDPOINTS.TEACHER.STUDENTS_COUNT}/${teacherId}/students/count`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.RISK_STUDENTS_COUNT}/${teacherId}/risk/students/count`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.TOP_STUDENTS_COUNT}/${teacherId}/top/students/count`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.GRADE_DISTRIBUTION}/${teacherId}/grade/distribution`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.CLASS_PERFORMANCE}/${teacherId}/class/performance`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.AI_ANALYTICS}/${classId}/ai/analytics`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.AVAILABLE_ASSESSMENTS}/${classId}/assessments/available`,
            {headers: header}
        )
        return response.data
    } catch(error){
        throw error;
    }
}

export const getVisibleAssessments = async (classId, header) => {
    try {
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.VISIBLE_ASSESSMENTS}/${classId}/assessments/visible`,
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
        const response = await api.post(
            `${API_ENDPOINTS.TEACHER.TOGGLE_ASSESSMENT}/${classSpreadSheetId}/assessments/${assessmentName}/toggle`,
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
        const response = await api.put(
            `${API_ENDPOINTS.TEACHER.UPDATE_VISIBLE_ASSESSMENTS}/${classSpreadsheetId}/assessments/visible`,
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
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.ASSESSMENT_STATUS}/${classSpreadSheetId}/assessments/status`,
            {headers: header}
        )
        console.log("Respopnse: ", response.data)
        return response.data
    } catch(error){
        throw error;
    }
}

export const getStudentDetail = async (classId, studentId, header) => {
    try{
        const response = await api.get(
            `${API_ENDPOINTS.TEACHER.STUDENT_DETAIL}/class/${classId}/student/${studentId}`, {
                headers: header
            }
        )

        return response.data
    } catch(error){
        throw error;
    }
}