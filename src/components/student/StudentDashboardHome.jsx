import React from 'react';
import { BookOpen, Clock, CheckCircle } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { formatDate, isOverdue, isDueSoon } from '../../utils/helpers';
import { STATUS_LABELS } from '../../utils/constants';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const StudentDashboardHome = () => {
  const { assignments, loading, error, clearError } = useAssignments();

  const stats = {
    total: assignments.length,
    dueSoon: assignments.filter(a => isDueSoon(a.dueDate)).length,
    overdue: assignments.filter(a => isOverdue(a.dueDate)).length
  };

  if (loading) {
    return <Loader text="Loading assignments..." />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Student Dashboard</h1>
        <p className="text-gray-600">View and submit your assignments</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.total}</p>
              <p className="text-gray-600">Available Assignments</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <Clock className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.dueSoon}</p>
              <p className="text-gray-600">Due Soon</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <CheckCircle className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <p className="text-2xl font-semibold text-gray-900">{stats.overdue}</p>
              <p className="text-gray-600">Overdue</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments List */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Available Assignments</h2>
        </div>

        <div className="p-6">
          {error && (
            <div className="mb-4">
              <ErrorMessage message={error} onClose={clearError} />
            </div>
          )}

          {assignments.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments available</h3>
              <p className="mt-1 text-sm text-gray-500">
                Check back later for new assignments from your teachers.
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {assignments.map((assignment) => (
                <div
                  key={assignment._id}
                  className={`border rounded-lg p-6 hover:shadow-md transition-shadow duration-200 ${
                    isOverdue(assignment.dueDate) 
                      ? 'border-red-200 bg-red-50' 
                      : isDueSoon(assignment.dueDate)
                      ? 'border-yellow-200 bg-yellow-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-gray-600 line-clamp-2">
                        {assignment.description}
                      </p>
                      <div className="mt-4 flex items-center space-x-4 text-sm text-gray-500">
                        <span>Due: {formatDate(assignment.dueDate)}</span>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          {STATUS_LABELS[assignment.status]}
                        </span>
                        {isOverdue(assignment.dueDate) && (
                          <span className="text-red-600 font-medium">Overdue</span>
                        )}
                        {isDueSoon(assignment.dueDate) && !isOverdue(assignment.dueDate) && (
                          <span className="text-yellow-600 font-medium">Due Soon</span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4">
                      <button
                        onClick={() => window.location.href = `/student/assignment/${assignment._id}`}
                        className="btn-primary"
                        disabled={isOverdue(assignment.dueDate)}
                      >
                        {isOverdue(assignment.dueDate) ? 'Overdue' : 'View & Submit'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentDashboardHome;
