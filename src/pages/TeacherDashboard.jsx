import React from 'react';
import Layout from "@/components/layout";
import { BarChartComponent } from '@/components/charts/bar-chart';
const TeacherDashboard = () => {
  return (
    <Layout >
      <div className=' bg-inherited font-bold text-2xl md:text-4xl p-4 rounded-lg shadow-sm mt-4 mb-4'>
        Welcome back, Teacher! This is your dashboard.
      </div>
      <div className='grid sm:grid-cols-1 md:grid-cols-4 gap-4'>
        <BarChartComponent/>
        <BarChartComponent/>
        <BarChartComponent/>
        <BarChartComponent/>
      </div>
    </Layout>
  );
};

export default TeacherDashboard;
