"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { Badge } from "../../components/ui/badge"
import { TrendingDown, TrendingUp } from "lucide-react"

export function SubjectPerformance() {
  // This would typically come from an API or database
  const subjects = {
    currentSemester: [
      {
        id: 1,
        name: "CS101",
        grade: 4.7,
        percentage: 94,
        trend: "up",
        weakAreas: ["Assignments", "Quizzes"],
        strongAreas: ["Exams", "Projects"],
      },
      {
        id: 2,
        name: "CS201",
        grade: 4.3,
        percentage: 86,
        trend: "up",
        weakAreas: ["Exams"],
        strongAreas: ["Assignments", "Projects"],
      },
      {
        id: 3,
        name: "CS301",
        grade: 4.5,
        percentage: 90,
        trend: "down",
        weakAreas: ["Quizzes", "Assignments"],
        strongAreas: ["Exams"],
      },
      {
        id: 4,
        name: "CS401",
        grade: 4.0,
        percentage: 80,
        trend: "up",
        weakAreas: ["Projects"],
        strongAreas: ["Quizzes", "Assignments"],
      },
    ],
    previousSemester: [
      {
        id: 1,
        name: "CS101",
        grade: 4.3,
        percentage: 86,
        trend: "up",
        weakAreas: ["Assignments"],
        strongAreas: ["Exams"],
      },
      {
        id: 2,
        name: "CS201",
        grade: 4.0,
        percentage: 80,
        trend: "up",
        weakAreas: ["Projects", "Exams"],
        strongAreas: ["Assignments"],
      },
      {
        id: 3,
        name: "CS301",
        grade: 4.7,
        percentage: 94,
        trend: "up",
        weakAreas: [],
        strongAreas: ["Assignments", "Quizzes", "Exams"],
      },
      {
        id: 4,
        name: "CS401",
        grade: 3.5,
        percentage: 70,
        trend: "down",
        weakAreas: ["Assignments", "Exams", "Projects"],
        strongAreas: ["Quizzes"],
      },
    ],
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Subject Performance</CardTitle>
        <CardDescription>Detailed breakdown of your performance by subject</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="currentSemester">
          <TabsList className="mb-4">
            <TabsTrigger value="currentSemester">Current Semester</TabsTrigger>
            <TabsTrigger value="previousSemester">Previous Semester</TabsTrigger>
          </TabsList>
          <TabsContent value="currentSemester">
            <div className="space-y-6">
              {subjects.currentSemester.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{subject.name}</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{subject.grade.toFixed(1)}</div>
                      {subject.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={(subject.grade / 5) * 100} className="h-2" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {subject.weakAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Needs improvement:</span>
                        {subject.weakAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-red-500 border-red-200 bg-red-50">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {subject.strongAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Strengths:</span>
                        {subject.strongAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-green-500 border-green-200 bg-green-50">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          <TabsContent value="previousSemester">
            <div className="space-y-6">
              {subjects.previousSemester.map((subject) => (
                <div key={subject.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">{subject.name}</div>
                    <div className="flex items-center space-x-2">
                      <div className="text-sm font-medium">{subject.grade.toFixed(1)}</div>
                      {subject.trend === "up" ? (
                        <TrendingUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <TrendingDown className="h-4 w-4 text-red-500" />
                      )}
                    </div>
                  </div>
                  <Progress value={(subject.grade / 5) * 100} className="h-2" />
                  <div className="flex flex-wrap gap-2 pt-2">
                    {subject.weakAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Needs improvement:</span>
                        {subject.weakAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-red-500 border-red-200 bg-red-50">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                    {subject.strongAreas.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        <span className="text-xs text-muted-foreground">Strengths:</span>
                        {subject.strongAreas.map((area) => (
                          <Badge key={area} variant="outline" className="text-green-500 border-green-200 bg-green-50">
                            {area}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
