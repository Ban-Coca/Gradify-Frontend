import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Bell,
  Shield,
  Palette,
  Database,
  Mail,
  FileText,
  Webhook,
  ExternalLink,
  User,
  Save,
  MoreVertical,
  Trash2,
  Eye,
  EyeOff,
  Download,
  Upload,
  CheckCircle,
  AlertCircle,
  Settings,
  Key,
  Globe,
  RefreshCw,
  Plus,
  X,
} from "lucide-react";
import Layout from "@/components/layout";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  createNotificationSubscription,
  getSubscriptionStatus,
  renewSubscription,
  cancelSubscription,
  getTrackedFiles,
} from "@/services/teacher/microsoftGraphService";
import { updateUser, getUserDetails } from "@/services/user/userService";
import { getStudentCount } from "@/services/teacher/teacherService";
import { useAuth } from "@/contexts/authentication-context";
import { useTheme } from "@/contexts/theme-context";
import toast from "react-hot-toast";

export default function TeacherSettings() {
  const [activeTab, setActiveTab] = useState("profile");
  const [profilePicture, setProfilePicture] = useState(null);
  const [settings, setSettings] = useState({
    emailNotifications: true,
    performanceAlerts: true,
    weeklyReports: false,
    darkMode: false,
    language: "english",
    timezone: "pst",
  });
  const [passwordVisible, setPasswordVisible] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [saveStatus, setSaveStatus] = useState("");

  const helmet = useDocumentTitle("Settings", "Manage your account settings and preferences.");

  const queryClient = useQueryClient();
  const { currentUser, getAuthHeader, updateUserProfile } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    department: "",
    bio: "",
    profilePicture: null,
  });

  const {
    data: profileData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["userProfile", currentUser?.userId],
    queryFn: () => getUserDetails(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser,
    staleTime: 5 * 60 * 1000, // Don't refetch for 5 minutes
  });

  useEffect(() => {
    if (profileData) {
      setFormData({
        firstName: profileData.firstName || "",
        lastName: profileData.lastName || "",
        email: profileData.email || "",
        phoneNumber: profileData.phoneNumber || "",
        department: profileData.department || "",
        bio: profileData.bio || "",
      });
    }
  }, [profileData]);

  const handleProfileChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
  };

  const {
    data: subscriptionStatus,
    isLoading: isLoadingStatus,
    error: statusError,
    refetch: refetchStatus,
  } = useQuery({
    queryKey: ["subscriptionStatus", currentUser?.userId],
    queryFn: () => getSubscriptionStatus(currentUser?.userId, getAuthHeader()),
    refetchInterval: 30000, // Refetch every 30 seconds
    enabled: !!currentUser,
  });

  const {
    data: trackedFilesData,
    isLoading: isLoadingFiles,
    error: filesError,
    refetch: refetchFiles,
  } = useQuery({
    queryKey: ["trackedFiles", currentUser?.userId],
    queryFn: () => getTrackedFiles(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser && subscriptionStatus?.hasActiveSubscription,
  });

  // Mutations for subscription actions
  const createSubscriptionMutation = useMutation({
    mutationFn: () =>
      createNotificationSubscription(currentUser?.userId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "subscriptionStatus",
        currentUser?.userId,
      ]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    onError: (error) => {
      console.error("Failed to create subscription:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    },
  });

  const renewSubscriptionMutation = useMutation({
    mutationFn: () => renewSubscription(currentUser?.userId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "subscriptionStatus",
        currentUser?.userId,
      ]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    onError: (error) => {
      console.error("Failed to renew subscription:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    },
  });

  const cancelSubscriptionMutation = useMutation({
    mutationFn: () => cancelSubscription(currentUser?.userId, getAuthHeader()),
    onSuccess: () => {
      queryClient.invalidateQueries([
        "subscriptionStatus",
        currentUser?.userId,
      ]);
      queryClient.invalidateQueries(["trackedFiles", currentUser?.userId]);
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    onError: (error) => {
      console.error("Failed to cancel subscription:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: (profileData) =>
      updateUser(currentUser.userId, profileData, getAuthHeader()),
    onSuccess: (updatedUserData) => {
      // Update the user profile query cache
      queryClient.invalidateQueries(["userProfile", currentUser?.userId]);

      // Extract the actual user data from the response
      if (updatedUserData) {
        // If the response has userResponse nested, use that, otherwise use the data directly
        const actualUserData = updatedUserData.userResponse || updatedUserData;
        updateUserProfile(actualUserData);
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    onError: (error) => {
      console.error("Failed to update user: ", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    },
  });

  const {
    data: studentCount,
    isLoading: countLoading,
    error: countError,
    refetch: refetchCount,
  } = useQuery({
    queryKey: ["studentCount", currentUser?.userId],
    queryFn: () => getStudentCount(currentUser?.userId, getAuthHeader()),
    enabled: !!currentUser,
  });
  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("unsaved");
  };

  const handleSaveSettings = () => {
    setSaveStatus("saving");
    // Check if we have a file to upload
    if (formData.profilePicture && formData.profilePicture instanceof File) {
      const submitData = new FormData();

      // Add all form fields except the file first
      Object.keys(formData).forEach((key) => {
        if (
          key !== "profilePicture" &&
          formData[key] !== null &&
          formData[key] !== undefined
        ) {
          submitData.append(key, formData[key]);
        }
      });

      submitData.append("profilePicture", formData.profilePicture);

      updateUserMutation.mutate(submitData);
    } else {
      const { profilePicture, ...jsonData } = formData;
      updateUserMutation.mutate(jsonData);
    }
  };

  const handleCreateSubscription = () => {
    setSaveStatus("saving");
    createSubscriptionMutation.mutate();
  };

  const handleRenewSubscription = () => {
    setSaveStatus("saving");
    renewSubscriptionMutation.mutate();
  };

  const handleCancelSubscription = () => {
    setSaveStatus("saving");
    cancelSubscriptionMutation.mutate();
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedTypes.includes(file.type)) {
        toast.error("Please select a valid image file (JPG, PNG, or GIF)");
        return;
      }

      // Validate file size (2MB)
      const maxSize = 10 * 1024 * 1024; // 2MB in bytes
      if (file.size > maxSize) {
        toast.error("File size must be less than 2MB");
        return;
      }

      // Create preview URL
      const previewUrl = URL.createObjectURL(file);

      // Update form data with the actual file
      setFormData((prev) => ({ ...prev, profilePicture: file }));
      setProfilePicture(previewUrl);
      setSaveStatus("unsaved");
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setSaveStatus("unsaved");

    // Clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Get tracked files from API response
  const trackedFiles = trackedFilesData?.trackedFiles || [];
  return (
    <Layout>
      {helmet}
      <div className="p-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-8 rounded-lg mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Settings</h1>
              <p className="text-green-100">
                Manage your account preferences and application settings
              </p>
            </div>
            <div className="flex items-center gap-3">
              {saveStatus && (
                <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-3 py-2">
                  {saveStatus === "saving" && (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span className="text-sm">Saving...</span>
                    </>
                  )}
                  {saveStatus === "saved" && (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-200" />
                      <span className="text-sm">Saved!</span>
                    </>
                  )}
                  {saveStatus === "unsaved" && (
                    <>
                      <AlertCircle className="w-4 h-4 text-yellow-200" />
                      <span className="text-sm">Unsaved changes</span>
                    </>
                  )}
                  {saveStatus === "error" && (
                    <>
                      <X className="w-4 h-4 text-red-200" />
                      <span className="text-sm">Error occurred</span>
                    </>
                  )}
                </div>
              )}
              <Button
                onClick={handleSaveSettings}
                disabled={saveStatus === "saving" || !saveStatus}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-white/20"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          </div>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5 md:grid-cols-1 sm:flex sm:w-auto sm:overflow-x-auto sm:gap-1 sm:p-1">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger
              value="files"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <Webhook className="w-4 h-4" />
              <span className="hidden sm:inline">File Tracking</span>
            </TabsTrigger>
            <TabsTrigger
              value="notifications"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <Bell className="w-4 h-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
            <TabsTrigger
              value="security"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <Shield className="w-4 h-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger
              value="preferences"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Preferences</span>
            </TabsTrigger>
          </TabsList>

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5 text-green-600" />
                      Profile Information
                    </CardTitle>
                    <CardDescription>
                      Update your personal information and profile details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage
                          src={
                            profilePicture ||
                            currentUser?.profilePictureUrl ||
                            "/api/placeholder/80/80"
                          }
                        />
                        <AvatarFallback className="bg-green-100 text-green-700 text-xl">
                          {formData.firstName?.charAt(0)?.toUpperCase() || ""}
                          {formData.lastName?.charAt(0)?.toUpperCase() || ""}
                        </AvatarFallback>
                      </Avatar>
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={handleUploadButtonClick}
                            className="bg-green-600 hover:bg-green-700"
                          >
                            <Upload className="w-4 h-4 mr-2" />
                            Upload Photo
                          </Button>
                          {(profilePicture || currentUser?.profilePicture) && (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={handleRemoveProfilePicture}
                              className="text-red-600 border-red-300 hover:bg-red-200 hover:text-red-600"
                            >
                              <X className="w-4 h-4 mr-2" />
                              Remove
                            </Button>
                          )}
                        </div>

                        <p className="text-sm text-gray-500">
                          JPG, PNG or GIF. Max size 2MB.
                        </p>

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/jpeg,image/png,image/gif"
                          onChange={handleFileUpload}
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) =>
                            handleProfileChange("firstName", e.target.value)
                          }
                          placeholder="Enter your first name"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) =>
                            handleProfileChange("lastName", e.target.value)
                          }
                          placeholder="Enter your last name"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleProfileChange("email", e.target.value)
                        }
                        placeholder="Enter your email address"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phoneNumber}
                        onChange={(e) =>
                          handleProfileChange("phoneNumber", e.target.value)
                        }
                        placeholder="Enter your phone number"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="department">Department</Label>
                      <Input
                        id="department"
                        value={formData.department}
                        onChange={(e) =>
                          handleProfileChange("department", e.target.value)
                        }
                        placeholder="Enter your department"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <textarea
                        id="bio"
                        className="w-full min-h-[100px] p-3 border border-input bg-background rounded-md resize-none"
                        value={formData.bio}
                        onChange={(e) =>
                          handleProfileChange("bio", e.target.value)
                        }
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </CardContent>
                </Card>
              </div>

              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Account Status</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">User ID</span>
                        <span className="font-medium">
                          #{currentUser?.userId || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Role</span>
                        <span className="font-medium capitalize">
                          {currentUser?.role || "Teacher"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium">
                          {profileData?.createdAt
                            ? (() => {
                                try {
                                  const date = new Date(profileData.createdAt);
                                  return isNaN(date.getTime())
                                    ? "Unknown"
                                    : date.toLocaleDateString();
                                } catch (error) {
                                  return "Unknown";
                                }
                              })()
                            : "Unknown"}
                        </span>
                      </div>
                      {currentUser?.role === "TEACHER" && (
                        <>
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-500">
                              Total Students
                            </span>
                            <span className="font-medium">
                              {studentCount || 0}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* File Tracking Tab */}
          <TabsContent value="files" className="space-y-6">
            {currentUser?.provider === "Google" ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-green-600" />
                    Microsoft File Tracking
                  </CardTitle>
                  <CardDescription>
                    File tracking is only available for Microsoft 365 users
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <Alert className="border-blue-200 bg-blue-50">
                    <AlertCircle className="h-4 w-4 text-blue-600" />
                    <AlertDescription className="text-blue-700">
                      Microsoft File Tracking is not available for Google
                      accounts. This feature is specifically designed for
                      Microsoft 365 integration.
                    </AlertDescription>
                  </Alert>
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Webhook className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Feature Not Available
                    </h3>
                    <p className="text-gray-500 mb-4">
                      File tracking requires a Microsoft 365 account to access
                      Microsoft Graph APIs for document monitoring.
                    </p>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Webhook className="w-5 h-5 text-green-600" />
                    Microsoft File Tracking
                  </CardTitle>
                  <CardDescription>
                    Manage webhook subscriptions for tracking Microsoft files
                    and documents
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* ...existing code... */}
                  {/* Loading State */}
                  {isLoadingStatus && (
                    <div className="flex items-center justify-center p-8">
                      <div className="flex items-center gap-2">
                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                        <span className="text-sm text-gray-600">
                          Loading subscription status...
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Error State */}
                  {statusError && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-700">
                        Failed to load subscription status. Please try again.
                      </AlertDescription>
                    </Alert>
                  )}

                  {/* Connection Status */}
                  {!isLoadingStatus && subscriptionStatus && (
                    <div
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        subscriptionStatus.hasActiveSubscription
                          ? "bg-green-50 border-green-200 dark:bg-emerald-950 dark:border-green-800"
                          : "bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                            subscriptionStatus.hasActiveSubscription
                              ? "bg-green-600"
                              : "bg-yellow-600"
                          }`}
                        >
                          <ExternalLink className="w-4 h-4 text-white" />
                        </div>
                        <div>
                          <p
                            className={`font-medium ${
                              subscriptionStatus.hasActiveSubscription
                                ? "text-green-900 dark:text-green-500"
                                : "text-yellow-900"
                            }`}
                          >
                            {subscriptionStatus.hasActiveSubscription
                              ? "Microsoft 365 Connected"
                              : "No Active Subscription"}
                          </p>
                          <p
                            className={`text-sm ${
                              subscriptionStatus.hasActiveSubscription
                                ? "text-green-700"
                                : "text-yellow-700"
                            }`}
                          >
                            {subscriptionStatus.hasActiveSubscription
                              ? `Webhook subscriptions active • ${
                                  subscriptionStatus.trackedFilesCount || 0
                                } files tracked`
                              : "Create a subscription to start tracking files"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={refetchStatus}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0"
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                        <Badge
                          className={`${
                            subscriptionStatus.hasActiveSubscription
                              ? "bg-green-600 hover:bg-green-700"
                              : "bg-yellow-600 hover:bg-yellow-700"
                          }`}
                        >
                          {subscriptionStatus.hasActiveSubscription
                            ? "Connected"
                            : "Disconnected"}
                        </Badge>
                      </div>
                    </div>
                  )}

                  {/* No Subscription State */}
                  {!isLoadingStatus &&
                    subscriptionStatus &&
                    !subscriptionStatus.hasActiveSubscription && (
                      <div className="text-center py-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <Webhook className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">
                          No Active Subscription
                        </h3>
                        <p className="text-gray-500 mb-4">
                          Create a webhook subscription to automatically track
                          changes to your Microsoft files.
                        </p>
                        <Button
                          onClick={handleCreateSubscription}
                          disabled={createSubscriptionMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {createSubscriptionMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Creating...
                            </>
                          ) : (
                            <>
                              <Plus className="w-4 h-4 mr-2" />
                              Create Subscription
                            </>
                          )}
                        </Button>
                      </div>
                    )}

                  {/* Tracked Files List */}
                  {subscriptionStatus?.hasActiveSubscription && (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h4 className="font-medium text-gray-900">
                          Tracked Files
                        </h4>
                        <div className="flex items-center gap-2">
                          <Button
                            onClick={refetchFiles}
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 mr-4"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refresh
                          </Button>
                        </div>
                      </div>

                      {isLoadingFiles ? (
                        <div className="flex items-center justify-center p-8 border rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                            <span className="text-sm text-gray-600">
                              Loading tracked files...
                            </span>
                          </div>
                        </div>
                      ) : filesError ? (
                        <Alert className="border-red-200 bg-red-50">
                          <AlertCircle className="h-4 w-4 text-red-600" />
                          <AlertDescription className="text-red-700">
                            Failed to load tracked files. Please try again.
                          </AlertDescription>
                        </Alert>
                      ) : trackedFiles.length === 0 ? (
                        <div className="text-center py-8 border rounded-lg bg-gray-50">
                          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-500">
                            No files are currently being tracked.
                          </p>
                        </div>
                      ) : (
                        <div className="border rounded-lg overflow-hidden">
                          <div className="bg-gray-50 px-4 py-3 border-b dark:bg-card">
                            <div className="grid grid-cols-12 gap-4 text-sm font-medium text-gray-700 dark:text-white">
                              <div className="col-span-3">File Name</div>
                              <div className="col-span-3">Path</div>
                              <div className="col-span-2">Status</div>
                              <div className="col-span-2">Last Modified</div>
                              <div className="col-span-1">Item ID</div>
                              <div className="col-span-1">Actions</div>
                            </div>
                          </div>

                          <div className="divide-y">
                            {trackedFiles.map((file, index) => (
                              <div
                                key={file.itemId || index}
                                className="px-4 py-3 dark:bg-card hover:bg-gray-50 hover:dark:bg-accent"
                              >
                                <div className="grid grid-cols-12 gap-4 items-center text-sm">
                                  <div className="col-span-3 flex items-center gap-2">
                                    <FileText className="w-4 h-4 text-gray-400" />
                                    <span className="font-medium text-gray-900 dark:text-white truncate">
                                      {file.fileName}
                                    </span>
                                  </div>
                                  <div className="col-span-3 text-gray-600 dark:text-white/50 truncate">
                                    {file.filePath}
                                  </div>
                                  <div className="col-span-2">
                                    <Badge
                                      variant={
                                        file.syncStatus === "SYNCED"
                                          ? "default"
                                          : "secondary"
                                      }
                                      className={
                                        file.syncStatus === "SYNCED"
                                          ? "bg-green-600 hover:bg-green-700"
                                          : ""
                                      }
                                    >
                                      {file.syncStatus || "Unknown"}
                                    </Badge>
                                  </div>
                                  <div className="col-span-2 text-gray-600">
                                    {file.lastModified
                                      ? new Date(
                                          file.lastModified
                                        ).toLocaleString()
                                      : "Unknown"}
                                  </div>
                                  <div className="col-span-1 text-gray-600 truncate text-xs">
                                    {file.itemId?.substring(0, 8)}...
                                  </div>
                                  <div className="col-span-1">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0"
                                    >
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Webhook Settings */}
                  {subscriptionStatus?.hasActiveSubscription && (
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">
                        Subscription Settings
                      </h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionId">
                            Subscription ID
                          </Label>
                          <Input
                            id="subscriptionId"
                            value={subscriptionStatus.subscriptionId || ""}
                            readOnly
                            className="bg-gray-50 text-xs"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="subscriptionExpiry">
                            Subscription Expiry
                          </Label>
                          <Input
                            id="subscriptionExpiry"
                            value={
                              subscriptionStatus.expirationDateTime
                                ? new Date(
                                    subscriptionStatus.expirationDateTime
                                  ).toLocaleString()
                                : "Unknown"
                            }
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={handleRenewSubscription}
                          disabled={renewSubscriptionMutation.isPending}
                          className="bg-green-600 hover:bg-green-700"
                        >
                          {renewSubscriptionMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                              Renewing...
                            </>
                          ) : (
                            <>
                              <RefreshCw className="w-4 h-4 mr-2" />
                              Renew Subscription
                            </>
                          )}
                        </Button>
                        <Button
                          onClick={handleCancelSubscription}
                          disabled={cancelSubscriptionMutation.isPending}
                          variant="outline"
                          className="border-red-600 text-red-600 hover:bg-red-50"
                        >
                          {cancelSubscriptionMutation.isPending ? (
                            <>
                              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin mr-2" />
                              Cancelling...
                            </>
                          ) : (
                            <>
                              <X className="w-4 h-4 mr-2" />
                              Cancel Subscription
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-green-600" />
                  Notification Preferences
                </CardTitle>
                <CardDescription>
                  Configure how and when you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Email Notifications</Label>
                      <p className="text-sm text-gray-500">
                        Receive notifications via email
                      </p>
                    </div>
                    <Switch
                      checked={settings.emailNotifications}
                      onCheckedChange={(checked) =>
                        handleSettingChange("emailNotifications", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">
                        Student Performance Alerts
                      </Label>
                      <p className="text-sm text-gray-500">
                        Get notified when students are at risk
                      </p>
                    </div>
                    <Switch
                      checked={settings.performanceAlerts}
                      onCheckedChange={(checked) =>
                        handleSettingChange("performanceAlerts", checked)
                      }
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Weekly Reports</Label>
                      <p className="text-sm text-gray-500">
                        Receive weekly performance summaries
                      </p>
                    </div>
                    <Switch
                      checked={settings.weeklyReports}
                      onCheckedChange={(checked) =>
                        handleSettingChange("weeklyReports", checked)
                      }
                    />
                  </div>
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">
                    Notification Methods
                  </h4>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Email Frequency</Label>
                      <Select defaultValue="immediate">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="immediate">Immediate</SelectItem>
                          <SelectItem value="hourly">Hourly Digest</SelectItem>
                          <SelectItem value="daily">Daily Digest</SelectItem>
                          <SelectItem value="weekly">Weekly Digest</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Quiet Hours</Label>
                      <Select defaultValue="none">
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="evening">6 PM - 8 AM</SelectItem>
                          <SelectItem value="night">10 PM - 6 AM</SelectItem>
                          <SelectItem value="weekend">Weekends</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Tab */}
          <TabsContent value="security" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Key className="w-5 h-5 text-green-600" />
                    Change Password
                  </CardTitle>
                  <CardDescription>
                    Update your account password for better security
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Check if user is Microsoft user */}
                  {currentUser?.provider === "Microsoft" ||
                  currentUser?.provider === "Google" ? (
                    <Alert className="border-blue-200 bg-blue-50">
                      <AlertCircle className="h-4 w-4 text-accent" />
                      <AlertDescription className="text-accent font-medium">
                        Password changes are managed through your{" "}
                        {currentUser.provider} account. Please visit the{" "}
                        {currentUser.provider} account portal to update your
                        password.
                      </AlertDescription>
                    </Alert>
                  ) : (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">
                          Current Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="currentPassword"
                            type={passwordVisible.current ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() =>
                              setPasswordVisible((prev) => ({
                                ...prev,
                                current: !prev.current,
                              }))
                            }
                          >
                            {passwordVisible.current ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type={passwordVisible.new ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() =>
                              setPasswordVisible((prev) => ({
                                ...prev,
                                new: !prev.new,
                              }))
                            }
                          >
                            {passwordVisible.new ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">
                          Confirm New Password
                        </Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type={passwordVisible.confirm ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-2 top-1/2 -translate-y-1/2 h-auto p-1"
                            onClick={() =>
                              setPasswordVisible((prev) => ({
                                ...prev,
                                confirm: !prev.confirm,
                              }))
                            }
                          >
                            {passwordVisible.confirm ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <Alert>
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>
                          Password must be at least 8 characters long and
                          include uppercase, lowercase, numbers, and special
                          characters.
                        </AlertDescription>
                      </Alert>
                      <Button className="w-full bg-green-600 hover:bg-green-700">
                        Update Password
                      </Button>
                    </>
                  )}

                  {/* Alternative: Add link to Microsoft account portal for Microsoft users */}
                  {(currentUser?.provider === "Microsoft" ||
                    currentUser?.provider === "Google") && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const url =
                          currentUser?.provider === "Microsoft"
                            ? "https://account.microsoft.com/security/password"
                            : "https://myaccount.google.com/security";
                        window.open(url, "_blank");
                      }}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Manage Password in {currentUser?.provider} Account
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Preferences Tab */}
          <TabsContent value="preferences" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Palette className="w-5 h-5 text-green-600" />
                    Appearance & Language
                  </CardTitle>
                  <CardDescription>
                    Customize your interface preferences
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Language</Label>
                    <Select
                      value={settings.language}
                      onValueChange={(value) =>
                        handleSettingChange("language", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="english">English</SelectItem>
                        <SelectItem value="spanish">Spanish</SelectItem>
                        <SelectItem value="french">French</SelectItem>
                        <SelectItem value="german">German</SelectItem>
                        <SelectItem value="chinese">Chinese</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="timezone">Timezone</Label>
                    <Select
                      value={settings.timezone}
                      onValueChange={(value) =>
                        handleSettingChange("timezone", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pst">
                          Pacific Standard Time
                        </SelectItem>
                        <SelectItem value="est">
                          Eastern Standard Time
                        </SelectItem>
                        <SelectItem value="cst">
                          Central Standard Time
                        </SelectItem>
                        <SelectItem value="mst">
                          Mountain Standard Time
                        </SelectItem>
                        <SelectItem value="utc">UTC</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="space-y-1">
                      <Label className="font-medium">Dark Mode</Label>
                      <p className="text-sm text-gray-500">Toggle dark theme</p>
                    </div>
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Database className="w-5 h-5 text-green-600" />
                    Data & Privacy
                  </CardTitle>
                  <CardDescription>
                    Manage your data and privacy settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button className="w-full justify-start" variant="outline">
                    <Download className="w-4 h-4 mr-2" />
                    Export All Data
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <FileText className="w-4 h-4 mr-2" />
                    Download Reports
                  </Button>
                  <Button className="w-full justify-start" variant="outline">
                    <Globe className="w-4 h-4 mr-2" />
                    Privacy Settings
                  </Button>
                  <Separator />
                  <Button
                    className="w-full justify-start"
                    variant="destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Account
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Frequently used actions and shortcuts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Mail className="w-4 h-4 mr-2" />
                    Contact Support
                  </Button>
                  <Button variant="outline" className="w-full">
                    <FileText className="w-4 h-4 mr-2" />
                    User Guide
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Settings className="w-4 h-4 mr-2" />
                    Advanced Settings
                  </Button>
                  <Button variant="outline" className="w-full">
                    <ExternalLink className="w-4 h-4 mr-2" />
                    What's New
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}
