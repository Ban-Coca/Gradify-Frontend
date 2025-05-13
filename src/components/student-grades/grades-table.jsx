"use client"

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Badge } from "../../components/ui/badge"

export function GradesTable({ courseFilter, searchQuery }) {
  // This would typically come from an API
  const grades = [
    {
      id: 1,
      course: "CS101 - Introduction to Programming",
      courseId: "cs101",
      category: "Quiz",
      grade: 4.7,
      letterGrade: "A",
      classAverage: 4.2,
      date: "2023-10-15",
    },
    {
      id: 2,
      course: "CS101 - Introduction to Programming",
      courseId: "cs101",
      category: "Assignment",
      grade: 4.3,
      letterGrade: "B+",
      classAverage: 4.0,
      date: "2023-10-10",
    },
    {
      id: 3,
      course: "CS201 - Data Structures",
      courseId: "cs201",
      category: "Project",
      grade: 4.8,
      letterGrade: "A",
      classAverage: 4.3,
      date: "2023-10-08",
    },
    {
      id: 4,
      course: "CS301 - Algorithms",
      courseId: "cs301",
      category: "Exam",
      grade: 4.1,
      letterGrade: "B",
      classAverage: 3.9,
      date: "2023-10-05",
    },
    {
      id: 5,
      course: "CS401 - Software Engineering",
      courseId: "cs401",
      category: "Quiz",
      grade: 3.5,
      letterGrade: "C+",
      classAverage: 3.4,
      date: "2023-10-01",
    },
  ]

  // Filter grades based on course selection and search query
  const filteredGrades = grades.filter((grade) => {
    const matchesCourse = courseFilter === "all" || grade.courseId === courseFilter
    const matchesSearch =
      grade.course.toLowerCase().includes(searchQuery.toLowerCase()) ||
      grade.category.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCourse && matchesSearch
  })

  const getGradeBadgeVariant = (grade) => {
    if (grade >= 4.5) return "success"
    if (grade >= 4.0) return "default"
    if (grade >= 3.0) return "warning"
    return "destructive"
  }

  const getCategoryBadgeVariant = (category) => {
    switch (category) {
      case "Quiz":
        return "secondary"
      case "Assignment":
        return "default"
      case "Project":
        return "outline"
      case "Exam":
        return "destructive"
      default:
        return "default"
    }
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Course</TableHead>
          <TableHead className="text-center">Category</TableHead>
          <TableHead className="text-center">Grade</TableHead>
          <TableHead className="text-center">Class Average</TableHead>
          <TableHead className="text-right">Date</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredGrades.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="h-24 text-center">
              No grades found.
            </TableCell>
          </TableRow>
        ) : (
          filteredGrades.map((grade) => (
            <TableRow key={grade.id}>
              <TableCell className="font-medium">{grade.course}</TableCell>
              <TableCell className="text-center">
                <Badge variant={getCategoryBadgeVariant(grade.category)}>{grade.category}</Badge>
              </TableCell>
              <TableCell className="text-center">
                <Badge variant={getGradeBadgeVariant(grade.grade)} className="min-w-[60px]">
                  {grade.grade.toFixed(1)}
                </Badge>
              </TableCell>
              <TableCell className="text-center">{grade.classAverage.toFixed(1)}</TableCell>
              <TableCell className="text-right">{formatDate(grade.date)}</TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  )
}
