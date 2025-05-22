import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Download, Search, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { GPASection } from "./gpa-section"
import { Badge } from "../../components/ui/badge"
import Pagination from "@/components/ui/pagination"
import { useAuth } from "@/contexts/authentication-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { getClassGradesByStudent, getCalculatedGrade, getStudentClasses, getStudentCourseTableData, getSchemesByClass, getTeacherByClass } from "@/services/student/studentService"
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
  const [allGrades, setAllGrades] = useState([]);
  const [allGradesLoading, setAllGradesLoading] = useState(true);
  const [page, setPage] = useState(1);

  const COURSES_PER_PAGE = 6;
  const filteredClasses = classes.filter((cls) =>
    cls.className.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const totalPages = Math.ceil(filteredClasses.length / COURSES_PER_PAGE);
  const paginatedClasses = filteredClasses.slice(
    (page - 1) * COURSES_PER_PAGE,
    page * COURSES_PER_PAGE
  );

  // Reset to first page if classes change and current page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

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
            schoolYear: cls.schoolYear,
            lastUpdated: cls.updatedAt ? new Date(cls.updatedAt).toLocaleDateString() : "",
          }))
        );
        console.log("Classes data:", data);
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

  // Fetch all grades in each class of the student
  useEffect(() => {
    async function fetchAllGrades() {
      if (!studentId) return;
      setAllGradesLoading(true);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getClassGradesByStudent(studentId, header);
        const gradesArray = data && typeof data === "object"
          ? Object.entries(data).map(([classId, grade]) => ({ classId, grade }))
          : Array.isArray(data)
            ? data
            : [];

        const gradesAsPercent = gradesArray.map(g => ({
          ...g,
          grade: parseFloat(
              (g.grade > 100 ? Number(g.grade) / 100 : Number(g.grade)).toFixed(1)
            )
        }));
        console.log("All grades data:", gradesAsPercent);
        setAllGrades(gradesAsPercent);
      } catch {
        setAllGrades([]);
      } finally {
        setAllGradesLoading(false);
      }
    }
    fetchAllGrades();
  }, [studentId, getAuthHeader]);

  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semesters" },
  ]

  const gradeRanges = ["90-100%", "80-89%", "70-79%", "60-69%", "Below 60%"];
  const gradeCounts = gradeRanges.map(
    (range) =>
      allGrades.filter((g) => getGradeRange(Number(g.grade)) === range).length
  );
  const totalGrades = allGrades.length;

  function getGradeRange(grade) {
    if (grade >= 90) return "90-100%";
    if (grade >= 80) return "80-89%";
    if (grade >= 70) return "70-79%";
    if (grade >= 60) return "60-69%";
    return "Below 60%";
  }

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
                      className="group cursor-pointer transition-colors hover:bg-gray-50"
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium transition-colors">
                              {cls.className} - {cls.section} - {cls.room || "No Room"}
                            </h3>
                            <p className="text-sm text-muted-foreground transition-colors">
                              {cls.schedule || "No Schedule"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm" className="transition-colors">
                            View Grades
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <GPASection />

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overview of your grades by percentage range</CardDescription>
                </CardHeader>
                <CardContent>
                  {allGradesLoading ? (
                    <div>Loading grade distribution...</div>
                  ) : (
                    <div className="space-y-6">
                      <div className="grid grid-cols-5 gap-4">
                        {gradeRanges.map((range, index) => {
                          const count = gradeCounts[index];
                          const percentage = totalGrades ? Math.round((count / totalGrades) * 100) : 0;
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
                          );
                        })}
                      </div>
                      <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
                        {gradeRanges.map((range, index) => {
                          const count = gradeCounts[index];
                          const percentage = totalGrades ? (count / totalGrades) * 100 : 0;
                          const colors = [
                            "hsl(var(--success))",
                            "hsl(var(--primary))",
                            "hsl(var(--secondary))",
                            "hsl(var(--warning))",
                            "hsl(var(--destructive))",
                          ];
                          return percentage > 0 ? (
                            <div
                              key={range}
                              className="h-full flex items-center justify-center text-xs font-medium text-white"
                              style={{
                                width: `${percentage}%`,
                                backgroundColor: colors[index],
                              }}
                            >
                              {percentage > 10 ? `${range}: ${Math.round(percentage)}%` : ""}
                            </div>
                          ) : null;
                        })}
                      </div>
                    </div>
                  )}
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
                <div className="flex flex-col gap-2">
                  <span>
                    {(classes.find(cls => cls.id === selectedClass)?.className) || "N/A"} - {(classes.find(cls => cls.id === selectedClass)?.section) || "No Section"} - {(classes.find(cls => cls.id === selectedClass)?.room) || "No Room"}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {(classes.find(cls => cls.id === selectedClass)?.schedule) || "No Schedule"} - {classes.find(cls => cls.id === selectedClass)?.schoolYear || "No School Year"}
                  </span>
                </div>
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
                <div className="grid grid-cols-1 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Grades Table</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="overflow-x-auto">
                        <table className="min-w-full border text-sm">
                          <thead>
                            <tr className="bg-muted">
                              <th className="px-4 py-2 border-b text-left text-white">Component</th>
                              <th className="px-4 py-2 border-b text-left text-white">Grade</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(tableData).map(([key, value]) => (
                              <tr key={key}>
                                <td className="px-4 py-2 border-b font-medium">{key}</td>
                                <td className="px-4 py-2 border-b">{value || "N/A"}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </CardContent>
                  </Card>
                  {/* Grade Scheme Card */}
                  <Card className="col-span-1 md:col-span-2 bg-gray-50">
                    <CardHeader>
                      <CardTitle>Class Grading System</CardTitle>
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