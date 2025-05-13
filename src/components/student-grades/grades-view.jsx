"use client"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Input } from "../../components/ui/input"
import { Download, Search, FileText } from "lucide-react"
import { CourseGrades } from "./course-grades"
import { GPASection } from "./gpa-section"
import { Badge } from "../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export function GradesView() {
  const [selectedCourse, setSelectedCourse] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedPeriod, setSelectedPeriod] = useState("current")

  // This would typically come from an API
  const courses = [
    { id: "cs101", name: "CS101 - Introduction to Programming", lastUpdated: "2 days ago" },
    { id: "cs201", name: "CS201 - Data Structures", lastUpdated: "1 week ago" },
    { id: "cs301", name: "CS301 - Algorithms", lastUpdated: "3 days ago" },
    { id: "cs401", name: "CS401 - Software Engineering", lastUpdated: "5 days ago" },
  ]

  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semester" },
    { id: "year", name: "Academic Year" },
  ]

  return (
    <div className="space-y-4">
      {!selectedCourse ? (
        <>
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-2 flex-1">
              <div className="relative flex-1 min-w-[200px]">
                <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search courses..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  {periods.map((period) => (
                    <SelectItem key={period.id} value={period.id}>
                      {period.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export All Grades
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Print grades</span>
              </Button>
            </div>
          </div>

          <Tabs defaultValue="courses" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="courses">Courses</TabsTrigger>
              <TabsTrigger value="summary">Grade Summary</TabsTrigger>
            </TabsList>

            <TabsContent value="courses" className="mt-4">
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2">
                {courses
                  .filter((course) => course.name.toLowerCase().includes(searchQuery.toLowerCase()))
                  .map((course) => (
                    <Card
                      key={course.id}
                      className="cursor-pointer hover:bg-accent/50 transition-colors"
                      onClick={() => setSelectedCourse(course.id)}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="text-lg font-medium">{course.name}</h3>
                            <p className="text-sm text-muted-foreground mt-1">Last updated: {course.lastUpdated}</p>
                          </div>
                          <Button variant="ghost" size="sm">
                            View Grades
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="summary" className="mt-4">
              <GPASection />

              <Card className="mt-4">
                <CardHeader>
                  <CardTitle>Grade Distribution</CardTitle>
                  <CardDescription>Overview of your grades by category</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-5 gap-4">
                      {["4.5-5.0", "4.0-4.4", "3.5-3.9", "3.0-3.4", "1.0-2.9"].map((range, index) => {
                        const count = [5, 8, 6, 3, 1][index]
                        const total = 23
                        const percentage = Math.round((count / total) * 100)

                        return (
                          <Card key={range} className="text-center">
                            <CardContent className="p-4">
                              <Badge
                                variant={
                                  index === 0
                                    ? "success"
                                    : index === 1
                                      ? "default"
                                      : index === 2
                                        ? "secondary"
                                        : index === 3
                                          ? "warning"
                                          : "destructive"
                                }
                                className="mb-2"
                              >
                                {range}
                              </Badge>
                              <div className="text-2xl font-bold">{count}</div>
                              <div className="text-xs text-muted-foreground">{percentage}%</div>
                            </CardContent>
                          </Card>
                        )
                      })}
                    </div>

                    <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
                      {[
                        { range: "4.5-5.0", count: 5, color: "hsl(var(--success))" },
                        { range: "4.0-4.4", count: 8, color: "hsl(var(--primary))" },
                        { range: "3.5-3.9", count: 6, color: "hsl(var(--secondary))" },
                        { range: "3.0-3.4", count: 3, color: "hsl(var(--warning))" },
                        { range: "1.0-2.9", count: 1, color: "hsl(var(--destructive))" },
                      ].map((item) => {
                        const total = 23
                        const percentage = (item.count / total) * 100

                        return percentage > 0 ? (
                          <div
                            key={item.range}
                            className="h-full flex items-center justify-center text-xs font-medium text-white"
                            style={{
                              width: `${percentage}%`,
                              backgroundColor: item.color,
                            }}
                          >
                            {percentage > 10 ? `${item.range}: ${Math.round(percentage)}%` : ""}
                          </div>
                        ) : null
                      })}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <>
          <div className="flex items-center justify-between">
            <Button variant="ghost" onClick={() => setSelectedCourse(null)} className="mb-4">
              ← Back to All Courses
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Export Course Grades
              </Button>
              <Button variant="outline" size="icon">
                <FileText className="h-4 w-4" />
                <span className="sr-only">Print course grades</span>
              </Button>
            </div>
          </div>
          <CourseGrades courseId={selectedCourse} />
        </>
      )}
    </div>
  )
}
