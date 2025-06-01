import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getReportsByStudentId } from "@/services/student/studentService"
import { useAuth } from "@/contexts/authentication-context"
import Pagination from "@/components/ui/pagination"
import { RefreshCw, Inbox, MessageSquare, Clock, Filter, Search, Star, AlertCircle, TrendingUp, Eye, MoreHorizontal, Calendar, User, BookOpen } from 'lucide-react'
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Helper to show "x hours ago"
function timeAgo(dateString) {
  const now = new Date()
  const date = new Date(dateString)
  const diffMs = now - date
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60))
    return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`
  }
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`
  const diffDays = Math.floor(diffHours / 24)
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`
}

const PAGE_SIZE = 4

export function SubjectPerformance() {
  const { currentUser, getAuthHeader } = useAuth()
  const [reports, setReports] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("recent")
  const [viewMode, setViewMode] = useState("card") // card, list
  const [selectedReports, setSelectedReports] = useState(new Set())
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchReports() {
      if (!currentUser?.userId) return
      setLoading(true)
      setError(null)
      try {
        const header = getAuthHeader ? getAuthHeader() : {}
        const data = await getReportsByStudentId(currentUser.userId, header)
        setReports(Array.isArray(data) ? data : [])
      } catch (error) {
        console.error("Error fetching reports:", error)
        setError(error.message)
        setReports([])
      } finally {
        setLoading(false)
      }
    }
    fetchReports()
  }, [currentUser, getAuthHeader])

  // Filter and sort reports
  const filteredReports = reports
    .sort((a, b) => {
      switch (sortBy) {
        case "recent":
          return new Date(b.reportDate) - new Date(a.reportDate)
        case "oldest":
          return new Date(a.reportDate) - new Date(b.reportDate)
        case "subject":
          return a.subject.localeCompare(b.subject)
        case "class":
          return a.className.localeCompare(b.className)
        default:
          return new Date(b.reportDate) - new Date(a.reportDate)
      }
    })

  // Pagination logic
  const totalPages = Math.ceil(filteredReports.length / PAGE_SIZE)
  const paginatedReports = filteredReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // Reset to first page if reports change and current page is out of range
  useEffect(() => {
    if (page > totalPages && totalPages > 0) setPage(1)
  }, [totalPages, page])

  const getTeacherInitials = (teacherName) => {
    if (!teacherName) return "T"
    const [first = "", last = ""] = teacherName.trim().split(" ")
    return `${first.charAt(0)}${last.charAt(0) || ""}`.toUpperCase()
  }

  const getFeedbackTypeIcon = (type) => {
    switch (type) {
      case "positive-feedback":
        return <Star className="h-4 w-4 text-green-600" />
      case "improvement-needed":
        return <AlertCircle className="h-4 w-4 text-orange-600" />
      case "general-feedback":
        return <MessageSquare className="h-4 w-4 text-blue-600" />
      default:
        return <MessageSquare className="h-4 w-4 text-gray-600" />
    }
  }

  const getFeedbackTypeBadge = (type) => {
    switch (type) {
      case "positive-feedback":
        return <Badge variant="default" className="bg-green-100 text-green-700">Positive</Badge>
      case "improvement-needed":
        return <Badge variant="destructive">Needs Improvement</Badge>
      case "general-feedback":
        return <Badge variant="secondary">General</Badge>
      default:
        return <Badge variant="outline">{type}</Badge>
    }
  }

  const handleReportClick = (report) => {
    localStorage.setItem("selectedFeedbackId", report.reportId)
    navigate("/student/feedback")
  }

  const refreshReports = async () => {
    setLoading(true)
    try {
      const header = getAuthHeader ? getAuthHeader() : {}
      const data = await getReportsByStudentId(currentUser.userId, header)
      setReports(Array.isArray(data) ? data : [])
      setError(null)
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (error) {
    return (
      <Card className="h-[510px]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Recent Feedback
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center h-[400px]">
          <Alert variant="destructive" className="max-w-md">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Error loading feedback: {error}
              <Button variant="outline" size="sm" onClick={refreshReports} className="mt-2 w-full">
                Try Again
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="h-[510px] flex flex-col gap-2">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5" />
              Recent Feedback
              {!loading && (
                <Badge variant="secondary" className="ml-2">
                  {filteredReports.length}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Click feedback to view details</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={refreshReports} disabled={loading}>
              <RefreshCw className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => setViewMode(viewMode === "card" ? "list" : "card")}>
                  Switch to {viewMode === "card" ? "List" : "Card"} View
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/student/feedback")}>
                  View All Feedback
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feedback..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Recent</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="subject">Subject</SelectItem>
              <SelectItem value="class">Class</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>

      <CardContent className="flex-1">
        {loading ? (
          <div className="space-y-3">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start gap-3 p-3">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Inbox className="w-16 h-16 mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No Feedback Found</h3>
            <p className="text-muted-foreground text-sm max-w-md">
              {searchQuery
                ? "Try adjusting your search or filters" 
                : "You don't have any feedback yet. Check back later for updates from your teachers."
              }
            </p>
            {(searchQuery) && (
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-3"
                onClick={() => {
                  setSearchQuery("")
                }}
              >
                Clear Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-2 h-full">
            {viewMode === "card" ? (
              <div className="flex flex-col gap-2 overflow-x-hidden overflow-y-auto max-h-[320px] pr-1">
                {filteredReports.map((report, index) => (
                  <Card
                    key={report.reportId}
                    className="cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-[1] border-l-4 border-l-primary/20 hover:border-l-primary"
                    onClick={() => handleReportClick(report)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-10 w-10 flex-shrink-0">
                          <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                            {getTeacherInitials(report.teacherName)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="min-w-0 flex-1">
                              <h4 className="font-medium text-sm truncate">{report.subject}</h4>
                              <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                                <User className="h-3 w-3" />
                                {report.teacherName}
                              </p>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                              {getFeedbackTypeBadge(report.notificationType)}
                              <div className="text-xs text-muted-foreground flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {timeAgo(report.reportDate)}
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                              <BookOpen className="h-3 w-3" />
                              {report.className}
                            </div>
                            <Button variant="ghost" size="sm" className="h-6 px-2">
                              <Eye className="h-3 w-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              // List View
              <div className="space-y-1">
                {paginatedReports.map((report) => (
                  <div
                    key={report.reportId}
                    className="flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-primary/10"
                    onClick={() => handleReportClick(report)}
                  >
                    <div className="flex items-center gap-2">
                      {getFeedbackTypeIcon(report.notificationType)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-sm truncate">{report.subject}</span>
                        <span className="text-xs text-muted-foreground">{timeAgo(report.reportDate)}</span>
                      </div>
                      <div className="text-xs text-muted-foreground truncate">
                        {report.className} • {report.teacherName}
                      </div>
                    </div>
                    {getFeedbackTypeBadge(report.notificationType)}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>

      {!loading && viewMode !== "card" && filteredReports.length > 0 && totalPages > 1 && (
        <div className="p-4">
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>
      )}
    </Card>
  )
}
