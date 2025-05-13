import React from 'react';
import Layout from "@/components/layout";
import { DashboardHeader } from "@/components/student-dashboard/dashboard-header"
import { DashboardShell } from "@/components/student-dashboard/dashboard-shell"
import { GradeOverview } from "@/components/student-dashboard/grade-overview"
import { RecentActivity } from "@/components/student-dashboard/recent-activity"
import { SubjectPerformance } from "@/components/student-dashboard/subject-performance"
import { UpcomingAssignments } from "@/components/student-dashboard/upcoming-assignments"
import { PerformanceChart } from "@/components/student-dashboard/performance-chart"
import { Notifications } from "@/components/student-dashboard/notifications"

export const metadata = {
  title: "Dashboard | Gradify",
  description: "Student dashboard for tracking academic performance",
}

const StudentDashboard = () => {
  return (
    <Layout>
      <DashboardShell>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here's an overview of your academic performance." />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <GradeOverview />
        <UpcomingAssignments />
        <Notifications />
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <PerformanceChart />
        <RecentActivity />
      </div>
      <SubjectPerformance />
    </DashboardShell>
    </Layout>
  );
};

export default StudentDashboard;
