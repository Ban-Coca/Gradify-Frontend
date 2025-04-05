import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/AuthenticationPages/LoginPage'
import SignupPage from '@/pages/AuthenticationPages/SignupPage'
import ForgotPassword from '@/pages/AuthenticationPages/ForgotPassword'
import VerifyCode from '@/pages/AuthenticationPages/VerificationCodePage'
import PasswordReset from './pages/AuthenticationPages/PasswordReset'
import HomePage from '@/pages/HomePage'
import { AuthenticationProvider, useAuth } from './contexts/authentication-context'
import { Navigate } from 'react-router-dom'
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
}
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
      <Route path="/" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/verify-code" element={<VerifyCode />} />
      <Route path="/reset-password" element={<PasswordReset />} />
      <Route path="/home" element={
        <ProtectedRoute>
          <HomePage />
        </ProtectedRoute>} 
      />
    </Routes>
  )
}

export default App
