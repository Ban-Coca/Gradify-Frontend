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
    select: (data) => data.map(student => ({
      id: student.userId,
      name: student.studentName,
      studentId: student.studentNumber,
      grade: student.grade,
      // Fix the percentage formatting - divide by 100 if over 100
      percentage: parseFloat((student.percentage > 100 ? student.percentage/100 : student.percentage).toFixed(1)),
      // Map the status to one of the expected values based on percentage
      status: student.status === "Good Standing" ? 
        (student.percentage >= 9000 ? "Excellent" : 
         student.percentage >= 8000 ? "On Track" : "At Risk") : 
        student.status,
    }))
  })
  // Filter students based on search query
  const filteredStudents = studentsData ? studentsData.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  ) : []
  console.log(studentsData)
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
  })

  const handleSort = (column) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortColumn(column)
      setSortDirection("asc")
    }
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
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
          {sortedStudents.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center">
                No students found.
              </TableCell>
            </TableRow>
          ) : (
            sortedStudents.map((student) => (
              <TableRow key={student.id}>
                <TableCell className="font-medium">{student.name}</TableCell>
                <TableCell >{student.studentId}</TableCell>
                <TableCell>{student.grade}</TableCell>
                <TableCell>{student.percentage}%</TableCell>
                <TableCell>
                  <Badge
                    variant="outline"
                    className={
                      student.status === "Excellent"
                        ? "bg-green-50 text-green-700 hover:bg-green-50 hover:text-black"
                        : student.status === "On Track"
                          ? "bg-blue-50 text-blue-700 hover:bg-blue-50 hover:text-black"
                          : "bg-red-50 text-red-700 hover:bg-red-50 hover:text-black"
                    }
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
  classId: PropTypes.string
}

StudentTable.defaultProps = {
  searchQuery: "",
}
