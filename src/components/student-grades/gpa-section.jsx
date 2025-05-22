import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { Progress } from "../../components/ui/progress"
import { useEffect, useState } from "react"
import { getCalculatedGPA } from "@/services/student/studentService"
import { useAuth } from "@/contexts/authentication-context"

export function GPASection() {
  const { currentUser, getAuthHeader } = useAuth();
  const [gpa, setGpa] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGPA() {
      setLoading(true);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        let grade = await getCalculatedGPA(currentUser.userId, header);
        grade = parseFloat((grade > 100 ? grade / 100 : grade).toFixed(2));
        setGpa(grade);
      } catch {
        setGpa(null);
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.userId) fetchGPA();
  }, [currentUser, getAuthHeader]);

  const maxGPA = 5.0;
  const percent = gpa && gpa > 0 ? Math.min((gpa / maxGPA) * 100, 100) : 0;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-2xl">Current GPA</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between mb-2">
          <div className="text-4xl font-bold">
            {loading ? (
              <span className="animate-pulse text-muted-foreground">--</span>
            ) : gpa !== null ? (
              gpa.toFixed(2)
            ) : (
              "N/A"
            )}%
          </div>
          <div className="text-sm text-muted-foreground">out of 100%</div>
        </div>
        <Progress value={percent} className="h-3 rounded-full" />
        <div className="text-sm text-muted-foreground mt-2">
          {percent >= 90
            ? "Excellent work!"
            : percent >= 80
            ? "Great job!"
            : percent >= 70
            ? "Keep improving!"
            : percent > 0
            ? "Needs attention"
            : ""}
        </div>
      </CardContent>
    </Card>
  );
}