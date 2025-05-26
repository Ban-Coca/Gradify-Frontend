import React from 'react';
import Layout from "@/components/layout";
import { DashboardHeader } from "@/components/student-dashboard/dashboard-header"
import { DashboardShell } from "@/components/student-dashboard/dashboard-shell"
import { ClassesList } from "@/components/student-dashboard/classes-list"
import { SubjectPerformance } from "@/components/student-dashboard/recent-feedaback"
import { PerformanceChart } from "@/components/student-dashboard/performance-chart"
export const metadata = {
  title: "Dashboard | Gradify",
  description: "Student dashboard for tracking academic performance",
}

const StudentDashboard = () => {
  return (
    <Layout>
      <DashboardHeader heading="Dashboard" text="Welcome back! Here's an overview of your academic performance." />
      <DashboardShell>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 w-full">
        <div className="w-full">
          <ClassesList />
        </div>
        <div className="w-full">
          <PerformanceChart />
        </div>
      </div>
      <SubjectPerformance />
    </DashboardShell>
    </Layout>
  );
};

export default StudentDashboard;
