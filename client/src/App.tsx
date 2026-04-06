import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Layout from './components/Layout';
import AdminTeachers from './pages/AdminTeachers';
import AdminStudents from './pages/AdminStudents';
import AdminClasses from './pages/AdminClasses';
import TeacherAttendance from './pages/TeacherAttendance';
import TeacherMarks from './pages/TeacherMarks';
import StudentPortal from './pages/StudentPortal';
import ParentFees from './pages/ParentFees';
import Announcements from './pages/Announcements';

const ProtectedRoute: React.FC<{ children: React.ReactNode, role: string }> = ({ children, role }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  if (!token) return <Navigate to="/login" />;
  if (user.role !== role) return <Navigate to="/login" />;

  return <Layout role={role}>{children}</Layout>;
};

const Dashboard: React.FC<{ role: string }> = ({ role }) => {
  return (
    <div className="card">
      <h2>Welcome to the {role.charAt(0) + role.slice(1).toLowerCase()} Dashboard</h2>
      <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>
        This is your central hub for managing Varahi Schools activities.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Overview</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Quick Stats</div>
        </div>
        <div className="card" style={{ borderLeft: '4px solid var(--secondary)' }}>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>Notifications</div>
          <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>3 New</div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        {/* Admin Routes */}
        <Route path="/admin" element={<ProtectedRoute role="ADMIN"><Dashboard role="ADMIN" /></ProtectedRoute>} />
        <Route path="/admin/teachers" element={<ProtectedRoute role="ADMIN"><AdminTeachers /></ProtectedRoute>} />
        <Route path="/admin/students" element={<ProtectedRoute role="ADMIN"><AdminStudents /></ProtectedRoute>} />
        <Route path="/admin/classes" element={<ProtectedRoute role="ADMIN"><AdminClasses /></ProtectedRoute>} />

        {/* Teacher Routes */}
        <Route path="/teacher" element={<ProtectedRoute role="TEACHER"><Dashboard role="TEACHER" /></ProtectedRoute>} />
        <Route path="/teacher/attendance" element={<ProtectedRoute role="TEACHER"><TeacherAttendance /></ProtectedRoute>} />
        <Route path="/teacher/marks" element={<ProtectedRoute role="TEACHER"><TeacherMarks /></ProtectedRoute>} />

        {/* Student Routes */}
        <Route path="/student" element={<ProtectedRoute role="STUDENT"><StudentPortal /></ProtectedRoute>} />
        <Route path="/student/marks" element={<ProtectedRoute role="STUDENT"><StudentPortal /></ProtectedRoute>} />

        {/* Parent Routes */}
        <Route path="/parent" element={<ProtectedRoute role="PARENT"><StudentPortal /></ProtectedRoute>} />
        <Route path="/parent/fees" element={<ProtectedRoute role="PARENT"><ParentFees /></ProtectedRoute>} />
        <Route path="/parent/performance" element={<ProtectedRoute role="PARENT"><StudentPortal /></ProtectedRoute>} />

        {/* Universal Routes */}
        <Route path="/announcements" element={
          <Layout role={JSON.parse(localStorage.getItem('user') || '{}').role}>
            <Announcements />
          </Layout>
        } />

        <Route path="/" element={<Landing />} />
      </Routes>
    </Router>
  );
}

export default App;
