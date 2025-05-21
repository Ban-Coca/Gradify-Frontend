import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { getStudentClasses, getCalculatedGrade } from "@/services/student/studentService"
import { useAuth } from "@/contexts/authentication-context"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";

function getCurrentSemesterAndSchoolYear() {
  const today = new Date();
  const month = today.getMonth(); // 0 = Jan, 7 = Aug
  const year = today.getFullYear();

  let semester, schoolYear;
  if (month >= 0 && month < 7) {
    // January (0) to July (6): 2nd Semester
    semester = "2nd";
    schoolYear = `${year - 1}-${year}`;
  } else {
    // August (7) to December (11): 1st Semester
    semester = "1st";
    schoolYear = `${year}-${year + 1}`;
  }
  return { semester, schoolYear };
}

export function PerformanceChart() {
  const { currentUser, getAuthHeader } = useAuth();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCoursesWithGrades() {
      if (!currentUser?.userId) return;
      setLoading(true);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const classes = await getStudentClasses(currentUser.userId, header);

        // Dynamically get current semester and school year
        const { semester: currentSemester, schoolYear: currentSchoolYear } = getCurrentSemesterAndSchoolYear();

        // Filter for current school year and semester
        const filtered = classes.filter(
          cls =>
            (cls.school_year === currentSchoolYear || cls.schoolYear === currentSchoolYear) &&
            (cls.semester === currentSemester || cls.semester === `${currentSemester} Semester`)
        );

        // Sort by created_at descending (most recent first)
        filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        const grades = await Promise.all(
          filtered.map(async (cls) => {
            let grade = null;
            try {
              grade = await getCalculatedGrade(currentUser.userId, cls.classId, header);
              if (typeof grade === "number" && !isNaN(grade)) {
                grade = parseFloat((grade > 100 ? grade / 100 : grade).toFixed(1));
              } else {
                grade = "N/A";
              }
            } catch (err) {
              console.error(`Error fetching grade for class ${cls.classId}:`, err);
              grade = "N/A";
            }
            return { ...cls, grade };
          })
        );

        setCourses(grades);
      } catch (error) {
        setCourses([]);
      } finally {
        setLoading(false);
      }
    }
    fetchCoursesWithGrades();
  }, [currentUser, getAuthHeader]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Courses & Grades</CardTitle>
        <CardDescription>Your grade in each course</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <div style={{ width: "100%", height: 300 }}>
            <ResponsiveContainer>
              <BarChart data={courses}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="className" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Bar dataKey="grade" fill="#198754" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}