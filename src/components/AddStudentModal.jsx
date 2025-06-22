import { useState, useEffect } from "react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, UserPlus } from "lucide-react";
import { useAuth } from "@/contexts/authentication-context";
import { getAllStudents, addStudentToClass } from "@/services/teacher/classServices";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export function AddStudentModal({ isOpen, onClose, classId, onStudentAdded }) {
    const { getAuthHeader } = useAuth();
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedStudentId, setSelectedStudentId] = useState(null);

    const { data: students = [], isLoading, error } = useQuery({
        queryKey: ["allStudents"],
        queryFn: () => getAllStudents(getAuthHeader()),
        enabled: isOpen,
    });

    const addStudentMutation = useMutation({
        mutationFn: (studentId) => addStudentToClass(classId, studentId, getAuthHeader()),
        onSuccess: () => {
            toast.success("Student added successfully!");
            onStudentAdded();
            onClose();
        },
        onError: (error) => {
            toast.error(error.message || "Failed to add student.");
        }
    });

    const filteredStudents = students.filter(student =>
        student.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleAddStudent = () => {
        if (selectedStudentId) {
            addStudentMutation.mutate(selectedStudentId);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add Student to Class</DialogTitle>
                    <DialogDescription>
                        Search for a registered student to add to this class.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                    <div className="relative mb-4">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="pl-8"
                        />
                    </div>
                    <div className="max-h-60 overflow-y-auto border rounded-md">
                        {isLoading && <p className="p-4 text-center">Loading students...</p>}
                        {error && <p className="p-4 text-center text-red-500">Error: {error.message}</p>}
                        {filteredStudents.map(student => (
                            <div
                                key={student.userId}
                                onClick={() => setSelectedStudentId(student.userId)}
                                className={`p-2 cursor-pointer hover:bg-gray-100 ${selectedStudentId === student.userId ? "bg-blue-100" : ""}`}
                            >
                                <p className="font-semibold">{student.firstName} {student.lastName}</p>
                                <p className="text-sm text-gray-500">{student.email}</p>
                            </div>
                        ))}
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={onClose}>Cancel</Button>
                    <Button onClick={handleAddStudent} disabled={!selectedStudentId || addStudentMutation.isLoading}>
                        {addStudentMutation.isLoading ? "Adding..." : "Add Student"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}