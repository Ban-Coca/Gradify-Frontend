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
  getStudentDetail,
} from "@/services/teacher/teacherService";
import { useAuth } from "@/contexts/authentication-context";

export function useTeacher(teacherId, classId, classSpreadsheetId) {
  const { getAuthHeader } = useAuth();
  const queryClient = useQueryClient();

  console.log('useTeacher called with:', { teacherId, classId, classSpreadsheetId });

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
        queryKey: ["assessmentStatus", classId],
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
        queryKey: ["assessmentStatus", classId],
      });
    },
  });

  const assessmentStatus = useQuery({
    queryKey: ["assessmentStatus", classId],
    queryFn: async () => {
      console.log('Fetching assessmentStatus for:', classId);
      const result = await getAssessmentStatus(classId, getAuthHeader());
      console.log('assessmentStatus RAW result:', result);
      console.log('assessmentStatus result type:', typeof result);
      console.log('assessmentStatus result keys:', Object.keys(result || {}));
      
      // Check if the result structure is correct
      if (result && typeof result === 'object') {
        Object.entries(result).forEach(([key, value]) => {
          console.log(`Assessment "${key}": ${value} (type: ${typeof value})`);
        });
      }
      
      return result;
    },
    enabled: !!classId,
    staleTime: 0,
    refetchOnMount: true,
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

// Custom hook for student details
export function useStudentDetail(classId, studentId) {
  const { getAuthHeader } = useAuth();

  const studentDetailQuery = useQuery({
    queryKey: ["studentDetail", classId, studentId],
    queryFn: () => getStudentDetail(classId, studentId, getAuthHeader()),
    enabled: !!classId && !!studentId,
  });

  return {
    studentDetail: studentDetailQuery.data,
    isLoading: studentDetailQuery.isLoading,
    error: studentDetailQuery.error,
    refetch: studentDetailQuery.refetch,
  };
}
