import { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import './App.css' 
import Home from './components/Home.jsx'
import LoginForm from './components/LoginForm.jsx'
import SignupForm from './components/SignupForm.jsx'
import S_Dashboard from './components/Student/S_Dashboard.jsx'
import T_Dashboard from './components/Teacher/T_Dashboard.jsx'
import A_Dashboard from './components/Admin/A_Dashboard.jsx'
import Quiz from './components/Student/Quiz.jsx'
import Results from './components/Student/Results.jsx'
import ProtectedRoute from './components/common/ProtectedRoute.jsx'
import { useAuth } from './context/AuthContext'

function App() {
  const { user } = useAuth();
  
  // If user is already logged in, redirect to their dashboard
  const handleAuthRedirect = (Component) => {
    if (user) {
      if (user.role === 'Student') {
        return <Navigate to="/student/dashboard" />;
      } else if (user.role === 'Teacher') {
        return <Navigate to="/teacher/dashboard" />;
      } else if (user.role === 'Admin') {
        return <Navigate to="/admin/dashboard" />;
      }
    }
    return <Component />;
  };

  return (
    <div className="app-container h-full min-h-screen">
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={handleAuthRedirect(LoginForm)} />
        <Route path="/signup" element={handleAuthRedirect(SignupForm)} />
        
        {/* Protected routes with role-based access */}
        <Route 
          path="/student/dashboard" 
          element={
            <ProtectedRoute roles={['Student']}>
              <S_Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/teacher/dashboard" 
          element={
            <ProtectedRoute roles={['Teacher']}>
              <T_Dashboard />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/admin/dashboard" 
          element={
            <ProtectedRoute roles={['Admin']}>
              <A_Dashboard />
            </ProtectedRoute>
          } 
        />
        
        {/* Student-specific routes */}
        <Route 
          path="/quiz" 
          element={
            <ProtectedRoute roles={['Student']}>
              <Quiz />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/results" 
          element={
            <ProtectedRoute roles={['Student']}>
              <Results />
            </ProtectedRoute>
          } 
        />
        
        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App


