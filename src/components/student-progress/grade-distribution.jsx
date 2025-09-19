import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"
import { useState, useEffect } from "react"

export function GradeDistribution({ allGrades, allGradesLoading }) {
  const [animatedCounts, setAnimatedCounts] = useState([0, 0, 0, 0, 0])
  const [showDetails, setShowDetails] = useState(false)

  const gradeRanges = [
    { range: "90-100%", label: "A", color: "bg-green-500", textColor: "text-green-600 dark:text-green-400", bgColor: "bg-green-50/50 dark:bg-green-900/10" },
    { range: "80-89%", label: "B", color: "bg-blue-500", textColor: "text-blue-600 dark:text-blue-400", bgColor: "bg-blue-50/50 dark:bg-blue-900/10" },
    { range: "70-79%", label: "C", color: "bg-yellow-500", textColor: "text-yellow-600 dark:text-yellow-400", bgColor: "bg-yellow-50/50 dark:bg-yellow-900/10" },
    { range: "60-69%", label: "D", color: "bg-orange-500", textColor: "text-orange-600 dark:text-orange-400", bgColor: "bg-orange-50/50 dark:bg-orange-900/10" },
    { range: "Below 60%", label: "F", color: "bg-red-500", textColor: "text-red-600 dark:text-red-400", bgColor: "bg-red-50/50 dark:bg-red-900/10" },
  ]

  const gradeCounts = gradeRanges.map(
    (_, index) => allGrades.filter((g) => getGradeRange(Number(g.grade)) === gradeRanges[index].range).length,
  )
  const totalGrades = allGrades.length

  function getGradeRange(grade) {
    if (grade >= 90) return "90-100%"
    if (grade >= 80) return "80-89%"
    if (grade >= 70) return "70-79%"
    if (grade >= 60) return "60-69%"
    return "Below 60%"
  }

  // Animate counts
  useEffect(() => {
    if (!allGradesLoading && gradeCounts.length > 0) {
      const timer = setTimeout(() => {
        setAnimatedCounts(gradeCounts)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [allGradesLoading, gradeCounts])

  const getGradeInsight = () => {
    const excellentCount = gradeCounts[0]
    const goodCount = gradeCounts[1]
    const needsImprovementCount = gradeCounts[3] + gradeCounts[4]

    if (excellentCount >= totalGrades * 0.7) {
      return { message: "Excellent performance across most classes!", icon: TrendingUp, color: "text-green-600 dark:text-green-400" }
    } else if (goodCount + excellentCount >= totalGrades * 0.8) {
      return { message: "Strong academic performance overall", icon: TrendingUp, color: "text-blue-600 dark:text-blue-400" }
    } else if (needsImprovementCount >= totalGrades * 0.3) {
      return { message: "Focus needed on improving lower grades", icon: TrendingDown, color: "text-orange-600 dark:text-orange-400" }
    } else {
      return { message: "Balanced performance across classes", icon: Minus, color: "text-gray-600 dark:text-gray-400" }
    }
  }

  if (allGradesLoading) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-4">
                <div className="h-16 bg-muted rounded" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="h-8 bg-muted rounded animate-pulse" />
      </div>
    )
  }

  if (totalGrades === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground dark:text-muted-foreground">
        <div className="text-4xl mb-2">📊</div>
        <p>No grade data available for distribution analysis</p>
      </div>
    )
  }

  const insight = getGradeInsight()
  const InsightIcon = insight.icon

  return (
    <div className="space-y-6">
      {/* Insight Banner */}
      <div className={`p-4 rounded-lg border-l-4 ${insight.color.replace("text-", "border-l-").replace(" dark:text-green-400", "").replace(" dark:text-blue-400", "").replace(" dark:text-orange-400", "").replace(" dark:text-gray-400", "")} bg-muted/30 dark:bg-muted/20`}>
        <div className="flex items-center gap-2">
          <InsightIcon className={`h-5 w-5 ${insight.color}`} />
          <span className={`font-medium ${insight.color}`}>{insight.message}</span>
        </div>
      </div>

      {/* Grade Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {gradeRanges.map((gradeInfo, index) => {
          const count = animatedCounts[index]
          const percentage = totalGrades ? Math.round((count / totalGrades) * 100) : 0
          return (
            <Card
              key={gradeInfo.range}
              className={`text-center transition-all duration-300 hover:scale-105 cursor-pointer ${gradeInfo.bgColor} border-l-4 ${gradeInfo.color.replace("bg-", "border-l-")} dark:border-l-4`}
              onClick={() => setShowDetails(!showDetails)}
            >
              <CardContent className="p-4">
                <div
                  className={`w-12 h-12 rounded-full ${gradeInfo.color} mx-auto mb-3 flex items-center justify-center text-white font-bold text-lg shadow-lg`}
                >
                  {gradeInfo.label}
                </div>
                <div className="space-y-2">
                  <div className={`text-2xl font-bold ${gradeInfo.textColor}`}>{count}</div>
                  <Badge variant="outline" className="text-xs">
                    {gradeInfo.range}
                  </Badge>
                  <div className="text-xs text-muted-foreground dark:text-muted-foreground">{percentage}% of total</div>
                  <Progress value={percentage} className="h-2" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Distribution Bar */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium dark:text-foreground">Grade Distribution</h4>
          <span className="text-xs text-muted-foreground dark:text-muted-foreground">{totalGrades} total grades</span>
        </div>
        <div className="h-8 w-full bg-muted dark:bg-muted rounded-full overflow-hidden flex shadow-inner">
          {gradeRanges.map((gradeInfo, index) => {
            const count = gradeCounts[index]
            const percentage = totalGrades ? (count / totalGrades) * 100 : 0
            return percentage > 0 ? (
              <div
                key={gradeInfo.range}
                className={`h-full flex items-center justify-center text-xs font-medium text-white ${gradeInfo.color} transition-all duration-500 hover:brightness-110`}
                style={{ width: `${percentage}%` }}
                title={`${gradeInfo.range}: ${count} classes (${Math.round(percentage)}%)`}
              >
                {percentage > 15 ? `${Math.round(percentage)}%` : percentage > 8 ? gradeInfo.label : ""}
              </div>
            ) : null
          })}
        </div>
      </div>

      {/* Detailed Breakdown */}
      {showDetails && (
        <Card className="border-dashed dark:border-dashed">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 dark:text-foreground">Detailed Breakdown</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground dark:text-muted-foreground mb-2">Performance Summary:</p>
                <ul className="space-y-1">
                  <li>• Excellent (A): {gradeCounts[0]} classes</li>
                  <li>• Good (B): {gradeCounts[1]} classes</li>
                  <li>• Satisfactory (C): {gradeCounts[2]} classes</li>
                  <li>• Needs Improvement: {gradeCounts[3] + gradeCounts[4]} classes</li>
                </ul>
              </div>
              <div>
                <p className="text-muted-foreground dark:text-muted-foreground mb-2">Recommendations:</p>
                <ul className="space-y-1">
                  {gradeCounts[0] > 0 && <li>• Maintain excellence in {gradeCounts[0]} classes</li>}
                  {gradeCounts[3] + gradeCounts[4] > 0 && (
                    <li>• Focus on improving {gradeCounts[3] + gradeCounts[4]} classes</li>
                  )}
                  {gradeCounts[1] > 0 && <li>• Push {gradeCounts[1]} B-grade classes to A level</li>}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
