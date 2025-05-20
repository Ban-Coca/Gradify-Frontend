"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp } from "lucide-react"

export function ImprovementAreas({ period, subject }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // This would typically come from an API based on period and subject
  const getImprovementData = () => {
    return [
      {
        area: "Algorithm Analysis",
        subject: "CS301 - Algorithms",
        courseId: "cs301",
        currentScore: 3.8,
        previousScore: 3.4,
        trend: "up",
        skillCategory: "Analytical Skills",
        recommendation: "Continue practicing time complexity analysis and review optimization techniques.",
      },
      {
        area: "Code Quality",
        subject: "CS101 - Introduction to Programming",
        courseId: "cs101",
        currentScore: 4.1,
        previousScore: 4.3,
        trend: "down",
        skillCategory: "Software Craftsmanship",
        recommendation: "Review code organization principles and practice writing cleaner, more maintainable code.",
      },
      {
        area: "Data Structure Implementation",
        subject: "CS201 - Data Structures",
        courseId: "cs201",
        currentScore: 3.9,
        previousScore: 3.6,
        trend: "up",
        skillCategory: "Implementation Skills",
        recommendation: "Focus on efficient implementations and memory management techniques.",
      },
      {
        area: "Project Planning",
        subject: "CS401 - Software Engineering",
        courseId: "cs401",
        currentScore: 3.4,
        previousScore: 3.7,
        trend: "down",
        skillCategory: "Project Management",
        recommendation:
          "Review agile methodologies and practice creating detailed project plans with clear milestones.",
      },
    ]
  }

  const improvementData = getImprovementData().filter((item) => subject === "all" || item.courseId === subject)

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse bg-muted h-48 w-full rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {improvementData.map((item, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-medium flex items-center gap-2">
                  {item.area}
                  {item.trend === "up" ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  )}
                </h3>
                <p className="text-sm text-muted-foreground">{item.subject}</p>
                <Badge variant="outline" className="mt-1">
                  {item.skillCategory}
                </Badge>
              </div>
              <Badge variant={item.trend === "up" ? "outline" : "destructive"} className="ml-2">
                {item.currentScore.toFixed(1)} ({item.trend === "up" ? "+" : "-"}
                {Math.abs(item.currentScore - item.previousScore).toFixed(1)})
              </Badge>
            </div>
            <div className="mt-4">
              <div className="flex items-start gap-2">
                {item.trend === "up" ? (
                  <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                )}
                <p className="text-sm">{item.recommendation}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
