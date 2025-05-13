"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export function GradeDistribution({ period, subject }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // This would typically come from an API based on period and subject
  const getDistributionData = () => {
    // Updated to use 1-5 scale instead of letter grades
    return {
      "4.5-5.0": 5, // Excellent
      "4.0-4.4": 8, // Very Good
      "3.5-3.9": 6, // Good
      "3.0-3.4": 3, // Satisfactory
      "1.0-2.9": 1, // Needs Improvement
    }
  }

  const distributionData = getDistributionData()
  const total = Object.values(distributionData).reduce((sum, count) => sum + count, 0)

  const getGradeBadgeVariant = (gradeRange) => {
    switch (gradeRange) {
      case "4.5-5.0":
        return "success"
      case "4.0-4.4":
        return "default"
      case "3.5-3.9":
        return "secondary"
      case "3.0-3.4":
        return "warning"
      case "1.0-2.9":
        return "destructive"
      default:
        return "default"
    }
  }

  const getGradeColor = (gradeRange) => {
    switch (gradeRange) {
      case "4.5-5.0":
        return "hsl(var(--success))"
      case "4.0-4.4":
        return "hsl(var(--primary))"
      case "3.5-3.9":
        return "hsl(var(--secondary))"
      case "3.0-3.4":
        return "hsl(var(--warning))"
      case "1.0-2.9":
        return "hsl(var(--destructive))"
      default:
        return "hsl(var(--primary))"
    }
  }

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse bg-muted h-48 w-full rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-5 gap-4">
        {Object.entries(distributionData).map(([gradeRange, count]) => (
          <Card key={gradeRange} className="text-center">
            <CardContent className="p-4">
              <Badge variant={getGradeBadgeVariant(gradeRange)} className="mb-2">
                {gradeRange}
              </Badge>
              <div className="text-2xl font-bold">{count}</div>
              <div className="text-xs text-muted-foreground">{total > 0 ? Math.round((count / total) * 100) : 0}%</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
        {Object.entries(distributionData).map(([gradeRange, count]) => {
          const percentage = total > 0 ? (count / total) * 100 : 0
          return percentage > 0 ? (
            <div
              key={gradeRange}
              className="h-full flex items-center justify-center text-xs font-medium text-white"
              style={{
                width: `${percentage}%`,
                backgroundColor: getGradeColor(gradeRange),
              }}
            >
              {percentage > 10 ? `${gradeRange}: ${Math.round(percentage)}%` : ""}
            </div>
          ) : null
        })}
      </div>
    </div>
  )
}
