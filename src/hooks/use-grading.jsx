import {useQuery, useMutation} from '@tanstack/react-query';
import { savingGradingScheme } from '@/services/teacher/gradingSchemeService';
import { useAuth } from '@/contexts/authentication-context';
export function useGrading({
    currentUser,
    classId
}) {
    const { getAuthHeader } = useAuth();
    const saveScheme = useMutation({
        mutationFn: (weightData) => {
            return savingGradingScheme(weightData, classId, currentUser.userId, getAuthHeader());
        },
    
        onSuccess: (data) => {
            console.log('Grading scheme saved successfully:', data);
        },
        onError: (error) => {
            console.error('Error saving grading scheme:', error);
        },
    })
    
    return {
        saveScheme,
    };
}