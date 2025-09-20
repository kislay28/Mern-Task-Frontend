import React, { createContext, useContext, useReducer } from 'react';
import { assignmentService } from '../services/assignmentService';
import { submissionService } from '../services/submissionService';
import toast from 'react-hot-toast';

const AssignmentContext = createContext();

const initialState = {
  assignments: [],
  currentAssignment: null,
  submissions: [],
  loading: false,
  error: null
};

const assignmentReducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        loading: false
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null
      };
    case 'SET_ASSIGNMENTS':
      return {
        ...state,
        assignments: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_ASSIGNMENT':
      return {
        ...state,
        assignments: [action.payload, ...state.assignments],
        loading: false,
        error: null
      };
    case 'UPDATE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.map(assignment =>
          assignment._id === action.payload._id ? action.payload : assignment
        ),
        currentAssignment: state.currentAssignment?._id === action.payload._id 
          ? action.payload 
          : state.currentAssignment,
        loading: false,
        error: null
      };
    case 'DELETE_ASSIGNMENT':
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment._id !== action.payload),
        loading: false,
        error: null
      };
    case 'SET_CURRENT_ASSIGNMENT':
      return {
        ...state,
        currentAssignment: action.payload,
        loading: false,
        error: null
      };
    case 'SET_SUBMISSIONS':
      return {
        ...state,
        submissions: action.payload,
        loading: false,
        error: null
      };
    case 'ADD_SUBMISSION':
      return {
        ...state,
        submissions: [action.payload, ...state.submissions],
        loading: false,
        error: null
      };
    case 'UPDATE_SUBMISSION':
      return {
        ...state,
        submissions: state.submissions.map(submission =>
          submission._id === action.payload._id ? action.payload : submission
        ),
        loading: false,
        error: null
      };
    default:
      return state;
  }
};

export const AssignmentProvider = ({ children }) => {
  const [state, dispatch] = useReducer(assignmentReducer, initialState);

  const setLoading = (loading) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  const fetchAssignments = async (status = '') => {
    try {
      setLoading(true);
      const response = await assignmentService.getAssignments(status);
      if (response.success) {
        dispatch({ type: 'SET_ASSIGNMENTS', payload: response.assignments });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch assignments');
    }
  };

  const fetchAssignment = async (id) => {
    try {
      setLoading(true);
      const response = await assignmentService.getAssignment(id);
      if (response.success) {
        dispatch({ type: 'SET_CURRENT_ASSIGNMENT', payload: response.assignment });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch assignment');
    }
  };

  const createAssignment = async (assignmentData) => {
    try {
      setLoading(true);
      const response = await assignmentService.createAssignment(assignmentData);
      if (response.success) {
        dispatch({ type: 'ADD_ASSIGNMENT', payload: response.assignment });
        toast.success(response.message || 'Assignment created successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create assignment';
      setError(message);
      return { success: false, message };
    }
  };

  const updateAssignment = async (id, assignmentData) => {
    try {
      setLoading(true);
      const response = await assignmentService.updateAssignment(id, assignmentData);
      if (response.success) {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: response.assignment });
        toast.success(response.message || 'Assignment updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update assignment';
      setError(message);
      return { success: false, message };
    }
  };

  const deleteAssignment = async (id) => {
    try {
      setLoading(true);
      const response = await assignmentService.deleteAssignment(id);
      if (response.success) {
        dispatch({ type: 'DELETE_ASSIGNMENT', payload: id });
        toast.success(response.message || 'Assignment deleted successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete assignment';
      setError(message);
      return { success: false, message };
    }
  };

  const updateAssignmentStatus = async (id, status) => {
    try {
      setLoading(true);
      const response = await assignmentService.updateAssignmentStatus(id, status);
      if (response.success) {
        dispatch({ type: 'UPDATE_ASSIGNMENT', payload: response.assignment });
        toast.success(response.message || 'Assignment status updated successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update assignment status';
      setError(message);
      return { success: false, message };
    }
  };

  const fetchSubmissions = async (assignmentId) => {
    try {
      setLoading(true);
      const response = await submissionService.getSubmissionsByAssignment(assignmentId);
      if (response.success) {
        dispatch({ type: 'SET_SUBMISSIONS', payload: response.submissions });
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to fetch submissions');
    }
  };

  const createSubmission = async (submissionData) => {
    try {
      setLoading(true);
      const response = await submissionService.createSubmission(submissionData);
      if (response.success) {
        dispatch({ type: 'ADD_SUBMISSION', payload: response.submission });
        toast.success(response.message || 'Submission created successfully');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create submission';
      setError(message);
      return { success: false, message };
    }
  };

  const markSubmissionAsReviewed = async (id) => {
    try {
      setLoading(true);
      const response = await submissionService.markAsReviewed(id);
      if (response.success) {
        dispatch({ type: 'UPDATE_SUBMISSION', payload: response.submission });
        toast.success(response.message || 'Submission marked as reviewed');
        return { success: true };
      }
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to mark submission as reviewed';
      setError(message);
      return { success: false, message };
    }
  };

  const value = {
    ...state,
    fetchAssignments,
    fetchAssignment,
    createAssignment,
    updateAssignment,
    deleteAssignment,
    updateAssignmentStatus,
    fetchSubmissions,
    createSubmission,
    markSubmissionAsReviewed,
    clearError
  };

  return (
    <AssignmentContext.Provider value={value}>
      {children}
    </AssignmentContext.Provider>
  );
};

export const useAssignments = () => {
  const context = useContext(AssignmentContext);
  if (!context) {
    throw new Error('useAssignments must be used within an AssignmentProvider');
  }
  return context;
};
