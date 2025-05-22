import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/authentication-context"
import { getStudentClasses } from "@/services/student/studentService"
import { Button } from "../ui/button"
import { ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import Pagination from "@/components/ui/pagination"
import { CardFooter } from "../ui/card"

export function ClassesList() {
  const { currentUser, getAuthHeader } = useAuth();
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const studentId = currentUser?.userId;
  const [currentPage, setCurrentPage] = useState(1);
  const classesPerPage = 4; // Max cards per page

  // Handle page change
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  useEffect(() => {
    async function loadClasses() {
      setLoading(true);
      setError(null);
      try {
        const header = getAuthHeader ? getAuthHeader() : {};
        const data = await getStudentClasses(studentId, header);
        setClasses(
          data.map((cls) => ({
            id: cls.classId,
            className: cls.className,
            section: cls.section,
            room: cls.room,
            schedule: cls.schedule,
            schoolYear: cls.schoolYear,
            lastUpdated: cls.updatedAt ? new Date(cls.updatedAt).toLocaleDateString() : "",
            classCode: cls.classCode,
            semester: cls.semester,
          }))
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    if (studentId) loadClasses();
  }, [studentId, getAuthHeader]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Loading Classes...</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>{error}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (!classes.length) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Classes</CardTitle>
          <CardDescription>You are not enrolled in any classes.</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="gap-4 h-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Your Classes</CardTitle>
            <CardDescription>Overview of your classes</CardDescription>
          </div>
          <Button onClick={() => navigate("/teacher/classes/all")}>
            View All Classes
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="h-[300px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {classes
            .slice((currentPage - 1) * classesPerPage, currentPage * classesPerPage)
            .map((classItem) => (
            <Card
              key={classItem.id}
              className="hover:bg-gray-50 cursor-pointer border rounded-lg p-5 min-h-[80px] flex flex-col justify-center"
              onClick={() => navigateToClass(classItem.id)}
            >
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-lg">{classItem.className || "No Class Name"}</CardTitle>
                <CardDescription className="text-sm">
                  Section: {classItem.section || "No Section"}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="text-sm text-muted-foreground">
                  {classItem.schedule || "No Schedule"}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-center items-center">
        <Pagination
          currentPage={currentPage}
          totalPages={Math.ceil(classes.length / classesPerPage)}
          onPageChange={handlePageChange}
        />
      </CardFooter>
    </Card>
  );
}