"use client"

import { useEffect, useState } from "react"

export function SubjectComparison({ period }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Update the comparison data to use 1-5 scale
  const getComparisonData = () => {
    return [
      { subject: "CS101 - Introduction to Programming", grade: 4.7, classAverage: 4.2 },
      { subject: "CS201 - Data Structures", grade: 4.3, classAverage: 4.0 },
      { subject: "CS301 - Algorithms", grade: 4.1, classAverage: 3.9 },
      { subject: "CS401 - Software Engineering", grade: 3.5, classAverage: 3.4 },
      { subject: "CS501 - Computer Networks", grade: 4.8, classAverage: 4.4 },
    ]
  }

  const comparisonData = getComparisonData()

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse bg-muted h-48 w-full rounded-md"></div>
      </div>
    )
  }

  // Replace the return statement with improved styling
  return (
    <div className="space-y-8">
      {comparisonData.map((item, index) => (
        <div key={index} className="space-y-3 bg-card rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">{item.subject}</div>
            <div className="text-sm">
              <span className="font-bold text-primary">{item.grade.toFixed(1)}</span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-muted-foreground">{item.classAverage.toFixed(1)}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Your Grade</span>
                <span className="text-xs font-bold">{item.grade.toFixed(1)}/5.0</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-primary rounded-full" style={{ width: `${(item.grade / 5) * 100}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Class Average</span>
                <span className="text-xs font-medium text-muted-foreground">{item.classAverage.toFixed(1)}/5.0</span>
              </div>
              <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-muted-foreground/60 rounded-full"
                  style={{ width: `${(item.classAverage / 5) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-muted-foreground">
              {item.grade > item.classAverage
                ? `You're ${(((item.grade - item.classAverage) / 5) * 100).toFixed(1)}% above the class average`
                : item.grade < item.classAverage
                  ? `You're ${(((item.classAverage - item.grade) / 5) * 100).toFixed(1)}% below the class average`
                  : `You're at the class average`}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
