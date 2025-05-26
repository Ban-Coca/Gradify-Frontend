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
import { Bell, Download, Printer, Share2, Sparkles, AlertCircle } from "lucide-react";
import Layout from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { LexicalEditor } from "@/components/lexical/lexical-editor";
import { useState, useEffect } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/contexts/authentication-context";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
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
  const [formError, setFormError] = useState("");
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

  const students = Array.isArray(studentsData)
    ? studentsData
    : studentsData?.students || [];

  const selectedStudent = students.find(
    (student) => student.userId === selectedStudentId
  );
  const selectedStudentName =
    selectedStudent?.firstName || initialStudentName || "";

  const { createReportMutation, aiGeneratedReportQuery } = useReports(
    currentUser,
    selectedClassId,
    selectedStudentId,
    activeTeacher,
    null
  );

  const handleSendReport = async () => {
    if (
      !selectedClassId ||
      !selectedStudentId ||
      !subject.trim() ||
      !message ||
      message === "<p>Enter your feedback or notification message</p>"
    ) {
      setFormError("Please fill in all required fields before sending the report.");
      return;
    }
    setFormError("");
    const payload = {
      teacherId: activeTeacher,
      studentId: selectedStudentId,
      classId: selectedClassId,
      notificationType,
      subject,
      message,
    };
    try {
      await createReportMutation.mutateAsync(payload);
      // Clear form fields
      setSubject("");
      setMessage("<p>Enter your feedback or notification message</p>");
      setNotificationType("grade-alert");
      setSelectedClassId("");
      setSelectedStudentId("");
      
      // Navigate to history tab
      setActiveTab("history");
      navigate("/teacher/reports/history");
    } catch (error) {
      // Optionally handle error (already shown in UI)
      console.error("Failed to send report:", error);
    }
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

  const generateAIReport = async () => {
    setIsGeneratingAI(true);
    try {
      const result = await aiGeneratedReportQuery.refetch();
      console.log("AI Generated Report:", result.data.message);
      if (result.data) {
        // Convert plain text to HTML for LexicalEditor
        const plain = result.data.message || "";

        // Better HTML conversion logic
        let html = plain
          // First, replace single newlines with <br /> tags
          .replace(/\n/g, "<br />")
          // Then wrap the entire content in a paragraph
          .replace(/^(.+)$/s, "<p>$1</p>")
          // Handle multiple consecutive <br /> tags and convert them to separate paragraphs
          .replace(/(<br \/>){2,}/g, "</p><p>")
          // Clean up any empty paragraphs
          .replace(/<p><\/p>/g, "")
          // Ensure we don't have <br /> at the start or end of paragraphs
          .replace(/<p><br \/>/g, "<p>")
          .replace(/<br \/><\/p>/g, "</p>");

        // Alternative simpler approach - just replace all newlines with <br />
        // const html = `<p>${plain.replace(/\n/g, '<br />')}</p>`;

        console.log("Converted HTML:", html);
        setMessage(html);
      }
    } finally {
      setIsGeneratingAI(false);
    }
  };

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
                      key={message}
                      onChange={setMessage}
                      initialContent={message}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex gap-4">
                <TooltipProvider>
                  {isGeneratingAI || !selectedStudentId || !selectedClassId ? (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>
                          <Button
                            variant="outline"
                            onClick={generateAIReport}
                            disabled={
                              isGeneratingAI ||
                              aiGeneratedReportQuery.isLoading ||
                              aiGeneratedReportQuery.isFetching ||
                              !selectedStudentId ||
                              !selectedClassId
                            }
                            className="flex items-center gap-2"
                          >
                            {isGeneratingAI ||
                            aiGeneratedReportQuery.isLoading ||
                            aiGeneratedReportQuery.isFetching ? (
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
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isGeneratingAI ||
                        aiGeneratedReportQuery.isLoading ||
                        aiGeneratedReportQuery.isFetching
                          ? "AI report is currently being generated."
                          : !selectedClassId
                          ? "Select a class to enable."
                          : !selectedStudentId
                          ? "Select a student to enable."
                          : ""}
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <Button
                      variant="outline"
                      onClick={generateAIReport}
                      disabled={false}
                      className="flex items-center gap-2"
                    >
                      <Sparkles className="h-4 w-4" />
                      Generate AI Report
                    </Button>
                  )}
                </TooltipProvider>
                <Button onClick={handleSendReport} className="cursor-pointer">
                  Send Report
                </Button>
                {aiGeneratedReportQuery.error && (
                  <div className="text-red-500 text-sm ml-2">
                    Error generating AI report:{" "}
                    {aiGeneratedReportQuery.error.message || "Unknown error"}
                  </div>
                )}
                {formError && (
                  <div className="flex items-center text-red-500 text-sm mb-2 gap-1">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {formError}
                  </div>
                )}
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
