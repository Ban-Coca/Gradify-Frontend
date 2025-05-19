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
        <div className='bg-inherited p-2 rounded-lg mt-4 mb-4'>
            <h1 className="text-xl md:text-2xl font-bold">Progress Trends</h1>
            <p className="text-sm text-muted">Track your academic progress and identify improvement areas.</p>
        </div>
        <ProgressView />
    </Layout>
  )
}
