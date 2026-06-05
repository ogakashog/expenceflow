/**
 * Helper Utilities
 * 
 * Shared formatting, validation, and display helper functions.
 */

/**
 * Formats a number as USD currency string.
 * @param {number} amount - The amount to format.
 * @returns {string} Formatted currency string (e.g., "$1,234.56").
 */
export function formatCurrency(amount) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount);
}

/**
 * Formats an ISO date string into a human-readable format.
 * @param {string} dateStr - ISO date string.
 * @returns {string} Formatted date (e.g., "Jan 15, 2026").
 */
export function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

/**
 * Validates the expense form data and returns any errors.
 * @param {Object} data - Form data object.
 * @returns {Object} An object mapping field names to error messages (empty if valid).
 */
export function validateExpenseForm(data) {
  const errors = {};

  if (!data.date) {
    errors.date = 'Date is required';
  }

  if (!data.category) {
    errors.category = 'Category is required';
  }

  if (!data.amount && data.amount !== 0) {
    errors.amount = 'Amount is required';
  } else if (isNaN(Number(data.amount)) || Number(data.amount) <= 0) {
    errors.amount = 'Amount must be a positive number';
  }

  if (!data.description || data.description.trim() === '') {
    errors.description = 'Description is required';
  }

  return errors;
}

/**
 * Generates a truncated file name for display.
 * @param {string} name - Original file name.
 * @param {number} maxLength - Maximum display length.
 * @returns {string} Truncated file name.
 */
export function truncateFileName(name, maxLength = 25) {
  if (!name || name.length <= maxLength) return name;
  const ext = name.split('.').pop();
  const base = name.slice(0, maxLength - ext.length - 4);
  return `${base}...${ext}`;
}
