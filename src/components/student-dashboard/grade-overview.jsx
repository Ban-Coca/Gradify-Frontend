"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

export function GradeOverview() {
  // This would typically come from an API or database
  const grades = {
    currentGPA: 4.2,
    maxGPA: 5.0,
    percentComplete: 84.0,
    trend: "up",
    lastUpdated: "2 days ago",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Current GPA</CardTitle>
        <CardDescription>Last updated {grades.lastUpdated}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-4xl font-bold">{grades.currentGPA}</div>
          <div className="text-sm text-muted-foreground">out of {grades.maxGPA}</div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Overall Progress</div>
            <div className="font-medium">{grades.percentComplete}%</div>
          </div>
          <Progress value={grades.percentComplete} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
