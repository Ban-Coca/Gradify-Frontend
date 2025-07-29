import { useState } from "react"
import PropTypes from "prop-types"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { ArrowUpDown, Download, Eye, MessageSquare, MoreHorizontal } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { getClassRoster } from "@/services/teacher/classServices"
import { useQuery } from "@tanstack/react-query"
import { useAuth } from "@/contexts/authentication-context"
import { useNavigate } from "react-router-dom"

export function StudentTable({ searchQuery, classId }) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")
  const { currentUser, getAuthHeader } = useAuth()
  const navigate = useNavigate()
  
  const { 
    data: studentsData, 
    isLoading, 
    error 
  } = useQuery({
    queryKey: ['classRoster', classId],
    queryFn: () => getClassRoster(classId, getAuthHeader()),
    enabled: !!classId,
    // Correctly process the data coming from the backend
    select: (data) => {
      if (!Array.isArray(data)) return []; // Handle cases where data might not be an array
      return data.map(student => ({
        id: student.userId,
        name: student.studentName,
        studentId: student.studentNumber,
        grade: student.grade, // This is the letter grade (A, B, C, D, F, or N/A)
        percentage: parseFloat(student.percentage.toFixed(1)), // Backend provides this as 0-100
        status: student.status, // Directly use the status from backend ("Failing", "At Risk", "Passing", "Good Standing", "Scheme Missing")
      }));
    }
  });

  // Filter students based on search query
  const filteredStudents = studentsData ? studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  ) : [];
  
  // Sort students based on column and direction
  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortColumn) return 0

    const aValue = a[sortColumn]
    const bValue = b[sortColumn]

    if (typeof aValue === "string" && typeof bValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    if (typeof aValue === "number" && typeof bValue === "number") {
      return sortDirection === "asc" ? aValue - bValue : bValue - aValue
    }

    return 0
  });

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "Failing":
        return "bg-red-100 text-red-700 border-red-300 hover:bg-red-200";
      case "At Risk":
        return "bg-orange-100 text-orange-700 border-orange-300 hover:bg-orange-200";
      case "Passing":
        return "bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-200";
      case "Good Standing":
        return "bg-green-100 text-green-700 border-green-300 hover:bg-green-200";
      case "Scheme Missing":
        return "bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-200"; // Neutral gray
      default:
        return "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"; // Fallback
    }
  };

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-[#198754]/10">
            <TableHead className="w-[250px]">
              <Button variant="ghost" onClick={() => handleSort("name")} className="flex items-center gap-1 px-0">
                Student Name
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("studentId")} className="flex items-center gap-1 px-0">
                ID
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("grade")} className="flex items-center gap-1 px-0">
                Grade
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("percentage")} className="flex items-center gap-1 px-0">
                Percentage
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="flex items-center gap-1 px-0">
                Status
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                Loading student roster...
              </TableCell>
            </TableRow>
          ) : error ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-red-500 h-24">
                Error loading roster: {error.message || "Unknown error"}
              </TableCell>
            </TableRow>
          ) : sortedStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center h-24">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            sortedStudents.map((student) => (
              <TableRow key={student.id} className="hover:bg-[#198754]/10">
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell >{student.studentId}</TableCell>
                <TableCell>{student.grade}</TableCell> {/* Letter Grade (A, B, C, N/A) */}
                <TableCell>{student.percentage}%</TableCell> {/* Percentage (0-100) */}
                <TableCell>
                  <Badge
                    variant="outline" // Keep outline for border and padding, then override colors
                    className={getStatusBadgeClass(student.status)}
                  >
                    {student.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem className="cursor-pointer" onClick={() =>
                        navigate(`/teacher/student-details/${student.id}`)}>
                        <Eye className="hover:text-white mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => 
                          navigate("/teacher/reports", { 
                            state: { 
                              studentId: student.id, 
                              studentName: student.name, 
                              classId: Number(classId), 
                              teacherId: currentUser.userId 
                            }
                          })
                        }
                        className="cursor-pointer"
                      >
                        <MessageSquare className="hover:text-white mr-2 h-4 w-4" />
                        Send Feedback
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="cursor-pointer">
                        <Download className="hover:text-white mr-2 h-4 w-4" />
                        Export Report
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          )} 
          
        </TableBody>
      </Table>
    </div>
  )
}

StudentTable.propTypes = {
  searchQuery: PropTypes.string,
  classId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired // Updated to accept string or number
};

StudentTable.defaultProps = {
  searchQuery: "",
};