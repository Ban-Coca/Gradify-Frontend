"use client"

import { useEffect, useState } from "react"

export function PerformanceChart({ period, subject }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // This would typically come from an API based on period and subject
  const getPerformanceData = () => {
    // Updated to use 1-5 scale instead of percentages
    const data = {
      current: {
        all: [3.8, 4.0, 4.2, 4.3, 4.5, 4.4, 4.2],
        cs101: [4.0, 4.2, 4.3, 4.5, 4.7, 4.6, 4.5],
        cs201: [3.8, 4.0, 4.1, 4.2, 4.3, 4.2, 4.1],
        cs301: [3.6, 3.8, 3.9, 4.0, 4.1, 4.0, 3.9],
        cs401: [3.4, 3.6, 3.7, 3.8, 3.9, 3.8, 3.7],
      },
      previous: {
        all: [3.6, 3.8, 3.9, 4.0, 4.1, 4.0, 3.9],
        cs101: [3.8, 4.0, 4.1, 4.2, 4.3, 4.2, 4.1],
        cs201: [3.6, 3.8, 3.9, 4.0, 4.1, 4.0, 3.9],
        cs301: [3.4, 3.6, 3.7, 3.8, 3.9, 3.8, 3.7],
        cs401: [3.2, 3.4, 3.5, 3.6, 3.7, 3.6, 3.5],
      },
      year: {
        all: [3.4, 3.6, 3.8, 4.0, 4.1, 4.2, 4.3, 4.2, 4.1, 4.0, 4.1, 4.2],
        cs101: [3.6, 3.8, 4.0, 4.2, 4.3, 4.4, 4.5, 4.4, 4.3, 4.2, 4.3, 4.4],
        cs201: [3.4, 3.6, 3.8, 4.0, 4.1, 4.2, 4.3, 4.2, 4.1, 4.0, 4.1, 4.2],
        cs301: [3.2, 3.4, 3.6, 3.8, 3.9, 4.0, 4.1, 4.0, 3.9, 3.8, 3.9, 4.0],
        cs401: [3.0, 3.2, 3.4, 3.6, 3.7, 3.8, 3.9, 3.8, 3.7, 3.6, 3.7, 3.8],
      },
    }

    return data[period][subject] || data.current.all
  }

  const performanceData = getPerformanceData()
  const labels =
    period === "year"
      ? ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
      : ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6", "Week 7"]

  if (!mounted) {
    return (
      <div className="h-80 flex items-center justify-center">
        <div className="animate-pulse bg-muted h-64 w-full rounded-md"></div>
      </div>
    )
  }

  return (
    <div className="h-80 relative">
      <div className="absolute inset-0 flex items-end">
        {performanceData.map((value, index) => (
          <div key={index} className="flex-1 mx-1 flex flex-col items-center" style={{ height: "100%" }}>
            <div className="text-xs text-muted-foreground mb-1">{value.toFixed(1)}</div>
            <div
              className="w-full bg-primary/80 rounded-t-sm transition-all duration-500 ease-in-out"
              style={{ height: `${(value / 5) * 100}%` }}
            ></div>
            <div className="text-xs text-muted-foreground mt-2">{labels[index]}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
