import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import {
  getStudentCount,
  getAtRiskStudents,
  getTopStudents,
  getAvailableAssesments,
  getVisibleAssessments,
  getAssessmentStatus,
  toggleAssessmentVisibility,
  updateAssessmentVisibility,
} from "@/services/teacher/teacherService";
import { useAuth } from "@/contexts/authentication-context";

export function useTeacher(teacherId, classId, classSpreadsheetId) {
  const { getAuthHeader } = useAuth();
  const queryClient = useQueryClient();
  const studentCountQuery = useQuery({
    queryKey: ["studentCount", teacherId],
    queryFn: () => getStudentCount(teacherId, getAuthHeader()),
    enabled: !!teacherId,
  });

  const atRiskStudentsQuery = useQuery({
    queryKey: ["atRiskStudents", teacherId],
    queryFn: () => getAtRiskStudents(teacherId, getAuthHeader()),
    enabled: !!teacherId,
  });

  const topStudentsQuery = useQuery({
    queryKey: ["topStudents", teacherId],
    queryFn: () => getTopStudents(teacherId, getAuthHeader()),
    enabled: !!teacherId,
  });

  const availableAssessments = useQuery({
    queryKey: ["availableAssessments", classId],
    queryFn: () => getAvailableAssesments(classId, getAuthHeader()),
    enabled: !!classId,
  });

  const visibleAssessments = useQuery({
    queryKey: ["visibleAssessments", classId],
    queryFn: () => getVisibleAssessments(classId, getAuthHeader()),
    enabled: !!classId,
  });

  const toggleAssessment = useMutation({
    mutationFn: ({ classSpreadsheetId, assessmentName }) =>
      toggleAssessmentVisibility(classSpreadsheetId, assessmentName, getAuthHeader()),
    onSuccess: () => {
      // Invalidate specific queries instead of ALL queries
      queryClient.invalidateQueries({
        queryKey: ["visibleAssessments", classId],
      });
      queryClient.invalidateQueries({
        queryKey: ["availableAssessments", classId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assessmentStatus", classSpreadsheetId],
      });
    },
  });

  const updateAssessment = useMutation({
    mutationFn: ({ classSpreadsheetId, assessments }) =>
      updateAssessmentVisibility(classSpreadsheetId, assessments, getAuthHeader()),
    onSuccess: () => {
      // Invalidate specific queries instead of ALL queries
      queryClient.invalidateQueries({
        queryKey: ["visibleAssessments", classId],
      });
      queryClient.invalidateQueries({
        queryKey: ["availableAssessments", classId],
      });
      queryClient.invalidateQueries({
        queryKey: ["assessmentStatus", classSpreadsheetId],
      });
    },
  });

  const assessmentStatus = useQuery({
    queryKey: ["assessmentStatus", classSpreadsheetId],
    queryFn: () => getAssessmentStatus(classSpreadsheetId, getAuthHeader()),
    enabled: !!classSpreadsheetId,
  });
  return {
    studentCountQuery,
    atRiskStudentsQuery,
    topStudentsQuery,
    availableAssessments,
    visibleAssessments,
    toggleAssessment,
    updateAssessment,
    assessmentStatus
  };
}
