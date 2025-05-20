import { DashboardHeader } from "@/components/student-dashboard/dashboard-header"
import { DashboardShell } from "@/components/student-dashboard/dashboard-shell"
import { GradesView } from "@/components/student-grades/grades-view"
import Layout from "@/components/layout"
export const metadata = {
  title: "Grades | Gradify",
  description: "View your academic grades and performance",
}

export default function GradesPage() {
  return (
    <Layout>
        <div className='bg-inherited p-2 rounded-lg mt-4 mb-4'>
            <h1 className="text-xl md:text-2xl font-bold">Grades</h1>
            <p className="text-sm text-muted">View and track your academic performance across all courses.</p>
        </div>
        <GradesView />
    </Layout>
  )
}
