import useDrivePicker from "react-google-drive-picker";
import { useRef } from "react";
import { Button } from "./ui/button";
import { HardDrive } from "lucide-react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/authentication-context";
import {
  getGoogleAccessToken,
  saveSheet,
} from "@/services/teacher/googleService";
import { toast } from "react-hot-toast";
export function GoogleDrivePicker({ userEmail }) {
  const [openPicker, setOpenPicker] = useDrivePicker();
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const { currentUser, getAuthHeader } = useAuth();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["googleAccessToken", currentUser?.userId],
    queryFn: () => getGoogleAccessToken(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser?.userId && currentUser?.provider === "Google",
    staleTime: 1000 * 60 * 30, // 30 minutes
    retry: 2,
  });
  const saveSheetMutation = useMutation({
    mutationFn: (urlLink) =>
      saveSheet(currentUser.userId, urlLink, getAuthHeader()),

    onSuccess: () => {
      toast.success("Successfully saved sheets");
    },
    onError: () => {
      toast.error("Error saving sheets");
    },
  });

  const handleOpenPicker = () => {
    if (isLoading) {
      return;
    }

    if (isError || !data?.accessToken) {
      toast.error("Fetching access token failed");
      return;
    }

    openPicker({
      clientId: clientId,
      developerKey: apiKey,
      viewId: "DOCS",
      showUploadView: true,
      showUploadFolders: true,
      supportDrives: true,
      multiselect: true,
      token: data.accessToken,
      authImmediate: true,
      ...(userEmail && { authuser: userEmail }),
      callbackFunction: (data) => {
        if (data.action === "cancel") {
          return
        } else if (data.action === "picked") {
          saveSheetMutation.mutate(data.docs[0].url);
        }
      },
    });
  };

  if (isError || currentUser.provider !== "Google") {
    return <Button disabled>Google Drive Unavailable</Button>;
  }

  return (
    <Button
      variant="default"
      onClick={handleOpenPicker}
      className="cursor-pointer"
    >
      <HardDrive />
      Browse Google Drive
    </Button>
  );
}
