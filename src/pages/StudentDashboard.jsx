import React from 'react';
import Layout from "@/components/layout";

const StudentDashboard = () => {
  return (
    <Layout>
      <div className="student-dashboard-container">
        <header className="dashboard-header">
          <h1>Student Dashboard</h1>
          <p>Welcome to your academic portal</p>
        </header>
        
        <div className="dashboard-content">
          <div className="dashboard-section">
            <h2>Courses</h2>
            <p>Your enrolled courses will appear here.</p>
          </div>
          
          <div className="dashboard-section">
            <h2>Recent Grades</h2>
            <p>Your recent grades will appear here.</p>
          </div>
          
          <div className="dashboard-section">
            <h2>Upcoming Assignments</h2>
            <p>Your upcoming assignments will appear here.</p>
          </div>
        </div>
        
        <footer className="dashboard-footer">
          <p>This is a temporary student dashboard</p>
        </footer>
      </div>
    </Layout>
  );
};

export default StudentDashboard;
