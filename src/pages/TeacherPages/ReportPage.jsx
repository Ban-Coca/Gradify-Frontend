import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  Bell,
  Download,
  Printer,
  Share2,
} from "lucide-react"
import Layout from "@/components/layout"
import { Badge } from "@/components/ui/badge";
import { LexicalEditor } from "@/components/lexical/lexical-editor";
import { useState } from "react"
import { useLocation } from "react-router-dom";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/contexts/authentication-context";

function ReportsPage() {
  const location = useLocation()
  const { studentId, studentName, classId, teacherId } = location.state || {}
  const { currentUser } = useAuth()
  const [recipientType, setRecipientType] = useState("individual")
  const [student, setStudent] = useState("john-doe")
  const [notificationType, setNotificationType] = useState("grade-alert")
  const [subject, setSubject] = useState("")
  const [message, setMessage] = useState("<p>Enter your feedback or notification message</p>")
  const { createReportMutation } = useReports(currentUser, classId, studentId, teacherId, null)
  
  if (!studentId || !classId || !teacherId) {
    return <div>Error: Missing required information to generate report.</div>;
  }
  const handleSendReport = async () => {
    const payload = {
      teacherId,
      studentId,
      classId,
      notificationType,
      subject,
      message,
    }
    
    try {
      await createReportMutation.mutateAsync(payload)
      console.log("Report sent successfully!")
      
    } catch (error) {
      console.error("Failed to send report:", error)
      
    }
  }

  return (
    <Layout>
      <div className="mt-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Generate Reports</h1>
          <p className="text-muted-foreground">Create customized reports for students</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button variant="outline" size="sm">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
          <Button variant="outline" size="sm">
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </div>
        <div className="mb-4 mt-4 items-center space-y-5">
          <Card>
            <CardHeader>
              <CardTitle className="font-bold">Send Feedback and Notifications</CardTitle>
              <CardDescription>Provide feedback to students or send class-wide notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid w-full gap-4">
                <div className="grid gap-2">
                  {/* <Label htmlFor="student">Select Student</Label>
                  <Select defaultValue="john-doe" onValueChange={setStudent}>
                    <SelectTrigger id="student">
                      <SelectValue placeholder="Select student" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="john-doe">John Doe</SelectItem>
                      <SelectItem value="jane-smith">Jane Smith</SelectItem>
                      <SelectItem value="alex-johnson">Alex Johnson</SelectItem>
                      <SelectItem value="sarah-williams">Sarah Williams</SelectItem>
                    </SelectContent>
                  </Select> */}
                  <div>
                    <h1 className="font-bold">Recipient</h1>
                    <p>Student Name: {studentName}</p>
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="notification-type">Notification Type</Label>
                  <Select defaultValue="grade-alert" onValueChange={setNotificationType}>
                    <SelectTrigger id="notification-type">
                      <SelectValue placeholder="Select notification type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="grade-alert">Grade Alert</SelectItem>
                      <SelectItem value="improvement">Improvement Suggestion</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input id="subject" value={subject} onChange={e => setSubject(e.target.value)} placeholder="Enter notification subject" />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="message">Message</Label>
                  {/* <Textarea
                    id="message"
                    placeholder="Enter your feedback or notification message"
                    className="min-h-[150px]"
                  /> */}
                  <LexicalEditor onChange={setMessage} initialContent={message} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button onClick={handleSendReport}>Send Report</Button>
            </CardFooter>
          </Card>

          {/* <Card>
            <CardHeader>
              <CardTitle>Recent Notifications</CardTitle>
              <CardDescription>History of your recently sent notifications and feedback</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Midterm Exam Feedback - John Doe</p>
                      <p className="text-sm text-muted-foreground">Sent on April 22, 2025</p>
                    </div>
                  </div>
                  <Badge>Delivered</Badge>
                </div>
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Class Announcement - Final Project Guidelines</p>
                      <p className="text-sm text-muted-foreground">Sent on April 20, 2025</p>
                    </div>
                  </div>
                  <Badge>Delivered</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Bell className="h-6 w-6 text-blue-500" />
                    <div>
                      <p className="font-medium">Grade Alert - Sarah Williams</p>
                      <p className="text-sm text-muted-foreground">Sent on April 18, 2025</p>
                    </div>
                  </div>
                  <Badge>Delivered</Badge>
                </div>
              </div>
            </CardContent>
          </Card> */}
        </div>
    </Layout>
  )
}

export default ReportsPage
