import React, { useState } from 'react';
import { Plus, BookOpen, Users, CheckCircle } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { ASSIGNMENT_STATUS } from '../../utils/constants';
import AssignmentForm from './AssignmentForm';
import AssignmentList from './AssignmentList';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const TeacherDashboardHome = () => {
  const [showAssignmentForm, setShowAssignmentForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState('');
  const { assignments, loading, error, clearError } = useAssignments();

  const stats = {
    total: assignments.length,
    draft: assignments.filter(a => a.status === ASSIGNMENT_STATUS.DRAFT).length,
    published: assignments.filter(a => a.status === ASSIGNMENT_STATUS.PUBLISHED).length,
    completed: assignments.filter(a => a.status === ASSIGNMENT_STATUS.COMPLETED).length,
    totalSubmissions: assignments.reduce((sum, a) => sum + (a.submissionCount || 0), 0)
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
          <p className="text-gray-600">Manage your assignments and track student progress</p>
        </div>
        <button
          onClick={() => setShowAssignmentForm(true)}
          className="btn-primary inline-flex items-center"
        >
          <Plus className="h-5 w-5 mr-2" />
          Create Assignment
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-primary-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Total Assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.totalSubmissions}</p>
              <p className="text-gray-600">Total Submissions</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.published}</p>
              <p className="text-gray-600">Published</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.completed}</p>
              <p className="text-gray-600">Completed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setStatusFilter('')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === ''
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setStatusFilter(ASSIGNMENT_STATUS.DRAFT)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === ASSIGNMENT_STATUS.DRAFT
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Draft ({stats.draft})
            </button>
            <button
              onClick={() => setStatusFilter(ASSIGNMENT_STATUS.PUBLISHED)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === ASSIGNMENT_STATUS.PUBLISHED
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Published ({stats.published})
            </button>
            <button
              onClick={() => setStatusFilter(ASSIGNMENT_STATUS.COMPLETED)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                statusFilter === ASSIGNMENT_STATUS.COMPLETED
                  ? 'border-primary-500 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Completed ({stats.completed})
            </button>
          </nav>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          {loading ? (
            <Loader text="Loading assignments..." />
          ) : (
            <AssignmentList statusFilter={statusFilter} />
          )}
        </div>
      </div>

      {/* Assignment Form Modal */}
      {showAssignmentForm && (
        <AssignmentForm
          onClose={() => setShowAssignmentForm(false)}
        />
      )}
    </div>
  );
};

export default TeacherDashboardHome;
