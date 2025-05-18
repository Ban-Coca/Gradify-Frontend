import { useNavigate } from "react-router-dom"
import Layout from "@/components/layout"
import { BarChartComponent } from "@/components/charts/bar-chart"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BookOpen,
  Upload,
  Users,
  LineChart,
  Star,
  ClipboardList,
  Database,
  ArrowRight,
  FileSpreadsheet,
  AlertTriangle,
  CheckCircle,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useEffect, useState } from "react"
import { getClassByTeacherId } from "@/services/teacher/classServices"
import ClassesList from "@/components/classes-list"
import Pagination from "@/components/ui/pagination";
import { GradeDistributionChart } from "@/components/charts/grade-distribution"
import { ClassPerformanceChart } from "@/components/charts/class-performance-chart"
import { useAuth } from "@/contexts/authentication-context"
const TeacherDashboard = () => {
  const [selectedClass, setSelectedClass] = useState("math101")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const navigate = useNavigate();
  const [classes, setClasses] = useState([]); // State for classes
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const classesPerPage = 6; // Max cards per page
  const { currentUser, getAuthHeader } = useAuth();
  // Sample data for charts
  const performanceData = {
    labels: ["Math 101", "Science 202", "History 303", "English 404"],
    datasets: [
      {
        label: "Class Average (%)",
        data: [78, 82, 75, 88],
        backgroundColor: "rgba(59, 130, 246, 0.5)",
      },
    ],
  }
  // Calculate the classes to display for the current page
  const indexOfLastClass = currentPage * classesPerPage;
  const indexOfFirstClass = indexOfLastClass - classesPerPage;
  const currentClasses = classes.slice(indexOfFirstClass, indexOfLastClass);

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
      const fetchClasses = async () => {
        try {
          const response = await getClassByTeacherId(currentUser.userId, getAuthHeader());
          console.log("Full API Response:", response);
    
          let allClasses = [];
          if (Array.isArray(response)) {
            allClasses = response;
          } else if (response && response.data && Array.isArray(response.data)) {
            allClasses = response.data;
          } else {
            console.error("Unexpected API response:", response);
            setClasses([]);
            return;
          }
          setClasses(allClasses);
        } catch (err) {
          console.error("Error fetching classes:", err);
          setError("Failed to fetch classes. Please try again later.");
        }
      };
    
      fetchClasses();
  }, []);
 
  // Sample recent uploads
  const recentUploads = [
    { id: 1, filename: "math101_midterm.csv", date: "Oct 15, 2023", status: "Success", records: 28 },
    { id: 2, filename: "science202_quiz3.xlsx", date: "Oct 10, 2023", status: "Success", records: 24 },
  ]

  const navigateToClass = (classId) => {
    navigate(`/teacher/classes/classdetail/${classId}`)
  }

  return (
    <Layout>
      {/* Welcome Banner */}
      <div className="mt-5 mb-6 bg-gradient-to-r from-primary to-green-400 text-white font-bold text-2xl md:text-4xl p-6 rounded-lg shadow-md items-center">
          <div>
            <h1>Welcome back, Teacher!</h1>
            <p className="text-sm md:text-base font-normal mt-2">
                Here's an overview of your classes and student performance
            </p>
          </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Total Students</p>
              <h3 className="text-2xl font-bold">128</h3>
              <p className="text-xs text-muted-foreground">Across all classes</p>
            </div>
            <div className="p-2 bg-blue-100 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Students at Risk</p>
              <h3 className="text-2xl font-bold">4</h3>
              <p className="text-xs text-muted-foreground">8% of class</p>
            </div>
            <div className="p-2 bg-red-100 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Top Performers</p>
              <h3 className="text-2xl font-bold">12</h3>
              <p className="text-xs text-muted-foreground">24% of class</p>
            </div>
            <div className="p-2 bg-green-100 rounded-full">
              <Star className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card> 
        <Card>
          <CardContent className="p-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">Missing Assignments</p>
              <h3 className="text-2xl font-bold">15</h3>
              <p className="text-xs text-muted-foreground">Across all students</p>
            </div>
            <div className="p-2 bg-amber-100 rounded-full">
              <ClipboardList className="h-6 w-6 text-amber-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Class Overview - Takes 2/3 of the width on large screens */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Your Classes</CardTitle>
                  <CardDescription>Quick overview of your active classes</CardDescription>
                </div>
                <Button onClick={() => navigate("/teacher/classes/all")}>
                  View All Classes
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <ClassesList classes={currentClasses} view={"grid"} navigateToClass={navigateToClass} />
            </CardContent>
            <CardFooter className="flex justify-center items-center">
              <Pagination
                currentPage={currentPage}
                totalPages={Math.ceil(classes.length / classesPerPage)}
                onPageChange={handlePageChange}
              />
            </CardFooter>
          </Card>

          <div className="grid gap-4 md:grid-cols-2">
            <Card className="col-span-1">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class Performance</CardTitle>
                  <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select period" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="current">Current Term</SelectItem>
                      <SelectItem value="previous">Previous Term</SelectItem>
                      <SelectItem value="year">Full Year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent>
                <ClassPerformanceChart />
              </CardContent>
            </Card>

            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>Distribution of grades across the class</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeDistributionChart />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Right Sidebar - Takes 1/3 of the width on large screens */}
        <div className="space-y-6">
          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button className="w-full justify-start" onClick={() => router.push("/upload")}>
                <Upload className="mr-2 h-4 w-4" />
                Upload Spreadsheet
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/classes/new")}>
                <BookOpen className="mr-2 h-4 w-4" />
                Create New Class
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/reports")}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                Generate Reports
              </Button>
              <Button className="w-full justify-start" variant="outline" onClick={() => router.push("/integrations")}>
                <Database className="mr-2 h-4 w-4" />
                Manage Integrations
              </Button>
            </CardContent>
          </Card>

          {/* Recent Uploads */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Uploads</CardTitle>
              <CardDescription>Your recently uploaded spreadsheets</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentUploads.map((upload) => (
                  <div key={upload.id} className="flex items-start space-x-3 pb-3 border-b last:border-0 last:pb-0">
                    <div className="p-2 bg-blue-100 rounded-md">
                      <FileSpreadsheet className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{upload.filename}</p>
                      <div className="flex justify-between text-sm text-gray-500">
                        <span>{upload.date}</span>
                        <span>{upload.records} records</span>
                      </div>
                    </div>
                    <div>
                      {upload.status === "Success" ? (
                        <Badge variant="success" className="flex items-center">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          Success
                        </Badge>
                      ) : (
                        <Badge variant="destructive" className="flex items-center">
                          <AlertTriangle className="mr-1 h-3 w-3" />
                          Error
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={() => router.push("/uploads")}>
                View All Uploads
              </Button>
            </CardFooter>
          </Card>

          {/* System Alerts */}
          <Card>
            <CardHeader className="bg-amber-50 rounded-t-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
                <CardTitle>Alerts</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="space-y-4">
                <div className="p-3 bg-red-50 border border-red-100 rounded-md">
                  <p className="font-medium text-red-800">Math 101: 2 students at risk</p>
                  <p className="text-sm text-red-600 mt-1">Students with grades below 60%</p>
                </div>
                <div className="p-3 bg-amber-50 border border-amber-100 rounded-md">
                  <p className="font-medium text-amber-800">History 303: Grades need review</p>
                  <p className="text-sm text-amber-600 mt-1">Last updated more than 7 days ago</p>
                </div>
                <div className="p-3 bg-blue-50 border border-blue-100 rounded-md">
                  <p className="font-medium text-blue-800">Feedback reports due</p>
                  <p className="text-sm text-blue-600 mt-1">End of month reports need to be generated</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  )
}

export default TeacherDashboard
