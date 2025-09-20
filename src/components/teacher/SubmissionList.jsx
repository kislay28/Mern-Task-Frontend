import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Eye, CheckCircle, Clock, User, Calendar, FileText, ArrowLeft } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const SubmissionList = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentAssignment, 
    submissions, 
    fetchAssignment, 
    fetchSubmissions, 
    markSubmissionAsReviewed,
    loading, 
    error 
  } = useAssignments();
  
  const [submissionLoading, setSubmissionLoading] = useState({});

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
      fetchSubmissions(id);
    }
  }, [id]);

  const handleMarkAsReviewed = async (submissionId) => {
    try {
      setSubmissionLoading(prev => ({ ...prev, [submissionId]: true }));
      await markSubmissionAsReviewed(submissionId);
    } catch (error) {
      toast.error('Failed to mark submission as reviewed');
    } finally {
      setSubmissionLoading(prev => ({ ...prev, [submissionId]: false }));
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate(`/teacher/assignment/${id}`)}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-5 w-5 mr-1" />
              Back to Assignment
            </button>
          </div>
        </div>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Submissions for "{currentAssignment.title}"
        </h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div className="flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            <span>Due: {formatDate(currentAssignment.dueDate)}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <FileText className="h-4 w-4 mr-2" />
            <span>Total Submissions: {submissions.length}</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <CheckCircle className="h-4 w-4 mr-2" />
            <span>Reviewed: {submissions.filter(s => s.reviewed).length}</span>
          </div>
        </div>
      </div>

      {/* Submissions List */}
      {submissions.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
            📋
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No submissions yet</h3>
          <p className="text-gray-500">
            Students haven't submitted their assignments yet. Check back later!
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Student Submissions</h2>
          </div>
          
          <div className="divide-y divide-gray-200">
            {submissions.map((submission) => (
              <div key={submission._id} className="p-6 hover:bg-gray-50">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center space-x-2">
                        <User className="h-5 w-5 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {submission.studentId?.name || 'Unknown Student'}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>Submitted {formatRelativeTime(submission.submittedAt)}</span>
                      </div>
                      
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        submission.reviewed 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {submission.reviewed ? (
                          <>
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Reviewed
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3 mr-1" />
                            Pending Review
                          </>
                        )}
                      </span>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <h4 className="font-medium text-gray-900 mb-2">Student Answer:</h4>
                      <div className="text-gray-700 whitespace-pre-wrap max-h-32 overflow-y-auto">
                        {submission.answer.length > 200 
                          ? `${submission.answer.substring(0, 200)}...` 
                          : submission.answer
                        }
                      </div>
                      {submission.answer.length > 200 && (
                        <p className="text-sm text-gray-500 mt-2">
                          Showing first 200 characters. Click "View Full Submission" to see complete answer.
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3 ml-6">
                    <button
                      onClick={() => {
                        // For now, show a detailed view in a modal or alert
                        alert(`Full submission from ${submission.studentId?.name}:\n\n${submission.answer}`);
                      }}
                      className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      View Full
                    </button>
                    
                    {!submission.reviewed && (
                      <button
                        onClick={() => handleMarkAsReviewed(submission._id)}
                        disabled={submissionLoading[submission._id]}
                        className="btn-primary flex items-center space-x-2"
                      >
                        {submissionLoading[submission._id] ? (
                          <>
                            <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                            <span>Marking...</span>
                          </>
                        ) : (
                          <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Mark as Reviewed</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Summary Stats */}
      {submissions.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Submission Summary</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{submissions.length}</div>
              <div className="text-sm text-blue-800">Total Submissions</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {submissions.filter(s => s.reviewed).length}
              </div>
              <div className="text-sm text-green-800">Reviewed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {submissions.filter(s => !s.reviewed).length}
              </div>
              <div className="text-sm text-yellow-800">Pending Review</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubmissionList;
