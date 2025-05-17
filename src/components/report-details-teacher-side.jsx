"use client"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"


export function ReportDetailsModal({ report, isOpen, onClose }) {
  // Format the date to be more readable
  const formattedDate = new Date(report.reportDate).toLocaleString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })

  // Get notification type badge color
  const getBadgeVariant = (type) => {
    switch (type) {
      case "grade-alert":
        return "destructive"
      case "attendance-alert":
        return "warning"
      case "improvement":
        return "success"
      default:
        return "secondary"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-bold">Report Details</DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Report Type & Date */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <Badge variant={getBadgeVariant(report.notificationType)} className="w-fit text-xs">
              {report.notificationType.replace(/-/g, " ").toUpperCase()}
            </Badge>
            <span className="text-sm text-muted-foreground">{formattedDate}</span>
          </div>

          {/* Subject */}
          <div>
            <h3 className="text-xl font-bold">{report.subject}</h3>
          </div>

          {/* Message */}
          <div className="bg-primary text-white p-4 rounded-md">
            <div dangerouslySetInnerHTML={{ __html: report.message }} className="prose prose-sm max-w-none" />
          </div>

          <Separator />

          {/* Student Information */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">STUDENT INFORMATION</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium">Name</p>
                <p className="text-sm">{report.studentName}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Student Number</p>
                <p className="text-sm">{report.studentNumber}</p>
              </div>
              <div>
                <p className="text-sm font-medium">Class</p>
                <p className="text-sm">{report.className}</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Teacher Information */}
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-2">REPORTED BY</h4>
            <p className="text-sm">{report.teacherName}</p>
          </div>
        </div>

        {/* <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          <Button>Take Action</Button>
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  )
}
