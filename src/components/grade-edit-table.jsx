import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Save } from "lucide-react"

export function GradeEditTable() {
  // Sample grade data
  const grades = [
    {
      id: 1,
      name: "Emma Johnson",
      studentId: "S10045",
      midterm: 92,
      finalProject: 88,
      homework1: 95,
      homework2: 90,
      homework3: 85,
      participation: 95,
    },
    {
      id: 2,
      name: "Michael Smith",
      studentId: "S10046",
      midterm: 78,
      finalProject: 82,
      homework1: 75,
      homework2: 80,
      homework3: 85,
      participation: 70,
    },
    {
      id: 3,
      name: "Sophia Garcia",
      studentId: "S10047",
      midterm: 85,
      finalProject: 90,
      homework1: 88,
      homework2: 92,
      homework3: 85,
      participation: 90,
    },
    {
      id: 4,
      name: "James Wilson",
      studentId: "S10048",
      midterm: 90,
      finalProject: 85,
      homework1: 92,
      homework2: 88,
      homework3: 90,
      participation: 85,
    },
    {
      id: 5,
      name: "Olivia Martinez",
      studentId: "S10049",
      midterm: 68,
      finalProject: 72,
      homework1: 65,
      homework2: 70,
      homework3: 75,
      participation: 60,
    },
  ]

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Student Name</TableHead>
            <TableHead>Student ID</TableHead>
            <TableHead>Midterm</TableHead>
            <TableHead>Final Project</TableHead>
            <TableHead>HW 1</TableHead>
            <TableHead>HW 2</TableHead>
            <TableHead>HW 3</TableHead>
            <TableHead>Participation</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {grades.map((student) => (
            <TableRow key={student.id}>
              <TableCell className="font-medium">{student.name}</TableCell>
              <TableCell>{student.studentId}</TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.midterm}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.finalProject}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.homework1}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.homework2}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.homework3}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell>
                <input
                  type="number"
                  defaultValue={student.participation}
                  className="w-16 p-1 border rounded-md"
                  min="0"
                  max="100"
                />
              </TableCell>
              <TableCell className="text-right">
                <Button variant="outline" size="sm">
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}