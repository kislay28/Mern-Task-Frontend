export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
export const APP_NAME = import.meta.env.VITE_APP_NAME || 'Assignment Portal';

export const ROLES = {
  TEACHER: 'teacher',
  STUDENT: 'student'
};

export const ASSIGNMENT_STATUS = {
  DRAFT: 'draft',
  PUBLISHED: 'published',
  COMPLETED: 'completed'
};

export const STATUS_COLORS = {
  [ASSIGNMENT_STATUS.DRAFT]: 'status-draft',
  [ASSIGNMENT_STATUS.PUBLISHED]: 'status-published',
  [ASSIGNMENT_STATUS.COMPLETED]: 'status-completed'
};

export const STATUS_LABELS = {
  [ASSIGNMENT_STATUS.DRAFT]: 'Draft',
  [ASSIGNMENT_STATUS.PUBLISHED]: 'Published',
  [ASSIGNMENT_STATUS.COMPLETED]: 'Completed'
};
