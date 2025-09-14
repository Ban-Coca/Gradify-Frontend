import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Download,
  Upload,
  Edit,
  Users,
  FileText,
  BarChart,
  Search,
  UserPlus,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { StudentTable } from "@/components/student-table";
import { GradeEditTable } from "@/components/grade-edit-table";
import { EngagementMetrics } from "@/components/engagement-metrics";
import {
  getClassById,
  updateClassById,
  getClassAverage,
  getStudentCount,
  getClassRoster,
  getSpreadsheetByClassId,
} from "@/services/teacher/classServices";
import { useAuth } from "@/contexts/authentication-context";
import GradingSchemeModal from "@/components/grading-schemes";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { ReportsTab } from "@/components/reports-tab";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import DeleteClassConfirmation from "@/pages/TeacherPages/DeleteClassConfirmation";
import { UploadModal } from "@/components/upload-modal";
import toast from "react-hot-toast";
import { updateClassSpreadsheetData } from "@/services/teacher/spreadsheetservices";
import AiAnalyticsSheet from "@/components/ai-analytics-sheet";
import { GradeDisplayTable } from "@/components/grade-visibility";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { syncSheet } from "@/services/teacher/googleService";
import { syncSheetExcel } from "@/services/teacher/microsoftGraphService";
import { useDocumentTitle } from "@/hooks/use-document-title";

const ClassDetailPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { currentUser, getAuthHeader } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradingSchemeModal, setGradingSchemeModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const helmet = useDocumentTitle("Class Details", "View and manage class information, students, and grades.");

  const { data: classAverageData, isLoading: isClassAverageLoading } = useQuery(
    {
      queryKey: ["classAverage", id],
      queryFn: () => getClassAverage(id, getAuthHeader()),
      enabled: !!id,
    }
  );

  const { data: studentCountData, isLoading: isStudentCountLoading } = useQuery(
    {
      queryKey: ["studentCount", id],
      queryFn: () => getStudentCount(id, getAuthHeader()),
      enabled: !!id,
    }
  );

  const { data: rosterData = [], isLoading: isRosterLoading } = useQuery({
    queryKey: ["classRoster", id],
    queryFn: () => getClassRoster(id, getAuthHeader()),
    enabled: !!id,
  });

  // BACKGROUND FUNCTION FOR WILL BE USED FOR SYNCING
  const { data: classSpreadsheet, isLoading: isClassSpreadsheetLoading } =
    useQuery({
      queryKey: ["classSpreadsheet", id],
      queryFn: () => getSpreadsheetByClassId(id, getAuthHeader()),
      staleTime: Infinity,
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    });

  const syncSheetMutation = useMutation({
    mutationFn: async () => {
      const userId = currentUser?.userId || currentUser?.id;
      const sheetId = classSpreadsheet[0]?.id;
      const headers = getAuthHeader();

      if (!userId || !sheetId) {
        throw new Error("Missing userId or sheetId for sync");
      }

      if (classSpreadsheet[0]?.isGoogleSheets === true) {
        return await syncSheet(userId, sheetId, headers);
      } else if (Boolean(classSpreadsheet?.[0]?.folderId)) {
        return await syncSheetExcel(userId, sheetId, headers);
      } else {
        throw new Error("Invalid sync condition");
      }
    },
    onSuccess: (data) => {
      // Refetch class/roster data after sync
      queryClient.invalidateQueries({ queryKey: ["classSpreadsheet", id] });
      queryClient.invalidateQueries({ queryKey: ["classRoster", id] });
      toast.success("Data synced successfully!");
    },
    onError: (error) => {
      toast.error("Failed to sync data: " + error.message);
    },
  });
  const safeRosterData = Array.isArray(rosterData) ? rosterData : [];

  const studentsAtRisk = safeRosterData.filter((student) => {
    const percentage =
      student.percentage > 100 ? student.percentage / 100 : student.percentage;
    return student.status === "At Risk" || percentage < 60;
  }).length;

  const average = classAverageData?.toFixed(2);

  const updateSpreadsheetMutation = useMutation({
    mutationFn: ({ classId, data, headers }) =>
      updateClassSpreadsheetData(classId, data, headers),
    onSuccess: (data) => {
      // Optionally refetch class/roster data here
      setUploadedFiles((prev) => [...prev, data]);
      setTimeout(() => setIsUploadModalOpen(false), 2000);
    },
    onError: (error) => {
      // Handle error (show toast, etc.)
      toast("Failed to update spreadsheet: " + error.message);
    },
  });

  const {
    data: classData,
    isLoading: loading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["classDetails", id],
    queryFn: async () => {
      const response = await getClassById(id, getAuthHeader());
      console.log("Class Details:", response);
      return {
        ...response,
        startTimeZone: response.startTimeZone || "AM",
        endTimeZone: response.endTimeZone || "AM",
      };
    },
    enabled: !!id,
    onSuccess: (data) => {
      console.log("Class Data:", data);
    },
    onError: (err) => {
      console.error("Error fetching class details:", err);
      toast.error("Failed to fetch class details. Please try again later.");
    },
  });

  const updateClassMutation = useMutation({
    mutationFn: ({ classId, updatedData, headers }) =>
      updateClassById(classId, updatedData, headers),
    onSuccess: (response) => {
      console.log("Class updated successfully:", response);

      // Invalidate and refetch the class details query to get updated data
      queryClient.invalidateQueries({ queryKey: ["classDetails", id] });

      // Close modal and show success message
      toggleModal();
      toast.success("Class updated successfully!");
    },
    onError: (error) => {
      console.error("Error updating class:", error);
      toast.error("Failed to update class. Please try again.");
    },
  });

  const openEditModal = () => {
    setEditForm({ ...classData });
    setIsModalOpen(true);
  };

  const handleUpdateClass = async () => {
    const updatedData = {
      ...editForm,
    };
    const header = getAuthHeader();
    console.log("Header in handleUpdateClass", header);

    updateClassMutation.mutate({
      classId: id,
      updatedData,
      headers: header,
    });
  };

  const handleClassDeleted = (className) => {
    // Navigate back to classes list after successful deletion
    navigate("/teacher/classes", {
      state: {
        notification: {
          type: "success",
          message: `${className} has been successfully deleted.`,
        },
      },
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not available";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Invalid date";

    const options = { year: "numeric", month: "long", day: "numeric" };
    return date.toLocaleDateString(undefined, options);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleGradingSchemeModal = () => {
    setGradingSchemeModal(!gradingSchemeModal);
  };

  const handleUploadComplete = (file) => {
    // file: { file: File }
    const teacherId = currentUser?.userId || currentUser?.id;
    if (!teacherId) {
      return;
    }
    updateSpreadsheetMutation.mutate({
      classId: id,
      data: { file: file, teacherId },
      headers: getAuthHeader(),
    });
  };
  // Loading state
  if (loading) {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Header skeleton */}
          <div className="flex items-center gap-2 mb-4 mt-5">
            <div className="h-9 w-32 bg-gray-200 rounded-md animate-pulse"></div>
          </div>

          {/* Class header skeleton */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="space-y-3">
                <div className="h-8 w-64 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-96 bg-gray-200 rounded animate-pulse"></div>
              </div>
              <div className="flex flex-col md:flex-row gap-2">
                <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-32 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-36 bg-gray-200 rounded-md animate-pulse"></div>
                <div className="h-10 w-28 bg-gray-200 rounded-md animate-pulse"></div>
              </div>
            </div>

            {/* Stats skeleton */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-50 p-3 rounded-md text-center">
                  <div className="h-4 w-16 bg-gray-200 rounded animate-pulse mx-auto mb-2"></div>
                  <div className="h-6 w-12 bg-gray-200 rounded animate-pulse mx-auto"></div>
                </div>
              ))}
            </div>
          </div>

          {/* Main content skeleton */}
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                Loading Class Details...
              </CardTitle>
              <CardDescription>
                Please wait while we fetch your class information
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="h-10 w-full bg-gray-200 rounded animate-pulse"></div>
                <div className="h-64 w-full bg-gray-100 rounded animate-pulse"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="space-y-6">
          {/* Header with navigation */}
          <div className="flex items-center gap-2 mb-4 mt-5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/teacher/classes")}
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Classes
            </Button>
          </div>

          {/* Error content */}
          <Card className="mb-5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-600">
                <AlertCircle className="h-5 w-5" />
                Error Loading Class Details
              </CardTitle>
              <CardDescription>
                We encountered an issue while loading your class information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  {error?.message ||
                    "Failed to load class details. This could be due to a network issue or server error."}
                </AlertDescription>
              </Alert>

              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={() => refetch()}
                  className="flex items-center gap-2"
                >
                  <RefreshCw className="h-4 w-4" />
                  Try Again
                </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate("/teacher/classes")}
                >
                  Return to Classes
                </Button>
              </div>

              {/* Additional help */}
              <div className="bg-gray-50 p-4 rounded-lg mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Troubleshooting:
                </h4>
                <ul className="text-sm text-gray-600 space-y-1">
                  <li>• Check your internet connection</li>
                  <li>• Refresh the page or try again in a few moments</li>
                  <li>• Contact support if the problem persists</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </div>
      </Layout>
    );
  }
  return (
    <Layout>
      {helmet}
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center gap-2 mb-4 mt-5">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/teacher/classes")}
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Classes
          </Button>
        </div>

        {/* Class Header */}
        <div className="bg-white dark:bg-card dark:border-accent rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl md:text-3xl">
                {classData?.className}
              </h1>
              <p className="text-gray-600 dark:text-gray-300 mt-1">
                {classData.semester || "No semester"} - {classData.section} -
                {classData.schedule || "No Schedule"} -{" "}
                {classData.room || "No Room"}
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <GradingSchemeModal
                open={gradingSchemeModal}
                onOpenChange={setGradingSchemeModal}
                classId={id}
                //initialData = {classData.gradingScheme}
              />
              <AiAnalyticsSheet classId={id} />
              <Button variant="outline" onClick={openEditModal}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Class Details
              </Button>
              <Button
                onClick={() => {
                  if (
                    classSpreadsheet[0]?.isGoogleSheets === true ||
                    Boolean(classSpreadsheet?.[0]?.folderId)
                  ) {
                    syncSheetMutation.mutate();
                  } else {
                    setIsUploadModalOpen(true);
                  }
                }}
                disabled={syncSheetMutation.isPending}
              >
                {syncSheetMutation.isPending ? (
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                ) : classSpreadsheet[0]?.isGoogleSheets === true ||
                  Boolean(classSpreadsheet?.[0]?.folderId) ? (
                  <RefreshCw className="h-4 w-4 mr-2" />
                ) : (
                  <Upload className="h-4 w-4 mr-2" />
                )}
                {syncSheetMutation.isPending
                  ? "Syncing..."
                  : classSpreadsheet[0]?.isGoogleSheets === true ||
                    Boolean(classSpreadsheet?.[0]?.folderId)
                  ? "Sync data"
                  : "Update Data"}
              </Button>

              <DeleteClassConfirmation
                classId={classData.classId}
                className={classData?.className}
                onClassDeleted={handleClassDeleted}
              />
            </div>
          </div>

          {/* Class Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6 w-full">
            <div className="bg-gray-50 dark:bg-card border dark:border-emerald-800 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">Students</p>
              <p className="font-bold text-lg">{studentCountData}</p>
            </div>
            <div className="bg-gray-50 dark:bg-card border dark:border-emerald-800 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">Avg. Grade</p>
              <p className="font-bold text-lg">{average}</p>
            </div>
            <div className="bg-gray-50 dark:bg-card border dark:border-emerald-800 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">Students at Risk</p>
              <p className="font-bold text-lg">
                {isRosterLoading ? "..." : studentsAtRisk}
              </p>
            </div>
            <div className="bg-gray-50 dark:bg-card border dark:border-emerald-800 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500 dark:text-gray-300">Last Updated</p>
              <p className="font-bold text-lg">
                {formatDate(classData.updatedAt)}
              </p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Edit Class</SheetTitle>
              <SheetDescription>
                Make changes to your class information.
              </SheetDescription>
            </SheetHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleUpdateClass();
              }}
              className="space-y-4 p-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Class Name
                </label>
                <input
                  type="text"
                  value={editForm?.className || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, className: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Semester
                </label>
                <input
                  type="text"
                  value={editForm?.semester || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, semester: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <input
                  type="text"
                  value={editForm?.schedule || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, schedule: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Room
                </label>
                <input
                  type="text"
                  value={editForm?.room || ""}
                  onChange={(e) =>
                    setEditForm({ ...editForm, room: e.target.value })
                  }
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <SheetClose asChild>
                  <Button variant="outline" type="button">
                    Cancel
                  </Button>
                </SheetClose>
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </SheetContent>
        </Sheet>

        {/* Main Content Tabs */}
        <Card className="mb-5">
          <CardHeader>
            <CardTitle>Class Management</CardTitle>
            <CardDescription>
              Manage roster, grades, and student engagement
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="roster">
              <TabsList className="mb-4">
                <TabsTrigger
                  value="roster"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Class Roster
                </TabsTrigger>
                {/* <TabsTrigger
                  value="grades"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Edit Grades
                </TabsTrigger> */}
                <TabsTrigger
                  value="visibility"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Grade Visibility
                </TabsTrigger>
                <TabsTrigger
                  value="reports"
                  className="text-white data-[state=active]:bg-white data-[state=active]:text-black"
                >
                  Reports
                </TabsTrigger>
              </TabsList>

              <TabsContent value="roster">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-4 items-center">
                    <div className="relative w-64">
                      <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                      <Input
                        type="search"
                        placeholder="Search students..."
                        className="w-full pl-8 md:w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                      />
                    </div>
                    <Button variant="outline" size="sm">
                      <Filter className="h-4 w-4 mr-1" />
                      Filter
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4 mr-1" />
                      Export Roster
                    </Button>
                  </div>
                </div>
                <StudentTable
                  searchQuery={searchQuery}
                  classId={id}
                  className="w-full"
                />
              </TabsContent>

              <TabsContent value="grades">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2 items-center">
                    <select className="border rounded-md px-3 py-2">
                      <option>All Assignments</option>
                      <option>Midterm Exam</option>
                      <option>Final Project</option>
                      <option>Homework 1-5</option>
                    </select>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" />
                      Bulk Edit
                    </Button>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Grades
                  </Button>
                </div>
                <GradeEditTable classId={id} className="w-full" />
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <ReportsTab classId={id} />
                </div>
              </TabsContent>

              <TabsContent value="visibility">
                <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
                  <GradeDisplayTable classId={id} />
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>

      <UploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onUploadComplete={handleUploadComplete}
        title="Upload Student Data"
        description="Upload an Excel file containing student information and grades"
        isLoading={updateSpreadsheetMutation.isLoading}
      />
    </Layout>
  );
};

export default ClassDetailPage;
