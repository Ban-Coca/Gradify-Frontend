"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { Progress } from "../../components/ui/progress"
import { Input } from "../../components/ui/input"
import { Search } from "lucide-react"

export function CourseGrades({ courseId }) {
  const [searchQuery, setSearchQuery] = useState("")

  // This would typically come from an API based on courseId
  const getCourseData = () => {
    const courses = {
      cs101: {
        id: "cs101",
        name: "CS101 - Introduction to Programming",
        instructor: "Dr. Smith",
        overallGrade: 4.5,
        assessments: {
          quizzes: [
            { id: 1, name: "Variables and Data Types", grade: 4.7, date: "2023-09-10", weight: 5 },
            { id: 2, name: "Control Flow", grade: 4.3, date: "2023-09-24", weight: 5 },
            { id: 3, name: "Functions", grade: 4.8, date: "2023-10-08", weight: 5 },
          ],
          assignments: [
            { id: 1, name: "Basic Programming Concepts", grade: 4.5, date: "2023-09-15", weight: 15 },
            { id: 2, name: "Control Structures Implementation", grade: 4.2, date: "2023-10-01", weight: 15 },
            { id: 3, name: "Function Library", grade: 4.6, date: "2023-10-15", weight: 15 },
          ],
          exams: [
            { id: 1, name: "Midterm Exam", grade: 4.4, date: "2023-10-20", weight: 20 },
            { id: 2, name: "Final Exam", grade: null, date: "2023-12-15", weight: 20 },
          ],
        },
      },
      cs201: {
        id: "cs201",
        name: "CS201 - Data Structures",
        instructor: "Dr. Johnson",
        overallGrade: 4.2,
        assessments: {
          quizzes: [
            { id: 1, name: "Arrays and Lists", grade: 4.5, date: "2023-09-12", weight: 5 },
            { id: 2, name: "Stacks and Queues", grade: 4.0, date: "2023-09-26", weight: 5 },
            { id: 3, name: "Trees", grade: 4.3, date: "2023-10-10", weight: 5 },
          ],
          assignments: [
            { id: 1, name: "Array Implementation", grade: 4.4, date: "2023-09-18", weight: 15 },
            { id: 2, name: "Stack and Queue Applications", grade: 4.1, date: "2023-10-05", weight: 15 },
            { id: 3, name: "Binary Tree Implementation", grade: 4.3, date: "2023-10-22", weight: 15 },
          ],
          exams: [
            { id: 1, name: "Midterm Exam", grade: 4.0, date: "2023-10-25", weight: 20 },
            { id: 2, name: "Final Exam", grade: null, date: "2023-12-18", weight: 20 },
          ],
        },
      },
      cs301: {
        id: "cs301",
        name: "CS301 - Algorithms",
        instructor: "Prof. Williams",
        overallGrade: 4.0,
        assessments: {
          quizzes: [
            { id: 1, name: "Algorithm Analysis", grade: 4.2, date: "2023-09-14", weight: 5 },
            { id: 2, name: "Sorting Algorithms", grade: 3.8, date: "2023-09-28", weight: 5 },
            { id: 3, name: "Graph Algorithms", grade: 4.0, date: "2023-10-12", weight: 5 },
          ],
          assignments: [
            { id: 1, name: "Algorithm Analysis Report", grade: 4.1, date: "2023-09-20", weight: 15 },
            { id: 2, name: "Sorting Algorithm Implementation", grade: 3.9, date: "2023-10-07", weight: 15 },
            { id: 3, name: "Graph Algorithm Application", grade: 4.0, date: "2023-10-25", weight: 15 },
          ],
          exams: [
            { id: 1, name: "Midterm Exam", grade: 3.8, date: "2023-10-30", weight: 20 },
            { id: 2, name: "Final Exam", grade: null, date: "2023-12-20", weight: 20 },
          ],
        },
      },
      cs401: {
        id: "cs401",
        name: "CS401 - Software Engineering",
        instructor: "Dr. Davis",
        overallGrade: 3.8,
        assessments: {
          quizzes: [
            { id: 1, name: "Software Development Lifecycle", grade: 4.0, date: "2023-09-15", weight: 5 },
            { id: 2, name: "Requirements Engineering", grade: 3.7, date: "2023-09-29", weight: 5 },
            { id: 3, name: "Software Design Patterns", grade: 3.5, date: "2023-10-13", weight: 5 },
          ],
          assignments: [
            { id: 1, name: "Project Proposal", grade: 4.2, date: "2023-09-22", weight: 15 },
            { id: 2, name: "Requirements Specification", grade: 3.8, date: "2023-10-09", weight: 15 },
            { id: 3, name: "Software Design Document", grade: 3.6, date: "2023-10-27", weight: 15 },
          ],
          exams: [
            { id: 1, name: "Midterm Exam", grade: 3.5, date: "2023-11-02", weight: 20 },
            { id: 2, name: "Final Exam", grade: null, date: "2023-12-22", weight: 20 },
          ],
        },
      },
    }

    return courses[courseId] || null
  }

  const courseData = getCourseData()

  if (!courseData) {
    return <div>Course not found</div>
  }

  const filterAssessments = (assessments) => {
    if (!searchQuery) return assessments

    return assessments.filter((assessment) => assessment.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  const getGradeBadgeVariant = (grade) => {
    if (!grade) return "outline"
    if (grade >= 4.5) return "success"
    if (grade >= 4.0) return "default"
    if (grade >= 3.0) return "warning"
    return "destructive"
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>{courseData.name}</CardTitle>
              <CardDescription>Instructor: {courseData.instructor}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="text-sm font-medium">Overall Grade:</div>
              <Badge variant={getGradeBadgeVariant(courseData.overallGrade)} className="text-lg px-3 py-1">
                {courseData.overallGrade.toFixed(1)}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex items-center justify-between text-sm mb-2">
              <div>Course Progress</div>
              <div className="font-medium">{Math.round((courseData.overallGrade / 5) * 100)}%</div>
            </div>
            <Progress value={(courseData.overallGrade / 5) * 100} className="h-2" />
          </div>

          <div className="relative mb-6">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search assessments..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <Tabs defaultValue="all">
            <TabsList className="mb-4 w-full grid grid-cols-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="quizzes">Quizzes</TabsTrigger>
              <TabsTrigger value="assignments">Assignments</TabsTrigger>
              <TabsTrigger value="exams">Exams</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {Object.entries(courseData.assessments).map(([category, items]) => (
                <div key={category}>
                  <h3 className="text-lg font-medium capitalize mb-3">{category}</h3>
                  <div className="space-y-3">
                    {filterAssessments(items).map((assessment) => (
                      <div
                        key={assessment.id}
                        className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                      >
                        <div>
                          <div className="font-medium">{assessment.name}</div>
                          <div className="text-sm text-muted-foreground">
                            {formatDate(assessment.date)} • Weight: {assessment.weight}%
                          </div>
                        </div>
                        {assessment.grade ? (
                          <Badge variant={getGradeBadgeVariant(assessment.grade)}>{assessment.grade.toFixed(1)}</Badge>
                        ) : (
                          <Badge variant="outline">Upcoming</Badge>
                        )}
                      </div>
                    ))}
                    {filterAssessments(items).length === 0 && (
                      <div className="text-center py-4 text-muted-foreground">No matching assessments found</div>
                    )}
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-3">
              {filterAssessments(courseData.assessments.quizzes).map((quiz) => (
                <div
                  key={quiz.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                >
                  <div>
                    <div className="font-medium">{quiz.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(quiz.date)} • Weight: {quiz.weight}%
                    </div>
                  </div>
                  {quiz.grade ? (
                    <Badge variant={getGradeBadgeVariant(quiz.grade)}>{quiz.grade.toFixed(1)}</Badge>
                  ) : (
                    <Badge variant="outline">Upcoming</Badge>
                  )}
                </div>
              ))}
              {filterAssessments(courseData.assessments.quizzes).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No matching quizzes found</div>
              )}
            </TabsContent>

            <TabsContent value="assignments" className="space-y-3">
              {filterAssessments(courseData.assessments.assignments).map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                >
                  <div>
                    <div className="font-medium">{assignment.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(assignment.date)} • Weight: {assignment.weight}%
                    </div>
                  </div>
                  {assignment.grade ? (
                    <Badge variant={getGradeBadgeVariant(assignment.grade)}>{assignment.grade.toFixed(1)}</Badge>
                  ) : (
                    <Badge variant="outline">Upcoming</Badge>
                  )}
                </div>
              ))}
              {filterAssessments(courseData.assessments.assignments).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No matching assignments found</div>
              )}
            </TabsContent>

            <TabsContent value="exams" className="space-y-3">
              {filterAssessments(courseData.assessments.exams).map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 border rounded-md hover:bg-accent/50"
                >
                  <div>
                    <div className="font-medium">{exam.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {formatDate(exam.date)} • Weight: {exam.weight}%
                    </div>
                  </div>
                  {exam.grade ? (
                    <Badge variant={getGradeBadgeVariant(exam.grade)}>{exam.grade.toFixed(1)}</Badge>
                  ) : (
                    <Badge variant="outline">Upcoming</Badge>
                  )}
                </div>
              ))}
              {filterAssessments(courseData.assessments.exams).length === 0 && (
                <div className="text-center py-4 text-muted-foreground">No matching exams found</div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Grade Breakdown</CardTitle>
          <CardDescription>Distribution of your grade by assessment type</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.entries(courseData.assessments).map(([category, items]) => {
              const totalWeight = items.reduce((sum, item) => sum + item.weight, 0)
              const completedWeight = items
                .filter((item) => item.grade !== null)
                .reduce((sum, item) => sum + item.weight, 0)
              const weightedGrade = items
                .filter((item) => item.grade !== null)
                .reduce((sum, item) => sum + (item.grade * item.weight) / 5, 0)
              const categoryAverage = completedWeight > 0 ? (weightedGrade / completedWeight) * 5 : 0

              return (
                <div key={category} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="capitalize font-medium">{category}</div>
                    <div className="text-sm">
                      {categoryAverage.toFixed(1)} • Weight: {totalWeight}%
                    </div>
                  </div>
                  <Progress value={(categoryAverage / 5) * 100} className="h-2" />
                  <div className="text-xs text-muted-foreground">
                    {completedWeight}/{totalWeight}% completed
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
