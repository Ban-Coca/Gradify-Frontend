import { ArrowLeft, Calendar, Download, Mail, MessageSquare, Phone, Send, User } from "lucide-react"
import {Link} from "react-router-dom"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function StudentDetailsPage() {
    const params = { id: "12345" } // This would normally be fetched from the URL params
  // This would normally be fetched from your database
  const student = {
    id: params.id,
    name: "Maria Teresa Santos",
    email: "maria.santos@student.edu",
    studentId: "65-5456-851",
    enrollmentDate: "August 15, 2023",
    profileImage: "/placeholder.svg?height=100&width=100",
    grade: "A",
    percentage: 90.5,
    status: "Excellent",
    attendance: 95,
    engagement: 88,
    classRank: 2,
    classPercentile: 10,
    gradeHistory: [
      { assessment: "Quiz 1", score: 85, date: "Feb 15, 2025" },
      { assessment: "Midterm", score: 88, date: "Apr 5, 2025" },
      { assessment: "Quiz 2", score: 92, date: "May 10, 2025" },
      { assessment: "Final Project", score: 94, date: "May 18, 2025" },
    ],
    feedback: [
      {
        id: "fb1",
        date: "May 15, 2025",
        from: "Dr. Johnson",
        subject: "Midterm Project Feedback",
        message:
          "Excellent work on your midterm project. Your analysis was thorough and your presentation was clear and engaging. I particularly appreciated your innovative approach to solving the main problem.",
        type: "positive",
      },
      {
        id: "fb2",
        date: "April 3, 2025",
        from: "Prof. Williams",
        subject: "Group Assignment Participation",
        message:
          "Maria has been an outstanding contributor to her group project. She consistently takes initiative and helps keep the team on track. Her research skills have been particularly valuable.",
        type: "positive",
      },
      {
        id: "fb3",
        date: "March 22, 2025",
        from: "Dr. Chen",
        subject: "Quiz 3 Performance",
        message:
          "While Maria performed well overall, there were some gaps in understanding the concepts covered in chapter 7. I recommend reviewing sections 7.3 and 7.4 before the final exam.",
        type: "improvement",
      },
    ],
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center mb-6">
        <Link to="/classes" className="flex items-center text-muted-foreground hover:text-foreground mr-4">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back to Class
        </Link>
        <h1 className="text-2xl font-bold">Student Details</h1>
      </div>

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
                <Phone className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Phone</p>
                  <p className="text-sm text-muted-foreground">{student.phone}</p>
                </div>
              </div>
              <div className="flex items-start">
                <User className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Student ID</p>
                  <p className="text-sm text-muted-foreground">{student.studentId}</p>
                </div>
              </div>
              <div className="flex items-start">
                <Calendar className="h-4 w-4 mr-2 mt-1 text-muted-foreground" />
                <div>
                  <p className="text-sm font-medium">Enrollment Date</p>
                  <p className="text-sm text-muted-foreground">{student.enrollmentDate}</p>
                </div>
              </div>
            </div>

            <Separator className="my-4" />

            <div className="space-y-4">
              <Button variant="outline" className="w-full">
                <MessageSquare className="h-4 w-4 mr-2" />
                Send Message
              </Button>
              <Button variant="outline" className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Academic Performance */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Academic Performance</CardTitle>
            <CardDescription>
              Current grade: {student.grade} ({student.percentage}%)
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="overview">
              <TabsList className="mb-4">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="trends">Grade Trends</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Overall Grade</span>
                    <span className="font-medium">{student.percentage}%</span>
                  </div>
                  <Progress value={student.percentage} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Attendance</span>
                    <span className="font-medium">{student.attendance}%</span>
                  </div>
                  <Progress value={student.attendance} className="h-2" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Engagement</span>
                    <span className="font-medium">{student.engagement}%</span>
                  </div>
                  <Progress value={student.engagement} className="h-2" />
                </div>

                <div className="grid grid-cols-3 gap-4 pt-4">
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{student.grade}</p>
                    <p className="text-xs text-muted-foreground">Current Grade</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{student.status}</p>
                    <p className="text-xs text-muted-foreground">Standing</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3 text-center">
                    <p className="text-2xl font-bold">{student.feedback.length}</p>
                    <p className="text-xs text-muted-foreground">Feedback Received</p>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="trends">
                <div className="space-y-6">
                  <div className="h-[200px] w-full border rounded-lg p-4 relative">
                    {/* This would be a chart in a real implementation */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="space-y-4 w-full px-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Quiz 1</span>
                            <span className="font-medium">85%</span>
                          </div>
                          <Progress value={85} className="h-1.5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Midterm</span>
                            <span className="font-medium">88%</span>
                          </div>
                          <Progress value={88} className="h-1.5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Quiz 2</span>
                            <span className="font-medium">92%</span>
                          </div>
                          <Progress value={92} className="h-1.5" />
                        </div>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Final Project</span>
                            <span className="font-medium">94%</span>
                          </div>
                          <Progress value={94} className="h-1.5" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Grade Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="font-bold text-lg mr-2">↗️</div>
                          <div>
                            <p className="text-sm font-medium">Improving</p>
                            <p className="text-xs text-muted-foreground">+6% over semester</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Class Standing</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center">
                          <div className="font-bold text-lg mr-2">🏆</div>
                          <div>
                            <p className="text-sm font-medium">Top 10%</p>
                            <p className="text-xs text-muted-foreground">2nd in class</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Recent Grade Changes</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span className="text-sm">Quiz 2</span>
                        <div className="flex items-center">
                          <span className="text-sm text-green-600 mr-1">+4%</span>
                          <span className="text-xs text-muted-foreground">May 10</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span className="text-sm">Final Project</span>
                        <div className="flex items-center">
                          <span className="text-sm text-green-600 mr-1">+2%</span>
                          <span className="text-xs text-muted-foreground">May 18</span>
                        </div>
                      </div>
                      <div className="flex justify-between items-center p-2 bg-muted rounded-md">
                        <span className="text-sm">Midterm</span>
                        <div className="flex items-center">
                          <span className="text-sm text-amber-600 mr-1">±0%</span>
                          <span className="text-xs text-muted-foreground">Apr 5</span>
                        </div>
                      </div>
                    </div>
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
              {student.feedback.map((item) => (
                <Card key={item.id}>
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-base">{item.subject}</CardTitle>
                        <CardDescription>
                          From: {item.from} • {item.date}
                        </CardDescription>
                      </div>
                      <Badge variant={item.type === "positive" ? "default" : "outline"}>
                        {item.type === "positive" ? "Positive" : "Needs Improvement"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">{item.message}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
