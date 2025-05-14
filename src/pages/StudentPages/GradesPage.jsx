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
        <DashboardShell>
            <DashboardHeader heading="Grades" text="View and track your academic performance across all courses." />
            <GradesView />
        </DashboardShell>
    </Layout>
  )
}
