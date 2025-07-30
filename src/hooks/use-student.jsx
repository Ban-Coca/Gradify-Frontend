import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authentication-context";
import { getVisibleStudentGrades } from "@/services/student/studentService";

export function useStudent(
    currentUser,
    classId,
) {
    const queryClient = useQueryClient();
    const { getAuthHeader } = useAuth();
    
    // Fetch visible student grades
    const visibleStudentGradesQuery = useQuery({
        queryKey: ["visibleStudentGrades", currentUser?.studentNumber, classId],
        queryFn: () => getVisibleStudentGrades(currentUser?.studentNumber, classId, getAuthHeader()),
        enabled: !!currentUser?.studentNumber && !!classId,
    });
    return {
        visibleStudentGrades: visibleStudentGradesQuery.data,
        isLoading: visibleStudentGradesQuery.isLoading,
        error: visibleStudentGradesQuery.error,
    };
}