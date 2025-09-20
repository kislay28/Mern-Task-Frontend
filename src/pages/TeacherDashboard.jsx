import React, { useEffect, useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from '../components/common/Header';
import TeacherDashboardHome from '../components/teacher/TeacherDashboardHome';
import AssignmentView from '../components/teacher/AssignmentView';
import AssignmentForm from '../components/teacher/AssignmentForm';
import SubmissionList from '../components/teacher/SubmissionList';
import { useAssignments } from '../context/AssignmentContext';

const TeacherDashboard = () => {
  const { fetchAssignments } = useAssignments();

  useEffect(() => {
    fetchAssignments();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<TeacherDashboardHome />} />
          <Route path="/assignment/:id" element={<AssignmentView />} />
          <Route path="/assignment/:id/edit" element={<AssignmentForm isEdit={true} />} />
          <Route path="/assignment/:id/submissions" element={<SubmissionList />} />
        </Routes>
      </main>
    </div>
  );
};

export default TeacherDashboard;
