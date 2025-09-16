const validator = require('validator');

/**
 * Validates user input data
 * @param {Object} data - The data to validate
 * @param {Array} fields - Fields to validate
 * @returns {Object} - Object with error and errorMessage properties
 */
function validateInput(data, fields) {
  const errors = {};

  fields.forEach(field => {
    const value = data[field.name];

    // Check required fields
    if (field.required && (!value || (typeof value === 'string' && value.trim() === ''))) {
      errors[field.name] = `${field.label || field.name} is required`;
      return;
    }

    if (value) {
      // Email validation
      if (field.type === 'email' && !validator.isEmail(value)) {
        errors[field.name] = 'Please enter a valid email address';
      }

      // Password validation
      if (field.type === 'password' && field.minLength && value.length < field.minLength) {
        errors[field.name] = `Password must be at least ${field.minLength} characters long`;
      }
    }
  });

  return {
    hasError: Object.keys(errors).length > 0,
    errors
  };
}

/**
 * Sanitizes user input to prevent XSS attacks
 * @param {Object} data - The data to sanitize
 * @returns {Object} - Sanitized data
 */
function sanitizeInput(data) {
  const sanitized = {};

  for (const key in data) {
    if (typeof data[key] === 'string') {
      sanitized[key] = validator.escape(data[key]);
    } else {
      sanitized[key] = data[key];
    }
  }

  return sanitized;
}

/**
 * Formats error messages for consistent API responses
 * @param {String|Object} error - Error message or object
 * @returns {Object} - Formatted error object
 */
function formatError(error) {
  if (typeof error === 'string') {
    return { message: error };
  }

  if (error instanceof Error) {
    return { 
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    };
  }

  return error;
}

module.exports = {
  validateInput,
  sanitizeInput,
  formatError
};
