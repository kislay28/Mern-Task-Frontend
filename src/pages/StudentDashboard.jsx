import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import StudentDashboardHome from '../components/student/StudentDashboardHome';
import AssignmentView from '../components/student/AssignmentView';
import { useAssignments } from '../context/AssignmentContext';

const StudentDashboard = () => {
  const { fetchAssignments } = useAssignments();

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<StudentDashboardHome />} />
          <Route path="/assignment/:id" element={<AssignmentView />} />
        </Routes>
      </main>
    </div>
  );
};

export default StudentDashboard;
