import { useState } from 'react'
import { Routes, Route, Outlet } from 'react-router-dom'
import LoginPage from '@/pages/AuthenticationPages/LoginPage'
import SignupPage from '@/pages/AuthenticationPages/SignupPage'
import ForgotPassword from '@/pages/AuthenticationPages/ForgotPassword'
import VerifyCode from '@/pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
import Unauthorized from '@/pages/AuthenticationPages/Unauthorized'
import HomePage from '@/pages/Homepage'
import StudentDashboard from './pages/StudentDashboard'
import TeacherDashboard from './pages/TeacherDashboard'
import { useAuth } from './contexts/authentication-context'
import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, userRole, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
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
  const { isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/home" />;
  }

  return children;
};

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/unauthorized" element={<Unauthorized/>} />
      <Route element={<ProtectedRoute allowedRoles={['TEACHER', 'STUDENT', 'USER']} />}>
        <Route path="/home" element={<HomePage />} />
      </Route>
          
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} />}>
        <Route path="/teacher/*" element={<TeacherDashboard />} />
      </Route>
          
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} />}>
        <Route path="/student/*" element={<StudentDashboard />} />
      </Route>
          
      {/* <Route path="*" element={<Navigate to="/login" replace />} /> */}
    </Routes>
  )
}

export default App
