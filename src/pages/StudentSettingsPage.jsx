import React, { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Bell,
  Shield,
  Settings,
  Save,
  CheckCircle,
  AlertCircle,
  X,
  Upload,
  Eye,
  EyeOff,
  Key,
  Palette,
  Database,
  Download,
  FileText,
  Globe,
  Trash2,
  Mail,
  ExternalLink,
} from "lucide-react";

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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

import Layout from "@/components/layout";
import { useAuth } from "@/contexts/authentication-context";
import { useTheme } from "@/contexts/theme-context";
import { useDocumentTitle } from "@/hooks/use-document-title";
import { getUserDetails, updateUser } from "@/services/user/userService";

export default function StudentSettings() {
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
        profilePicture: profileData.profilePicture,
      });
    }
  }, [profileData]);

  const handleProfileChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaveStatus("unsaved");
  };

  const updateUserMutation = useMutation({
    mutationFn: (profileData) =>
      updateUser(currentUser.userId, profileData, getAuthHeader()),
    onSuccess: (updatedUserData) => {
      // Update the user profile query cache
      queryClient.invalidateQueries(["userProfile", currentUser?.userId]);

      // Extract the actual user data from the response
      if (updatedUserData) {
        if (updatedUserData.user) {
          updateUserProfile(updatedUserData.user);
        } else if (updatedUserData.data?.user) {
          updateUserProfile(updatedUserData.data.user);
        }
      }

      setSaveStatus("saved");
      setTimeout(() => setSaveStatus(""), 2000);
    },
    onError: (error) => {
      console.error("Failed to update user:", error);
      setSaveStatus("error");
      setTimeout(() => setSaveStatus(""), 2000);
    },
  });

  const handleSettingChange = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveStatus("unsaved");
  };

  const handleSaveSettings = () => {
    setSaveStatus("saving");

    const profileUpdateData = {
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: formData.phoneNumber,
      department: formData.department,
      bio: formData.bio,
    };

    if (profilePicture) {
      profileUpdateData.profilePicture = profilePicture;
    }

    updateUserMutation.mutate(profileUpdateData);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file.");
        return;
      }

      // Validate file size (2MB limit)
      if (file.size > 2 * 1024 * 1024) {
        alert("File size must be less than 2MB.");
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
        setSaveStatus("unsaved");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveProfilePicture = () => {
    setProfilePicture(null);
    setFormData((prev) => ({ ...prev, profilePicture: null }));
    setSaveStatus("unsaved");
  };

  return (
    <Layout>
      {helmet}
      <div className="p-8">
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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4 md:grid-cols-1 sm:flex sm:w-auto sm:overflow-x-auto sm:gap-1 sm:p-1">
            <TabsTrigger
              value="profile"
              className="flex items-center gap-2 data-[state=inactive]:text-white sm:whitespace-nowrap sm:min-w-fit sm:px-3 sm:py-2"
            >
              <User className="w-4 h-4" />
              <span className="hidden sm:inline">Profile</span>
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
                          {currentUser?.role || "Student"}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Member Since</span>
                        <span className="font-medium">
                          {profileData?.createdAt
                            ? (() => {
                                const date = new Date(profileData.createdAt);
                                return date.toLocaleDateString("en-US", {
                                  year: "numeric",
                                  month: "long",
                                  day: "numeric",
                                });
                              })()
                            : "Unknown"}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

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
                        Grade Updates
                      </Label>
                      <p className="text-sm text-gray-500">
                        Get notified when grades are posted or updated
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
                        Receive weekly progress summaries
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

                  {(currentUser?.provider === "Microsoft" ||
                    currentUser?.provider === "Google") && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => {
                        const url =
                          currentUser.provider === "Microsoft"
                            ? "https://account.microsoft.com/security"
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
                    Export My Data
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