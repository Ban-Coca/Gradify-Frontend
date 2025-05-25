import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authentication-context"
import { getStudentClasses, getTeacherByClass } from "@/services/student/studentService"
import { Button } from "@/components/ui/button"
import { ArrowRight, BookOpen, Clock, MapPin, Calendar, Users, Search, Grid, List, RefreshCw } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Pagination from "@/components/ui/pagination"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function ClassesList() {
  const { currentUser, getAuthHeader } = useAuth()
  const [classes, setClasses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [filterSemester, setFilterSemester] = useState("all")
  const [teachers, setTeachers] = useState({});
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState("grid") // grid, list
  const classesPerPage = 4
  const navigate = useNavigate()

  const studentId = currentUser?.userId

  useEffect(() => {
    loadClasses()
  }, [studentId, getAuthHeader])

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
          classCode: cls.classCode,
          semester: cls.semester,
          createdAt: cls.created_at,
        })),
      )
      // Fetch teachers for each class
      const teacherPromises = data.map(cls =>
        getTeacherByClass(cls.classId, header)
          .then(teacher => ({ classId: cls.classId, teacher }))
          .catch(() => ({ classId: cls.classId, teacher: null }))
      );
      const teacherResults = await Promise.all(teacherPromises);
      const teacherMap = {};
      teacherResults.forEach(({ classId, teacher }) => {
        teacherMap[classId] = teacher;
      });
      console.log("Teachers loaded:", teacherMap)
      setTeachers(teacherMap);
      console.log("Classes loaded:", data)
    } catch (err) {
      console.error("Error loading classes:", err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Filter and sort classes
  const filteredClasses = classes
    .filter((cls) => {
      const matchesSearch =
        cls.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.section?.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesSemester = filterSemester === "all" || cls.semester === filterSemester

      return matchesSearch && matchesSemester
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.createdAt) - new Date(a.createdAt)
        case "name":
          return a.className.localeCompare(b.className)
        case "section":
          return a.section.localeCompare(b.section)
        default:
          return 0
      }
    })

  const totalPages = Math.ceil(filteredClasses.length / classesPerPage)
  const paginatedClasses = filteredClasses.slice((currentPage - 1) * classesPerPage, currentPage * classesPerPage)

  // Reset to first page if classes change and current page is out of range
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) setCurrentPage(1)
  }, [totalPages, currentPage])

  const navigateToClass = (classId) => {
    navigate("/student/grades", { state: { selectedClassId: classId } })
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber)
  }

  const getScheduleIcon = (schedule) => {
    if (schedule?.toLowerCase().includes("morning")) return "🌅"
    if (schedule?.toLowerCase().includes("afternoon")) return "☀️"
    if (schedule?.toLowerCase().includes("evening")) return "🌆"
    return "📅"
  }

  if (error) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Your Classes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[300px]">
          <Alert variant="destructive" className="max-w-md">
            <AlertDescription>
              Error loading classes: {error}
              <Button variant="outline" size="sm" onClick={loadClasses} className="mt-2 w-full">
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
    <Card className="h-full flex flex-col gap-0">
      <CardHeader className="pb-4">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Your Classes
              {!loading && (
                <Badge variant="secondary" className="ml-2">
                  {filteredClasses.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Overview of your enrolled classes</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={loadClasses} disabled={loading}>
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button onClick={() => navigate("/student/grades")}>
              View All Classes
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {loading ? (
          <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 gap-3" : "space-y-3"}`}>
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-24 w-full" />
            ))}
          </div>
        ) : (
          <div className="h-full">
            {viewMode === "grid" ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {paginatedClasses.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border-l-4 border-l-primary/20 hover:border-l-primary"
                    onClick={() => navigateToClass(classItem.id)}
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg leading-tight">
                            {classItem.className || "No Class Name"}
                          </CardTitle>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {classItem.section || "No Section"}
                            </Badge>
                            {classItem.semester && (
                              <Badge variant="secondary" className="text-xs">
                                {classItem.semester} Semester
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="space-y-2 text-sm">
                        {classItem.schedule && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Clock className="h-4 w-4" />
                            {classItem.schedule}
                          </div>
                        )}
                        {classItem.room && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <MapPin className="h-4 w-4" />
                            Room {classItem.room}
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Users className="h-4 w-4" />
                          {
                            teachers[classItem.id]
                              ? teachers[classItem.id]
                              : "Loading..."
                          }
                        </div>
                        {classItem.lastUpdated && (
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Calendar className="h-4 w-4" />
                            {classItem.schedule || "No Schedule"}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="space-y-2">
                {paginatedClasses.map((classItem) => (
                  <Card
                    key={classItem.id}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md"
                    onClick={() => navigateToClass(classItem.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="text-2xl">{getScheduleIcon(classItem.schedule)}</div>
                          <div className="flex-1">
                            <h3 className="font-semibold">{classItem.className || "No Class Name"}</h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-sm text-muted-foreground">{classItem.section || "No Section"}</span>
                              {classItem.room && (
                                <span className="text-sm text-muted-foreground">• Room {classItem.room}</span>
                              )}
                              {classItem.schedule && (
                                <span className="text-sm text-muted-foreground">• {classItem.schedule}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          {classItem.semester && <Badge variant="secondary">{classItem.semester}</Badge>}
                          <Button variant="ghost" size="sm">
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {!loading && filteredClasses.length > 0 && totalPages > 1 && (
        <div className="flex justify-center items-center py-4">
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}
    </Card>
  )
}
