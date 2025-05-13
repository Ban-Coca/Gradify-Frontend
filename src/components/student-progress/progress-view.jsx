"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { PerformanceChart } from "./performance-chart"
import { GradeDistribution } from "./grade-distribution"
import { SubjectComparison } from "./subject-comparison"
import { ImprovementAreas } from "./improvement-areas"
import { Button } from "../../components/ui/button"
import { Filter, X, Download, Calendar, BarChart } from "lucide-react"
import { Badge } from "../../components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"

export function ProgressView() {
  const [selectedPeriod, setSelectedPeriod] = useState("current")
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [showFilters, setShowFilters] = useState(false)

  // This would typically come from an API
  const periods = [
    { id: "current", name: "Current Semester" },
    { id: "previous", name: "Previous Semester" },
    { id: "year", name: "Academic Year" },
    { id: "custom", name: "Custom Range" },
  ]

  const subjects = [
    { id: "all", name: "All Courses" },
    { id: "cs101", name: "CS101 - Introduction to Programming" },
    { id: "cs201", name: "CS201 - Data Structures" },
    { id: "cs301", name: "CS301 - Algorithms" },
    { id: "cs401", name: "CS401 - Software Engineering" },
  ]

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className={showFilters ? "bg-muted" : ""}
            >
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>

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
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
            <Button variant="outline" size="sm">
              <Calendar className="h-4 w-4 mr-2" />
              Set Goals
            </Button>
          </div>
        </div>

        {showFilters && (
          <Card className="border border-input">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Course</h3>
                  <div className="flex flex-wrap gap-2">
                    {subjects.map((subject) => (
                      <Badge
                        key={subject.id}
                        variant={selectedSubject === subject.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedSubject(subject.id)}
                      >
                        {subject.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPeriod("current")
                      setSelectedSubject("all")
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active filters display */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedPeriod !== "current" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {periods.find((p) => p.id === selectedPeriod)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedPeriod("current")} />
            </Badge>
          )}
          {selectedSubject !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {subjects.find((s) => s.id === selectedSubject)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedSubject("all")} />
            </Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="performance" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Grade Distribution</TabsTrigger>
          <TabsTrigger value="comparison">Course Comparison</TabsTrigger>
          <TabsTrigger value="improvement">Improvement Areas</TabsTrigger>
        </TabsList>
        <TabsContent value="performance">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle>Performance Trend</CardTitle>
                <CardDescription>
                  Your academic performance over{" "}
                  {selectedPeriod === "current"
                    ? "the current semester"
                    : selectedPeriod === "previous"
                      ? "the previous semester"
                      : "the academic year"}
                  {selectedSubject !== "all" && ` for ${subjects.find((s) => s.id === selectedSubject)?.name}`}
                </CardDescription>
              </div>
              <Button variant="outline" size="sm">
                <BarChart className="h-4 w-4 mr-2" />
                Change Chart Type
              </Button>
            </CardHeader>
            <CardContent>
              <PerformanceChart period={selectedPeriod} subject={selectedSubject} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="distribution">
          <Card>
            <CardHeader>
              <CardTitle>Grade Distribution</CardTitle>
              <CardDescription>Distribution of your grades across different assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <GradeDistribution period={selectedPeriod} subject={selectedSubject} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="comparison">
          <Card>
            <CardHeader>
              <CardTitle>Course Comparison</CardTitle>
              <CardDescription>Compare your performance across different courses</CardDescription>
            </CardHeader>
            <CardContent>
              <SubjectComparison period={selectedPeriod} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="improvement">
          <Card>
            <CardHeader>
              <CardTitle>Improvement Areas</CardTitle>
              <CardDescription>Areas where you can focus to improve your performance</CardDescription>
            </CardHeader>
            <CardContent>
              <ImprovementAreas period={selectedPeriod} subject={selectedSubject} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
