import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, TrendingDown, TrendingUp, XCircle } from "lucide-react"

export function ImprovementAreas({ classes = [], allGrades = [] }) {
  // Map classId to grade for quick lookup
  const classIdToGrade = {};
  allGrades.forEach(g => {
    classIdToGrade[String(g.classId)] = g.grade;
  });

  // Recommendation based on actual grade from allGrades
  const getRecommendation = (grade) => {
    if (grade == null) return "No grade data available for this class.";
    if (grade < 60) return "Urgent: Seek help from your instructor and review class materials immediately.";
    if (grade < 75) return "Danger zone: Strongly consider extra practice and tutoring support.";
    if (grade < 80) return "Keep practicing and focus on areas where you lost points.";
    if (grade < 90) return "Good job! You're doing well, keep up the consistent effort.";
    return "Excellent work! Maintain your performance and help peers if you can.";
  };

  if (!classes.length || !allGrades.length) {
    return <div className="text-muted-foreground">No improvement suggestions available.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {classes.map((cls, idx) => {
        const grade = classIdToGrade[String(cls.classId)];
        return (
          <Card key={cls.classId || idx} className="p-0">
            <CardContent className="p-8">
              <div className="flex items-start justify-between">
                <h3 className="font-medium flex items-center gap-2">
                  {cls.className}
                  {grade >= 90 ? (
                    <TrendingUp className="h-4 w-4 text-green-500" />
                  ) : grade >= 80 ? (
                    <TrendingUp className="h-4 w-4 text-blue-500" />
                  ) : grade >= 75 ? (
                    <TrendingDown className="h-4 w-4 text-yellow-500" />
                  ) : grade >= 60 ? (
                    <TrendingDown className="h-4 w-4 text-red-500" />
                  ) : (
                    <XCircle className="h-4 w-4 text-red-700" />
                  )}
                </h3>
                <Badge variant="outline" className="mt-1">
                  {grade != null ? `${grade}%` : "No Grade"}
                </Badge>
              </div>
              <div className="mt-4">
                <div className="flex items-start gap-2">
                  {grade == null ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  ) : grade < 60 ? (
                    <XCircle className="h-5 w-5 text-red-700 mt-0.5" />
                  ) : grade < 75 ? (
                    <XCircle className="h-5 w-5 text-red-600 mt-0.5" />
                  ) : grade < 80 ? (
                    <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
                  ) : grade < 90 ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  ) : (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                  )}
                  <p className="text-sm">{getRecommendation(grade)}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}