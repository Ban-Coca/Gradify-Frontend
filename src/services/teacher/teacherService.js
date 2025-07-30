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