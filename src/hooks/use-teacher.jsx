import { useQuery } from "@tanstack/react-query"
import { getStudentCount, getAtRiskStudents, getTopStudents } from "@/services/teacher/teacherService"
import { useAuth } from "@/contexts/authentication-context"

export function useTeacher(teacherId) { 
    const { getAuthHeader } = useAuth()
    const studentCountQuery = useQuery({
        queryKey: ['studentCount', teacherId],
        queryFn: () => getStudentCount(teacherId, getAuthHeader()),
        enabled: !!teacherId,
    })

    const atRiskStudentsQuery = useQuery({
        queryKey: ['atRiskStudents', teacherId],
        queryFn: () => getAtRiskStudents(teacherId, getAuthHeader()),
        enabled: !!teacherId,
    })

    const topStudentsQuery = useQuery({
        queryKey: ['topStudents', teacherId],
        queryFn: () => getTopStudents(teacherId, getAuthHeader()),
        enabled: !!teacherId,
    })

    return {
        studentCountQuery,
        atRiskStudentsQuery,
        topStudentsQuery
    }
}