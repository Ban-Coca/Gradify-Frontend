import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { useAuth } from "@/contexts/authentication-context"
import { getStudentClasses, getReportsByStudentId } from "@/services/student/studentService"

export function FeedbackView() {
  const [selectedClass, setSelectedClass] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const { currentUser, getAuthHeader } = useAuth()
  const studentId = currentUser?.userId;
  const [statusFilter, setStatusFilter] = useState("all")
  const [classes, setClasses] = useState([])
  const [feedbackItems, setFeedbackItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Handle page change
  useEffect(() => {
    const id = localStorage.getItem("selectedFeedbackId");
    if (id) {
      setSelectedFeedback(id);
      localStorage.removeItem("selectedFeedbackId");
    }
  }, []);

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

  // Fetch feedback reports
  useEffect(() => {
    async function loadReports() {
      setLoading(true);
      setError(null);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getReportsByStudentId(studentId, header);
        setFeedbackItems(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (studentId) loadReports();
  }, [studentId, getAuthHeader]);

  // Get initials from teacherName
    const getTeacherInitials = (teacherName) => {
      if (!teacherName) return "U";
      const [first = "", last = ""] = teacherName.trim().split(" ");
      return `${first.charAt(0)}${last.charAt(0) || ""}`.toUpperCase();
    };

  // Filter feedback based on class selection, status, and search query
  const filteredFeedback = feedbackItems.filter((feedback) => {
    const matchesClass = selectedClass === "all" || feedback.classId === selectedClass;
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter;
    const matchesSearch =
      feedback.subject?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.className?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.teacherName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesClass && matchesStatus && matchesSearch;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Set the first feedback as selected by default if none is selected
  useEffect(() => {
    if (filteredFeedback.length > 0 && !selectedFeedback) {
      setSelectedFeedback(filteredFeedback[0].reportId);
    }
  }, [filteredFeedback, selectedFeedback]);

  // Get the selected feedback details
  const selectedFeedbackDetails = feedbackItems.find((feedback) => feedback.reportId === selectedFeedback);

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feedback..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className={`h-4 w-4 ${showFilters ? "text-white" : ""}`} />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        {showFilters && (
          <Card className="border border-input p-4">
            <CardContent className="p-0">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Classes</h3>
                  <div className="flex flex-wrap gap-2">
                    {[{ id: "all", className: "All" }, ...classes].map((cls) => (

                      <Badge
                        key={cls.id}
                        variant={selectedClass === cls.id ? "default" : "outline"}
                        className="cursor-pointer"
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
        <div className="flex flex-wrap items-center gap-2">
          {selectedClass !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {classes.find((c) => c.id === selectedClass)?.className}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedClass("all")} />
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[600px] overflow-auto">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              {filteredFeedback.length} feedback item{filteredFeedback.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No feedback found matching your filters.
                </div>
              ) : (
                filteredFeedback.map((feedback) => (
                  <div
                    key={feedback.reportId}
                    className={`group p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFeedback === feedback.reportId
                        ? "border-primary bg-primary/5"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => setSelectedFeedback(feedback.reportId)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarFallback className="bg-primary/10 text-primary group-hover:bg-[#198754]/10 group-hover:text-[#198754] transition-colors">
                            {getTeacherInitials(feedback.teacherName)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium group-hover:text-[#198754] transition-colors">
                            {feedback.teacherName}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-[#198754] transition-colors">
                            {formatDate(feedback.reportDate)}
                          </div>
                          <Badge variant="secondary">
                            {feedback.notificationType
                              .split("-")
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(" ")}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium group-hover:text-[#198754] transition-colors">{feedback.subject}</div>
                      <div className="text-sm text-muted-foreground group-hover:text-[#198754] transition-colors">{feedback.className}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-[600px] overflow-auto">
          {selectedFeedbackDetails ? (
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{selectedFeedbackDetails.subject}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/10 text-primary">
                      {getTeacherInitials(selectedFeedbackDetails.teacherName)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {selectedFeedbackDetails.teacherName}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(selectedFeedbackDetails.reportDate)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedFeedbackDetails.className}</Badge>
                  <Badge variant="secondary">
                    {selectedFeedbackDetails.notificationType
                      .split("-")
                      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                      .join(" ")}
                  </Badge>
                </div>

                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedFeedbackDetails.message }}
                />
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Feedback Selected</h3>
                <p className="text-muted-foreground">Select a feedback item from the list to view details.</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}