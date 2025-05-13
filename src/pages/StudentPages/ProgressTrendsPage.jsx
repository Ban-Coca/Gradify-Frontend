import { DashboardHeader } from "@/components/student-dashboard/dashboard-header"
import { DashboardShell } from "@/components/student-dashboard/dashboard-shell"
import { ProgressView } from "@/components/student-progress/progress-view"
import Layout from "@/components/layout"

export const metadata = {
  title: "Progress Trends | Gradify",
  description: "Track your academic progress over time",
}

export default function ProgressTrendsPage() {
  return (
    <Layout>
        <DashboardShell>
        <DashboardHeader heading="Progress Trends" text="Track your academic progress and identify improvement areas." />
        <ProgressView />
        </DashboardShell>
    </Layout>
  )
}
