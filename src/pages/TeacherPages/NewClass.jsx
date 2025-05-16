import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { createClass } from "@/services/teacher/classServices";
import { useAuth } from "@/contexts/authentication-context";
import { toast } from 'react-hot-toast';

const NewClass = ({ isOpen, onClose, onClassCreated }) => {
  const { currentUser, getAuthHeader } = useAuth();
  
  const [formData, setFormData] = useState({
    className: "",
    section: "",
    semester: "",
    schoolYear: new Date().getFullYear().toString(),
    classCode: generateRandomCode(6),
    schedule: "",
    room: "",
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Generate a random alphanumeric code
  function generateRandomCode(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your class...");
      
      // Get the auth header
      const authHeader = getAuthHeader();
      
      // Create class data with all required fields
      const classFormData = {
        ...formData,
        teacherId: currentUser.userId,
        authHeader: authHeader
      };
      
      // Send data to backend using the service
      const response = await createClass(classFormData);
      
      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Get current date for created/updated timestamps
      const now = new Date();
      
      // Determine category for UI display
      const currentYear = now.getFullYear();
      const currentMonth = now.getMonth() + 1;
      let currentSemester;

      if (currentMonth >= 1 && currentMonth <= 5) {
        currentSemester = "2nd Semester";
      } else if (currentMonth >= 8 && currentMonth <= 12) {
        currentSemester = "1st Semester";
      } else {
        currentSemester = null;
      }

      let category = "all";
      // Current semester logic
      if (formData.semester === currentSemester && formData.schoolYear === currentYear.toString()) {
        category = "current";
      } 
      // Future semester logic - classes for next semester should also be "current"
      else if (
        // Next semester in same year
        (formData.schoolYear === currentYear.toString() && 
        ((currentSemester === "1st Semester" && formData.semester === "2nd Semester") ||
          (currentSemester === "Summer" && formData.semester === "1st Semester"))) ||
        // Next year's classes
        (parseInt(formData.schoolYear) > currentYear)
      ) {
        category = "current";
      }
      // Past classes
      else if (
        parseInt(formData.schoolYear) < currentYear || 
        (formData.schoolYear === currentYear.toString() && 
        ((currentSemester === "2nd Semester" && formData.semester === "1st Semester") ||
          (currentSemester === "1st Semester" && formData.semester === "Summer")))
      ) {
        category = "past";
      }

      // Combine backend response with frontend data for immediate UI update
      const newClass = {
        classId: response.classId || Date.now(), // Use response ID or fallback
        className: formData.className,
        section: formData.section,
        semester: formData.semester,
        schoolYear: formData.schoolYear,
        classCode: formData.classCode,
        schedule: formData.schedule,
        room: formData.room,
        category,
        createdAt: response.createdAt || now.toISOString(),
        updatedAt: response.updatedAt || now.toISOString(),
        teacher: {
          userId: currentUser.userId
        }
      };
      
      onClassCreated(newClass);
      
      // Show success toast with class name
      toast.success(`Class "${formData.className}" created successfully!`, {
        duration: 4000
      });
      
      onClose();
      
      // Reset form
      setFormData({
        className: "",
        section: "",
        semester: "",
        schoolYear: new Date().getFullYear().toString(),
        classCode: generateRandomCode(6),
        schedule: "",
        room: "",
      });
    } catch (error) {
      console.error("Error creating class:", error);
      const errorMessage = error.response?.data?.message || "Failed to create class. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>
            Fill in the details to create a new class.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="className" className="text-right">
                Class Name
              </Label>
              <Input
                id="className"
                name="className"
                value={formData.className}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Enter class name"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="section" className="text-right">
                Section
              </Label>
              <Input
                id="section"
                name="section"
                value={formData.section}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Enter section (e.g., A, B, Class 101)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="schedule" className="text-right">
                Schedule
              </Label>
              <Input
                id="schedule"
                name="schedule"
                value={formData.schedule}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="E.g., Mon/Wed 10:00-11:30 AM"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="semester" className="text-right">
                Semester
              </Label>
              <Select
                value={formData.semester}
                onValueChange={(value) => handleSelectChange("semester", value)}
                required
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st Semester">1st Semester</SelectItem>
                  <SelectItem value="2nd Semester">2nd Semester</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="schoolYear" className="text-right">
                School Year
              </Label>
              <Input
                id="schoolYear"
                name="schoolYear"
                value={formData.schoolYear}
                onChange={handleInputChange}
                className="col-span-3"
                required
                placeholder="Enter school year (e.g., 2025)"
              />
            </div>

            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="room" className="text-right">
                Room
              </Label>
              <Input
                id="room"
                name="room"
                value={formData.room}
                onChange={handleInputChange}
                className="col-span-3"
                placeholder="Enter room (e.g., NGE-101)"
              />
            </div>
            
            <div className="grid grid-cols-4 items-center gap-2">
              <Label htmlFor="classCode" className="text-right">
                Class Code
              </Label>
              <div className="col-span-3 flex gap-2">
                <Input
                  id="classCode"
                  name="classCode"
                  value={formData.classCode}
                  onChange={handleInputChange}
                  className="flex-1"
                  readOnly
                />
                <Button 
                  type="button" 
                  variant="outline"
                  className="cursor-pointer"
                  onClick={() => setFormData(prev => ({
                    ...prev,
                    classCode: generateRandomCode(6)
                  }))}
                >
                  Regenerate
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="cursor-pointer">
              {isSubmitting ? "Creating..." : "Create Class"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewClass;