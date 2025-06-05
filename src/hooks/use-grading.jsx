import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  savingGradingScheme,
  getGradingScheme as fetchGradingScheme,
  updateGradingScheme as updateGradingSchemeService,
} from "@/services/teacher/gradingSchemeService";
import { useAuth } from "@/contexts/authentication-context";

export function useGrading({ currentUser, classId }) {
  const queryClient = useQueryClient();
  const { getAuthHeader } = useAuth();
  const saveScheme = useMutation({
    mutationFn: (weightData) => {
      return savingGradingScheme(
        weightData,
        classId,
        currentUser.userId,
        getAuthHeader()
      );
    },

    onSuccess: (data) => {
      queryClient.invalidateQueries(["classRoster", classId]);
      console.log("Grading scheme saved successfully:", data);
    },
    onError: (error) => {
      console.error("Error saving grading scheme:", error);
    },
  });

  const getGradingScheme = useQuery({
    queryKey: ["gradingScheme", classId],
    queryFn: () => {
      return fetchGradingScheme(classId, getAuthHeader());
    },
    enabled: !!classId,
    select: (data) => { // This function processes the data from the API
      if (!data) { // If API returns null (because no scheme was found)
        return []; // Return an empty array
      }
      if (typeof data.gradingScheme === "string") {
        try {
          return JSON.parse(data.gradingScheme);
        } catch {
          return []; // Return empty array on parse error
        }
      }
      return data.gradingScheme || []; // Fallback
    },
  });
  const updateGradingScheme = useMutation({
    mutationFn: (weightData) => {
      return updateGradingSchemeService(
        weightData,
        classId,
        currentUser.userId,
        getAuthHeader()
      );
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries(["classRoster", classId]);
      console.log("Grading scheme updated successfully:", data);
    },
    onError: (error) => {
      console.error("Error updating grading scheme:", error);
    },
  });
  return {
    saveScheme,
    getGradingScheme,
    updateGradingScheme,
  };
}
