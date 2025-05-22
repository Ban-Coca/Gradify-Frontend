import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { createClass } from "@/services/teacher/classServices"
import { useAuth } from "@/contexts/authentication-context"
import { toast } from "react-hot-toast"

const NewClass = ({ isOpen, onClose, onClassCreated }) => {
  const { currentUser, getAuthHeader } = useAuth()

  const [formData, setFormData] = useState({
    className: "",
    section: "",
    semester: "",
    schoolYear: new Date().getFullYear().toString(),
    classCode: generateRandomCode(6),
    days: [],
    startTime: "",
    startTimeZone: "AM",
    endTime: "",
    endTimeZone: "AM",
    room: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Generate a random alphanumeric code
  function generateRandomCode(length) {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
    let result = ""
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
  }

  // Helper to generate time options
  const allTimes = [];
  for (let hour = 7; hour <= 22; hour++) {
    for (let min = 0; min < 60; min += 30) {
      // For 10:00 PM, only allow :00, not :30
      if (hour === 22 && min > 0) continue;
      const value = `${hour.toString().padStart(2, "0")}:${min.toString().padStart(2, "0")}`;
      let displayHour = hour % 12 === 0 ? 12 : hour % 12;
      let ampm = hour < 12 ? "AM" : "PM";
      const display = `${displayHour}:${min.toString().padStart(2, "0")} ${ampm}`;
      allTimes.push({ value, display, hour, min, ampm });
    }
  }
  // Filter times for AM or PM
  const getFilteredTimes = (zone) => {
    if (zone === "AM") {
      // 7:00 AM to 11:30 AM
      return allTimes.filter(t => t.ampm === "AM" && t.hour >= 7 && t.hour <= 11);
    } else {
      // 12:00 PM to 10:00 PM (no 10:30 PM)
      return allTimes.filter(
        t =>
          t.ampm === "PM" &&
          t.hour >= 12 &&
          (t.hour < 22 || (t.hour === 22 && t.min === 0))
      );
    }
  };

  const handleDaysChange = (e) => {
    const { value, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      days: checked ? [...prev.days, value] : prev.days.filter((day) => day !== value),
    }))
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const getScheduleString = () => {
    if (!formData.days.length || !formData.startTime || !formData.endTime) return "";
    const days = formData.days.map(d => d.slice(0, 3)).join("/"); // Mon/Wed/Fri

    // Format time as hh:mm
    const formatTime = (t) => {
      const [h, m] = t.split(":");
      const hour = ((+h + 11) % 12) + 1;
      return `${hour}:${m}`;
    };

    // If both times are in the same zone, show AM/PM once
    if (formData.startTimeZone === formData.endTimeZone) {
      return `${days} ${formatTime(formData.startTime)}-${formatTime(formData.endTime)} ${formData.startTimeZone}`;
    }
    // If different zones, show both
    return `${days} ${formatTime(formData.startTime)} ${formData.startTimeZone}-${formatTime(formData.endTime)} ${formData.endTimeZone}`;
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Validation: check all required fields
    if (
      !formData.className.trim() ||
      !formData.section.trim() ||
      !formData.semester.trim() ||
      !formData.schoolYear.trim() ||
      !formData.classCode.trim() ||
      !formData.room.trim() ||
      formData.days.length === 0 ||
      !formData.startTime ||
      !formData.endTime
    ) {
      toast.error("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Show loading toast
      const loadingToast = toast.loading("Creating your class...")

      // Get the auth header
      const authHeader = getAuthHeader()

      // Create class data with all required fields
      const classFormData = {
        ...formData,
        teacherId: currentUser.userId,
        authHeader: authHeader,
        schedule: getScheduleString(),
      }

      const schedule = getScheduleString()
      console.log("Schedule String:", schedule)
      // Send data to backend using the service
      const response = await createClass(classFormData)

      // Dismiss loading toast
      toast.dismiss(loadingToast)

      // Get current date for created/updated timestamps
      const now = new Date()

      // Determine category for UI display
      const currentYear = now.getFullYear()
      const currentMonth = now.getMonth() + 1
      let currentSemester

      if (currentMonth >= 1 && currentMonth <= 5) {
        currentSemester = "2nd"
      } else if (currentMonth >= 8 && currentMonth <= 12) {
        currentSemester = "1st"
      } else {
        currentSemester = null
      }

      let category = "all"
      // Current semester logic
      if (formData.semester === currentSemester && formData.schoolYear === currentYear.toString()) {
        category = "current"
      }
      // Future semester logic - classes for next semester should also be "current"
      else if (
        // Next semester in same year
        (formData.schoolYear === currentYear.toString() &&
          ((currentSemester === "1st" && formData.semester === "2nd") ||
            (currentSemester === "Summer" && formData.semester === "1st"))) ||
        // Next year's classes
        Number.parseInt(formData.schoolYear) > currentYear
      ) {
        category = "current"
      }
      // Past classes
      else if (
        Number.parseInt(formData.schoolYear) < currentYear ||
        (formData.schoolYear === currentYear.toString() &&
          ((currentSemester === "2nd" && formData.semester === "1st") ||
            (currentSemester === "1st" && formData.semester === "Summer")))
      ) {
        category = "past"
      }

      // Combine backend response with frontend data for immediate UI update
      const newClass = {
        classId: response.classId || Date.now(), // Use response ID or fallback
        className: formData.className,
        section: formData.section,
        semester: formData.semester,
        schoolYear: formData.schoolYear,
        classCode: formData.classCode,
        schedule: schedule,
        room: formData.room,
        category,
        createdAt: response.createdAt || now.toISOString(),
        updatedAt: response.updatedAt || now.toISOString(),
        teacher: {
          userId: currentUser.userId,
        },
      }

      onClassCreated(newClass)

      // Show success toast with class name
      toast.success(`Class "${formData.className}" created successfully!`, {
        duration: 4000,
      })

      onClose()

      // Reset form
      setFormData({
        className: "",
        section: "",
        semester: "",
        schoolYear: new Date().getFullYear().toString(),
        classCode: generateRandomCode(6),
        days: [],
        startTime: "",
        startTimeZone: "AM",
        endTime: "",
        endTimeZone: "AM",
        room: "",
      })
    } catch (error) {
      console.error("Error creating class:", error)
      const errorMessage = error.response?.data?.message || "Failed to create class. Please try again."
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
          <DialogDescription>Fill in the details to create a new class.</DialogDescription>
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
                <Label className="text-right">Days</Label>
                <div className="col-span-3 relative w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button type="button" variant="outline" className="w-full">
                        {formData.days.length > 0 ? formData.days.join(", ") : "Select days"}
                        <span>&#9662;</span>
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="min-w-[250px] w-[300px]">
                      <div className="flex flex-col gap-1">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                          <label key={day} className="flex items-center gap-2 cursor-pointer">
                            <input
                              type="checkbox"
                              name="days"
                              value={day}
                              checked={formData.days.includes(day)}
                              onChange={handleDaysChange}
                              className="accent-green-600"
                              required={formData.days.length === 0}
                            />
                            <span>{day}</span>
                          </label>
                        ))}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
                {/* Start and End Time Selectors */}
                <Label htmlFor="startTime" className="text-right mt-2">Start Time</Label>
                <div className="col-span-3 flex gap-2 mt-2">
                  <Select
                    value={formData.startTime}
                    onValueChange={(value) => handleSelectChange("startTime", value)}
                    required
                  >
                    <SelectTrigger className="w-full border rounded-md px-3 py-2 h-12">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredTimes(formData.startTimeZone).map(time => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.startTimeZone}
                    onValueChange={(value) => handleSelectChange("startTimeZone", value)}
                    required
                  >
                    <SelectTrigger className="w-24 border rounded-md px-3 py-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Label htmlFor="endTime" className="text-right mt-2">End Time</Label>
                <div className="col-span-3 flex gap-2 mt-2">
                  <Select
                    value={formData.endTime}
                    onValueChange={(value) => handleSelectChange("endTime", value)}
                    required
                  >
                    <SelectTrigger className="w-full border rounded-md px-3 py-2 h-12">
                      <SelectValue placeholder="Select time" />
                    </SelectTrigger>
                    <SelectContent>
                      {getFilteredTimes(formData.endTimeZone).map(time => (
                        <SelectItem key={time.value} value={time.value}>
                          {time.display}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select
                    value={formData.endTimeZone}
                    onValueChange={(value) => handleSelectChange("endTimeZone", value)}
                    required
                  >
                    <SelectTrigger className="w-24 border rounded-md px-3 py-2 h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
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
                  <SelectItem value="1st">1st Semester</SelectItem>
                  <SelectItem value="2nd">2nd Semester</SelectItem>
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
                  onClick={() =>
                    setFormData((prev) => ({
                      ...prev,
                      classCode: generateRandomCode(6),
                    }))
                  }
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
  )
}

export default NewClass
