import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Bell, Download, Printer, Share2, Sparkles } from "lucide-react";
import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { LexicalEditor } from "@/components/lexical/lexical-editor";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/contexts/authentication-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ReportsHistory } from "@/components/reports-history";
import {
  getClassByTeacherId,
  getStudentByClass,
} from "@/services/teacher/classServices";
import { useQuery } from "@tanstack/react-query";

function ReportsPage() {
  const { tab } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, getAuthHeader } = useAuth();
  const {
    studentId: initialStudentId,
    studentName: initialStudentName,
    classId: initialClassId,
    teacherId: initialTeacherId,
  } = location.state || {};
  const [notificationType, setNotificationType] = useState("grade-alert");
  const [subject, setSubject] = useState("");
  const [isGeneratingAI, setIsGeneratingAI] = useState(false);
  const [message, setMessage] = useState(
    "<p>Enter your feedback or notification message</p>"
  );
  const defaultTab = "create";
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedClassId, setSelectedClassId] = useState(initialClassId || "");
  const [selectedStudentId, setSelectedStudentId] = useState(
    initialStudentId || ""
  );

  const activeTeacher = initialTeacherId || currentUser?.userId;
  const { data: classes = [], isLoading: isLoadingClasses } = useQuery({
    queryKey: ["classes", activeTeacher],
    queryFn: () => getClassByTeacherId(activeTeacher, getAuthHeader()),
    enabled: !!activeTeacher,
  });

  // Fetch students in the selected class
  const { data: studentsData = [], isLoading: isLoadingStudents } = useQuery({
    queryKey: ["students", selectedClassId],
    queryFn: () => getStudentByClass(selectedClassId, getAuthHeader()),
    enabled: !!selectedClassId,
  });
  console.log("Students Data:", studentsData);
  const students = Array.isArray(studentsData)
    ? studentsData
    : studentsData?.students || [];

  const selectedStudent = students.find(
    (student) => student.userId === selectedStudentId
  );
  const selectedStudentName =
    selectedStudent?.firstName || initialStudentName || "";

  const { createReportMutation } = useReports(
    currentUser,
    selectedClassId,
    selectedClassId,
    activeTeacher,
    null
  );

  const handleSendReport = async () => {
    const payload = {
      teacherId: activeTeacher,
      studentId: selectedStudentId,
      classId: selectedClassId,
      notificationType,
      subject,
      message,
    };
    createReportMutation.mutateAsync(payload);
  };
  useEffect(() => {
    if (tab && tab !== activeTab) {
      setActiveTab(tab);
    }
  }, [tab]);
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    navigate(`/teacher/reports/${tab}`);
  };
  const generateAIReport = {};
  return (
    <Layout>
      <div className="mt-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Generate Reports
          </h1>
          <p className="text-muted-foreground">
            Create customized reports for students
          </p>
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
        <Tabs
          value={activeTab}
          onValueChange={handleTabChange}
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger
              value="create"
              className="data-[state=inactive]:text-white"
            >
              Create Report
            </TabsTrigger>
            <TabsTrigger
              value="history"
              className="data-[state=inactive]:text-white"
            >
              Report History
            </TabsTrigger>
          </TabsList>
          <TabsContent value="create" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle className="font-bold">
                  Send Feedback and Notifications
                </CardTitle>
                <CardDescription>Provide feedback to students</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid w-full gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="class-select">Select Class</Label>
                      <Select
                        value={selectedClassId}
                        onValueChange={(value) => {
                          setSelectedClassId(value);
                          setSelectedStudentId(""); // Reset student when class changes
                        }}
                      >
                        <SelectTrigger id="class-select">
                          <SelectValue placeholder="Select a class" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingClasses ? (
                            <SelectItem value="loading" disabled>
                              Loading classes...
                            </SelectItem>
                          ) : classes.length > 0 ? (
                            classes.map((classItem) => (
                              <SelectItem
                                key={classItem.classId}
                                value={classItem.classId}
                              >
                                {classItem.className} - {classItem.section}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No classes found
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-2">
                      <Label htmlFor="student-select">Select Student</Label>
                      <Select
                        value={selectedStudentId}
                        onValueChange={setSelectedStudentId}
                        disabled={!selectedClassId || isLoadingStudents}
                      >
                        <SelectTrigger id="student-select">
                          <SelectValue placeholder="Select a student" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingStudents ? (
                            <SelectItem value="loading" disabled>
                              Loading students...
                            </SelectItem>
                          ) : students.length > 0 ? (
                            students.map((student) => (
                              <SelectItem
                                key={student.userId}
                                value={student.userId}
                              >
                                {student.firstName} {student.lastName}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="none" disabled>
                              No students in this class
                            </SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Recipient Information
                  {selectedStudentId && (
                    <div className="grid gap-2">
                      <div>
                        <h1 className="font-bold">Recipient</h1>
                        <p>Student Name: {selectedStudentName}</p>
                      </div>
                    </div>
                  )} */}
                  <div className="grid gap-2">
                    <Label htmlFor="notification-type">Notification Type</Label>
                    <Select
                      defaultValue="grade-alert"
                      onValueChange={setNotificationType}
                    >
                      <SelectTrigger id="notification-type">
                        <SelectValue placeholder="Select notification type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="grade-alert">Grade Alert</SelectItem>
                        <SelectItem value="improvement">
                          Improvement Suggestion
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="subject">Subject</Label>
                    <Input
                      id="subject"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      placeholder="Enter notification subject"
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="message">Message</Label>
                    <LexicalEditor
                      onChange={setMessage}
                      initialContent={message}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <Button
                  variant="outline"
                  onClick={generateAIReport}
                  disabled={
                    isGeneratingAI || !selectedStudentId || !selectedClassId
                  }
                  className="flex items-center gap-2"
                >
                  {isGeneratingAI ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"></div>
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4" />
                      Generate AI Report
                    </>
                  )}
                </Button>
                <Button onClick={handleSendReport} className="cursor-pointer">Send Report</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            <ReportsHistory
              classId={selectedClassId}
              studentId={selectedStudentId}
              teacherId={activeTeacher}
            />
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
}

export default ReportsPage;
