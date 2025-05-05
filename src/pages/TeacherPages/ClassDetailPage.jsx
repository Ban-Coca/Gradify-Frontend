import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Layout from "@/components/layout";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Upload, Edit, Users, FileText, BarChart, Search, UserPlus, Filter, Activity } from "lucide-react";
import { StudentTable } from "@/components/student-table";
import { GradeEditTable } from "@/components/grade-edit-table";
import { EngagementMetrics } from "@/components/engagement-metrics";
import { getClassById, updateClassById } from "@/services/teacher/classServices";
import { useAuth } from "@/contexts/authentication-context";
import GradingSchemeModal from "@/components/grading-schemes";
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

  useEffect(() => {
    const fetchClassDetails = async () => {
      try {
        const response = await getClassById(id, getAuthHeader());
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
          <Button variant="ghost" size="sm" onClick={() => navigate("/classes")}>
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
            <div className="flex gap-2">
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
            </div>
          </div>

          {/* Class Stats */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Students</p>
              <p className="font-bold text-lg">{classData.students}</p>
            </div>
            <div className="bg-gray-50 p-3 rounded-md text-center">
              <p className="text-sm text-gray-500">Avg. Grade</p>
              <p className="font-bold text-lg">{classData.avgGrade}</p>
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
        {isModalOpen && (
          <div
            className="mt-15 h-vh fixed inset-0 backdrop-blur-sm bg-opacity-50 flex justify-end z-1"
            onClick={(e) => {
              // Close the modal if the user clicks outside the modal content
              if (e.target === e.currentTarget) {
                toggleModal();
              }
            }}
          >
            <div className="bg-white w-1/3 h-full shadow-lg p-6 overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">Edit Class</h2>
                <Button variant="ghost" onClick={toggleModal}>
                  Close
                </Button>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleUpdateClass();
                }}
                className="space-y-4"
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
                <Button type="submit" className="w-full mt-4">
                  Save Changes
                </Button>
              </form>
            </div>
          </div>
        )}

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
                <StudentTable searchQuery={searchQuery} className="w-full" />
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
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Performance Reports</CardTitle>
                      <CardDescription>Generate student performance reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-blue-600 mr-3" />
                            <div>
                              <p className="font-medium">Individual Student Reports</p>
                              <p className="text-sm text-gray-500">Generate reports for each student</p>
                            </div>
                          </div>
                          <Button size="sm">Generate</Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <BarChart className="h-5 w-5 text-green-600 mr-3" />
                            <div>
                              <p className="font-medium">Class Summary Report</p>
                              <p className="text-sm text-gray-500">Overall class performance</p>
                            </div>
                          </div>
                          <Button size="sm">Generate</Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <Users className="h-5 w-5 text-purple-600 mr-3" />
                            <div>
                              <p className="font-medium">At-Risk Students Report</p>
                              <p className="text-sm text-gray-500">Identify students needing help</p>
                            </div>
                          </div>
                          <Button size="sm">Generate</Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Recent Reports</CardTitle>
                      <CardDescription>Previously generated reports</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="font-medium">Midterm Performance Report</p>
                              <p className="text-sm text-gray-500">Generated on Oct 15, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>

                        <div className="flex items-center justify-between p-3 border rounded-md">
                          <div className="flex items-center">
                            <FileText className="h-5 w-5 text-gray-500 mr-3" />
                            <div>
                              <p className="font-medium">Monthly Progress Report</p>
                              <p className="text-sm text-gray-500">Generated on Oct 1, 2023</p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm">
                            Download
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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