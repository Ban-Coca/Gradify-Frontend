import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, MessageSquare, ChevronLeft, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/authentication-context"
import { getStudentClasses, getReportsByStudentId } from "@/services/student/studentService"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"

export function FeedbackView() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [showMobileDetail, setShowMobileDetail] = useState(false)
  const { currentUser, getAuthHeader } = useAuth()
  const studentId = currentUser?.userId
  const [statusFilter, setStatusFilter] = useState("all")
  const [classes, setClasses] = useState([])
  const [feedbackItems, setFeedbackItems] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Handle page change
  useEffect(() => {
    const id = localStorage.getItem("selectedFeedbackId")
    if (id) {
      setSelectedFeedback(id)
      localStorage.removeItem("selectedFeedbackId")
    }
  }, [])

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

  // Fetch feedback reports
  useEffect(() => {
    async function loadReports() {
      setLoading(true)
      setError(null)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getReportsByStudentId(studentId, header)
        setFeedbackItems(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    if (studentId) loadReports()
  }, [studentId, getAuthHeader])

  // Get initials from teacherName
  const getTeacherInitials = (teacherName) => {
    if (!teacherName) return "U"
    const [first = "", last = ""] = teacherName.trim().split(" ")
    return `${first.charAt(0)}${last.charAt(0) || ""}`.toUpperCase()
  }

  // Filter feedback based on class selection, status, and search query
  const filteredFeedback = feedbackItems.filter((feedback) => {
    const matchesClass = selectedClass === "all" || feedback.classId === selectedClass
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter
    const matchesSearch =
      feedback.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesClass && matchesStatus && matchesSearch
  })

  const formatDate = (dateString) => {
    if (!dateString) return ""
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Set the first feedback as selected by default if none is selected
  useEffect(() => {
    if (filteredFeedback.length > 0 && !selectedFeedback) {
      setSelectedFeedback(filteredFeedback[0].reportId)
    }
  }, [filteredFeedback, selectedFeedback])

  // Get the selected feedback details
  const selectedFeedbackDetails = feedbackItems.find((feedback) => feedback.reportId === selectedFeedback)

  const handleFeedbackSelect = (feedbackId) => {
    setSelectedFeedback(feedbackId)
    setShowMobileDetail(true)
  }

  const handleBackToList = () => {
    setShowMobileDetail(false)
  }

  const clearFilters = () => {
    setSelectedClass("all")
    setStatusFilter("all")
    setSearchQuery("")
  }

  const activeFiltersCount = (selectedClass !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0)

  if (error) {
    return (
      <div className="space-y-4 mb-8">
        <Alert variant="destructive">
          <AlertDescription>Error loading feedback: {error}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="space-y-4 mb-8">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feedback..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className={`relative ${showFilters ? "bg-muted text-white" : ""}`}
            >
              <Filter className={`h-4 w-4 ${showFilters ? "text-white" : ""}`} />
              Filters
              {activeFiltersCount > 0 && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
                >
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
            {activeFiltersCount > 0 && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Clear all
              </Button>
            )}
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <Card className="border border-input">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Filter by Class</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: "all", className: "All Classes" }, ...classes].map((cls) => (
                      <Badge
                        key={cls.id}
                        variant={selectedClass === cls.id ? "default" : "outline"}
                        className={`cursor-pointer transition-colors
                          ${selectedClass === cls.id
                            ? "bg-primary text-white"
                            : "hover:bg-primary hover:text-white"}
                        `}
                        onClick={() => setSelectedClass(cls.id)}
                      >
                        {cls.className}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active filters display */}
        {activeFiltersCount > 0 && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {selectedClass !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {classes.find((c) => c.id === selectedClass)?.className}
                <X className="h-3 w-3 cursor-pointer hover:text-destructive" onClick={() => setSelectedClass("all")} />
              </Badge>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Feedback List */}
        <div className={`lg:col-span-5 xl:col-span-4 ${showMobileDetail ? "hidden lg:block" : ""}`}>
          <Card className="h-[calc(100vh-300px)] min-h-[500px] gap-0">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center justify-between">
                <span>Feedback</span>
                {loading && <Loader2 className="h-4 w-4 animate-spin" />}
              </CardTitle>
              <CardDescription>
                {loading
                  ? "Loading feedback..."
                  : `${filteredFeedback.length} feedback item${filteredFeedback.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-auto max-h-[420px]">
                {loading ? (
                  <div className="space-y-4 p-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="space-y-3">
                        <div className="flex items-start gap-3">
                          <Skeleton className="h-9 w-9 rounded-full" />
                          <div className="space-y-2 flex-1">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-3 w-16" />
                            <Skeleton className="h-4 w-full" />
                            <Skeleton className="h-3 w-20" />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : filteredFeedback.length === 0 ? (
                  <div className="text-center py-12 px-4">
                    <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">No feedback found</h3>
                    <p className="text-muted-foreground text-sm">
                      {searchQuery || selectedClass !== "all"
                        ? "Try adjusting your search or filters"
                        : "You don't have any feedback yet"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-1 p-2">
                    {filteredFeedback.map((feedback) => (
                      <div
                        key={feedback.reportId}
                        className={`group p-4 rounded-lg cursor-pointer transition-all duration-200 hover:bg-primary/10 ${
                          selectedFeedback === feedback.reportId
                            ? "bg-primary/5 border-l-4 border-l-primary"
                            : "hover:bg-primary/10 hover:text-primary"
                        }`}
                        onClick={() => handleFeedbackSelect(feedback.reportId)}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-9 w-9 flex-shrink-0">
                            <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                              {getTeacherInitials(feedback.teacherName)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2 mb-2">
                              <div className="min-w-0 flex-1">
                                <div className="text-sm font-medium truncate">{feedback.teacherName}</div>
                                <div className="text-xs text-muted-foreground">{formatDate(feedback.reportDate)}</div>
                              </div>
                              <Badge variant="secondary" className="text-xs flex-shrink-0">
                                {feedback.notificationType
                                  .split("-")
                                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                                  .join(" ")}
                              </Badge>
                            </div>
                            <div className="space-y-1">
                              <div className="font-medium text-sm line-clamp-2">{feedback.subject}</div>
                              <div className="text-xs text-muted-foreground truncate">{feedback.className}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Feedback Detail */}
        <div className={`lg:col-span-7 xl:col-span-8 ${!showMobileDetail ? "hidden lg:block" : ""}`}>
          <Card className="h-[calc(100vh-300px)] min-h-[500px]">
            {selectedFeedbackDetails ? (
              <>
                <CardHeader className="pb-4">
                  <div className="flex items-center gap-2 lg:hidden">
                    <Button variant="ghost" size="sm" onClick={handleBackToList} className="p-1">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <span className="text-sm text-muted-foreground">Back to list</span>
                  </div>
                  <CardTitle className="text-xl leading-tight">{selectedFeedbackDetails.subject}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getTeacherInitials(selectedFeedbackDetails.teacherName)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="font-medium">{selectedFeedbackDetails.teacherName}</div>
                      <div className="text-sm text-muted-foreground">
                        {formatDate(selectedFeedbackDetails.reportDate)}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="font-medium">
                      {selectedFeedbackDetails.className}
                    </Badge>
                    <Badge variant="secondary">
                      {selectedFeedbackDetails.notificationType
                        .split("-")
                        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                        .join(" ")}
                    </Badge>
                  </div>

                  <div className="border-t pt-6">
                    <div
                      className="prose prose-sm max-w-full break-words prose-headings:text-foreground prose-p:text-foreground prose-strong:text-foreground prose-ul:text-foreground prose-ol:text-foreground prose-li:text-foreground"
                      dangerouslySetInnerHTML={{ __html: selectedFeedbackDetails.message }}
                    />
                  </div>
                </CardContent>
              </>
            ) : (
              <CardContent className="flex items-center justify-center h-full">
                <div className="text-center max-w-md mx-auto">
                  <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                  <h3 className="text-xl font-medium mb-3">No Feedback Selected</h3>
                  <p className="text-muted-foreground">
                    Select a feedback item from the list to view its details and content.
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}
