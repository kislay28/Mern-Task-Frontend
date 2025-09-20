import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ArrowLeft } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import ErrorMessage from '../common/ErrorMessage';
import Loader from '../common/Loader';

const AssignmentForm = ({ assignment = null, onClose, isEdit = false }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { 
    currentAssignment, 
    fetchAssignment, 
    createAssignment, 
    updateAssignment, 
    loading, 
    error, 
    clearError 
  } = useAssignments();

  // For edit mode, fetch the assignment if we don't have it
  useEffect(() => {
    if (isEdit && id && !currentAssignment) {
      fetchAssignment(id);
    }
  }, [isEdit, id, currentAssignment]);

  const assignmentData = isEdit ? currentAssignment : assignment;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    defaultValues: assignmentData ? {
      title: assignmentData.title || '',
      description: assignmentData.description || '',
      dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate).toISOString().slice(0, 16) : ''
    } : {
      title: '',
      description: '',
      dueDate: ''
    }
  });

  // Reset form when assignment data changes
  useEffect(() => {
    if (assignmentData) {
      reset({
        title: assignmentData.title || '',
        description: assignmentData.description || '',
        dueDate: assignmentData.dueDate ? new Date(assignmentData.dueDate).toISOString().slice(0, 16) : ''
      });
    }
  }, [assignmentData, reset]);

  const onSubmit = async (data) => {
    // Format date for backend
    const formattedData = {
      ...data,
      dueDate: new Date(data.dueDate).toISOString()
    };

    const result = (isEdit || assignment) 
      ? await updateAssignment(id || assignment._id, formattedData)
      : await createAssignment(formattedData);
    
    if (result.success) {
      reset();
      if (isEdit) {
        navigate('/teacher');
      } else if (onClose) {
        onClose();
      }
    }
  };

  const handleCancel = () => {
    if (isEdit) {
      navigate(-1); // Go back to previous page
    } else if (onClose) {
      onClose();
    }
  };

  // Show loader for edit mode while fetching assignment
  if (isEdit && loading && !assignmentData) {
    return <Loader />;
  }

  // Show error if assignment not found in edit mode
  if (isEdit && !loading && !assignmentData) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate('/teacher')}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </button>
        </div>
        <ErrorMessage message="Assignment not found or you don't have permission to edit it." />
      </div>
    );
  }

  const FormContent = () => (
    <>
      {error && (
        <ErrorMessage message={error} onClose={clearError} />
      )}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700">
          Assignment Title
        </label>
        <input
          {...register('title', {
            required: 'Title is required',
            maxLength: {
              value: 100,
              message: 'Title must not exceed 100 characters'
            }
          })}
          type="text"
          className={`mt-1 input-field ${
            errors.title ? 'border-red-300 focus:ring-red-500' : ''
          }`}
          placeholder="Enter assignment title"
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700">
          Description
        </label>
        <textarea
          {...register('description', {
            required: 'Description is required',
            maxLength: {
              value: 1000,
              message: 'Description must not exceed 1000 characters'
            }
          })}
          rows={4}
          className={`mt-1 input-field ${
            errors.description ? 'border-red-300 focus:ring-red-500' : ''
          }`}
          placeholder="Enter assignment description"
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
        )}
      </div>

      <div>
        <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
          Due Date
        </label>
        <input
          {...register('dueDate', {
            required: 'Due date is required',
            validate: (value) => {
              const selectedDate = new Date(value);
              const now = new Date();
              return selectedDate > now || 'Due date must be in the future';
            }
          })}
          type="datetime-local"
          className={`mt-1 input-field ${
            errors.dueDate ? 'border-red-300 focus:ring-red-500' : ''
          }`}
        />
        {errors.dueDate && (
          <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
        )}
      </div>

      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={handleCancel}
          className="btn-secondary"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="btn-primary"
        >
          {loading ? (
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
          ) : (
            (isEdit || assignment) ? 'Update Assignment' : 'Create Assignment'
          )}
        </button>
      </div>
    </>
  );

  // Render as full page for edit mode
  if (isEdit) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Edit Assignment</h1>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <FormContent />
          </form>
        </div>
      </div>
    );
  }

  // Render as modal for create mode
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-2xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">
            {assignment ? 'Edit Assignment' : 'Create New Assignment'}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormContent />
        </form>
      </div>
    </div>
  );
};

export default AssignmentForm;
