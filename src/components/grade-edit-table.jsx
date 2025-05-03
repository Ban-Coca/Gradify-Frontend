import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import { useAuth } from "@/contexts/authentication-context";
import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  getSpreadsheetByClassId,
} from "@/services/teacher/classServices";

export function GradeEditTable({ classId }) {
  const { currentUser, getAuthHeader } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const [spreadsheet, setSpreadsheet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editedData, setEditedData] = useState({});
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
        const data = await getSpreadsheetByClassId(classId, getAuthHeader());
        console.log("Fetched spreadsheet data:", data);

        // The API returns an array, but we need the first item
        const spreadsheetData = Array.isArray(data) ? data[0] : data;
        setSpreadsheet(spreadsheetData);

        // Initialize editedData with current values
        const initialEditState = {};
        if (spreadsheetData && spreadsheetData.gradeRecords) {
          spreadsheetData.gradeRecords.forEach((record) => {
            if (record && record.grades && record.grades["Student Number"]) {
              const studentId = record.grades["Student Number"];
              initialEditState[studentId] = { ...record.grades };
            }
          });
        }
        setEditedData(initialEditState);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching spreadsheet:", err);
        setError("Failed to load spreadsheet data");
        setLoading(false);
      }
    };

    fetchSpreadsheet();
  }, [classId, getAuthHeader]);

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

  const handleGradeChange = (studentId, column, value) => {
    setEditedData((prev) => ({
      ...prev,
      [studentId]: {
        ...(prev[studentId] || {}),
        [column]: value,
      },
    }));
  };

  const handleSave = async () => {
    // if (!spreadsheet || !spreadsheet.gradeRecords) return;

    // try {
    //   setSaving(true);

    //   // Transform editedData back to the format expected by the API
    //   const updatedGradeRecords = spreadsheet.gradeRecords.map((record) => {
    //     if (!record || !record.grades || !record.grades["Student Number"]) {
    //       return record;
    //     }

    //     const studentId = record.grades["Student Number"];
    //     return {
    //       ...record,
    //       grades: editedData[studentId] || record.grades,
    //     };
    //   });

    //   const updatedSpreadsheet = {
    //     ...spreadsheet,
    //     gradeRecords: updatedGradeRecords,
    //   };

    //   // Send to API
    //   await updateSpreadsheet(classId, updatedSpreadsheet, getAuthHeader());

    //   setSaveSuccess(true);
    //   setSpreadsheet(updatedSpreadsheet);

    //   // Reset success message after 3 seconds
    //   setTimeout(() => setSaveSuccess(false), 3000);
    // } catch (err) {
    //   console.error("Error saving spreadsheet:", err);
    //   setError("Failed to save changes");
    // } finally {
    //   setSaving(false);
    // }
  };

  // Only calculate grade columns if spreadsheet exists
  const gradeColumns = spreadsheet ? getGradeColumns() : [];

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
          Edit Grades for {spreadsheet.className}
        </h2>
        <div className="flex items-center gap-3">
          {saveSuccess && (
            <span className="text-green-600">Changes saved successfully!</span>
          )}
          <Button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Student Number</TableHead>
              <TableHead className="font-bold">First Name</TableHead>
              <TableHead className="font-bold">Last Name</TableHead>
              {gradeColumns.map((column) => (
                <TableHead key={column} className="font-bold">
                  {column}
                </TableHead>
              ))}
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
                <TableRow key={uniqueKey}>
                  <TableCell>{studentId}</TableCell>
                  <TableCell>{record.grades["First Name"] || ""}</TableCell>
                  <TableCell>{record.grades["Last Name"] || ""}</TableCell>
                  {gradeColumns.map((column) => (
                    <TableCell key={column}>
                      <input
                        type="text"
                        value={
                          editedData[studentId]?.[column] ||
                          record.grades[column] ||
                          ""
                        }
                        onChange={(e) =>
                          handleGradeChange(studentId, column, e.target.value)
                        }
                        className="w-full p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </TableCell>
                  ))}
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
