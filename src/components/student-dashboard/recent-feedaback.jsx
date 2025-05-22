import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { getReportsByStudentId } from "@/services/student/studentService";
import { useAuth } from "@/contexts/authentication-context";
import Pagination from "../ui/pagination"; // <-- Import your Pagination component

// Helper to show "x hours ago"
function timeAgo(dateString) {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now - date;
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) {
    const diffMins = Math.floor(diffMs / (1000 * 60));
    return diffMins <= 1 ? "just now" : `${diffMins} minutes ago`;
  }
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

const PAGE_SIZE = 4;

export function SubjectPerformance() {
  const { currentUser, getAuthHeader } = useAuth();
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const navigate = useNavigate();

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

  // Sort all feedbacks by date (latest first)
  const sortedReports = [...reports].sort(
    (a, b) => new Date(b.reportDate) - new Date(a.reportDate)
  );

  // Pagination logic
  const totalPages = Math.ceil(sortedReports.length / PAGE_SIZE);
  const paginatedReports = sortedReports.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Reset to first page if reports change and current page is out of range
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  return (
    <Card className="h-[510px]">
      <CardHeader>
        <CardTitle>Recent Feedback</CardTitle>
        <CardDescription>Click feedback to view details</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : sortedReports.length === 0 ? (
          <div className="text-muted-foreground">No feedback found.</div>
        ) : (
          <>
            <div className="space-y-2 h-[340px]">
              {paginatedReports.map((report) => (
                <div
                  key={report.reportId}
                  className="p-4 border rounded-lg cursor-pointer transition-colors hover:bg-gray-50"
                  onClick={() => {
                    localStorage.setItem("selectedFeedbackId", report.reportId);
                    navigate(`/student/feedback`)
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{report.subject}</div>
                    <div className="text-xs text-muted-foreground">
                      {timeAgo(report.reportDate)}
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1">
                    {report.className}
                  </div>
                </div>
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </CardContent>
    </Card>
  );
}