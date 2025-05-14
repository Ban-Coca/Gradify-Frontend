"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Badge } from "../../components/ui/badge"
import { Calendar } from "lucide-react"

export function UpcomingAssignments() {
  // This would typically come from an API or database
  const assignments = [
    {
      id: 1,
      title: "Programming Quiz",
      dueDate: "Oct 15, 2023",
      subject: "CS101",
      priority: "high",
    },
    {
      id: 2,
      title: "Algorithm Analysis",
      dueDate: "Oct 18, 2023",
      subject: "CS301",
      priority: "medium",
    },
    {
      id: 3,
      title: "Project Proposal",
      dueDate: "Oct 20, 2023",
      subject: "CS401",
      priority: "low",
    },
  ]

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Upcoming Assignments</CardTitle>
        <CardDescription>Assignments due in the next 7 days</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assignments.map((assignment) => (
            <div key={assignment.id} className="flex items-start justify-between">
              <div className="space-y-1">
                <div className="font-medium">{assignment.title}</div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="mr-1 h-3 w-3" />
                  {assignment.dueDate}
                </div>
              </div>
              <Badge
                variant={
                  assignment.priority === "high"
                    ? "destructive"
                    : assignment.priority === "medium"
                      ? "default"
                      : "secondary"
                }
              >
                {assignment.subject}
              </Badge>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
