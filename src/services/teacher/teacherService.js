import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/teacher";

export const getStudentCount = async (teacherId, header) => {
    try {
        const response = await axios.get(
        `${API_BASE_URL}/getstudentcount/${teacherId}`,
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
            `${API_BASE_URL}/getatriskstudents/${teacherId}`,
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
            `${API_BASE_URL}/gettopstudents/${teacherId}`,
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
            `${API_BASE_URL}/teacher-grade-distribution/${teacherId}`,
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
            `${API_BASE_URL}/class-performance/${teacherId}`,
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
            `${API_BASE_URL}/class-ai-analytics/${classId}`,
            { headers: header }
        );
        return response.data;
    } catch (error) {
        console.error("Error fetching class AI analytics:", error);
        throw error;
    }
};