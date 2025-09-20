import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Calendar, Clock, User, FileText, Send, CheckCircle } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { submissionService } from '../../services/submissionService';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import toast from 'react-hot-toast';
import Loader from '../common/Loader';
import ErrorMessage from '../common/ErrorMessage';

const AssignmentView = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentAssignment, fetchAssignment, loading, error } = useAssignments();
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [existingSubmission, setExistingSubmission] = useState(null);
  const [submissionCheckLoading, setSubmissionCheckLoading] = useState(true);

  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  useEffect(() => {
    if (id) {
      fetchAssignment(id);
      checkExistingSubmission();
    }
  }, [id]);

  const checkExistingSubmission = async () => {
    try {
      setSubmissionCheckLoading(true);
      const response = await submissionService.getMySubmissions();
      if (response.success) {
        const submission = response.submissions.find(sub => sub.assignmentId._id === id);
        setExistingSubmission(submission);
      }
    } catch (error) {
      console.error('Error checking submission:', error);
    } finally {
      setSubmissionCheckLoading(false);
    }
  };

  const onSubmit = async (data) => {
    try {
      setSubmissionLoading(true);
      const submissionData = {
        assignmentId: id,
        answer: data.answer
      };

      const response = await submissionService.createSubmission(submissionData);
      if (response.success) {
        toast.success('Assignment submitted successfully!');
        reset();
        checkExistingSubmission(); // Refresh submission status
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to submit assignment';
      toast.error(message);
    } finally {
      setSubmissionLoading(false);
    }
  };

  const isPastDue = currentAssignment && new Date(currentAssignment.dueDate) < new Date();
  const canSubmit = currentAssignment && !existingSubmission && !isPastDue;

  if (loading || submissionCheckLoading) {
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
          onClick={() => navigate('/student')}
          className="mt-4 btn-primary"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Assignment Header */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold text-gray-900">{currentAssignment.title}</h1>
          <div className="flex items-center space-x-4">
            {existingSubmission && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                <CheckCircle className="h-4 w-4 mr-1" />
                Submitted
              </span>
            )}
            {isPastDue && !existingSubmission && (
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
            <span>By {currentAssignment.createdBy?.name || 'Unknown'}</span>
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

      {/* Existing Submission */}
      {existingSubmission && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <h2 className="text-xl font-semibold text-gray-900">Your Submission</h2>
          </div>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-2">
              Submitted on: {formatDate(existingSubmission.submittedAt)}
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium text-gray-900 mb-2">Your Answer:</h4>
              <div className="text-gray-700 whitespace-pre-wrap">
                {existingSubmission.answer}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              existingSubmission.reviewed 
                ? 'bg-blue-100 text-blue-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {existingSubmission.reviewed ? 'Reviewed' : 'Pending Review'}
            </span>
          </div>
        </div>
      )}

      {/* Submission Form */}
      {canSubmit && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center space-x-2 mb-4">
            <FileText className="h-5 w-5 text-blue-600" />
            <h2 className="text-xl font-semibold text-gray-900">Submit Your Assignment</h2>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label htmlFor="answer" className="block text-sm font-medium text-gray-700 mb-2">
                Your Answer *
              </label>
              <textarea
                id="answer"
                rows={10}
                className="input-field"
                placeholder="Enter your assignment answer here..."
                {...register('answer', {
                  required: 'Answer is required',
                  minLength: {
                    value: 10,
                    message: 'Answer must be at least 10 characters long'
                  }
                })}
              />
              {errors.answer && (
                <p className="mt-1 text-sm text-red-600">{errors.answer.message}</p>
              )}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">
                Make sure to review your answer before submitting. You can only submit once.
              </p>
              <button
                type="submit"
                disabled={submissionLoading}
                className="btn-primary flex items-center space-x-2"
              >
                {submissionLoading ? (
                  <>
                    <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    <span>Submit Assignment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* No Submission Allowed Messages */}
      {!canSubmit && !existingSubmission && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-center space-x-2 mb-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            <h3 className="text-lg font-medium text-yellow-800">Submission Not Available</h3>
          </div>
          <p className="text-yellow-700">
            {isPastDue 
              ? "The due date for this assignment has passed. You can no longer submit your work."
              : "This assignment is not available for submission at this time."
            }
          </p>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-start">
        <button
          onClick={() => navigate('/student')}
          className="btn-secondary"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
};

export default AssignmentView;
