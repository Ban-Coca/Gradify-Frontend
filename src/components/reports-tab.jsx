import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, BarChart, Users, EllipsisVertical } from "lucide-react";
import { useState } from "react";
import { useReports } from "@/hooks/use-reports";
import { useAuth } from "@/contexts/authentication-context";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import { Loading } from "@/components/loading-state";
import { ReportDetailsModal } from "@/components/report-details-teacher-side";

export function ReportsTab({
    classId,
}) {
  const { currentUser } = useAuth();
  const { reportsByClassQuery } = useReports(
    currentUser,
    classId,
    null,
    currentUser.userId,
    null
  );

  const { data: reports = [], isLoading, isError, error } = reportsByClassQuery;
  
  const [selectedReport, setSelectedReport] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (report) => {
    setSelectedReport(report);
    setIsModalOpen(true);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loading variant="spinner" size="lg" text="Loading reports..." />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-red-600">
        <p className="font-semibold mb-2">Failed to load reports.</p>
        <p className="text-sm">{error?.message || "An unexpected error occurred."}</p>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Performance Reports</CardTitle>
          <CardDescription>
            Generate student performance reports
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-blue-600 mr-3" />
                <div>
                  <p className="font-medium">Individual Student Reports</p>
                  <p className="text-sm text-gray-500">
                    Generate reports for each student
                  </p>
                </div>
              </div>
              <Button size="sm">Generate</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <BarChart className="h-5 w-5 text-green-600 mr-3" />
                <div>
                  <p className="font-medium">Class Summary Report</p>
                  <p className="text-sm text-gray-500">
                    Overall class performance
                  </p>
                </div>
              </div>
              <Button size="sm">Generate</Button>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-md">
              <div className="flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-3" />
                <div>
                  <p className="font-medium">At-Risk Students Report</p>
                  <p className="text-sm text-gray-500">
                    Identify students needing help
                  </p>
                </div>
              </div>
              <Button size="sm">Generate</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card >
        <CardHeader>
          <CardTitle className="text-lg">Recent Reports</CardTitle>
          <CardDescription>Previously made reports</CardDescription>
        </CardHeader>
        <CardContent>
          {reports.map((report) => (
            <div
              key={report.reportId}
              className="flex items-center justify-between p-3 border rounded-md mb-2"
              onClick={() => handleCardClick(report)}
            >
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-gray-500 mr-3" />
                <div>
                  <p className="font-medium">
                    {report.subject || "Untitled Report"}
                  </p>
                  <p className="text-sm text-gray-500">
                    Generated on{" "}
                    {report.reportDate
                      ? new Date(report.reportDate).toLocaleDateString()
                      : "Unknown date"}
                  </p>
                </div>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm">
                    <EllipsisVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent >
                  <DropdownMenuItem asChild>
                    <a
                      href={report.downloadUrl || "#"}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                    >
                      Download
                    </a>
                  </DropdownMenuItem>
                  {/* Add more actions here as needed */}
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </CardContent>
      </Card>

      {selectedReport && (
        <ReportDetailsModal
          report={selectedReport}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </>
  );
}
