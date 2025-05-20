import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Eye, MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ReportDetailsModal } from "@/components/report-details-teacher-side";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/contexts/authentication-context";

export function ReportsHistory({ classId, studentId }) {
  const { currentUser } = useAuth();
  const [selectedReport, setSelectedReport] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const { reportsByTeacherQuery } = useReports(
    currentUser,
    classId,
    studentId,
    currentUser.userId,
    null
  );
  const { data: reports = [], isLoading, isError, error } = reportsByTeacherQuery;

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };
  
  const getBadgeVariant = (type) => {
    switch (type) {
      case "grade-alert":
        return "destructive";
      case "improvement":
        return "success";
      default:
        return "secondary";
    }
  };

  const handleViewDetails = (report) => {
    setSelectedReport(report);
    requestAnimationFrame(() => {
      setIsDetailsModalOpen(true)
    })
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p>Loading reports...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex justify-center">
            <p className="text-destructive">
              Error loading reports: {error.message}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="font-bold">Report History</CardTitle>
          <CardDescription>
            Previously sent reports and notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          {reports.length === 0 ? (
            <div className="flex justify-center py-6">
              <p className="text-muted-foreground">
                No reports have been sent yet
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {reports.map((report) => (
                <div
                  key={report.reportId}
                  className="flex items-start justify-between rounded-lg border p-4 hover:bg-muted/50"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{report.subject}</h4>
                      <Badge variant={getBadgeVariant(report.notificationType)}>
                        {report.notificationType.replace(/-/g, " ")}
                      </Badge>
                    </div>
                    <p className="text-sm text-foreground">
                      To: {report.studentName} • Sent:{" "}
                      {formatDate(report.reportDate)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewDetails(report)}
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" aria-label="More options">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => handleViewDetails(report)}
                        >
                          <Eye className="text-inherit mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">
                          <Trash2 className="text-destructive mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={isDetailsModalOpen}
          onClose={() => setIsDetailsModalOpen(false)}
        />
      )}
    </>
  );
}
