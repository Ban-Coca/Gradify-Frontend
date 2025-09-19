import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Award, AlertTriangle } from "lucide-react"
import { useState, useEffect } from "react"

export function AveragePerClass({ subject, allGrades = [], allGradesLoading = false, classes = [] }) {
  const [animatedGrades, setAnimatedGrades] = useState({})
  const [sortBy, setSortBy] = useState("grade") // grade, alphabetical

  useEffect(() => {
    if (!allGradesLoading && allGrades.length > 0) {
      // Animate grades
      const timer = setTimeout(() => {
        const animated = {}
        allGrades.forEach((item) => {
          animated[item.classId] = item.grade
        })
        setAnimatedGrades(animated)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [allGradesLoading, allGrades])

  if (allGradesLoading) {
    return (
      <div className="space-y-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 animate-pulse">
            <div className="w-48 h-6 bg-muted rounded" />
            <div className="flex-1 h-6 bg-muted rounded" />
          </div>
        ))}
      </div>
    )
  }

  if (!allGrades.length) {
    return (
      <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
        <div className="text-4xl mb-2">📊</div>
        <h3 className="text-lg font-medium mb-2 dark:text-foreground">No Grade Data Available</h3>
        <p>Your grades will appear here once they are available.</p>
      </div>
    )
  }

  // Map classId to className for display
  const classIdToName = {}
  classes.forEach((cls) => {
    classIdToName[cls.classId] = cls.className
  })

  // Sort grades
  const sortedGrades = [...allGrades].sort((a, b) => {
    if (sortBy === "alphabetical") {
      const nameA = classIdToName[a.classId] || a.classId
      const nameB = classIdToName[b.classId] || b.classId
      return nameA.localeCompare(nameB)
    }
    return b.grade - a.grade // Highest grade first
  })

  // Find the max grade for scaling bar width
  const maxGrade = Math.max(...allGrades.map((item) => item.grade), 100)
  const averageGrade = allGrades.reduce((sum, item) => sum + item.grade, 0) / allGrades.length

  const getGradeColor = (grade) => {
    if (grade >= 90) return "bg-green-500"
    if (grade >= 80) return "bg-blue-500"
    if (grade >= 70) return "bg-yellow-500"
    if (grade >= 60) return "bg-orange-500"
    return "bg-red-500"
  }

  const getGradeIcon = (grade) => {
    if (grade >= 90) return <Award className="h-4 w-4 text-green-600 dark:text-green-400" />
    if (grade >= 80) return <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
    if (grade >= 70) return <TrendingUp className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
    return <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-blue-50/50 border-blue-200 dark:bg-blue-900/10 dark:border-blue-800">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-blue-600 dark:text-blue-400">Overall Average</p>
              <p className="text-2xl font-bold text-blue-700 dark:text-blue-300">{averageGrade.toFixed(1)}%</p>
              <Progress value={averageGrade} className="mt-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-green-50/50 border-green-200 dark:bg-green-900/10 dark:border-green-800">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-green-600 dark:text-green-400">Highest Grade</p>
              <p className="text-2xl font-bold text-green-700 dark:text-green-300">
                {Math.max(...allGrades.map((g) => g.grade)).toFixed(1)}%
              </p>
              <p className="text-xs text-green-600 dark:text-green-400 mt-1">Best performance</p>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-purple-50/50 border-purple-200 dark:bg-purple-900/10 dark:border-purple-800">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-sm font-medium text-purple-600 dark:text-purple-400">Total Classes</p>
              <p className="text-2xl font-bold text-purple-700 dark:text-purple-300">{allGrades.length}</p>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Enrolled courses</p>
            </div>
          </CardContent>
        </Card>
      </div>
      {/* Sort Controls */}
      <div className="flex items-center gap-2">
  <span className="text-sm font-medium dark:text-foreground">Sort by:</span>
  <button
    onClick={() => setSortBy("grade")}
    className={`px-3 py-1 rounded text-sm transition-colors
      ${sortBy === "grade"
        ? "bg-primary text-white"
        : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
      }`}
    data-state={sortBy === "grade" ? "active" : ""}
  >
    Grade
  </button>
  <button
    onClick={() => setSortBy("alphabetical")}
    className={`px-3 py-1 rounded text-sm transition-colors
      ${sortBy === "alphabetical"
        ? "bg-primary text-white"
        : "bg-primary/10 text-primary dark:bg-primary/20 dark:text-primary"
      }`}
    data-state={sortBy === "alphabetical" ? "active" : ""}
  >
    Alphabetical
  </button>
</div>

      {/* Grade Bars */}
      <div className="space-y-4">
        {sortedGrades.map((item, index) => {
          const animatedGrade = animatedGrades[item.classId] || 0
          const className = classIdToName[item.classId] || `Class ${item.classId}`

          return (
            <Card
              key={item.classId}
              className="transition-all duration-200 hover:shadow-md dark:hover:shadow-xl hover:scale-[1.01] border-l-4"
              style={{ borderLeftColor: getGradeColor(item.grade).replace("bg-", "#") }}
            >
              <CardContent className="p-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2 w-64 flex-shrink-0">
                    {getGradeIcon(item.grade)}
                    <span className="font-medium truncate dark:text-foreground">{className}</span>
                  </div>

                  <div className="flex-1 relative">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 h-8 bg-gray-100 dark:bg-gray-800 rounded-full relative overflow-hidden shadow-inner">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-out ${getGradeColor(item.grade)}`}
                          style={{
                            width: `${(animatedGrade / maxGrade) * 100}%`,
                            minWidth: animatedGrade > 0 ? "8px" : "0px",
                          }}
                        />
                        <div className="absolute inset-0 flex items-center justify-end pr-3">
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-200 drop-shadow-sm">
                            {item.grade.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge
                          variant={
                            item.grade >= 90
                              ? "default"
                              : item.grade >= 80
                                ? "secondary"
                                : item.grade >= 70
                                  ? "outline"
                                  : "destructive"
                          }
                        >
                          {item.grade >= 90
                            ? "A"
                            : item.grade >= 80
                              ? "B"
                              : item.grade >= 70
                                ? "C"
                                : item.grade >= 60
                                  ? "D"
                                  : "F"}
                        </Badge>
                      </div>
                    </div>

                    {/* Comparison to average */}
                    <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground dark:text-muted-foreground">
                      <span>
                        {item.grade > averageGrade
                          ? `${(item.grade - averageGrade).toFixed(1)}% above your average`
                          : item.grade < averageGrade
                            ? `${(averageGrade - item.grade).toFixed(1)}% below your average`
                            : "At your average"}
                      </span>
                      <span>Rank: #{index + 1}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Performance Insights */}
      <Card className="bg-gradient-to-r from-blue-50/50 to-purple-50/50 border-blue-200 dark:from-blue-900/10 dark:to-purple-900/10 dark:border-blue-800">
        <CardContent className="p-6">
          <h4 className="font-semibold mb-4 flex items-center gap-2 dark:text-foreground">
            <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            Performance Insights
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-2 dark:text-foreground">Strengths:</p>
              <ul className="space-y-1 text-muted-foreground dark:text-muted-foreground">
                <li>• {allGrades.filter((g) => g.grade >= 90).length} classes with A grades</li>
                <li>• {allGrades.filter((g) => g.grade >= 80).length} classes above 80%</li>
                <li>• Average performance: {averageGrade.toFixed(1)}%</li>
              </ul>
            </div>
            <div>
              <p className="font-medium mb-2 dark:text-foreground">Areas for Growth:</p>
              <ul className="space-y-1 text-muted-foreground dark:text-muted-foreground">
                {allGrades.filter((g) => g.grade < 75).length > 0 ? (
                  <li>• {allGrades.filter((g) => g.grade < 75).length} classes need attention</li>
                ) : (
                  <li>• All classes performing well!</li>
                )}
                <li>• Focus on consistency across subjects</li>
                <li>• Maintain strong study habits</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
