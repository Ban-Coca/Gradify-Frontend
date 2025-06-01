"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Download,
  Search,
  FileText,
  ChevronLeft,
  BookOpen,
  TrendingUp,
  Award,
  Calendar,
  User,
  Clock,
  Filter,
  X,
  BarChart3,
  PieChart,
  Loader2,
} from "lucide-react"
import { useEffect, useState } from "react"
import { GPASection } from "./gpa-section"
import { useLocation } from "react-router-dom"
import { Badge } from "@/components/ui/badge"
import Pagination from "@/components/ui/pagination"
import { useAuth } from "@/contexts/authentication-context"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  getClassGradesByStudent,
  getCalculatedGrade,
  getStudentClasses,
  getStudentCourseTableData,
  getSchemesByClass,
  getTeacherByClass,
} from "@/services/student/studentService"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function GradesView() {
  const [selectedClass, setSelectedClass] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [schemeLoading, setSchemeLoading] = useState(true)
  const [teacherLoading, setTeacherLoading] = useState(true)
  const { currentUser, getAuthHeader } = useAuth()
  const studentId = currentUser?.userId
  const [error, setError] = useState(null)
  const [tableData, setTableData] = useState({})
  const [grades, setGrades] = useState({})
  const [assessmentMaxValues, setAssessmentMaxValues] = useState({})
  const [gradesLoading, setGradesLoading] = useState(false)
  const [gradesError, setGradesError] = useState(null)
  const [scheme, setScheme] = useState([])
  const [teacher, setTeacher] = useState(null)
  const [calculatedGrade, setCalculatedGrade] = useState(null)
  const [allGrades, setAllGrades] = useState([])
  const [allGradesLoading, setAllGradesLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState("name")
  const [viewMode, setViewMode] = useState("grid")
  const location = useLocation()
  const selectedClassIdFromState = location.state?.selectedClassId

  const COURSES_PER_PAGE = 6

  // Enhanced filtering and sorting
  const filteredClasses = classes
    .filter(
      (cls) =>
        cls.className.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.section.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .sort((a, b) => {
      switch (sortBy) {
        case "name":
          return a.className.localeCompare(b.className)
        case "section":
          return a.section.localeCompare(b.section)
        case "updated":
          return new Date(b.lastUpdated) - new Date(a.lastUpdated)
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredClasses.length / COURSES_PER_PAGE)
  const paginatedClasses = filteredClasses.slice((page - 1) * COURSES_PER_PAGE, page * COURSES_PER_PAGE)

  // Reset to first page if classes change and current page is out of range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1)
  }, [totalPages, page])

  useEffect(() => {
    if (selectedClassIdFromState) {
      setSelectedClass(selectedClassIdFromState)
    }
  }, [selectedClassIdFromState])

  // Fetch classes
  useEffect(() => {
    async function loadClasses() {
      setLoading(true)
      setError(null)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getStudentClasses(studentId, header)
        setClasses(
          data.map((cls) => ({
            id: cls.classId,
            className: cls.className,
            section: cls.section,
            room: cls.room,
            schedule: cls.schedule,
            schoolYear: cls.schoolYear,
            lastUpdated: cls.updatedAt ? new Date(cls.updatedAt).toLocaleDateString() : "",
          })),
        )
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (studentId) loadClasses()
  }, [studentId, getAuthHeader])

  // Fetch table data (grades) when a class is selected
  useEffect(() => {
    async function loadTableData() {
      if (!selectedClass) return
      setGradesLoading(true)
      setGradesError(null)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getStudentCourseTableData(studentId, selectedClass, header)
        setGrades(data.grades)
        setAssessmentMaxValues(data.assessmentMaxValues)
      } catch (err) {
        setTableData({})
        setGradesError(err.message)
      } finally {
        setGradesLoading(false)
      }
    }
    if (selectedClass) loadTableData()
  }, [selectedClass, studentId, getAuthHeader])

  // Fetch teacher info
  useEffect(() => {
    async function fetchTeacher() {
      if (!selectedClass) return
      setTeacherLoading(true)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getTeacherByClass(selectedClass, header)
        setTeacher(data)
      } catch {
        setTeacher(null)
      } finally {
        setTeacherLoading(false)
      }
    }
    if (selectedClass) fetchTeacher()
  }, [selectedClass, getAuthHeader])

  // Fetch grading scheme
  useEffect(() => {
    async function fetchScheme() {
      if (!selectedClass) return
      setSchemeLoading(true)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getSchemesByClass(selectedClass, header)
        setScheme(Array.isArray(data) ? data : [])
      } catch {
        setScheme([])
      } finally {
        setSchemeLoading(false)
      }
    }
    if (selectedClass) fetchScheme()
  }, [selectedClass, getAuthHeader])

  // Fetch calculated grade
  useEffect(() => {
    async function fetchCalculatedGrade() {
      if (!selectedClass) return
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        let grade = await getCalculatedGrade(studentId, selectedClass, header)
        grade = Number.parseFloat((grade > 100 ? grade / 100 : grade).toFixed(1))
        setCalculatedGrade(grade)
      } catch {
        setCalculatedGrade(null)
      }
    }
    if (selectedClass) fetchCalculatedGrade()
  }, [selectedClass, studentId, getAuthHeader])

  // Fetch all grades in each class of the student
  useEffect(() => {
    async function fetchAllGrades() {
      if (!studentId) return
      setAllGradesLoading(true)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getClassGradesByStudent(studentId, header)
        const gradesArray =
          data && typeof data === "object"
            ? Object.entries(data).map(([classId, grade]) => ({ classId, grade }))
            : Array.isArray(data)
              ? data
              : []

        const gradesAsPercent = gradesArray.map((g) => ({
          ...g,
          grade: Number.parseFloat((g.grade > 100 ? Number(g.grade) / 100 : Number(g.grade)).toFixed(1)),
        }))
        setAllGrades(gradesAsPercent)
      } catch {
        setAllGrades([])
      } finally {
        setAllGradesLoading(false)
      }
    }
    fetchAllGrades()
  }, [studentId, getAuthHeader])

  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semesters" },
  ]

  const gradeRanges = ["90-100%", "80-89%", "70-79%", "60-69%", "Below 60%"]
  const gradeCounts = gradeRanges.map(
    (range) => allGrades.filter((g) => getGradeRange(Number(g.grade)) === range).length,
  )
  const totalGrades = allGrades.length

  function getGradeRange(grade) {
    if (grade >= 90) return "90-100%"
    if (grade >= 80) return "80-89%"
    if (grade >= 70) return "70-79%"
    if (grade >= 60) return "60-69%"
    return "Below 60%"
  }

  function getGradeColor(grade) {
    if (grade >= 90) return "text-green-600"
    if (grade >= 80) return "text-blue-600"
    if (grade >= 70) return "text-yellow-600"
    if (grade >= 60) return "text-orange-600"
    return "text-red-600"
  }

  function getGradeBadgeVariant(grade) {
    if (grade >= 90) return "default"
    if (grade >= 80) return "secondary"
    if (grade >= 70) return "outline"
    return "destructive"
  }

  const getTeacherInitials = (teacherName) => {
    if (!teacherName) return "T"
    const [first = "", last = ""] = teacherName.trim().split(" ")
    return `${first.charAt(0)}${last.charAt(0) || ""}`.toUpperCase()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedPeriod("current")
    setSortBy("name")
  }

  const activeFiltersCount =
    (searchQuery ? 1 : 0) + (selectedPeriod !== "current" ? 1 : 0) + (sortBy !== "name" ? 1 : 0)

  if (error) {
    return (
      <div className="space-y-4 mb-6 px-4 sm:px-6 lg:px-8">
        <Alert variant="destructive">
          <AlertDescription>Error loading classes: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-6 mb-6">
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
          {loading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="ml-2">Loading your classes...</span>
              </div>
            </div>
          ) : classes.length === 0 ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12">
                <BookOpen className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-xl font-medium mb-2">No Classes Found</h3>
                <p className="text-muted-foreground text-center max-w-md">
                  You are not currently enrolled in any classes. Contact your academic advisor for assistance.
                </p>
              </CardContent>
            </Card>
          ) : (
            <>
              {/* Search and Filters */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="relative flex-1 min-w-0">
                    <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Search classes..."
                      className="pl-8"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="flex items-center gap-2">
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

                {/* Active filters display */}
                {activeFiltersCount > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: {searchQuery}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSearchQuery("")}
                        />
                      </Badge>
                    )}
                    {selectedPeriod !== "current" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        {periods.find((p) => p.id === selectedPeriod)?.name}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSelectedPeriod("current")}
                        />
                      </Badge>
                    )}
                    {sortBy !== "name" && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Sort: {sortBy}
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => setSortBy("name")}
                        />
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <Tabs defaultValue="classes" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="classes" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                    <BookOpen className="h-4 w-4" />
                    Classes ({filteredClasses.length})
                  </TabsTrigger>
                  <TabsTrigger value="summary" className="text-white data-[state=active]:bg-white data-[state=active]:text-black">
                    <BarChart3 className="h-4 w-4" />
                    Grade Summary
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="classes" className="mt-6">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {paginatedClasses.map((cls) => {
                      const classGrade = allGrades.find((g) => String(g.classId) === String(cls.id));
                      return (
                        <Card
                          key={cls.id}
                          className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary/20 hover:border-l-primary"
                          onClick={() => setSelectedClass(cls.id)}
                        >
                          <CardContent className="p-6">
                            <div className="space-y-4">
                              <div className="flex items-start justify-between">
                                <div className="space-y-1 flex-1">
                                  <h3 className="font-semibold text-lg leading-tight group-hover:text-primary transition-colors">
                                    {cls.className}
                                  </h3>
                                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                    <Badge variant="outline">{cls.section}</Badge>
                                    {cls.room ? (
                                      <span>Room {cls.room}</span>
                                    ) : (
                                      <span>No room</span>
                                    )}
                                  </div>
                                </div>
                                {classGrade && (
                                  <Badge variant={getGradeBadgeVariant(classGrade.grade)} className="ml-2">
                                    {classGrade.grade}%
                                  </Badge>
                                )}
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {cls.schedule ? cls.schedule : "No schedule"}
                                </div>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Calendar className="h-4 w-4" />
                                  {cls.schoolYear ? cls.schoolYear : "No School Year"}
                                </div>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="w-full group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                              >
                                View Grades & Details
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      )
                    })}
                  </div>

                  {totalPages > 1 && (
                    <div className="mt-6">
                      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="summary" className="mt-6">
                  <div className="space-y-6">
                    <GPASection />

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <PieChart className="h-5 w-5" />
                          Grade Distribution
                        </CardTitle>
                        <CardDescription>Overview of your grades by percentage range</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {allGradesLoading ? (
                          <div className="space-y-4">
                            <Skeleton className="h-8 w-full" />
                            <div className="grid grid-cols-5 gap-4">
                              {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-20" />
                              ))}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                              {gradeRanges.map((range, index) => {
                                const count = gradeCounts[index]
                                const percentage = totalGrades ? Math.round((count / totalGrades) * 100) : 0
                                const colors = [
                                  "bg-green-500",
                                  "bg-blue-500",
                                  "bg-yellow-500",
                                  "bg-orange-500",
                                  "bg-red-500",
                                ]
                                return (
                                  <Card key={range} className="text-center">
                                    <CardContent className="p-4">
                                      <div
                                        className={`w-12 h-12 rounded-full ${colors[index]} mx-auto mb-3 flex items-center justify-center text-white font-bold`}
                                      >
                                        {count}
                                      </div>
                                      <div className="text-sm font-medium mb-1">{range}</div>
                                      <div className="text-xs text-muted-foreground">{percentage}% of total</div>
                                    </CardContent>
                                  </Card>
                                )
                              })}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </>
          )}
        </>
      ) : (
        <>
          {/* Class Detail View */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <Button variant="ghost" onClick={() => setSelectedClass(null)} className="self-start">
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to All Classes
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
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="space-y-2">
                  <CardTitle className="text-2xl">
                    {classes.find((cls) => cls.id === selectedClass)?.className || "N/A"}
                  </CardTitle>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline">
                      {classes.find((cls) => cls.id === selectedClass)?.section || "No Section"}
                    </Badge>
                    {classes.find((cls) => cls.id === selectedClass)?.room && (
                      <Badge variant="outline">Room {classes.find((cls) => cls.id === selectedClass)?.room}</Badge>
                    )}
                    <Badge variant="secondary">
                      {classes.find((cls) => cls.id === selectedClass)?.schoolYear || "No School Year"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {classes.find((cls) => cls.id === selectedClass)?.schedule || "No Schedule"}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Final Grade</p>
                    <p
                      className={`text-3xl font-bold ${calculatedGrade !== null ? getGradeColor(calculatedGrade) : ""}`}
                    >
                      {calculatedGrade !== null ? `${calculatedGrade}%` : "N/A"}
                    </p>
                  </div>
                  {calculatedGrade !== null && <Progress value={calculatedGrade} className="w-32" />}
                </div>
              </div>

              <CardDescription className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Instructor:{" "}
                {teacherLoading ? (
                  <Skeleton className="h-4 w-24" />
                ) : teacher ? (
                  <span className="font-medium">{teacher}</span>
                ) : (
                  "N/A"
                )}
              </CardDescription>
            </CardHeader>

            <CardContent>
              {gradesLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <div className="space-y-2">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                </div>
              ) : gradesError ? (
                <Alert variant="destructive">
                  <AlertDescription>Error loading grades: {gradesError}</AlertDescription>
                </Alert>
              ) : Object.keys(grades).length === 0 ? (
                <div className="text-center py-12">
                  <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">No Grade Data</h3>
                  <p className="text-muted-foreground">No grade information is available for this class yet.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Grades Table */}
                  <div className="lg:col-span-2">
                    <Card>
                      <CardHeader>
                        <CardTitle>Assessment Grades</CardTitle>
                        <CardDescription>Your performance on individual assessments</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b">
                                <th className="text-left py-3 px-4 font-medium">Assessment</th>
                                <th className="text-left py-3 px-4 font-medium">Score</th>
                                <th className="text-left py-3 px-4 font-medium">Percentage</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(grades)
                                .filter(
                                  ([key]) =>
                                    ![
                                      "firstName",
                                      "lastName",
                                      "studentNumber",
                                      "firstname",
                                      "lastname",
                                      "studentnumber",
                                    ].includes(key.replace(/\s+/g, "").toLowerCase()),
                                )
                                .map(([key, value]) => {
                                  const maxValue = assessmentMaxValues[key]
                                  const percentage = maxValue ? ((value / maxValue) * 100).toFixed(1) : null
                                  return (
                                    <tr key={key} className="border-b hover:bg-muted/50">
                                      <td className="py-3 px-4 font-medium">{key}</td>
                                      <td className="py-3 px-4">
                                        <span className="font-mono">
                                          {value || "N/A"} / {maxValue !== undefined ? maxValue : "N/A"}
                                        </span>
                                      </td>
                                      <td className="py-3 px-4">
                                        {percentage ? (
                                          <Badge variant={getGradeBadgeVariant(Number.parseFloat(percentage))}>
                                            {percentage}%
                                          </Badge>
                                        ) : (
                                          <span className="text-muted-foreground">N/A</span>
                                        )}
                                      </td>
                                    </tr>
                                  )
                                })}
                            </tbody>
                          </table>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Grading Scheme */}
                  <div>
                    <Card>
                      <CardHeader>
                        <CardTitle>Grading Breakdown</CardTitle>
                        <CardDescription>How your final grade is calculated</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {schemeLoading ? (
                          <div className="space-y-3">
                            {[...Array(4)].map((_, i) => (
                              <Skeleton key={i} className="h-16 w-full" />
                            ))}
                          </div>
                        ) : scheme && Array.isArray(scheme) && scheme.length > 0 ? (
                          <div className="space-y-3">
                            {scheme.map((item, idx) => (
                              <Card key={item.id || idx} className="border-l-4 border-l-primary/20">
                                <CardContent className="p-4">
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <h4 className="font-medium">{item.name}</h4>
                                      <p className="text-sm text-muted-foreground">Weight in final grade</p>
                                    </div>
                                    <div className="text-right">
                                      <p className="text-2xl font-bold text-primary">
                                        {item.weight ? `${item.weight}%` : "N/A"}
                                      </p>
                                    </div>
                                  </div>
                                  {item.weight && <Progress value={item.weight} className="mt-2" />}
                                </CardContent>
                              </Card>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-8">
                            <BarChart3 className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
                            <p className="text-muted-foreground">No grading scheme available</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  )
}