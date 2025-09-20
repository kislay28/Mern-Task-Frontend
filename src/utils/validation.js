export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  return password.length >= 6;
};

export const validateRequired = (value) => {
  return value && value.trim().length > 0;
};

export const validateMaxLength = (value, maxLength) => {
  return value.length <= maxLength;
};

export const validateFutureDate = (date) => {
  return new Date(date) > new Date();
};

export const getValidationError = (field, value, rules = {}) => {
  if (rules.required && !validateRequired(value)) {
    return `${field} is required`;
  }
  
  if (rules.email && !validateEmail(value)) {
    return 'Please enter a valid email address';
  }
  
  if (rules.password && !validatePassword(value)) {
    return 'Password must be at least 6 characters long';
  }
  
  if (rules.maxLength && !validateMaxLength(value, rules.maxLength)) {
    return `${field} must not exceed ${rules.maxLength} characters`;
  }
  
  if (rules.futureDate && !validateFutureDate(value)) {
    return 'Date must be in the future';
  }
  
  return null;
};
