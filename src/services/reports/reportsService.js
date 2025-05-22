import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/reports";

export const createReport = async (reportDTO, authHeader) => {
  console.log(reportDTO);
  const response = await axios.post(API_BASE_URL, reportDTO, {
    headers: authHeader,
  });
  console.log(response.data);
  return response.data;
};

export const getReportById = async (reportId, authHeader) => {
  const response = await axios.get(`${API_BASE_URL}/${reportId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByStudentId = async (studentId, authHeader) => {
  const response = await axios.get(`${API_BASE_URL}/student/${studentId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByTeacherId = async (teacherId, authHeader) => {
  const response = await axios.get(`${API_BASE_URL}/teacher/${teacherId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const getReportsByClassId = async (classId, authHeader) => {
  const response = await axios.get(`${API_BASE_URL}/class/${classId}`, {
    headers: authHeader,
  });
  return response.data;
};

export const updateReport = async (reportId, reportDTO, authHeader) => {
  const response = await axios.put(`${API_BASE_URL}/${reportId}`, reportDTO, {
    headers: authHeader,
  });
  return response.data;
};

export const deleteReport = async (reportId, authHeader) => {
  await axios.delete(`${API_BASE_URL}/${reportId}`, { headers: authHeader });
};

export const getAIGeneratedReport = async (studentId, classId, authHeader) => {
  const response = await axios.get(
    `${API_BASE_URL}/generate-suggestion/student/${studentId}/class/${classId}`,
    { headers: authHeader }
  );
  return response.data;
};
