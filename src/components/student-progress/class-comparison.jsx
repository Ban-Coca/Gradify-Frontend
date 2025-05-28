import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus, Target, Users, Award } from "lucide-react"
import { Button } from "@/components/ui/button"

export function SubjectComparison({ comparisonData = [] }) {
  const [mounted, setMounted] = useState(false)
  const [sortBy, setSortBy] = useState("performance") // performance, alphabetical, difference
  const [showOnlyBelowAverage, setShowOnlyBelowAverage] = useState(false)

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
    return (
      <div className="text-center py-8">
        <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Comparison Data Available</h3>
        <p className="text-muted-foreground">Class average data is not available for comparison.</p>
      </div>
    )
  }

  // Filter and sort data
  let filteredData = comparisonData.filter((item) => item.grade != null && item.classAverage != null)

  if (showOnlyBelowAverage) {
    filteredData = filteredData.filter((item) => item.grade < item.classAverage)
  }

  const sortedData = [...filteredData].sort((a, b) => {
    switch (sortBy) {
      case "alphabetical":
        return a.className.localeCompare(b.className)
      case "difference":
        const diffA = a.grade - a.classAverage
        const diffB = b.grade - b.classAverage
        return diffB - diffA // Highest positive difference first
      case "performance":
      default:
        return b.grade - a.grade // Highest grade first
    }
  })

  // Calculate statistics
  const aboveAverageCount = filteredData.filter((item) => item.grade > item.classAverage).length
  const belowAverageCount = filteredData.filter((item) => item.grade < item.classAverage).length
  const atAverageCount = filteredData.filter((item) => Math.abs(item.grade - item.classAverage) < 0.1).length

  const averageDifference =
    filteredData.reduce((sum, item) => sum + (item.grade - item.classAverage), 0) / filteredData.length

  return (
    <div className="space-y-6">
      {/* Summary Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-6 w-6 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Above Average</p>
                <p className="text-xl font-bold text-green-700">{aboveAverageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingDown className="h-6 w-6 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Below Average</p>
                <p className="text-xl font-bold text-red-700">{belowAverageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Minus className="h-6 w-6 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">At Average</p>
                <p className="text-xl font-bold text-blue-700">{atAverageCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-6 w-6 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-purple-600">Avg Difference</p>
                <p className={`text-xl font-bold ${averageDifference >= 0 ? "text-green-700" : "text-red-700"}`}>
                  {averageDifference >= 0 ? "+" : ""}
                  {averageDifference.toFixed(1)}%
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-sm font-medium">Sort by:</span>
        <Button
          variant={sortBy === "performance" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("performance")}
        >
          Performance
        </Button>
        <Button
          variant={sortBy === "difference" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("difference")}
        >
          Difference
        </Button>
        <Button
          variant={sortBy === "alphabetical" ? "default" : "outline"}
          size="sm"
          onClick={() => setSortBy("alphabetical")}
        >
          Alphabetical
        </Button>
        <div className="ml-4">
          <Button
            variant={showOnlyBelowAverage ? "default" : "outline"}
            size="sm"
            onClick={() => setShowOnlyBelowAverage(!showOnlyBelowAverage)}
          >
            {showOnlyBelowAverage ? "Show All" : "Below Average Only"}
          </Button>
        </div>
      </div>

      {/* Comparison Cards */}
      <div className="space-y-4">
        {sortedData.map((item, index) => {
          const difference = item.grade - item.classAverage
          const isAboveAverage = difference > 0
          const isSignificantDifference = Math.abs(difference) > 5

          return (
            <Card
              key={item.className || index}
              className={`transition-all duration-200 hover:shadow-lg ${
                isAboveAverage
                  ? "border-l-4 border-l-green-500 bg-green-50/30"
                  : difference < 0
                    ? "border-l-4 border-l-red-500 bg-red-50/30"
                    : "border-l-4 border-l-gray-500 bg-gray-50/30"
              }`}
            >
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg">{item.className}</CardTitle>
                  <div className="flex items-center gap-2">
                    {isAboveAverage ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : difference < 0 ? (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    ) : (
                      <Minus className="h-5 w-5 text-gray-600" />
                    )}
                    {isSignificantDifference && <Award className="h-4 w-4 text-yellow-600" />}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">Your Grade</span>
                  <Badge variant={item.grade >= 90 ? "default" : item.grade >= 80 ? "secondary" : "destructive"}>
                    {item.grade?.toFixed(1)}%
                  </Badge>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Your Performance</span>
                    <span className="font-mono">{item.grade?.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.grade} className="h-3" />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center text-xs">
                    <span>Class Average</span>
                    <span className="font-mono text-muted-foreground">{item.classAverage?.toFixed(1)}%</span>
                  </div>
                  <Progress value={item.classAverage} className="h-2 opacity-60" />
                </div>

                <div className="pt-2 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Performance vs Class:</span>
                    <Badge
                      variant={isAboveAverage ? "default" : difference < 0 ? "destructive" : "secondary"}
                      className="font-mono"
                    >
                      {difference >= 0 ? "+" : ""}
                      {difference.toFixed(1)}%
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isAboveAverage
                      ? `You're performing ${difference.toFixed(1)}% above the class average`
                      : difference < 0
                        ? `You're ${Math.abs(difference).toFixed(1)}% below the class average`
                        : "You're performing at the class average"}
                    {isSignificantDifference && (
                      <span className="font-medium">
                        {" "}
                        - {isAboveAverage ? "Excellent work!" : "Focus area for improvement"}
                      </span>
                    )}
                  </p>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {filteredData.length === 0 && (
        <div className="text-center py-8 text-muted-foreground">
          <p>No classes match the current filter criteria.</p>
        </div>
      )}
    </div>
  )
}
