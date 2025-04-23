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

export function StudentTable({ searchQuery }) {
  const [sortColumn, setSortColumn] = useState(null)
  const [sortDirection, setSortDirection] = useState("asc")

  // Mock data - in a real app, this would come from your API or state
  const students = [
    {
      id: 1,
      name: "John Doe",
      studentId: "S12345",
      grade: "A",
      percentage: 92,
      lastSubmission: "Apr 20, 2025",
      status: "On Track",
      missingAssignments: 0,
    },
    {
      id: 2,
      name: "Jane Smith",
      studentId: "S12346",
      grade: "B+",
      percentage: 87,
      lastSubmission: "Apr 18, 2025",
      status: "On Track",
      missingAssignments: 1,
    },
    {
      id: 3,
      name: "Alex Johnson",
      studentId: "S12347",
      grade: "C",
      percentage: 75,
      lastSubmission: "Apr 15, 2025",
      status: "At Risk",
      missingAssignments: 3,
    },
    {
      id: 4,
      name: "Sarah Williams",
      studentId: "S12348",
      grade: "A-",
      percentage: 90,
      lastSubmission: "Apr 19, 2025",
      status: "On Track",
      missingAssignments: 0,
    },
    {
      id: 5,
      name: "Michael Brown",
      studentId: "S12349",
      grade: "B",
      percentage: 83,
      lastSubmission: "Apr 17, 2025",
      status: "On Track",
      missingAssignments: 1,
    },
    {
      id: 6,
      name: "Emily Davis",
      studentId: "S12350",
      grade: "D+",
      percentage: 68,
      lastSubmission: "Apr 10, 2025",
      status: "At Risk",
      missingAssignments: 4,
    },
    {
      id: 7,
      name: "David Wilson",
      studentId: "S12351",
      grade: "B-",
      percentage: 80,
      lastSubmission: "Apr 16, 2025",
      status: "On Track",
      missingAssignments: 2,
    },
    {
      id: 8,
      name: "Olivia Martinez",
      studentId: "S12352",
      grade: "A+",
      percentage: 98,
      lastSubmission: "Apr 21, 2025",
      status: "Excellent",
      missingAssignments: 0,
    },
  ]

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.studentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

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
            <TableHead>Last Submission</TableHead>
            <TableHead>
              <Button variant="ghost" onClick={() => handleSort("status")} className="flex items-center gap-1 px-0">
                Status
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead>
              <Button
                variant="ghost"
                onClick={() => handleSort("missingAssignments")}
                className="flex items-center gap-1 px-0"
              >
                Missing
                <ArrowUpDown className="h-4 w-4" />
              </Button>
            </TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStudents.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell >{student.studentId}</TableCell>
              <TableCell>{student.grade}</TableCell>
              <TableCell>{student.percentage}%</TableCell>
              <TableCell>{student.lastSubmission}</TableCell>
              <TableCell>
                <Badge
                  variant="outline"
                  className={
                    student.status === "Excellent"
                      ? "bg-green-50 text-green-700 hover:bg-green-50"
                      : student.status === "On Track"
                        ? "bg-blue-50 text-blue-700 hover:bg-blue-50"
                        : "bg-red-50 text-red-700 hover:bg-red-50"
                  }
                >
                  {student.status}
                </Badge>
              </TableCell>
              <TableCell>{student.missingAssignments}</TableCell>
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
                    <DropdownMenuItem className="cursor-pointer">
                      <Eye className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <MessageSquare className="mr-2 h-4 w-4" />
                      Send Feedback
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="cursor-pointer">
                      <Download className="mr-2 h-4 w-4" />
                      Export Report
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

StudentTable.propTypes = {
  searchQuery: PropTypes.string,
}

StudentTable.defaultProps = {
  searchQuery: "",
}
