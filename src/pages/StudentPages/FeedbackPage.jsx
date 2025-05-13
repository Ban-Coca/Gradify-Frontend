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
        <DashboardShell>
        <DashboardHeader heading="Feedback" text="Review teacher comments and suggestions on your work." />
        <FeedbackView />
        </DashboardShell>
    </Layout>
  )
}
