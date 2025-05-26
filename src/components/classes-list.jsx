import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Pagination from "@/components/ui/pagination"; // Import your Pagination

const PAGE_SIZE = 6;

const ClassesList = ({ classes, view, loading, error, navigateToClass }) => {
  const [page, setPage] = useState(1);

  // Pagination logic
  const totalPages = Math.ceil((classes?.length || 0) / PAGE_SIZE);
  const paginatedClasses = Array.isArray(classes)
    ? classes.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
    : [];

  if (Array.isArray(classes) && classes.length > 0) {
    return view === "grid" ? (
      <>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {paginatedClasses.map((classItem) => (
            <Card
              key={classItem.classId}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigateToClass(classItem.classId)}
            >
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <CardTitle>{classItem.className}</CardTitle>
                </div>
                <CardDescription>
                  {(classItem.semester ? `${classItem.semester} Semester` : "No Semester")} • {classItem.schoolYear || "No School Year"} • {classItem.room || "No Room"}
                </CardDescription>
              </CardHeader>
              <CardContent className="mt-auto pb-2">
                <div className="space-y-2">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Users className="h-4 w-4 mr-2 text-gray-500" />
                      <span>Section: {classItem.section || "No Section"}</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{classItem.schedule || "No Schedule"}</span>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="mt-auto">
                <Button variant="ghost" className="w-full" onClick={() => navigateToClass(classItem.classId)}>
                  Manage Class
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    ) : (
      <>
        <div className="space-y-4">
          {paginatedClasses.map((classItem) => (
            <Card
              key={classItem.classId}
              className="cursor-pointer hover:bg-gray-50"
              onClick={() => navigateToClass(classItem.classId)}
            >
              <CardContent className="px-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{classItem.className}</h3>
                    <p className="text-sm text-gray-500">
                      {(classItem.semester ? `${classItem.semester} Semester` : "No Semester")} • {classItem.schoolYear || "No School Year"} • {classItem.room || "No Room"}
                    </p>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Section: {classItem.section}</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{classItem.schedule || "No Schedule"}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8 text-center">
      <BookOpen className="h-12 w-12 text-gray-300 mb-4" />
      <h3 className="text-lg font-medium">No Current Classes</h3>
      <p className="text-gray-500 mt-1">You currently have no classes. Create a new class to get started.</p>
    </div>
  );
};

export default ClassesList;