import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import LoginPage from '@/pages/AuthenticationPages/LoginPage'
import SignupPage from '@/pages/AuthenticationPages/SignupPage'
import ForgotPassword from '@/pages/AuthenticationPages/ForgotPassword'
import VerifyCode from '@/pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
import Unauthorized from '@/pages/AuthenticationPages/Unauthorized'
import StudentDashboard from './pages/StudentPages/StudentDashboard'
import TeacherDashboard from './pages/TeacherPages/TeacherDashboard'
import OAuth2Callback from './components/OAuth2Callback'
import { useAuth } from './contexts/authentication-context'
import { Navigate } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import SpreadsheetsPage from './pages/TeacherPages/SpreadsheetsPage'
import { Loading } from './components/loading-state'
import DisplaySpreadsheetPage from './pages/TeacherPages/DisplaySpreadsheetPage'
import ClassesPage from './pages/TeacherPages/ClassesPage'
import ClassDetailPage from './pages/TeacherPages/ClassDetailPage'
import ReportsPage from './pages/TeacherPages/ReportPage'
import GradesPage from './pages/StudentPages/GradesPage'
import FeedbackPage from './pages/StudentPages/FeedbackPage'
import ProgressTrendsPage from './pages/StudentPages/ProgressTrendsPage'
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  if (loading) {
    return <Loading fullscreen variant={"spinner"} size="xl" />;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if(allowedRoles && !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return <Outlet/>;
}

export const RoleBasedComponent = ({ children, allowedRoles }) => {
  const { userRole } = useAuth();
  
  if (!allowedRoles || (userRole && allowedRoles.includes(userRole))) {
    return <>{children}</>;
  }
  
  return null;
};

const RedirectIfAuthenticated = ({ children }) => {
  const { isAuthenticated, userRole } = useAuth();

  if (isAuthenticated) {
    if (userRole === 'TEACHER') {
      return <Navigate to="/teacher/dashboard" />;
    } else if (userRole === 'STUDENT') {
      return <Navigate to="/student/dashboard" />;
    }
    // Default redirect if authenticated but role is unknown
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<RedirectIfAuthenticated><LoginPage /></RedirectIfAuthenticated>} />
      <Route path="/signup" element={<RedirectIfAuthenticated><SignupPage /></RedirectIfAuthenticated>} />
      <Route path="/oauth2/callback" element={<OAuth2Callback />} />
      <Route path="/forgot-password" element={<RedirectIfAuthenticated><ForgotPassword /></RedirectIfAuthenticated>} />
      <Route path="/verify-code" element={<RedirectIfAuthenticated><VerifyCode /></RedirectIfAuthenticated>} />
      <Route path="/reset-password" element={<RedirectIfAuthenticated><PasswordReset /></RedirectIfAuthenticated>} />
      <Route path="/unauthorized" element={<Unauthorized/>} />
      <Route path="/" element={<RedirectIfAuthenticated><LandingPage /></RedirectIfAuthenticated>} />
      
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
        <Route path="/teacher/*" element={<TeacherDashboard />} />
        <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
        <Route path="/teacher/spreadsheets" element={<SpreadsheetsPage />} />
        <Route path="/teacher/spreadsheets/display/:id" element={<DisplaySpreadsheetPage />} />
        <Route path="/classes/:tab?" element={<ClassesPage />} />
        <Route path="/classes/classdetail/:id?" element={<ClassDetailPage />} />    
        <Route path="/reports" element={<ReportsPage/>} />      
      </Route>
          
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route path="/student/*" element={<StudentDashboard />} />
        <Route path="/student/dashboard" element={<StudentDashboard />} />
        <Route path="/student/grades" element={<GradesPage />} />
        <Route path="/student/feedback" element={<FeedbackPage />} />
        <Route path="/student/progress-trends" element={<ProgressTrendsPage />} />
      </Route>
          
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  )
}

export default App