import React, { useState } from 'react';
import { Edit, Trash2, Eye, Users, MoreVertical } from 'lucide-react';
import { useAssignments } from '../../context/AssignmentContext';
import { ASSIGNMENT_STATUS, STATUS_LABELS } from '../../utils/constants';
import { formatDate, formatRelativeTime } from '../../utils/helpers';
import AssignmentForm from './AssignmentForm';

const AssignmentList = ({ statusFilter }) => {
  const { assignments, deleteAssignment, updateAssignmentStatus } = useAssignments();
  const [editingAssignment, setEditingAssignment] = useState(null);
  const [showDropdown, setShowDropdown] = useState(null);

  const filteredAssignments = statusFilter 
    ? assignments.filter(assignment => assignment.status === statusFilter)
    : assignments;

  const handleStatusChange = async (assignmentId, currentStatus) => {
    let newStatus;
    if (currentStatus === ASSIGNMENT_STATUS.DRAFT) {
      newStatus = ASSIGNMENT_STATUS.PUBLISHED;
    } else if (currentStatus === ASSIGNMENT_STATUS.PUBLISHED) {
      newStatus = ASSIGNMENT_STATUS.COMPLETED;
    }
    
    if (newStatus) {
      await updateAssignmentStatus(assignmentId, newStatus);
    }
  };

  const handleDelete = async (assignmentId) => {
    if (window.confirm('Are you sure you want to delete this assignment?')) {
      await deleteAssignment(assignmentId);
    }
  };

  if (filteredAssignments.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="mx-auto h-12 w-12 text-gray-400">
          📝
        </div>
        <h3 className="mt-2 text-sm font-medium text-gray-900">No assignments found</h3>
        <p className="mt-1 text-sm text-gray-500">
          {statusFilter 
            ? `No assignments with status "${STATUS_LABELS[statusFilter]}"`
            : 'Get started by creating a new assignment.'
          }
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="grid gap-6">
        {filteredAssignments.map((assignment) => (
          <div
            key={assignment._id}
            className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    {assignment.title}
                  </h3>
                  <span className={`status-badge status-${assignment.status}`}>
                    {STATUS_LABELS[assignment.status]}
                  </span>
                </div>
                
                <p className="mt-2 text-gray-600 line-clamp-2">
                  {assignment.description}
                </p>
                
                <div className="mt-4 flex items-center space-x-6 text-sm text-gray-500">
                  <span>Due: {formatDate(assignment.dueDate)}</span>
                  <span>Created: {formatRelativeTime(assignment.createdAt)}</span>
                  {assignment.submissionCount !== undefined && (
                    <span className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {assignment.submissionCount} submissions
                    </span>
                  )}
                </div>
              </div>
              
              <div className="ml-4 relative">
                <button
                  onClick={() => setShowDropdown(showDropdown === assignment._id ? null : assignment._id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical className="h-5 w-5" />
                </button>
                
                {showDropdown === assignment._id && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button
                        onClick={() => {
                          window.location.href = `/teacher/assignment/${assignment._id}`;
                          setShowDropdown(null);
                        }}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View Details
                      </button>
                      
                      {assignment.status === ASSIGNMENT_STATUS.DRAFT && (
                        <>
                          <button
                            onClick={() => {
                              setEditingAssignment(assignment);
                              setShowDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </button>
                          <button
                            onClick={() => {
                              handleDelete(assignment._id);
                              setShowDropdown(null);
                            }}
                            className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </button>
                        </>
                      )}
                      
                      {assignment.status !== ASSIGNMENT_STATUS.COMPLETED && (
                        <button
                          onClick={() => {
                            handleStatusChange(assignment._id, assignment.status);
                            setShowDropdown(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-blue-700 hover:bg-blue-50 w-full"
                        >
                          {assignment.status === ASSIGNMENT_STATUS.DRAFT ? 'Publish' : 'Mark as Completed'}
                        </button>
                      )}
                      
                      {assignment.status === ASSIGNMENT_STATUS.PUBLISHED && (
                        <button
                          onClick={() => {
                            window.location.href = `/teacher/assignment/${assignment._id}/submissions`;
                            setShowDropdown(null);
                          }}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                        >
                          <Users className="h-4 w-4 mr-2" />
                          View Submissions ({assignment.submissionCount || 0})
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {editingAssignment && (
        <AssignmentForm
          assignment={editingAssignment}
          onClose={() => setEditingAssignment(null)}
        />
      )}
    </>
  );
};

export default AssignmentList;
