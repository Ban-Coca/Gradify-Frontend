import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, BarChart3, Target, Info } from "lucide-react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

export function PseudoTrendChart({ allGrades = [], classes = [] }) {
  const [animatedHeights, setAnimatedHeights] = useState({})
  const [selectedPoint, setSelectedPoint] = useState(null)
  const [viewMode, setViewMode] = useState("bars") // bars, line, dots

  // Sort grades by classId (or use another property for order if available)
  const sortedGrades = [...allGrades].sort((a, b) => Number(a.classId) - Number(b.classId))

  // Map classId to className for display
  const classIdToName = {}
  classes.forEach((cls) => {
    classIdToName[cls.classId] = cls.className
  })

  useEffect(() => {
    if (sortedGrades.length > 0) {
      const timer = setTimeout(() => {
        const heights = {}
        sortedGrades.forEach((item) => {
          heights[item.classId] = item.grade
        })
        setAnimatedHeights(heights)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [sortedGrades])

  if (!sortedGrades.length) {
    return (
      <div className="text-center py-12">
        <BarChart3 className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Trend Data Available</h3>
        <p className="text-muted-foreground">Grade trends will appear here once you have multiple classes.</p>
      </div>
    )
  }

  const maxGrade = Math.max(...sortedGrades.map((item) => item.grade))
  const minGrade = Math.min(...sortedGrades.map((item) => item.grade))
  const averageGrade = sortedGrades.reduce((sum, item) => sum + item.grade, 0) / sortedGrades.length

  const getGradeColor = (grade) => {
    if (grade >= 90) return "bg-green-500"
    if (grade >= 80) return "bg-blue-500"
    if (grade >= 70) return "bg-yellow-500"
    if (grade >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getGradeTrend = () => {
    if (sortedGrades.length < 2) return "neutral"
    const firstHalf = sortedGrades.slice(0, Math.ceil(sortedGrades.length / 2))
    const secondHalf = sortedGrades.slice(Math.ceil(sortedGrades.length / 2))

    const firstAvg = firstHalf.reduce((sum, item) => sum + item.grade, 0) / firstHalf.length
    const secondAvg = secondHalf.reduce((sum, item) => sum + item.grade, 0) / secondHalf.length

    if (secondAvg > firstAvg + 2) return "improving"
    if (secondAvg < firstAvg - 2) return "declining"
    return "stable"
  }

  const trend = getGradeTrend()

  return (
    <div className="space-y-6">
      {/* Trend Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600">Average Grade</p>
              <p className="text-2xl font-bold text-blue-700">{averageGrade.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600">Highest</p>
              <p className="text-2xl font-bold text-green-700">{maxGrade.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-orange-50 border-orange-200">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-orange-600">Lowest</p>
              <p className="text-2xl font-bold text-orange-700">{minGrade.toFixed(1)}%</p>
            </div>
          </CardContent>
        </Card>

        <Card
          className={`${trend === "improving" ? "bg-green-50 border-green-200" : trend === "declining" ? "bg-red-50 border-red-200" : "bg-gray-50 border-gray-200"}`}
        >
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium">Trend</p>
              <div className="flex items-center justify-center gap-1">
                {trend === "improving" ? (
                  <TrendingUp className="h-5 w-5 text-green-600" />
                ) : trend === "declining" ? (
                  <TrendingDown className="h-5 w-5 text-red-600" />
                ) : (
                  <Target className="h-5 w-5 text-gray-600" />
                )}
                <span
                  className={`text-sm font-bold ${trend === "improving" ? "text-green-700" : trend === "declining" ? "text-red-700" : "text-gray-700"}`}
                >
                  {trend === "improving" ? "Improving" : trend === "declining" ? "Declining" : "Stable"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* View Mode Controls */}
      <div className="flex items-center gap-2">
        <span className="text-sm font-medium">View:</span>
        <Button variant={viewMode === "bars" ? "default" : "outline"} size="sm" onClick={() => setViewMode("bars")}>
          <BarChart3 className="h-4 w-4 mr-1" />
          Bars
        </Button>
        <Button variant={viewMode === "line" ? "default" : "outline"} size="sm" onClick={() => setViewMode("line")}>
          <TrendingUp className="h-4 w-4 mr-1" />
          Line
        </Button>
        <Button variant={viewMode === "dots" ? "default" : "outline"} size="sm" onClick={() => setViewMode("dots")}>
          <Target className="h-4 w-4 mr-1" />
          Dots
        </Button>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
            Grade Progression by Class Enrollment Order
          </CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Info className="h-4 w-4" />
            Click on any point to see detailed information
          </div>
        </CardHeader>
        <CardContent>
          <div className="relative">
            {/* Average line */}
            <div
              className="absolute w-full border-t-2 border-dashed border-gray-300 z-10"
              style={{ top: `${100 - averageGrade}%` }}
            >
              <span className="absolute -top-6 right-0 text-xs text-gray-500 bg-white px-2">
                Avg: {averageGrade.toFixed(1)}%
              </span>
            </div>

            {viewMode === "bars" && (
              <div className="flex items-end justify-between gap-2 h-64 p-4">
                {sortedGrades.map((item, idx) => {
                  const animatedHeight = animatedHeights[item.classId] || 0
                  const heightPercentage = (animatedHeight / 100) * 100
                  const className = classIdToName[item.classId] || `Class ${item.classId}`

                  return (
                    <div key={item.classId} className="flex flex-col items-center flex-1 group">
                      <div
                        className={`w-full max-w-16 rounded-t-lg transition-all duration-1000 ease-out cursor-pointer hover:opacity-80 ${getGradeColor(item.grade)} relative`}
                        style={{ height: `${heightPercentage}%`, minHeight: "8px" }}
                        onClick={() => setSelectedPoint(selectedPoint === item.classId ? null : item.classId)}
                      >
                        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Badge variant="secondary" className="text-xs">
                            {item.grade.toFixed(1)}%
                          </Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-xs text-center text-muted-foreground max-w-16 truncate">
                        {className}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {viewMode === "line" && (
              <div className="relative h-64 p-4">
                <svg className="w-full h-full">
                  {/* Grid lines */}
                  {[0, 25, 50, 75, 100].map((value) => (
                    <line
                      key={value}
                      x1="0"
                      y1={`${100 - value}%`}
                      x2="100%"
                      y2={`${100 - value}%`}
                      stroke="#e5e7eb"
                      strokeWidth="1"
                    />
                  ))}

                  {/* Line path */}
                  <polyline
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    points={sortedGrades
                      .map((item, idx) => {
                        const x = (idx / (sortedGrades.length - 1)) * 100
                        const y = 100 - item.grade
                        return `${x},${y}`
                      })
                      .join(" ")}
                  />

                  {/* Data points */}
                  {sortedGrades.map((item, idx) => {
                    const x = (idx / (sortedGrades.length - 1)) * 100
                    const y = 100 - item.grade
                    return (
                      <circle
                        key={item.classId}
                        cx={`${x}%`}
                        cy={`${y}%`}
                        r="6"
                        fill="#3b82f6"
                        className="cursor-pointer hover:r-8 transition-all"
                        onClick={() => setSelectedPoint(selectedPoint === item.classId ? null : item.classId)}
                      />
                    )
                  })}
                </svg>

                {/* Class labels */}
                <div className="flex justify-between mt-2">
                  {sortedGrades.map((item) => (
                    <div key={item.classId} className="text-xs text-center text-muted-foreground flex-1 truncate">
                      {classIdToName[item.classId] || `Class ${item.classId}`}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {viewMode === "dots" && (
              <div className="flex items-center justify-center py-8">
                <div className="flex items-end gap-4">
                  {sortedGrades.map((item, idx) => {
                    const className = classIdToName[item.classId] || `Class ${item.classId}`
                    return (
                      <div key={item.classId} className="flex flex-col items-center group">
                        <div
                          className={`w-16 h-16 rounded-full ${getGradeColor(item.grade)} flex items-center justify-center text-white font-bold text-sm shadow-lg cursor-pointer hover:scale-110 transition-all duration-200`}
                          onClick={() => setSelectedPoint(selectedPoint === item.classId ? null : item.classId)}
                        >
                          {item.grade.toFixed(0)}
                        </div>
                        <div className="mt-2 text-xs text-center text-muted-foreground max-w-16 truncate">
                          {className}
                        </div>
                        <Progress value={item.grade} className="mt-1 w-16 h-1" />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Selected Point Details */}
          {selectedPoint && (
            <Card className="mt-4 border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                {(() => {
                  const selectedItem = sortedGrades.find((item) => item.classId === selectedPoint)
                  const className = classIdToName[selectedItem.classId] || `Class ${selectedItem.classId}`
                  const position = sortedGrades.findIndex((item) => item.classId === selectedPoint) + 1

                  return (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <h4 className="font-medium">{className}</h4>
                        <p className="text-2xl font-bold text-primary">{selectedItem.grade.toFixed(1)}%</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Position in sequence</p>
                        <p className="text-lg font-semibold">
                          #{position} of {sortedGrades.length}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Compared to average</p>
                        <p
                          className={`text-lg font-semibold ${selectedItem.grade > averageGrade ? "text-green-600" : selectedItem.grade < averageGrade ? "text-red-600" : "text-gray-600"}`}
                        >
                          {selectedItem.grade > averageGrade ? "+" : ""}
                          {(selectedItem.grade - averageGrade).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  )
                })()}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Insights */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            Trend Analysis
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2">Performance Pattern:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>
                  • Grade range: {minGrade.toFixed(1)}% - {maxGrade.toFixed(1)}%
                </li>
                <li>• Variation: {(maxGrade - minGrade).toFixed(1)} percentage points</li>
                <li>
                  • Consistency:{" "}
                  {maxGrade - minGrade < 10
                    ? "Very consistent"
                    : maxGrade - minGrade < 20
                      ? "Moderately consistent"
                      : "Highly variable"}
                </li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2">Recommendations:</p>
              <ul className="space-y-1 text-muted-foreground">
                {trend === "improving" && <li>• Great progress! Keep up the momentum</li>}
                {trend === "declining" && <li>• Focus on study habits and seek help</li>}
                {trend === "stable" && <li>• Maintain consistency across all subjects</li>}
                <li>• Target classes below {averageGrade.toFixed(0)}% for improvement</li>
                <li>• Leverage strengths from high-performing classes</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
