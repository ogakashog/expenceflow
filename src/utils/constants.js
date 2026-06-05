/**
 * Application Constants
 * 
 * Central place for all shared constants used across the app.
 */

// Expense categories available in the form
export const CATEGORIES = [
  'Food & Dining',
  'Transportation',
  'Accommodation',
  'Office Supplies',
  'Software & Tools',
  'Travel',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Marketing',
  'Other',
];

// Workflow statuses for expenses
export const STATUSES = ['draft', 'submitted', 'approved', 'rejected'];

// Number of expenses displayed per page
export const PAGE_SIZE = 8;

// Status display configuration (labels and colors)
export const STATUS_CONFIG = {
  draft: {
    label: 'Draft',
    bgClass: 'bg-slate-100 text-slate-700',
    dotClass: 'bg-slate-400',
  },
  submitted: {
    label: 'Submitted',
    bgClass: 'bg-amber-100 text-amber-700',
    dotClass: 'bg-amber-400',
  },
  approved: {
    label: 'Approved',
    bgClass: 'bg-emerald-100 text-emerald-700',
    dotClass: 'bg-emerald-400',
  },
  rejected: {
    label: 'Rejected',
    bgClass: 'bg-rose-100 text-rose-700',
    dotClass: 'bg-rose-400',
  },
};
