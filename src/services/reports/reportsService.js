import { api } from "@/config/api";
import { API_ENDPOINTS } from '@/config/constants';

export const createReport = async (reportDTO, authHeader) => {
  console.log(reportDTO);
  const response = await api.post(API_ENDPOINTS.REPORTS, reportDTO, {
    headers: authHeader,
  });
  console.log(response.data);
  return response.data;
};

export const getReportById = async (reportId, authHeader) => {
  const response = await api.get(`${API_ENDPOINTS.REPORTS.GET_BY_ID}/${reportId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByStudentId = async (studentId, authHeader) => {
  const response = await api.get(`${API_ENDPOINTS.REPORTS.GET_BY_STUDENT}/${studentId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByTeacherId = async (teacherId, authHeader) => {
  const response = await api.get(`${API_ENDPOINTS.REPORTS.GET_BY_TEACHER}/${teacherId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByClassId = async (classId, authHeader) => {
  const response = await api.get(`${API_ENDPOINTS.REPORTS.GET_BY_CLASS}/${classId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const updateReport = async (reportId, reportDTO, authHeader) => {
  const response = await api.put(`${API_ENDPOINTS.REPORTS.UPDATE}/${reportId}`, reportDTO, {
    headers: authHeader,
  });
  return response.data;
};

export const deleteReport = async (reportId, authHeader) => {
  await api.delete(`${API_ENDPOINTS.REPORTS.DELETE}/${reportId}`, { headers: authHeader });
};

export const getAIGeneratedReport = async (studentId, classId, authHeader) => {
  const response = await api.get(
    `${API_ENDPOINTS.REPORTS.GENERATE_SUGGESTION}/${studentId}/class/${classId}`,
    { headers: authHeader }
  );
  return response.data;
};
