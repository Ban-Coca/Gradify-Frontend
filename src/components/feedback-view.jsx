import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, Filter, X, Download, Reply, CheckCircle, MessageSquare } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"

export function FeedbackView() {
  const [selectedCourse, setSelectedCourse] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedFeedback, setSelectedFeedback] = useState(null)
  const [showFilters, setShowFilters] = useState(false)
  const [replyMode, setReplyMode] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  // This would typically come from an API
  const courses = [
    { id: "all", name: "All Courses" },
    { id: "cs101", name: "CS101 - Introduction to Programming" },
    { id: "cs201", name: "CS201 - Data Structures" },
    { id: "cs301", name: "CS301 - Algorithms" },
    { id: "cs401", name: "CS401 - Software Engineering" },
  ]

  // This would typically come from an API
  const feedbackItems = [
    {
      id: "feedback1",
      courseId: "cs101",
      course: "CS101 - Introduction to Programming",
      title: "Programming Assignment 2",
      category: "Assignment",
      date: "2023-10-15",
      status: "unread",
      teacher: {
        firstName: "Dr. John",
        lastName: "Smith",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `
        <p><strong>Overall Assessment:</strong></p>
        <p>Your code structure was excellent, but there are some areas for improvement in error handling.</p>
        
        <p><strong>Strengths:</strong></p>
        <ul>
          <li>Well-organized code structure</li>
          <li>Good use of functions and classes</li>
          <li>Clear variable naming</li>
        </ul>
        
        <p><strong>Areas for Improvement:</strong></p>
        <ul>
          <li>Error handling needs more robustness</li>
          <li>Some edge cases not considered</li>
          <li>Code comments could be more descriptive</li>
        </ul>
        
        <p><strong>Recommendations:</strong></p>
        <p>I recommend focusing on implementing try-catch blocks for error handling and adding more comprehensive comments to explain your logic. Also, consider edge cases like empty inputs or invalid data.</p>
      `,
      attachments: [
        { name: "Assignment_Feedback.pdf", size: "1.2 MB" },
        { name: "Code_Examples.zip", size: "850 KB" },
      ],
    },
    {
      id: "feedback2",
      courseId: "cs101",
      course: "CS101 - Introduction to Programming",
      title: "Quiz 3: Functions",
      category: "Quiz",
      date: "2023-10-08",
      status: "read",
      teacher: {
        firstName: "Dr. Jane",
        lastName: "Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `
        <p><strong>Overall Assessment:</strong></p>
        <p>Excellent work on the quiz! You demonstrated a strong understanding of functions.</p>
        
        <p><strong>Strengths:</strong></p>
        <ul>
          <li>Clear understanding of function parameters</li>
          <li>Good implementation of recursive functions</li>
          <li>Proper use of return values</li>
        </ul>
        
        <p><strong>Areas for Improvement:</strong></p>
        <ul>
          <li>Consider optimizing function calls for better performance</li>
          <li>Review scope and closure concepts</li>
        </ul>
        
        <p><strong>Recommendations:</strong></p>
        <p>Continue practicing with more complex function patterns and explore higher-order functions.</p>
      `,
      attachments: [{ name: "Quiz_Feedback.pdf", size: "800 KB" }],
    },
    {
      id: "feedback3",
      courseId: "cs201",
      course: "CS201 - Data Structures",
      title: "Binary Tree Implementation",
      category: "Assignment",
      date: "2023-10-10",
      status: "read",
      teacher: {
        firstName: "Prof. John",
        lastName: "Doe",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `
        <p><strong>Overall Assessment:</strong></p>
        <p>Your implementation was efficient, but your documentation needs more detail.</p>
        
        <p><strong>Strengths:</strong></p>
        <ul>
          <li>Efficient implementation of binary tree operations</li>
          <li>Good time complexity analysis</li>
          <li>Clean code structure</li>
        </ul>
        
        <p><strong>Areas for Improvement:</strong></p>
        <ul>
          <li>Documentation needs more detail</li>
          <li>Some edge cases not handled properly</li>
          <li>Could improve memory usage</li>
        </ul>
        
        <p><strong>Recommendations:</strong></p>
        <p>For your next assignment, focus on providing more detailed documentation for your code. Explain your design decisions and the reasoning behind your implementation choices.</p>
      `,
      attachments: [{ name: "Implementation_Feedback.pdf", size: "980 KB" }],
    },
    {
      id: "feedback4",
      courseId: "cs301",
      course: "CS301 - Algorithms",
      title: "Algorithm Analysis",
      category: "Exam",
      date: "2023-10-05",
      status: "unread",
      teacher: {
        firstName: "Dr. Alice",
        lastName: "Green",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `
        <p><strong>Overall Assessment:</strong></p>
        <p>Your analysis is thorough, but you need to provide more examples to support your conclusions.</p>
        
        <p><strong>Strengths:</strong></p>
        <ul>
          <li>Comprehensive time complexity analysis</li>
          <li>Good understanding of algorithm behavior</li>
          <li>Clear explanation of concepts</li>
        </ul>
        
        <p><strong>Areas for Improvement:</strong></p>
        <ul>
          <li>Need more concrete examples</li>
          <li>Some mathematical proofs could be more rigorous</li>
          <li>Consider practical applications</li>
        </ul>
        
        <p><strong>Recommendations:</strong></p>
        <p>For your next analysis, include more concrete examples to illustrate your points. Also, try to connect theoretical concepts with practical applications to demonstrate your understanding.</p>
      `,
      attachments: [
        { name: "Analysis_Feedback.docx", size: "750 KB" },
        { name: "Example_Problems.pdf", size: "1.5 MB" },
      ],
    },
    {
      id: "feedback5",
      courseId: "cs401",
      course: "CS401 - Software Engineering",
      title: "Project Proposal",
      category: "Assignment",
      date: "2023-10-01",
      status: "read",
      teacher: {
        firstName: "Dr. James",
        lastName: "Brown",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      content: `
        <p><strong>Overall Assessment:</strong></p>
        <p>Your proposal is well-structured, but consider adding more details about implementation.</p>
        
        <p><strong>Strengths:</strong></p>
        <ul>
          <li>Clear project objectives and scope</li>
          <li>Well-defined requirements</li>
          <li>Good project timeline</li>
        </ul>
        
        <p><strong>Areas for Improvement:</strong></p>
        <ul>
          <li>Implementation details could be more specific</li>
          <li>Risk assessment needs more depth</li>
          <li>Consider adding more about testing strategy</li>
        </ul>
        
        <p><strong>Recommendations:</strong></p>
        <p>For your next proposal, include more specific details about how you plan to implement the project. Also, expand your risk assessment section to cover more potential issues and mitigation strategies.</p>
      `,
      attachments: [{ name: "Proposal_Feedback.pdf", size: "1.1 MB" }],
      replies: [
        {
          id: "reply1",
          date: "2023-10-02",
          content:
            "Thank you for the feedback. I'll work on adding more implementation details and expanding the risk assessment section.",
          sender: "student",
        },
        {
          id: "reply2",
          date: "2023-10-03",
          content: "Great! Looking forward to seeing your revised proposal. Let me know if you have any questions.",
          sender: "teacher",
        },
      ],
    },
  ]

  // Get user initials for avatar fallback
  const getUserInitials = (currentUser) => {
    if (!currentUser?.firstName && !currentUser?.lastName) return "U"
    return `${currentUser?.firstName?.charAt(0) || ""}${currentUser?.lastName?.charAt(0) || ""}`
  }

  // Filter feedback based on course selection, status, and search query
  const filteredFeedback = feedbackItems.filter((feedback) => {
    const matchesCourse = selectedCourse === "all" || feedback.courseId === selectedCourse
    const matchesStatus = statusFilter === "all" || feedback.status === statusFilter
    const matchesSearch =
      feedback.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      feedback.course.toLowerCase().includes(searchQuery.toLowerCase())

    return matchesCourse && matchesStatus && matchesSearch
  })

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  // Set the first feedback as selected by default if none is selected
  if (filteredFeedback.length > 0 && !selectedFeedback) {
    setSelectedFeedback(filteredFeedback[0].id)
  }

  // Get the selected feedback details
  const selectedFeedbackDetails = feedbackItems.find((feedback) => feedback.id === selectedFeedback)

  const handleMarkAsRead = () => {
    // In a real app, this would update the database
    // For now, we'll just log it
    console.log(`Marking feedback ${selectedFeedback} as read`)

    // Find the feedback in our array and update its status
    const updatedFeedbackItems = feedbackItems.map((item) => {
      if (item.id === selectedFeedback) {
        return { ...item, status: "read" }
      }
      return item
    })

    // In a real app, we would update the state with the new array
    // For this demo, we'll just log it
    console.log("Updated feedback items:", updatedFeedbackItems)
  }

  const handleSendReply = () => {
    if (!replyText.trim()) return

    // In a real app, this would send the reply to the server
    console.log(`Sending reply to feedback ${selectedFeedback}: ${replyText}`)

    // Reset the reply form
    setReplyText("")
    setReplyMode(false)
  }

  return (
    <div className="space-y-4 mb-8">
      <div className="flex flex-col gap-4">
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search feedback..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-muted" : ""}
          >
            <Filter className="h-4 w-4 " />
            <span className="sr-only">Filter</span>
          </Button>
        </div>

        {showFilters && (
          <Card className="border border-input">
            <CardContent className="p-4">
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-2">Course</h3>
                  <div className="flex flex-wrap gap-2">
                    {courses.map((course) => (
                      <Badge
                        key={course.id}
                        variant={selectedCourse === course.id ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => setSelectedCourse(course.id)}
                      >
                        {course.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCourse("all")
                      setStatusFilter("all")
                    }}
                  >
                    <X className="h-4 w-4 mr-2" />
                    Reset Filters
                  </Button>
                  <Button size="sm" onClick={() => setShowFilters(false)}>
                    Apply Filters
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Active filters display */}
        <div className="flex flex-wrap items-center gap-2">
          {selectedCourse !== "all" && (
            <Badge variant="secondary" className="flex items-center gap-1">
              {courses.find((c) => c.id === selectedCourse)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => setSelectedCourse("all")} />
            </Badge>
          )}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="h-[600px] overflow-auto">
          <CardHeader>
            <CardTitle>Feedback</CardTitle>
            <CardDescription>
              {filteredFeedback.length} feedback item{filteredFeedback.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredFeedback.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No feedback found matching your filters.
                </div>
              ) : (
                filteredFeedback.map((feedback) => (
                  <div
                    key={feedback.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedFeedback === feedback.id ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                    }`}
                    onClick={() => setSelectedFeedback(feedback.id)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-9 w-9">
                          <AvatarImage src={feedback.teacher?.profileImage} alt={feedback.teacher?.firstName} />
                          <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials(feedback.teacher)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="text-sm font-medium">
                            {feedback.teacher.firstName} {feedback.teacher.lastName}
                          </div>
                          <div className="text-xs text-muted-foreground">{formatDate(feedback.date)}</div>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium">{feedback.title}</div>
                      <div className="text-sm text-muted-foreground">{feedback.course}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="h-[600px] overflow-auto">
          {selectedFeedbackDetails ? (
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium">{selectedFeedbackDetails.title}</h3>
                </div>

                <div className="flex items-center gap-2">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={selectedFeedbackDetails.teacher.avatar} alt={selectedFeedbackDetails.teacher.firstName} />
                    <AvatarFallback className="bg-primary/10 text-primary">{getUserInitials(selectedFeedbackDetails.teacher)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">
                      {selectedFeedbackDetails.teacher.firstName} {selectedFeedbackDetails.teacher.lastName}
                    </div>
                    <div className="text-xs text-muted-foreground">{formatDate(selectedFeedbackDetails.date)}</div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant="outline">{selectedFeedbackDetails.course}</Badge>
                </div>

                <div
                  className="prose prose-sm max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedFeedbackDetails.content }}
                />
              </div>
            </CardContent>
          ) : (
            <CardContent className="flex items-center justify-center h-full">
              <div className="text-center">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium mb-2">No Feedback Selected</h3>
                <p className="text-muted-foreground">Select a feedback item from the list to view details.</p>
              </div>
            </CardContent>
          )}
        </Card>
      </div>
    </div>
  )
}
