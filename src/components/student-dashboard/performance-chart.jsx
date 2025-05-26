import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getStudentClasses, getCalculatedGrade } from "@/services/student/studentService"
import { useAuth } from "@/contexts/authentication-context"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell, PieChart, Pie, LineChart, Line } from "recharts"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { BookOpen, TrendingUp, BarChart3, PieChartIcon, Target, Award, AlertTriangle, RefreshCw, Download, Filter } from 'lucide-react'

function getCurrentSemesterAndSchoolYear() {
  const today = new Date()
  const month = today.getMonth() // 0 = Jan, 7 = Aug
  const year = today.getFullYear()

  let semester, schoolYear
  if (month >= 0 && month < 7) {
    // January (0) to July (6): 2nd Semester
    semester = "2nd"
    schoolYear = `${year - 1}-${year}`
  } else {
    // August (7) to December (11): 1st Semester
    semester = "1st"
    schoolYear = `${year}-${year + 1}`
  }
  return { semester, schoolYear }
}

export function PerformanceChart() {
  const { currentUser, getAuthHeader } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [chartType, setChartType] = useState("bar") // bar, pie, line
  const [sortBy, setSortBy] = useState("grade") // grade, name, recent
  const [filterSemester, setFilterSemester] = useState("current")

  useEffect(() => {
    fetchCoursesWithGrades()
  }, [currentUser, getAuthHeader, filterSemester])

  async function fetchCoursesWithGrades() {
    if (!currentUser?.userId) return
    setLoading(true)
    setError(null)
    try {
      const header = getAuthHeader ? getAuthHeader() : {}
      const classes = await getStudentClasses(currentUser.userId, header)

      // Dynamically get current semester and school year
      const { semester: currentSemester, schoolYear: currentSchoolYear } = getCurrentSemesterAndSchoolYear()

      // Filter based on semester selection
      let filtered = classes
      if (filterSemester === "current") {
        filtered = classes.filter(
          cls =>
            (cls.school_year === currentSchoolYear || cls.schoolYear === currentSchoolYear) &&
            (cls.semester === currentSemester || cls.semester === `${currentSemester} Semester`)
        )
      }

      // Sort by created_at descending (most recent first)
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))

      const grades = await Promise.all(
        filtered.map(async (cls) => {
          let grade = null
          try {
            grade = await getCalculatedGrade(currentUser.userId, cls.classId, header)
            if (typeof grade === "number" && !isNaN(grade)) {
              grade = Number.parseFloat((grade > 100 ? grade / 100 : grade).toFixed(1))
            } else {
              grade = null
            }
          } catch (err) {
            console.error(`Error fetching grade for class ${cls.classId}:`, err)
            grade = null
          }
          return { 
            ...cls, 
            grade,
            displayGrade: grade || 0,
            hasGrade: grade !== null
          }
        })
      )

      setCourses(grades)
    } catch (error) {
      console.error("Error fetching courses:", error)
      setError(error.message)
      setCourses([])
    } finally {
      setLoading(false)
    }
  }

  // Sort courses
  const sortedCourses = [...courses].sort((a, b) => {
    switch (sortBy) {
      case "grade":
        return (b.displayGrade || 0) - (a.displayGrade || 0)
      case "name":
        return a.className.localeCompare(b.className)
      case "recent":
        return new Date(b.created_at) - new Date(a.created_at)
      default:
        return 0
    }
  })

  // Calculate statistics
  const coursesWithGrades = courses.filter(c => c.hasGrade)
  const averageGrade = coursesWithGrades.length > 0 
    ? coursesWithGrades.reduce((sum, c) => sum + c.grade, 0) / coursesWithGrades.length 
    : 0
  const highestGrade = coursesWithGrades.length > 0 ? Math.max(...coursesWithGrades.map(c => c.grade)) : 0
  const lowestGrade = coursesWithGrades.length > 0 ? Math.min(...coursesWithGrades.map(c => c.grade)) : 0

  const getGradeColor = (grade) => {
    if (!grade) return "#94a3b8" // gray for no grade
    if (grade >= 90) return "#10b981" // green
    if (grade >= 80) return "#3b82f6" // blue
    if (grade >= 70) return "#f59e0b" // yellow
    if (grade >= 60) return "#f97316" // orange
    return "#ef4444" // red
  }

  const getGradeCategory = (grade) => {
    if (!grade) return "No Grade"
    if (grade >= 90) return "A (90-100%)"
    if (grade >= 80) return "B (80-89%)"
    if (grade >= 70) return "C (70-79%)"
    if (grade >= 60) return "D (60-69%)"
    return "F (Below 60%)"
  }

  // Prepare data for pie chart
  const gradeDistribution = [
    { name: "A (90-100%)", value: coursesWithGrades.filter(c => c.grade >= 90).length, color: "#10b981" },
    { name: "B (80-89%)", value: coursesWithGrades.filter(c => c.grade >= 80 && c.grade < 90).length, color: "#3b82f6" },
    { name: "C (70-79%)", value: coursesWithGrades.filter(c => c.grade >= 70 && c.grade < 80).length, color: "#f59e0b" },
    { name: "D (60-69%)", value: coursesWithGrades.filter(c => c.grade >= 60 && c.grade < 70).length, color: "#f97316" },
    { name: "F (Below 60%)", value: coursesWithGrades.filter(c => c.grade < 60).length, color: "#ef4444" },
  ].filter(item => item.value > 0)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload
      return (
        <div className="bg-white p-3 border rounded-lg shadow-lg">
          <p className="font-medium">{label}</p>
          <p className="text-sm text-muted-foreground">
            Grade: {data.hasGrade ? `${data.grade}%` : "No grade yet"}
          </p>
          {data.section && <p className="text-xs text-muted-foreground">Section: {data.section}</p>}
        </div>
      )
    }
    return null
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Courses & Grades
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Alert variant="destructive" className="max-w-md">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Error loading courses: {error}
              <Button variant="outline" size="sm" onClick={fetchCoursesWithGrades} className="mt-2 w-full">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Courses & Grades
              {!loading && (
                <Badge variant="secondary" className="ml-2">
                  {courses.length} courses
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Your performance across all enrolled courses</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={fetchCoursesWithGrades} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap items-center gap-2 mt-4">
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">
                <div className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Bar Chart
                </div>
              </SelectItem>
              <SelectItem value="pie">
                <div className="flex items-center gap-2">
                  <PieChartIcon className="h-4 w-4" />
                  Pie Chart
                </div>
              </SelectItem>
              <SelectItem value="line">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Line Chart
                </div>
              </SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="grade">By Grade</SelectItem>
              <SelectItem value="name">By Name</SelectItem>
              <SelectItem value="recent">By Recent</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterSemester} onValueChange={setFilterSemester}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="current">Current Semester</SelectItem>
              <SelectItem value="all">All Semesters</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Quick Stats */}
        {!loading && coursesWithGrades.length > 0 && (
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-sm font-medium text-blue-600">Average</div>
              <div className="text-xl font-bold text-blue-700">{averageGrade.toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-sm font-medium text-green-600">Highest</div>
              <div className="text-xl font-bold text-green-700">{highestGrade.toFixed(1)}%</div>
            </div>
            <div className="text-center p-3 bg-orange-50 rounded-lg">
              <div className="text-sm font-medium text-orange-600">Lowest</div>
              <div className="text-xl font-bold text-orange-700">{lowestGrade.toFixed(1)}%</div>
            </div>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-[250px] w-full" />
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-[300px] text-center">
            <BookOpen className="w-16 h-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Classes Enrolled</h3>
            <p className="text-muted-foreground max-w-md">
              You don't have any classes for the selected semester. Contact your academic advisor to enroll in courses.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Chart */}
            <div style={{ width: "100%", height: 300 }}>
              <ResponsiveContainer>
                {chartType === "bar" ? (
                  <BarChart data={sortedCourses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="className" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="displayGrade" radius={[4, 4, 0, 0]}>
                      {sortedCourses.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={getGradeColor(entry.grade)} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : chartType === "pie" ? (
                  <PieChart>
                    <Pie
                      data={gradeDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value, percent }) => `${name}: ${value} (${(percent * 100).toFixed(0)}%)`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gradeDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                ) : (
                  <LineChart data={sortedCourses}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="className" 
                      angle={-45}
                      textAnchor="end"
                      height={80}
                      fontSize={12}
                    />
                    <YAxis domain={[0, 100]} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line 
                      type="monotone" 
                      dataKey="displayGrade" 
                      stroke="#3b82f6" 
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
