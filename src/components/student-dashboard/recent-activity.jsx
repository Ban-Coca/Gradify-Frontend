"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar"

export function RecentActivity() {
  // This would typically come from an API or database
  const activities = [
    {
      id: 1,
      type: "grade",
      subject: "CS101",
      description: "You received a grade of 4.7 on your Programming exam",
      time: "2 hours ago",
      teacher: {
        name: "Dr. Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 2,
      type: "feedback",
      subject: "CS301",
      description: "Dr. Johnson provided feedback on your algorithm analysis",
      time: "1 day ago",
      teacher: {
        name: "Dr. Johnson",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
    {
      id: 3,
      type: "submission",
      subject: "CS401",
      description: "You submitted your project proposal",
      time: "2 days ago",
      teacher: {
        name: "Prof. Davis",
        avatar: "/placeholder.svg?height=40&width=40",
      },
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>Your latest academic activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {activities.map((activity) => (
            <div key={activity.id} className="flex items-start space-x-4">
              <Avatar>
                <AvatarImage src={activity.teacher.avatar || "/placeholder.svg"} alt={activity.teacher.name} />
                <AvatarFallback>{activity.teacher.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <div className="font-medium">{activity.subject}</div>
                <div className="text-sm text-muted-foreground">{activity.description}</div>
                <div className="text-xs text-muted-foreground">{activity.time}</div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
