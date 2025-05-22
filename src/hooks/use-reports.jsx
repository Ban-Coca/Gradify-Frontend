import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authentication-context";
import {
  createReport,
  getReportById,
  getReportsByStudentId,
  getReportsByTeacherId,
  getReportsByClassId,
  updateReport,
  deleteReport,
  getAIGeneratedReport,
} from "@/services/reports/reportsService";

export function useReports(
  currentUser,
  classId,
  studentId,
  teacherId,
  reportId
) {
  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();
  // Fetch a single report by ID
  const reportQuery = useQuery({
    queryKey: ["report", reportId],
    queryFn: () => getReportById(reportId, getAuthHeader()),
    enabled: !!reportId,
  });

  // Fetch reports by student ID
  const reportsByStudentQuery = useQuery({
    queryKey: ["reports", "student", studentId],
    queryFn: () => getReportsByStudentId(studentId, getAuthHeader()),
    enabled: !!studentId,
  });

  // Fetch reports by teacher ID
  const reportsByTeacherQuery = useQuery({
    queryKey: ["reports", "teacher", teacherId],
    queryFn: () => getReportsByTeacherId(teacherId, getAuthHeader()),
    enabled: !!teacherId,
  });

  // Fetch reports by class ID
  const reportsByClassQuery = useQuery({
    queryKey: ["reports", "class", classId],
    queryFn: () => getReportsByClassId(classId, getAuthHeader()),
    enabled: !!classId,
  });

  // Create report mutation
  const createReportMutation = useMutation({
    mutationFn: (reportDTO) => createReport(reportDTO, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const updateReportMutation = useMutation({
    mutationFn: ({ reportId, reportDTO }) =>
      updateReport(reportId, reportDTO, getAuthHeader()),
    onSuccess: (_, { reportId }) => {
      queryClient.invalidateQueries({ queryKey: ["report", reportId] });
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });

  const deleteReportMutation = useMutation({
    mutationFn: (reportId) => deleteReport(reportId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reports"] });
    },
  });
  // Fetch AI-generated report
  const aiGeneratedReportQuery = useQuery({
    queryKey: ["reports", "generate-suggestion", studentId, classId],
    queryFn: () => getAIGeneratedReport(studentId, classId, getAuthHeader()),
    enabled: !!studentId && !!classId,
  });

  return {
    reportQuery,
    reportsByStudentQuery,
    reportsByTeacherQuery,
    reportsByClassQuery,
    createReportMutation,
    updateReportMutation,
    deleteReportMutation,
    aiGeneratedReportQuery,
  };
}
