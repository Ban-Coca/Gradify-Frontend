import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Download, Search, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import { GPASection } from "./gpa-section"
import { Badge } from "../../components/ui/badge"
import { useAuth } from "@/contexts/authentication-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { getStudentClasses, getStudentCourseTableData } from "@/services/student/classStudentService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export function GradesView() {
  const [selectedClass, setSelectedClass] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const { currentUser, getAuthHeader } = useAuth()
  const studentId = currentUser?.userId;
  const [error, setError] = useState(null)
  const [tableData, setTableData] = useState([])
  const [gradesLoading, setGradesLoading] = useState(false)
  const [gradesError, setGradesError] = useState(null)

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
        console.log("Classes data:", data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (studentId) loadClasses();
  }, [studentId, getAuthHeader]);

  // Fetch table data when a class is selected
  useEffect(() => {
    async function loadTableData() {
      if (!selectedClass) return;
      setGradesLoading(true);
      setGradesError(null);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getStudentCourseTableData(studentId, selectedClass, header);
        setTableData(data && typeof data === "object" ? data : {}); // <-- store as object
        console.log("Table data:", data);
      } catch (err) {
        setTableData({});
        setGradesError(err.message);
      } finally {
        setGradesLoading(false);
      }
    }
    if (selectedClass) loadTableData();
  }, [selectedClass, studentId, getAuthHeader]);


  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semesters" },
  ]

  return (
    <div className="space-y-4">
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
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All Grades
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Print grades</span>
              </Button>
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
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedClass(cls.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">
                              {cls.className} - {cls.section} - {cls.room || "No Room"}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {cls.schedule || "No Schedule"}
                            </p>
                          </div>
                          <Button variant="ghost" size="sm">
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
          {/* Table Data */}
          <Card>
            <CardHeader>
              <CardTitle>Class Grade Table</CardTitle>
              <CardDescription>
                {gradesLoading
                  ? "Loading grades..."
                  : gradesError
                  ? `Error: ${gradesError}`
                  : tableData.length === 0
                  ? "No grade data found for this class."
                  : "Your grade details for this class:"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {!gradesLoading && !gradesError && Object.keys(tableData).length > 0 && (
                <table className="min-w-full text-sm">
                  <thead>
                    <tr>
                      <th className="text-left p-2">Student Number</th>
                      <th className="text-left p-2">Last Name</th>
                      <th className="text-left p-2">First Name</th>
                      <th className="text-left p-2">Q1</th>
                      <th className="text-left p-2">Q2</th>
                      <th className="text-left p-2">ME</th>
                      <th className="text-left p-2">FE</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="p-2">{tableData["Student Number"] || "N/A"}</td>
                      <td className="p-2">{tableData["Last Name"] || "N/A"}</td>
                      <td className="p-2">{tableData["First Name"] || "N/A"}</td>
                      <td className="p-2">{tableData["Q1"] || "N/A"}</td>
                      <td className="p-2">{tableData["Q2"] || "N/A"}</td>
                      <td className="p-2">{tableData["ME"] || "N/A"}</td>
                      <td className="p-2">{tableData["FE"] || "N/A"}</td>
                    </tr>
                  </tbody>
                </table>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}