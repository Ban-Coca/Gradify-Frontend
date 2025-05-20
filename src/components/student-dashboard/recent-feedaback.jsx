import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // or use 'useRouter' if using Next.js
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getReportsByStudentId } from "@/services/student/studentService";
import { useAuth } from "@/contexts/authentication-context";

export function SubjectPerformance() {
  const { currentUser, getAuthHeader } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // For React Router. Use useRouter for Next.js

  useEffect(() => {
    async function fetchReports() {
      if (!currentUser?.userId) return;
      setLoading(true);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getReportsByStudentId(currentUser.userId, header);
        setReports(data);
      } catch (error) {
        setReports([]);
      } finally {
        setLoading(false);
      }
    }
    fetchReports();
  }, [currentUser, getAuthHeader]);

  // Group by className and get the latest report per subject
  const latestReports = Object.values(
    reports.reduce((acc, report) => {
      const key = report.className;
      if (
        !acc[key] ||
        new Date(report.reportDate) > new Date(acc[key].reportDate)
      ) {
        acc[key] = report;
      }
      return acc;
    }, {})
  );

  return (
    <Card >
      <CardHeader>
        <CardTitle>Recent Feedback per Subject</CardTitle>
        <CardDescription>Click a subject to view detailed feedback</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : latestReports.length === 0 ? (
          <div className="text-muted-foreground">No feedback found.</div>
        ) : (
          <div className="space-y-6">
            {latestReports.map((report) => (
              <div
                key={report.classId}
                className="p-4 border rounded-lg cursor-pointer transition-colors hover:bg-[#198754]/10"
                onClick={() => navigate(`/student/feedback/${report.reportId}`)}
              >
                <div className="flex items-center justify-between">
                  <div className="font-medium">{report.className}</div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(report.reportDate).toLocaleDateString()}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground mt-1">
                  Teacher: {report.teacherName}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}