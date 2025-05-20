import { useQuery } from "@tanstack/react-query"
import { getClassByTeacherId } from "@/services/teacher/classServices"
import { useAuth } from "@/contexts/authentication-context"
export function useClass(
    teacherId
) { 
    const { getAuthHeader } = useAuth()
    const classQuery = useQuery({
        queryKey: ['classByTeacherId', teacherId],
        queryFn: () => getClassByTeacherId(teacherId, getAuthHeader()),
        enabled: !!teacherId,
    })
    return {
        classQuery
    }
}