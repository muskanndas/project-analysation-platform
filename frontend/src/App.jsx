import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from './routes/ProtectedRoute';

import Login from './pages/Login';
import AdminDashboard from './pages/AdminDashboard';
import StudentDashboard from './pages/StudentDashboard';
import MentorDashboard from './pages/MentorDashboard';
import StudentLayout from './components/StudentLayout';
import MentorLayout from './components/MentorLayout';
import AdminLayout from './components/AdminLayout';
import Signup from './pages/Signup';
import ForgotPassword from './pages/ForgotPassword';
import VerifyOtp from './pages/VerifyOtp';
import ResetPassword from './pages/ResetPassword';
import TeamCreatePage from './pages/TeamCreatePage';
import TeamDashboardPage from './pages/TeamDashboardPage';
import ProjectCreatePage from './pages/ProjectCreatePage';
import ProjectDetailsPage from './pages/ProjectDetailsPage';
import MentorProjectReviewPage from './pages/MentorProjectReviewPage';
import MentorProjectProgressPage from './pages/MentorProjectProgressPage';
import MentorProjectFeedbackPage from './pages/MentorProjectFeedbackPage';
import StudentFeedbackPage from './pages/StudentFeedbackPage';
import StudentTaskBoardPage from './pages/StudentTaskBoardPage';
import StudentTaskCreatePage from './pages/StudentTaskCreatePage';
import StudentMyTasksPage from './pages/StudentMyTasksPage';
import StudentManagement from './pages/StudentManagement';
import MentorManagement from './pages/MentorManagement';
import ProjectMonitoring from './pages/ProjectMonitoring';
import TaskMonitoring from './pages/TaskMonitoring';
import MentorMonitoring from './pages/MentorMonitoring';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          <Route
            path="/admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="students" element={<StudentManagement />} />
            <Route path="mentors" element={<MentorManagement />} />
            <Route path="projects" element={<ProjectMonitoring />} />
            <Route path="tasks" element={<TaskMonitoring />} />
            <Route path="mentor-monitoring" element={<MentorMonitoring />} />
          </Route>
          
          <Route
            path="/mentor"
            element={
              <ProtectedRoute requiredRole="mentor">
                <MentorLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/mentor/dashboard" replace />} />
            <Route path="dashboard" element={<MentorDashboard />} />
            <Route path="project/:id/review" element={<MentorProjectReviewPage />} />
            <Route path="project/:id/progress" element={<MentorProjectProgressPage />} />
            <Route path="project/:id/feedback" element={<MentorProjectFeedbackPage />} />
          </Route>
          
          <Route
            path="/student"
            element={
              <ProtectedRoute requiredRole="student">
                <StudentLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Navigate to="/student/dashboard" replace />} />
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="team/create" element={<TeamCreatePage />} />
            <Route path="team" element={<TeamDashboardPage />} />
            <Route path="project/create" element={<ProjectCreatePage />} />
            <Route path="project" element={<ProjectDetailsPage />} />
            <Route path="feedback" element={<StudentFeedbackPage />} />
            <Route path="tasks" element={<StudentTaskBoardPage />} />
            <Route path="tasks/create" element={<StudentTaskCreatePage />} />
            <Route path="tasks/my" element={<StudentMyTasksPage />} />
          </Route>
          
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
