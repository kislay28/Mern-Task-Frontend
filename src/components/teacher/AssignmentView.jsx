import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, User, FileText, Eye, Edit, Trash2, Users, CheckCircle } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AssignmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentAssignment, 
    fetchAssignment, 
    deleteAssignment, 
    updateAssignmentStatus,
    loading, 
    error 
  } = useAssignments();
  
  const [actionLoading, setActionLoading] = useState('');

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
    }
  }, [id]);

  const handleStatusUpdate = async (newStatus) => {
    try {
      setActionLoading('status');
      await updateAssignmentStatus(id, newStatus);
    } catch (error) {
      toast.error('Failed to update assignment status');
    } finally {
      setActionLoading('');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this assignment? This action cannot be undone.')) {
      try {
        setActionLoading('delete');
        const result = await deleteAssignment(id);
        if (result.success) {
          navigate('/teacher');
        }
      } catch (error) {
        toast.error('Failed to delete assignment');
      } finally {
        setActionLoading('');
      }
    }
  };

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <ErrorMessage message={error} />;
  }

  if (!currentAssignment) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 text-gray-400">
          📝
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">Assignment not found</h3>
        <p className="mt-1 text-sm text-gray-500">
          The assignment you're looking for doesn't exist or you don't have permission to view it.
        </p>
        <button
          onClick={() => navigate('/teacher')}
          className="mt-4 btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'published':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const isPastDue = new Date(currentAssignment.dueDate) < new Date();

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentAssignment.title}</h1>
          <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(currentAssignment.status)}`}>
              {currentAssignment.status.charAt(0).toUpperCase() + currentAssignment.status.slice(1)}
            </span>
            {isPastDue && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                <Clock className="h-4 w-4 mr-1" />
                Past Due
              </span>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center text-sm text-gray-600">
            <User className="h-4 w-4 mr-2" />
            <span>Created by {currentAssignment.createdBy?.name || 'Unknown'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {formatDate(currentAssignment.dueDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="h-4 w-4 mr-2" />
            <span>Created: {formatRelativeTime(currentAssignment.createdAt)}</span>
          </div>
        </div>

        <div className="prose max-w-none">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Description:</h3>
          <div className="text-gray-700 whitespace-pre-wrap bg-gray-50 p-4 rounded-lg">
            {currentAssignment.description}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Actions</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* View Submissions */}
          <button
            onClick={() => navigate(`/teacher/assignment/${id}/submissions`)}
            className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <Users className="h-5 w-5 mr-2" />
            View Submissions
          </button>

          {/* Edit Assignment */}
          <button
            onClick={() => navigate(`/teacher/assignment/${id}/edit`)}
            disabled={currentAssignment.status !== 'draft'}
            className={`flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg text-sm font-medium transition-colors ${
              currentAssignment.status !== 'draft' 
                ? 'text-gray-400 bg-gray-100 cursor-not-allowed' 
                : 'text-gray-700 bg-white hover:bg-gray-50'
            }`}
          >
            <Edit className="h-5 w-5 mr-2" />
            Edit Assignment
          </button>

          {/* Publish/Unpublish */}
          {currentAssignment.status === 'draft' && (
            <button
              onClick={() => handleStatusUpdate('published')}
              disabled={actionLoading === 'status'}
              className="flex items-center justify-center px-4 py-3 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-colors disabled:opacity-50"
            >
              {actionLoading === 'status' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Publishing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Publish
                </>
              )}
            </button>
          )}

          {currentAssignment.status === 'published' && (
            <button
              onClick={() => handleStatusUpdate('completed')}
              disabled={actionLoading === 'status'}
              className="flex items-center justify-center px-4 py-3 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {actionLoading === 'status' ? (
                <>
                  <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                  Completing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-5 w-5 mr-2" />
                  Mark Complete
                </>
              )}
            </button>
          )}

          {/* Delete Assignment */}
          <button
            onClick={handleDelete}
            disabled={actionLoading === 'delete'}
            className="flex items-center justify-center px-4 py-3 bg-red-600 text-white rounded-lg text-sm font-medium hover:bg-red-700 transition-colors disabled:opacity-50"
          >
            {actionLoading === 'delete' ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>
                Deleting...
              </>
            ) : (
              <>
                <Trash2 className="h-5 w-5 mr-2" />
                Delete
              </>
            )}
          </button>
        </div>
      </div>

      {/* Assignment Stats */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Assignment Statistics</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {currentAssignment.status === 'published' ? 'Active' : currentAssignment.status.charAt(0).toUpperCase() + currentAssignment.status.slice(1)}
            </div>
            <div className="text-sm text-blue-800">Current Status</div>
          </div>
          
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {Math.max(0, Math.ceil((new Date(currentAssignment.dueDate) - new Date()) / (1000 * 60 * 60 * 24)))}
            </div>
            <div className="text-sm text-green-800">Days Remaining</div>
          </div>
          
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {formatDate(currentAssignment.createdAt)}
            </div>
            <div className="text-sm text-purple-800">Date Created</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-start">
        <button
          onClick={() => navigate('/teacher')}
          className="btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AssignmentView;
