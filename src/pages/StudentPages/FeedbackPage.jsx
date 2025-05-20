import { DashboardHeader } from "@/components/student-dashboard/dashboard-header"
import { DashboardShell } from "@/components/student-dashboard/dashboard-shell"
import { FeedbackView } from "@/components/feedback-view"
import Layout from "@/components/layout"

export const metadata = {
  title: "Feedback | Gradify",
  description: "View teacher feedback on your assignments and assessments",
}

export default function FeedbackPage() {
  return (
    <Layout>
        <div className='bg-inherited p-2 rounded-lg mt-4 mb-4'>
            <h1 className="text-xl md:text-2xl font-bold">Feedback</h1>
            <p className="text-sm text-muted">Review teacher comments and suggestions on your work.</p>
        </div>
        <FeedbackView />
    </Layout>
  )
}
