"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"

export function GPASection() {
  // This would typically come from an API
  const gpaData = {
    currentGPA: 4.2,
    maxGPA: 5.0,
    percentComplete: 84.0,
    lastUpdated: "October 15, 2023",
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Current GPA</CardTitle>
        <CardDescription>Last updated on {gpaData.lastUpdated}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between">
          <div className="text-4xl font-bold">{gpaData.currentGPA}</div>
          <div className="text-sm text-muted-foreground">out of {gpaData.maxGPA}</div>
        </div>
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div>Overall Progress</div>
            <div className="font-medium">{gpaData.percentComplete}%</div>
          </div>
          <Progress value={gpaData.percentComplete} className="h-2" />
        </div>
      </CardContent>
    </Card>
  )
}
