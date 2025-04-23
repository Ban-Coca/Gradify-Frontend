import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function EngagementMetrics() {
  // Sample engagement metrics
  const metrics = [
    {
      id: 1,
      name: "Emma Johnson",
      participation: 95,
      attendance: 98,
      assignmentCompletion: 100,
      feedback: "Highly engaged, participates regularly in discussions",
    },
    {
      id: 2,
      name: "Michael Smith",
      participation: 70,
      attendance: 85,
      assignmentCompletion: 80,
      feedback: "Moderate engagement, could participate more in discussions",
    },
    {
      id: 3,
      name: "Sophia Garcia",
      participation: 90,
      attendance: 95,
      assignmentCompletion: 95,
      feedback: "Strong engagement, contributes valuable insights",
    },
    {
      id: 4,
      name: "James Wilson",
      participation: 85,
      attendance: 90,
      assignmentCompletion: 90,
      feedback: "Good engagement, consistent participation",
    },
    {
      id: 5,
      name: "Olivia Martinez",
      participation: 60,
      attendance: 75,
      assignmentCompletion: 70,
      feedback: "Needs improvement, often distracted in class",
    },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Student Engagement Details</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {metrics.map((student) => (
            <div key={student.id} className="border rounded-md p-4">
              <div className="flex justify-between items-center mb-2">
                <h4 className="font-medium">{student.name}</h4>
                <div className="text-sm bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {student.participation + student.attendance + student.assignmentCompletion}/300
                </div>
              </div>

              <div className="space-y-2">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Participation</span>
                    <span>{student.participation}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${student.participation}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Attendance</span>
                    <span>{student.attendance}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-green-600 h-2 rounded-full" style={{ width: `${student.attendance}%` }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Assignment Completion</span>
                    <span>{student.assignmentCompletion}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${student.assignmentCompletion}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              <div className="mt-3 text-sm text-gray-600">
                <p className="font-medium">Feedback:</p>
                <p>{student.feedback}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
