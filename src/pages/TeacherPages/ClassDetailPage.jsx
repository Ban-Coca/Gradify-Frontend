import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, Download, Upload, Edit, Users, FileText, 
  BarChart, Search, UserPlus, Filter
} from "lucide-react";
import { StudentTable } from "@/components/student-table";
import { GradeEditTable } from "@/components/grade-edit-table";
import { EngagementMetrics } from "@/components/engagement-metrics";
import { getClassById, updateClassById, getClassAverage, getStudentCount } from "@/services/teacher/classServices";
import { useAuth } from "@/contexts/authentication-context";
import GradingSchemeModal from "@/components/grading-schemes";
import { useQuery } from "@tanstack/react-query";
import { ReportsTab } from "@/components/reports-tab";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetClose } from "@/components/ui/sheet"
import DeleteClassConfirmation from "@/pages/TeacherPages/DeleteClassConfirmation";

const ClassDetailPage = () => {
  const navigate = useNavigate()
  const { id } = useParams();
  const { currentUser, getAuthHeader } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")
  const [classData, setClassData] = useState(null); 
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [gradingSchemeModal, setGradingSchemeModal] = useState(false);
  const [error, setError] = useState(null);
  
  const { data: classAverageData, isLoading: isClassAverageLoading } = useQuery({
    queryKey: ["classAverage", id],
    queryFn: () => getClassAverage(id, getAuthHeader()),
    enabled: !!id,
  })

  const { data: studentCountData, isLoading: isStudentCountLoading } = useQuery({
    queryKey: ["studentCount", id],
    queryFn: () => getStudentCount(id, getAuthHeader()),
    enabled: !!id,
  })

  const average = parseFloat(classAverageData/100).toFixed(2)

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await getClassById(id, getAuthHeader());
        console.log("Class Details:", response);
        setClassData(response);
        console.log("Class Data:", classData);
      } catch (err) {
        console.error("Error fetching class details:", err);
        setError("Failed to fetch class details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchClassDetails();
  }, [id]);

  const handleUpdateClass = async () => {
    try {
      const response = await updateClassById(id, classData, getAuthHeader);
      console.log("Class updated successfully:", response);
      toggleModal();
    } catch (error) {
      console.error("Error updating class:", error);
    }
  };

  const handleClassDeleted = (className) => {
    // Navigate back to classes list after successful deletion
    navigate("/teacher/classes", { 
      state: { 
        notification: {
          type: "success",
          message: `${className} has been successfully deleted.`
        }
      }
    });
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const toggleGradingSchemeModal = () => {
    setGradingSchemeModal(!gradingSchemeModal);
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p>Loading class details...</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with navigation */}
        <div className="flex items-center gap-2 mb-4 mt-5">
          <Button variant="ghost" size="sm" onClick={() => navigate("/teacher/classes")}>
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Classes
          </Button>
        </div>

        {/* Class Header */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="font-bold text-2xl md:text-3xl">{classData?.className}</h1>
              <p className="text-gray-600 mt-1">
                {classData.semester} semester
              </p>
            </div>
            <div className="flex flex-col md:flex-row gap-2">
              <GradingSchemeModal
                open={gradingSchemeModal}
                onOpenChange={setGradingSchemeModal}
                classId={id}
                //initialData = {classData.gradingScheme}
                />
              <Button variant="outline" onClick={toggleModal}>
                <Edit className="h-4 w-4 mr-2" />
                Edit Class
              </Button>
              <Button>
                <Upload className="h-4 w-4 mr-2" />
                Upload Data
              </Button>
              <DeleteClassConfirmation 
                classId={id} 
                className={classData?.className}
                onClassDeleted={handleClassDeleted}
              />
            </div>
          </div>

          {/* Class Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Students</p>
              <p className="font-bold text-lg">{studentCountData}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Avg. Grade</p>
              <p className="font-bold text-lg">{average}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Assignments</p>
              <p className="font-bold text-lg">12</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Attendance</p>
              <p className="font-bold text-lg">92%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Engagement</p>
              <p className="font-bold text-lg">76%</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="font-bold text-lg">{formatDate(classData.updatedAt)}</p>
            </div>
          </div>
        </div>

        {/* Modal */}
        <Sheet open={isModalOpen} onOpenChange={setIsModalOpen}>
          <SheetContent className="w-full sm:max-w-md overflow-y-auto">
            <SheetHeader className="mb-4">
              <SheetTitle>Edit Class</SheetTitle>
              <SheetDescription>Make changes to your class information.</SheetDescription>
            </SheetHeader>
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleUpdateClass()
              }}
              className="space-y-4 p-4"
            >
              <div>
                <label className="block text-sm font-medium text-gray-700">Class Name</label>
                <input
                  type="text"
                  value={classData.className}
                  onChange={(e) => setClassData({ ...classData, className: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Semester</label>
                <input
                  type="text"
                  value={classData.semester}
                  onChange={(e) => setClassData({ ...classData, semester: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Schedule</label>
                <input
                  type="text"
                  value={classData.schedule}
                  onChange={(e) => setClassData({ ...classData, schedule: e.target.value })}
                  className="mt-1 block w-full border rounded-md px-3 py-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Room</label>
                <input
                  type="text"
                  value={classData.room}
                  onChange={(e) => setClassData({ ...classData, room: e.target.value })}
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
            <CardDescription>Manage roster, grades, and student engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="roster">
              <TabsList className="mb-4">
                <TabsTrigger value="roster" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Class Roster</TabsTrigger>
                <TabsTrigger value="grades"className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Edit Grades</TabsTrigger>
                <TabsTrigger value="engagement"className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Engagement Metrics</TabsTrigger>
                <TabsTrigger value="reports"className="text-white data-[state=active]:bg-white data-[state=active]:text-black">Reports</TabsTrigger>
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
                    <Button size="sm">
                      <UserPlus className="h-4 w-4 mr-1" />
                      Add Student
                    </Button>
                  </div>
                </div>
                <StudentTable searchQuery={searchQuery} classId={id} className="w-full" />
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
                <GradeEditTable 
                  classId={id}
                  className="w-full" />
              </TabsContent>

              <TabsContent value="engagement">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex gap-2 items-center">
                    <select className="border rounded-md px-3 py-2">
                      <option>Last 5 Weeks</option>
                      <option>Last 10 Weeks</option>
                      <option>Entire Semester</option>
                    </select>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-1" />
                    Export Report
                  </Button>
                </div>
                <EngagementMetrics />
              </TabsContent>

              <TabsContent value="reports">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <ReportsTab classId={id}/>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
    </Layout>
  )
}

export default ClassDetailPage