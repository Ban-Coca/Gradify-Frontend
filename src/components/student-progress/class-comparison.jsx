import { useEffect, useState } from "react"

export function SubjectComparison({ comparisonData = [] }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="h-64 flex items-center justify-center">
        <div className="animate-pulse bg-muted h-48 w-full rounded-md"></div>
      </div>
    )
  }

  if (!comparisonData.length) {
    return <div className="text-muted-foreground">No comparison data available.</div>
  }

  return (
    <div className="space-y-8">
      {comparisonData.map((item, index) => (
        <div key={item.className || index} className="space-y-3 bg-card rounded-lg p-4 border shadow-sm">
          <div className="flex items-center justify-between">
            <div className="font-medium text-lg">{item.className}</div>
            <div className="text-sm">
              <span className="font-bold text-primary">{item.grade?.toFixed(1) ?? "N/A"}</span>
              <span className="mx-2 text-muted-foreground">/</span>
              <span className="text-muted-foreground">{item.classAverage?.toFixed(1) ?? "N/A"}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Your Grade</span>
                <span className="text-xs font-bold">{item.grade?.toFixed(1) ?? "N/A"}%</span>
              </div>
              <div className="h-2 w-full bg-green-100 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full" style={{ width: `${item.grade ?? 0}%` }}></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-xs font-medium">Class Average</span>
                <span className="text-xs font-medium text-muted-foreground">{item.classAverage?.toFixed(1) ?? "N/A"}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gray-400 rounded-full"
                  style={{ width: `${item.classAverage ?? 0}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="pt-2">
            <div className="text-xs text-muted-foreground">
              {item.grade != null && item.classAverage != null ? (
                item.grade > item.classAverage
                  ? `You're ${(item.grade - item.classAverage).toFixed(1)}% above the class average`
                  : item.grade < item.classAverage
                    ? `You're ${(item.classAverage - item.grade).toFixed(1)}% below the class average`
                    : `You're at the class average`
              ) : "No comparison available"}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}