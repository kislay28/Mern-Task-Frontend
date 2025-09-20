import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { AssignmentProvider } from './context/AssignmentContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/Login';
import TeacherDashboard from './pages/TeacherDashboard';
import StudentDashboard from './pages/StudentDashboard';
import { useAuth } from './context/AuthContext';
import { ROLES } from './utils/constants';

const AppRoutes = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <Routes>
      <Route 
        path="/login" 
        element={
          isAuthenticated ? (
            <Navigate to={user?.role === ROLES.TEACHER ? '/teacher' : '/student'} replace />
          ) : (
            <Login />
          )
        } 
      />
      
      <Route 
        path="/teacher/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.TEACHER]}>
            <TeacherDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/student/*" 
        element={
          <ProtectedRoute allowedRoles={[ROLES.STUDENT]}>
            <StudentDashboard />
          </ProtectedRoute>
        } 
      />
      
      <Route 
        path="/" 
        element={
          <Navigate 
            to={
              isAuthenticated 
                ? (user?.role === ROLES.TEACHER ? '/teacher' : '/student')
                : '/login'
            } 
            replace 
          />
        } 
      />
      
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

function App() {
  return (
    <AuthProvider>
      <AssignmentProvider>
        <Router>
          <div className="min-h-screen bg-gray-50">
            <AppRoutes />
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#363636',
                  color: '#fff',
                },
                success: {
                  duration: 3000,
                  theme: {
                    primary: '#4ade80',
                    secondary: 'black',
                  },
                },
                error: {
                  duration: 4000,
                  theme: {
                    primary: '#ef4444',
                    secondary: 'black',
                  },
                },
              }}
            />
          </div>
        </Router>
      </AssignmentProvider>
    </AuthProvider>
  );
}

export default App;
