import { Card, CardContent } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"

export function GradeDistribution({allGrades, allGradesLoading }) {
  const gradeRanges = ["90-100%", "80-89%", "70-79%", "60-69%", "Below 60%"];
  const gradeCounts = gradeRanges.map(
    (range) =>
      allGrades.filter((g) => getGradeRange(Number(g.grade)) === range).length
  );
  const totalGrades = allGrades.length;

  function getGradeRange(grade) {
    if (grade >= 90) return "90-100%";
    if (grade >= 80) return "80-89%";
    if (grade >= 70) return "70-79%";
    if (grade >= 60) return "60-69%";
    return "Below 60%";
  }

  return (
    <div>
      {allGradesLoading ? (
        <div>Loading grade distribution...</div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-5 gap-4">
            {gradeRanges.map((range, index) => {
              const count = gradeCounts[index];
              const percentage = totalGrades ? Math.round((count / totalGrades) * 100) : 0;
              return (
                <Card key={range} className="text-center">
                  <CardContent className="p-4">
                    <Badge
                      variant={
                        index === 0
                          ? "success"
                          : index === 1
                          ? "default"
                          : index === 2
                          ? "secondary"
                          : index === 3
                          ? "warning"
                          : "destructive"
                      }
                      className="mb-2"
                    >
                      {range}
                    </Badge>
                    <div className="text-2xl font-bold">{count}</div>
                    <div className="text-xs text-muted-foreground">{percentage}%</div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          <div className="h-8 w-full bg-muted rounded-full overflow-hidden flex">
            {gradeRanges.map((range, index) => {
              const count = gradeCounts[index];
              const percentage = totalGrades ? (count / totalGrades) * 100 : 0;
              const colors = [
                "hsl(var(--success))",
                "hsl(var(--primary))",
                "hsl(var(--secondary))",
                "hsl(var(--warning))",
                "hsl(var(--destructive))",
              ];
              return percentage > 0 ? (
                <div
                  key={range}
                  className="h-full flex items-center justify-center text-xs font-medium text-white"
                  style={{
                    width: `${percentage}%`,
                    backgroundColor: colors[index],
                  }}
                >
                  {percentage > 10 ? `${range}: ${Math.round(percentage)}%` : ""}
                </div>
              ) : null;
            })}
          </div>
        </div>
      )}
    </div>
  )
}
