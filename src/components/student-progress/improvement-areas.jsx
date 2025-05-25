import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  XCircle,
  Target,
  BookOpen,
  Users,
  Clock,
  Lightbulb,
  Star,
  ArrowRight,
} from "lucide-react"
import { useState } from "react"

export function ImprovementAreas({ classes = [], allGrades = [] }) {
  const [selectedClass, setSelectedClass] = useState(null)
  const [showAllRecommendations, setShowAllRecommendations] = useState(false)

  // Map classId to grade for quick lookup
  const classIdToGrade = {}
  allGrades.forEach((g) => {
    classIdToGrade[String(g.classId)] = g.grade
  })

  // Enhanced recommendation system
  const getDetailedRecommendation = (grade, className) => {
    const baseRecommendations = {
      urgent: {
        icon: XCircle,
        color: "text-red-600",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        priority: "High Priority",
        actions: [
          "Schedule immediate meeting with instructor",
          "Join study groups or find a study partner",
          "Utilize tutoring services",
          "Review all missed assignments",
          "Create a daily study schedule",
        ],
      },
      danger: {
        icon: AlertTriangle,
        color: "text-orange-600",
        bgColor: "bg-orange-50",
        borderColor: "border-orange-200",
        priority: "Medium Priority",
        actions: [
          "Meet with instructor during office hours",
          "Form or join a study group",
          "Review and redo practice problems",
          "Improve note-taking strategies",
          "Set up regular study sessions",
        ],
      },
      improvement: {
        icon: TrendingUp,
        color: "text-yellow-600",
        bgColor: "bg-yellow-50",
        borderColor: "border-yellow-200",
        priority: "Low Priority",
        actions: [
          "Focus on areas where points were lost",
          "Practice additional problems",
          "Review feedback on assignments",
          "Participate more in class discussions",
          "Seek clarification on difficult topics",
        ],
      },
      good: {
        icon: CheckCircle,
        color: "text-blue-600",
        bgColor: "bg-blue-50",
        borderColor: "border-blue-200",
        priority: "Maintain",
        actions: [
          "Continue current study habits",
          "Help classmates who are struggling",
          "Challenge yourself with extra credit",
          "Prepare for advanced topics",
          "Maintain consistent effort",
        ],
      },
      excellent: {
        icon: Star,
        color: "text-green-600",
        bgColor: "bg-green-50",
        borderColor: "border-green-200",
        priority: "Excellence",
        actions: [
          "Maintain your excellent performance",
          "Consider tutoring other students",
          "Explore advanced topics in the subject",
          "Participate in academic competitions",
          "Share study strategies with peers",
        ],
      },
    }

    if (grade == null) {
      return {
        message: "No grade data available for this class.",
        category: "urgent",
        ...baseRecommendations.urgent,
      }
    }

    if (grade < 60) {
      return {
        message: `Critical situation in ${className}. Immediate action required to avoid failing.`,
        category: "urgent",
        ...baseRecommendations.urgent,
      }
    }

    if (grade < 75) {
      return {
        message: `${className} needs significant improvement. Focus on fundamental concepts.`,
        category: "danger",
        ...baseRecommendations.danger,
      }
    }

    if (grade < 80) {
      return {
        message: `Good foundation in ${className}. Small improvements can make a big difference.`,
        category: "improvement",
        ...baseRecommendations.improvement,
      }
    }

    if (grade < 90) {
      return {
        message: `Strong performance in ${className}. You're doing well overall.`,
        category: "good",
        ...baseRecommendations.good,
      }
    }

    return {
      message: `Outstanding work in ${className}! You're excelling in this subject.`,
      category: "excellent",
      ...baseRecommendations.excellent,
    }
  }

  if (!classes.length || !allGrades.length) {
    return (
      <div className="text-center py-8">
        <Lightbulb className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-medium mb-2">No Improvement Data Available</h3>
        <p className="text-muted-foreground">
          Once you have grades, we'll provide personalized recommendations to help you improve.
        </p>
      </div>
    )
  }

  // Sort classes by grade (lowest first for priority)
  const sortedClasses = classes
    .map((cls) => ({
      ...cls,
      grade: classIdToGrade[String(cls.classId)],
    }))
    .sort((a, b) => (a.grade || 0) - (b.grade || 0))

  const urgentClasses = sortedClasses.filter((cls) => cls.grade != null && cls.grade < 75)
  const excellentClasses = sortedClasses.filter((cls) => cls.grade != null && cls.grade >= 90)

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div>
                <p className="text-sm font-medium text-red-600">Needs Attention</p>
                <p className="text-2xl font-bold text-red-700">{urgentClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Star className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-sm font-medium text-green-600">Excellent Performance</p>
                <p className="text-2xl font-bold text-green-700">{excellentClasses.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Target className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-blue-600">Total Classes</p>
                <p className="text-2xl font-bold text-blue-700">{classes.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Class Recommendations */}
      <div className="grid gap-4 md:grid-cols-1 lg:grid-cols-2">
        {(showAllRecommendations ? sortedClasses : sortedClasses.slice(0, 6)).map((cls, idx) => {
          const recommendation = getDetailedRecommendation(cls.grade, cls.className)
          const RecommendationIcon = recommendation.icon

          return (
            <Card
              key={cls.classId || idx}
              className={`transition-all duration-200 hover:shadow-lg cursor-pointer ${recommendation.borderColor} ${recommendation.bgColor}`}
              onClick={() => setSelectedClass(selectedClass === cls.classId ? null : cls.classId)}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <RecommendationIcon className={`h-6 w-6 ${recommendation.color}`} />
                    <div>
                      <CardTitle className="text-lg">{cls.className}</CardTitle>
                      <Badge variant="outline" className="mt-1">
                        {recommendation.priority}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge variant={cls.grade >= 90 ? "default" : cls.grade >= 75 ? "secondary" : "destructive"}>
                      {cls.grade != null ? `${cls.grade}%` : "No Grade"}
                    </Badge>
                    {cls.grade != null && <Progress value={cls.grade} className="mt-2 w-20" />}
                  </div>
                </div>
              </CardHeader>

              <CardContent>
                <p className={`text-sm mb-4 ${recommendation.color}`}>{recommendation.message}</p>

                {selectedClass === cls.classId && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4" />
                        Recommended Actions:
                      </h4>
                      <ul className="space-y-2">
                        {recommendation.actions.slice(0, 3).map((action, actionIdx) => (
                          <li key={actionIdx} className="flex items-start gap-2 text-sm">
                            <ArrowRight className="h-3 w-3 mt-1 text-muted-foreground flex-shrink-0" />
                            {action}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline">
                        <BookOpen className="h-3 w-3 mr-1" />
                        Study Plan
                      </Button>
                      <Button size="sm" variant="outline">
                        <Users className="h-3 w-3 mr-1" />
                        Find Study Group
                      </Button>
                      <Button size="sm" variant="outline">
                        <Clock className="h-3 w-3 mr-1" />
                        Schedule Help
                      </Button>
                    </div> */}
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Show More Button */}
      {classes.length > 6 && (
        <div className="text-center">
          <Button variant="outline" onClick={() => setShowAllRecommendations(!showAllRecommendations)}>
            {showAllRecommendations ? "Show Less" : `Show All ${classes.length} Classes`}
          </Button>
        </div>
      )}

      {/* General Tips */}
      <Card className="border-blue-200 bg-blue-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-blue-600" />
            General Study Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">Time Management:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Create a weekly study schedule</li>
                <li>• Use the Pomodoro Technique</li>
                <li>• Prioritize difficult subjects</li>
                <li>• Take regular breaks</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Study Strategies:</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Active recall and spaced repetition</li>
                <li>• Form study groups</li>
                <li>• Teach concepts to others</li>
                <li>• Use multiple learning resources</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
