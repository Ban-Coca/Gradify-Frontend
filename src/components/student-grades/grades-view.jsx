import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Download, Search, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { GPASection } from "./gpa-section"
import { Badge } from "../../components/ui/badge"
import { useAuth } from "@/contexts/authentication-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { getCalculatedGrade, getStudentClasses, getStudentCourseTableData, getSchemesByClass, getTeacherByClass } from "@/services/student/studentService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export function GradesView() {
  const [selectedClass, setSelectedClass] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [schemeLoading, setSchemeLoading] = useState(true)
  const [teacherLoading, setTeacherLoading] = useState(true)
  const { currentUser, getAuthHeader } = useAuth()
  const studentId = currentUser?.userId;
  const [error, setError] = useState(null)
  const [tableData, setTableData] = useState({})
  const [gradesLoading, setGradesLoading] = useState(false)
  const [gradesError, setGradesError] = useState(null)
  const [scheme, setScheme] = useState([])
  const [teacher, setTeacher] = useState(null)
  const [calculatedGrade, setCalculatedGrade] = useState(null);

  // Fetch classes
  useEffect(() => {
    async function loadClasses() {
      setLoading(true);
      setError(null);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getStudentClasses(studentId, header);
        setClasses(
          data.map((cls) => ({
            id: cls.classId,
            className: cls.className,
            section: cls.section,
            room: cls.room,
            schedule: cls.schedule,
            lastUpdated: cls.updatedAt ? new Date(cls.updatedAt).toLocaleDateString() : "",
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (studentId) loadClasses();
  }, [studentId, getAuthHeader]);

  // Fetch table data (grades) when a class is selected
  useEffect(() => {
    async function loadTableData() {
      if (!selectedClass) return;
      setGradesLoading(true);
      setGradesError(null);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getStudentCourseTableData(studentId, selectedClass, header);
        setTableData(data && typeof data === "object" ? data : {});
      } catch (err) {
        setTableData({});
        setGradesError(err.message);
      } finally {
        setGradesLoading(false);
      }
    }
    if (selectedClass) loadTableData();
  }, [selectedClass, studentId, getAuthHeader]);

  // Fetch teacher info
  useEffect(() => {
    async function fetchTeacher() {
      if (!selectedClass) return;
      setTeacherLoading(true)
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getTeacherByClass(selectedClass, header)
        console.log("Teacher data:", data)
        setTeacher(data)
      } catch {
        setTeacher(null)
      } finally {
        setTeacherLoading(false)
      }
    }
    if (selectedClass) fetchTeacher();
  }, [selectedClass, getAuthHeader]);

  // Fetch grading scheme
  useEffect(() => {
    async function fetchScheme() {
      if (!selectedClass) return;
      setSchemeLoading(true)
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getSchemesByClass(selectedClass, header)
        console.log("Scheme data:", data)
        setScheme(Array.isArray(data) ? data : [])
      } catch {
        setScheme([])
      } finally {
        setSchemeLoading(false)
      }
    }
    if (selectedClass) fetchScheme();
  }, [selectedClass, getAuthHeader]);

  // Fetch calculated grade
  useEffect(() => {
    async function fetchCalculatedGrade() {
      if (!selectedClass) return;
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        let grade = await getCalculatedGrade(studentId, selectedClass, header);
        // Apply your condition and formatting
        grade = parseFloat(
          (grade > 100 ? grade / 100 : grade).toFixed(1)
        );
        setCalculatedGrade(grade);
        console.log("Calculated grade:", grade);
      } catch {
        setCalculatedGrade(null);
      }
    }
    if (selectedClass) fetchCalculatedGrade();
  }, [selectedClass, studentId, getAuthHeader]);

  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semesters" },
  ]

  return (
    <div className="space-y-4 mb-6">
      <Card>
        <CardHeader>
          <CardTitle>Your Classes</CardTitle>
          <CardDescription>
            View your enrolled classes and check your grades for each class.
          </CardDescription>
        </CardHeader>
      </Card>
      {!selectedClass ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search classes..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Tabs defaultValue="classes" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger 
                className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
                value="classes" 
              >
                Classes
              </TabsTrigger>
              <TabsTrigger 
                value="summary"
                className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
              >
                Grade Summary
              </TabsTrigger>
            </TabsList>

            <TabsContent value="classes" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {classes
                  .filter((cls) => cls.className.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((cls) => (
                    <Card
                      key={cls.id}
                      className="group cursor-pointer transition-colors hover:bg-[#198754]/10"
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium group-hover:text-[#198754] transition-colors">
                              {cls.className} - {cls.section} - {cls.room || "No Room"}
                            </h3>
                            <p className="text-sm text-muted-foreground group-hover:text-[#198754] transition-colors">
                              {cls.schedule || "No Schedule"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="group-hover:text-[#198754] transition-colors">
                            View Grades
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <GPASection />

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overview of your grades by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-4">
                      {["4.5-5.0", "4.0-4.4", "3.5-3.9", "3.0-3.4", "1.0-2.9"].map((range, index) => {
                        const count = [5, 8, 6, 3, 1][index]
                        const total = 23
                        const percentage = Math.round((count / total) * 100)

                        return (
                          <Card key={range} className="text-center">
                            <CardContent className="p-4">
                              <Badge
                                variant={
                                  index === 0
                                    ? "success"
                                    : index === 1
                                      ? "default"
                                      : index === 2
                                        ? "secondary"
                                        : index === 3
                                          ? "warning"
                                          : "destructive"
                                }
                                className="mb-2"
                              >
                                {range}
                              </Badge>
                              <div className="text-2xl font-bold">{count}</div>
                              <div className="text-xs text-muted-foreground">{percentage}%</div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
                      {[
                        { range: "4.5-5.0", count: 5, color: "hsl(var(--success))" },
                        { range: "4.0-4.4", count: 8, color: "hsl(var(--primary))" },
                        { range: "3.5-3.9", count: 6, color: "hsl(var(--secondary))" },
                        { range: "3.0-3.4", count: 3, color: "hsl(var(--warning))" },
                        { range: "1.0-2.9", count: 1, color: "hsl(var(--destructive))" },
                      ].map((item) => {
                        const total = 23
                        const percentage = (item.count / total) * 100

                        return percentage > 0 ? (
                          <div
                            key={item.range}
                            className="h-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          >
                            {percentage > 10 ? `${item.range}: ${Math.round(percentage)}%` : ""}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
         <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedClass(null)} className="mb-4">
              ← Back to All Classes
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Class Grades
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Print class grades</span>
              </Button>
            </div>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>
                  {(classes.find(cls => cls.id === selectedClass)?.className) || "Class"}
                </span>
                <span className="text-base font-normal text-muted-foreground ml-4">
                  Final Grade: <span className="font-semibold text-black">
                    {calculatedGrade !== null ? calculatedGrade : "N/A"}%
                  </span>
                </span>
              </CardTitle>
              <CardDescription>
                Instructor:{" "}
                {teacherLoading
                  ? "Loading..."
                  : teacher
                  ? teacher
                  : "N/A"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {gradesLoading ? (
                <div>Loading grades...</div>
              ) : Object.keys(tableData).length === 0 ? (
                <div>No grade data found for this class.</div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Midterm Card */}
                  <Card className="bg-blue-50">
                    <CardHeader>
                      <CardTitle>Midterm Grades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="font-semibold">Q1:</span>{" "}
                        {tableData["Q1"] || "N/A"}
                      </div>
                      <div className="mb-2">
                        <span className="font-semibold">Q2:</span>{" "}
                        {tableData["Q2"] || "N/A"}
                      </div>
                      <div>
                        <span className="font-semibold">Midterm Exam (ME):</span>{" "}
                        {tableData["ME"] || "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Finals Card */}
                  <Card className="bg-green-50">
                    <CardHeader>
                      <CardTitle>Final Grades</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="mb-2">
                        <span className="font-semibold">Final Exam (FE):</span>{" "}
                        {tableData["FE"] || "N/A"}
                      </div>
                    </CardContent>
                  </Card>
                  {/* Grade Scheme Card */}
                  <Card className="col-span-1 md:col-span-2 bg-gray-50">
                    <CardHeader>
                      <CardTitle>Grade Scheme</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {schemeLoading ? (
                        <div>Loading scheme...</div>
                      ) : scheme && Array.isArray(scheme) && scheme.length > 0 ? (
                        <div className="flex flex-row gap-4">
                          {scheme.map((item, idx) => (
                            <Card key={item.id || idx} className="flex-1 min-w-[150px] bg-white border border-gray-200 shadow-sm">
                              <CardContent className="p-4 text-center">
                                <div className="font-semibold text-lg">{item.name}</div>
                                <div className="text-2xl font-bold mt-2">{item.weight ? `${item.weight}%` : "N/A"}</div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      ) : (
                        <div>No grading scheme found for this class.</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}