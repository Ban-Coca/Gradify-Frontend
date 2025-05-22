"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"
import { Bell, FileText, MessageSquare } from "lucide-react"

export function Notifications() {
  // This would typically come from an API or database
  const notifications = [
    {
      id: 1,
      title: "New grade posted",
      description: "Your CS101 test has been graded",
      time: "2 hours ago",
      type: "grade",
    },
    {
      id: 2,
      title: "Teacher feedback",
      description: "Dr. Johnson left feedback on your assignment",
      time: "1 day ago",
      type: "feedback",
    },
    {
      id: 3,
      title: "Assignment reminder",
      description: "CS301 homework due tomorrow",
      time: "2 days ago",
      type: "reminder",
    },
    {
      id: 4,
      title: "Assignment reminder",
      description: "CS301 homework due tomorrow",
      time: "2 days ago",
      type: "reminder",
    },
  ]

  const getIcon = (type) => {
    switch (type) {
      case "grade":
        return <FileText className="h-4 w-4 text-blue-500" />
      case "feedback":
        return <MessageSquare className="h-4 w-4 text-green-500" />
      case "reminder":
        return <Bell className="h-4 w-4 text-amber-500" />
      default:
        return <Bell className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Your recent notifications</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notifications.map((notification) => (
            <div key={notification.id} className="flex items-start space-x-3">
              <div className="mt-0.5">{getIcon(notification.type)}</div>
              <div className="space-y-1">
                <div className="font-medium">{notification.title}</div>
                <div className="text-sm text-muted-foreground">{notification.description}</div>
                <div className="text-xs text-muted-foreground">{notification.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
