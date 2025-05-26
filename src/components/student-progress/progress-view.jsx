import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { AveragePerClass } from "./average-class"
import { GradeDistribution } from "./grade-distribution"
import { SubjectComparison } from "./class-comparison"
import { ImprovementAreas } from "./improvement-areas"
import { useEffect, useState } from "react"
import { PseudoTrendChart } from "./psuedo-trend";
import { useAuth } from "@/contexts/authentication-context"
import { getClassAveragesByStudent, getClassGradesByStudent, getStudentClasses } from "@/services/student/studentService"


export function ProgressView() {
  const [selectedClass, setSelectedClass] = useState("all");
  const [classes, setClasses] = useState([]);
  const [showFilters, setShowFilters] = useState(false)
  const [allGrades, setAllGrades] = useState([]);
  const [allGradesLoading, setAllGradesLoading] = useState(true);
  const [classAverages, setClassAverages] = useState([]);

  const { currentUser, getAuthHeader } = useAuth();
  const studentId = currentUser?.userId;

  useEffect(() => {
    async function fetchClassAverages() {
      try{
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getClassAveragesByStudent(studentId, header);
        console.log("All grades data:", data);
        setClassAverages(data);
      } catch (error) {
        console.error("Error fetching class averages:", error);
      } finally {
        setAllGradesLoading(false);
      }
    }

    async function fetchClasses() {
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getStudentClasses(studentId, header);
        setClasses(data);
      } catch (error) {
        console.error("Error fetching classes:", error);
      } finally {
        setAllGradesLoading(false);
      }
    }

    async function fetchAllGrades() {
      if (!studentId) return;
      setAllGradesLoading(true);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getClassGradesByStudent(studentId, header);
        const gradesArray = data && typeof data === "object"
          ? Object.entries(data).map(([classId, grade]) => ({ classId, grade }))
          : Array.isArray(data)
            ? data
            : [];

        const gradesAsPercent = gradesArray.map(g => ({
          ...g,
          grade: parseFloat(
              (g.grade > 100 ? Number(g.grade) / 100 : Number(g.grade)).toFixed(1)
            )
        }));
        setAllGrades(gradesAsPercent);
      } catch {
        setAllGrades([]);
      } finally {
        setAllGradesLoading(false);
      }
    }

    fetchClassAverages();
    fetchAllGrades();
    fetchClasses();
  }, [studentId, getAuthHeader]);

  // Combining allGrades and classAverages for comparison
  const comparisonData = allGrades.map(g => {
    // Convert g.classId to number for comparison
    const classAverageObj = classAverages.find(avg => avg.classId === Number(g.classId));
    const classAveragePercent = classAverageObj
      ? parseFloat(
          (classAverageObj.average > 100
            ? Number(classAverageObj.average) / 100
            : Number(classAverageObj.average)
          ).toFixed(1)
        )
      : null;
    return {
      className: classAverageObj?.className,
      grade: g.grade,
      classAverage: classAveragePercent
    };
  });
  return (
    <div className="space-y-4 mt-8">
      {classes.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-60 text-muted-foreground text-center">
          <span className="text-5xl mb-3">📚</span>
          No classes found.
        </div>
      ) : (
        <Tabs defaultValue="average" className="w-full mb-6 gap-4">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger 
              value="average"
              className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
            > Average Per Class</TabsTrigger>
            <TabsTrigger 
              value="distribution"
              className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
            > Grade Distribution</TabsTrigger>
            <TabsTrigger 
              value="comparison"
              className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
            > Class Comparison</TabsTrigger>
            <TabsTrigger 
              value="trend"
              className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
            > Pseudo-Trend</TabsTrigger>
            <TabsTrigger 
              value="improvement"
              className="w-full text-center text-white transition-all duration-300 ease-in-out transform data-[state=active]:bg-white data-[state=active]:text-black hover:bg-gray-300/50"
            > Improvement Suggestions</TabsTrigger>
          </TabsList>
          <TabsContent value="average">
            <Card>
              <CardHeader>
                <CardTitle>Average Grade Per Class</CardTitle>
                <CardDescription>See your average grade for each class.</CardDescription>
              </CardHeader>
              <CardContent>
                <AveragePerClass
                  allGrades={allGrades}
                  allGradesLoading={allGradesLoading}
                  classes={classes}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="distribution">
            <Card>
              <CardHeader>
                <CardTitle>Grade Distribution</CardTitle>
                <CardDescription>See how your grades are distributed.</CardDescription>
              </CardHeader>
              <CardContent>
                <GradeDistribution
                  allGrades={allGrades}
                  allGradesLoading={allGradesLoading}
                />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="comparison">
            <Card>
              <CardHeader>
                <CardTitle>Comparison to Class Average</CardTitle>
                <CardDescription>Compare your grades to the class average.</CardDescription>
              </CardHeader>
              <CardContent>
                <SubjectComparison comparisonData={comparisonData} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="trend">
            <Card>
              <CardHeader>
                <CardTitle>Pseudo-Trend by Class Order</CardTitle>
                <CardDescription>See your grades in the order you enrolled in classes.</CardDescription>
              </CardHeader>
              <CardContent>
                <PseudoTrendChart allGrades={allGrades} classes={classes} />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="improvement">
            <Card>
              <CardHeader>
                <CardTitle>Improvement Suggestions</CardTitle>
                <CardDescription>Actionable tips based on your grades.</CardDescription>
              </CardHeader>
              <CardContent>
                <CardContent>
                  <ImprovementAreas classes={classes} allGrades={allGrades} />
                </CardContent>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  )
}