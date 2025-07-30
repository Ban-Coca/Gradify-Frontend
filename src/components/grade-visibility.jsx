import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Save, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getSpreadsheetByClassId } from "@/services/teacher/classServices";
import { useTeacher } from "@/hooks/use-teacher";

export function GradeDisplayTable({ classId }) {
  const { currentUser, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const [spreadsheet, setSpreadsheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  const excludedFields = ["Student Number", "First Name", "Last Name"];

  useEffect(() => {
    const fetchSpreadsheet = async () => {
      if (!classId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("Fetching spreadsheet for classId:", classId);
        const data = await getSpreadsheetByClassId(classId, getAuthHeader());
        console.log("Fetched spreadsheet data:", data);

        const spreadsheetData = Array.isArray(data) ? data[0] : data;
        setSpreadsheet(spreadsheetData);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching spreadsheet:", err);
        setError("Failed to load spreadsheet data");
        setLoading(false);
      }
    };

    fetchSpreadsheet();
  }, [classId, getAuthHeader]);

  const {
    availableAssessments,
    visibleAssessments,
    toggleAssessment,
    updateAssessment,
    assessmentStatus,
  } = useTeacher(currentUser.userId, classId, spreadsheet?.id);

  // Get all unique column headers for the grades
  const getGradeColumns = () => {
    if (!spreadsheet?.gradeRecords?.length) return [];

    // Collect all unique keys from all grade records
    const allKeys = new Set();
    spreadsheet.gradeRecords.forEach((record) => {
      if (record && record.grades) {
        Object.keys(record.grades).forEach((key) => {
          if (!excludedFields.includes(key)) {
            allKeys.add(key);
          }
        });
      }
    });

    // Convert to array and sort
    return Array.from(allKeys).sort();
  };

  const handleVisibilityToggle = (assessmentName) => {
    if (!spreadsheet?.id) return;

    toggleAssessment.mutate({
      classSpreadsheetId: spreadsheet?.id,
      assessmentName: assessmentName,
    });
  };

  const handleSaveVisibility = async () => {
    try {
      if (!spreadsheet?.id || !visibleAssessments?.data) return;

      // Convert visible assessments array to Set for the API
      const visibleSet = new Set(visibleAssessments.data);

      updateAssessment.mutate({
        classSpreadsheetId: spreadsheet.id,
        assessments: visibleSet,
      });

      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error("Error saving visibility settings:", err);
      setError("Failed to save visibility settings");
    }
  };

  // Only calculate grade columns if spreadsheet exists
  const gradeColumns = spreadsheet ? getGradeColumns() : [];

  const getAssessmentVisibility = (assessmentName) => {
    return assessmentStatus?.data?.[assessmentName] || false;
  };

  if (loading) {
    return <div className="py-8 text-center">Loading grade data...</div>;
  }

  if (error) {
    return <div className="py-8 text-center text-red-500">{error}</div>;
  }

  if (
    !spreadsheet ||
    !spreadsheet.gradeRecords ||
    spreadsheet.gradeRecords.length === 0
  ) {
    return (
      <div className="py-8 text-center">
        No grade records found for this class.
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          Grade Overview for {spreadsheet.className}
        </h2>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-green-600">Visibility settings saved!</span>
          )}
          <Button
            onClick={handleSaveVisibility}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Visibility"}
          </Button>
        </div>
      </div>

      {/* Visibility Controls */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">Assessment Visibility for Students</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {gradeColumns.map((column) => {
            const isVisible = getAssessmentVisibility(column)
            const isDisabled = toggleAssessment?.isLoading || !spreadsheet?.id || !toggleAssessment?.mutate

            return (
              <div key={column} className="flex items-center justify-between p-2 bg-white rounded border">
                <div className="flex items-center gap-2">
                  {isVisible ? (
                    <Eye className="h-4 w-4 text-green-600" />
                  ) : (
                    <EyeOff className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="font-medium">{column}</span>
                </div>

                <Switch
                  checked={isVisible}
                  onCheckedChange={(checked) => {
                    console.log(`Debug - Switch clicked for ${column}, new value:`, checked)
                    handleVisibilityToggle(column)
                  }}
                  disabled={isDisabled}
                  className="cursor-pointer"
                />
              </div>
            )
          })}
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-[#198754]/10">
              <TableHead className="font-bold">Student Number</TableHead>
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              {gradeColumns.map((column) => {
                const isVisible = getAssessmentVisibility(column);
                return (
                  <TableHead key={column} className="font-bold">
                    <div className="flex items-center gap-2">
                      {column}
                      {isVisible ? (
                        <Eye className="h-4 w-4 text-green-600" />
                      ) : (
                        <EyeOff className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TableHead>
                );
              })}
            </TableRow>
          </TableHeader>
          <TableBody>
            {spreadsheet.gradeRecords.map((record, index) => {
              if (!record || !record.grades) {
                return null;
              }

              const studentId =
                record.grades["Student Number"] || record.studentNumber || "";
              const uniqueKey = studentId || record.id || `student-${index}`;

              return (
                <TableRow key={uniqueKey} className="hover:bg-[#198754]/10">
                  <TableCell className="font-medium">{studentId}</TableCell>
                  <TableCell>{record.grades["First Name"] || ""}</TableCell>
                  <TableCell>{record.grades["Last Name"] || ""}</TableCell>
                  {gradeColumns.map((column) => {
                    const isVisible = getAssessmentVisibility(column);
                    return (
                      <TableCell key={column}>
                        <div
                          className={`p-2 rounded ${
                            isVisible
                              ? "bg-green-50 text-green-800"
                              : "bg-gray-50 text-gray-500"
                          }`}
                        >
                          {record.grades[column] || "-"}
                        </div>
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>

      {/* Summary */}
      <div className="mt-4 p-4 bg-blue-50 rounded-lg">
        <h4 className="font-semibold text-blue-800 mb-2">Visibility Summary</h4>
        <div className="flex flex-wrap gap-2">
          <span className="text-sm text-blue-700">
            Visible to students:{" "}
            {Object.values(assessmentStatus?.data || {}).filter(Boolean).length}{" "}
            assessments
          </span>
          <span className="text-sm text-blue-700">•</span>
          <span className="text-sm text-blue-700">
            Hidden from students:{" "}
            {
              Object.values(assessmentStatus?.data || {}).filter((v) => !v)
                .length
            }{" "}
            assessments
          </span>
        </div>
      </div>
    </div>
  );
}
