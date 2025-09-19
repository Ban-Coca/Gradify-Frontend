import { ArrowLeft, Calendar, Download, Mail, MessageSquare, Phone, Send, User } from "lucide-react"
import {Link} from "react-router-dom"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useStudentDetail } from '@/hooks/use-teacher'
import { Loading } from '@/components/loading-state'
import { useQuery } from '@tanstack/react-query'
import { getCalculatedGrade, getStudentCourseTableData } from '@/services/student/studentService'
import { useAuth } from '@/contexts/authentication-context'

export default function StudentDetailsDialog({ isOpen, onClose, student: propStudent = null, classId }) {
  // Use the API hook to fetch student details
  const { getAuthHeader } = useAuth();

  const { studentDetail, isLoading, error } = useStudentDetail(classId, propStudent?.id);
  
  // Fetch calculated grade for the student
  const { data: calculatedGradeData, isLoading: isGradeLoading } = useQuery({
    queryKey: ["calculatedGrade", propStudent?.id, classId],
    queryFn: () => getCalculatedGrade(propStudent?.id, classId, getAuthHeader()),
    enabled: !!propStudent?.id && !!classId,
  });

  // Fetch student course table data for grade history
  const { data: courseTableData, isLoading: isCourseDataLoading } = useQuery({
    queryKey: ["studentCourseData", propStudent?.id, classId],
    queryFn: () => getStudentCourseTableData(propStudent?.id, classId, getAuthHeader()),
    enabled: !!propStudent?.id && !!classId,
  });

  // Helper function to transform course table data to grade history array
  const transformCourseDataToHistory = (courseData) => {
    if (!courseData?.grades) return [];
    
    return Object.entries(courseData.grades)
      .filter(([key, value]) => 
        !['studentId', 'studentName', 'studentNumber', 'Last Name', 'First Name', 'Student Number'].includes(key) && 
        value !== null && value !== undefined && value !== ''
      )
      .map(([assessment, score]) => ({
        assessment,
        score: parseFloat(score) || 0,
        percentage: parseFloat(score) || 0,
        date: new Date().toLocaleDateString() // API doesn't provide dates, using current date
      }));
  };

  // Helper function to determine student status based on overall grade
  const getStudentStatus = (percentage) => {
    if (percentage >= 90) return 'Excellent';
    if (percentage >= 80) return 'Good Standing';
    if (percentage >= 70) return 'Passing';
    if (percentage >= 60) return 'At Risk';
    return 'Failing';
  };

  const convertCalculatedGradeToLetterGrade = (percentage) => {
      let grade;
      if (percentage >= 90) grade = "A";
      else if (percentage >= 80) grade = "B";
      else if (percentage >= 70) grade = "C";
      else if (percentage >= 60) grade = "D";
      else grade = "F";
      return grade;
  }
  // Process the API data when available
  const processedStudent = studentDetail && calculatedGradeData ? {
    id: studentDetail.userId,
    name: `${studentDetail.firstName} ${studentDetail.lastName}`,
    email: studentDetail.email,
    studentId: studentDetail.studentNumber,
    major: studentDetail.major,
    yearLevel: studentDetail.yearLevel,
    grade: convertCalculatedGradeToLetterGrade(calculatedGradeData) || 'N/A',
    percentage: calculatedGradeData.percentage || 0,
    status: getStudentStatus(calculatedGradeData || 0),
    gradeHistory: transformCourseDataToHistory(courseTableData),
    reports: studentDetail.reports || [],
  
  } : null;
  
  // default sample student for when no student prop is passed or data is loading
  const defaultStudent = {
    id: "12345",
    name: "Loading...",
    email: "loading@example.com",
    studentId: "Loading...",
    enrollmentDate: "August 15, 2023",
    profileImage: "/placeholder.svg?height=100&width=100",
    grade: "N/A",
    percentage: 0,
    status: "Loading...",
    attendance: 0,
    engagement: 0,
    classRank: 0,
    classPercentile: 0,
    gradeHistory: [],
    reports: [],
  }

  // Use processed student data if available, otherwise fall back to prop or default
  const student = processedStudent || propStudent || defaultStudent
  console.log("Student: ", student)
  // Handle loading state
  if (isLoading || isGradeLoading || isCourseDataLoading) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent aria-describedby="report-details-description" className="w-full sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Loading student information...</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <Loading text="Loading student details..." />
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Handle error state
  if (error) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent aria-describedby="report-details-description" className="w-full sm:max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Student Details</DialogTitle>
            <DialogDescription>Error loading student information</DialogDescription>
          </DialogHeader>
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <p className="text-red-500 mb-4">Failed to load student details</p>
              <Button onClick={() => window.location.reload()}>Try Again</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent aria-describedby="report-details-description" className="w-full sm:max-w-4xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <div className="flex items-center">
            <DialogTitle>Student Details</DialogTitle>
          </div>
          <DialogDescription className="mt-1">Details for {student.name}</DialogDescription>
        </DialogHeader>

        {/* make main body scrollable while keeping header/footer visible */}
        <div className="overflow-y-auto px-0 py-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">   
          {/* Student Profile Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Student Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center mb-4">
                <Avatar className="h-24 w-24 mb-2">
                  <AvatarImage src={student.profileImage || "/placeholder.svg"} alt={student.name} />
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">{student.name}</h2>
                <Badge className="mt-1" variant={student.status === "Excellent" ? "default" : "outline"}>
                  {student.status}
                </Badge>
              </div>

              <Separator className="my-4" />

              <div className="space-y-3">
                <div className="flex items-start">
                  <Mail className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Email</p>
                    <p className="text-sm text-muted-foreground">{student.email}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium">Student ID</p>
                    <p className="text-sm text-muted-foreground">{student.studentId}</p>
                  </div>
                </div>
                {student.major && (
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Major</p>
                      <p className="text-sm text-muted-foreground">{student.major}</p>
                    </div>
                  </div>
                )}
                {student.yearLevel && (
                  <div className="flex items-start">
                    <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Year Level</p>
                      <p className="text-sm text-muted-foreground">{student.yearLevel}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Academic Performance */}
          <Card className="md:col-span-2">
            <CardHeader>
              <CardTitle>Academic Performance</CardTitle>
              <CardDescription>
                Academic overview for student
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="overview">
                <TabsList className="mb-4">
                  <TabsTrigger value="overview">Overview</TabsTrigger>
                  <TabsTrigger value="trends">Grades</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Overall Grade</span>
                      <span className="font-medium">{calculatedGradeData?.toFixed(2)}%</span>
                    </div>
                    <Progress value={calculatedGradeData} className="h-2" />
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-2xl text-white font-bold">{calculatedGradeData?.toFixed(2)}</p>
                      <p className="text-xs text-white dark:text-muted-foreground">Current Grade</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-2xl text-white font-bold">{student.status}</p>
                      <p className="text-xs text-white dark:text-muted-foreground">Standing</p>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <p className="text-2xl text-white font-bold">{student.reports ? student.reports.length : 0}</p>
                      <p className="text-xs text-white dark:text-muted-foreground">Reports Received</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="trends">
                  <div className="space-y-6">
                    <div className="w-full border rounded-lg p-4">
                      {/* Display actual grade history */}
                      <div className="space-y-3 max-h-[300px] px-4 overflow-y-auto">
                        {student.gradeHistory && student.gradeHistory.length > 0 ? (
                          student.gradeHistory.map((grade, index) => (
                            <div key={index} className="space-y-2 py-1">
                              <div className="flex justify-between text-sm">
                                <span className="font-medium">{grade.assessment}</span>
                                <span className="font-semibold">{grade.score}%</span>
                              </div>
                              <Progress value={grade.percentage} className="h-2" />
                            </div>
                          ))
                        ) : (
                          <div className="text-center text-muted-foreground py-8">
                            <p>No grade history available</p>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Current Grade</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="font-bold text-3xl mr-3">
                              {student.grade}
                            </div>
                            <div>
                              <p className="text-lg font-semibold">{calculatedGradeData?.toFixed(2)}%</p>
                              <p className="text-xs text-muted-foreground">Overall Score</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">Academic Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <div className="font-bold text-lg mr-2">
                              {student.percentage >= 90 ? "🏆" : student.percentage >= 80 ? "⭐" : student.percentage >= 70 ? "✅" : "⚠️"}
                            </div>
                            <div>
                              <p className="text-sm font-medium">{student.status}</p>
                              <p className="text-xs text-muted-foreground">Current Standing</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Feedback History */}
          <Card className="md:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Feedback History</CardTitle>
                <CardDescription>Recent feedback provided to the student</CardDescription>
              </div>
              <Button>
                <Send className="h-4 w-4 mr-2" />
                Send Feedback
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {student.reports && student.reports.length > 0 ? (
                  student.reports.map((report) => (
                    <Card key={report.reportId}>
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <CardTitle className="text-base">{report.subject}</CardTitle>
                            <CardDescription>
                              {new Date(report.reportDate).toLocaleDateString()}
                            </CardDescription>
                          </div>
                          <Badge variant={report.notificationType === "grade-alert" ? "destructive" : "default"}>
                            {report.notificationType === "grade-alert" ? "Grade Alert" : "Feedback"}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div 
                          className="text-sm"
                          dangerouslySetInnerHTML={{ __html: report.message }}
                        />
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <p>No feedback or reports available for this student.</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
