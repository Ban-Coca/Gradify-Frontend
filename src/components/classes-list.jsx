import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, Calendar, BookOpen, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const ClassesList = ({ classes, view, loading, error, navigateToClass }) => {
    if (Array.isArray(classes) && classes.length > 0) {
        return view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((classItem) => (
            <Card
                key={classItem.classId} // Use `classid` instead of `id`
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigateToClass(classItem.classId)} // Use `classid`
            >
                <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <CardTitle>{classItem.className}</CardTitle> {/* Use `className` */}
                </div>
                <CardDescription>
                    {classItem.semester} {classItem.schoolYear} • {classItem.classCode} • {classItem.room}
                </CardDescription>
                </CardHeader>
                <CardContent className="mt-auto pb-2">
                <div className="space-y-2">
                    <div className="flex items-center text-sm">
                    <Users className="h-4 w-4 mr-2 text-gray-500" />
                    <span>Section: {classItem.section}</span> {/* Use `section` */}
                    </div>
                    <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span>{classItem.schedule}</span> {/* Use `schedule` */}
                    </div>
                </div>
                </CardContent>
                <CardFooter className="mt-auto">
                <Button variant="ghost" className="w-full" onClick={() => navigateToClass(classItem.classid)}>
                    Manage Class
                    <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
                </CardFooter>
            </Card>
            ))}
        </div>
        ) : (
        <div className="space-y-4">
            {classes.map((classItem) => (
            <Card
                key={classItem.classid}
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => navigateToClass(classItem.classid)}
            >
                <CardContent className="p-4">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                    <h3 className="font-bold text-lg">{classItem.className}</h3> {/* Use `className` */}
                    <p className="text-sm text-gray-500">
                        {classItem.semester} {classItem.schoolYear} • {classItem.room}
                    </p>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                        <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1 text-gray-500" />
                        <span>Section: {classItem.section}</span> {/* Use `section` */}
                        </div>
                        <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1 text-gray-500" />
                        <span>{classItem.schedule}</span> {/* Use `schedule` */}
                        </div>
                    </div>
                    </div>
                </div>
                </CardContent>
            </Card>
            ))}
        </div>
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