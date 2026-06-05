/**
 * ExpenseForm Component
 * 
 * Full expense submission form with validation, receipt upload,
 * and Firebase integration.
 */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { addExpense } from '../services/expenseService';
import { uploadReceipt } from '../services/storageService';
import { validateExpenseForm, truncateFileName } from '../utils/helpers';
import { CATEGORIES } from '../utils/constants';
import toast from 'react-hot-toast';
import {
  Calendar,
  Tag,
  IndianRupee,
  FileText,
  Upload,
  X,
  Loader2,
  Send,
} from 'lucide-react';

export default function ExpenseForm() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    date: '',
    category: '',
    amount: '',
    description: '',
  });
  const [receiptFile, setReceiptFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  /**
   * Updates a single form field value.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on change
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Handles receipt file selection.
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('File size must be under 5MB');
        return;
      }
      setReceiptFile(file);
    }
  };

  /**
   * Removes the selected receipt file.
   */
  const clearFile = () => {
    setReceiptFile(null);
  };

  /**
   * Validates and submits the form to Firestore.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate
    const validationErrors = validateExpenseForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast.error('Please fix the errors below');
      return;
    }

    setSubmitting(true);

    try {
      let receiptUrl = null;
      let receiptName = null;

      // Upload receipt if provided
      if (receiptFile) {
        const result = await uploadReceipt(receiptFile, user.uid);
        receiptUrl = result.url;
        receiptName = receiptFile.name;
      }

      // Save expense to Firestore
      await addExpense(
        {
          ...formData,
          receiptUrl,
          receiptName,
        },
        user.uid
      );

      toast.success('Expense added successfully!');
      navigate('/expenses');
    } catch (err) {
      console.error('Error adding expense:', err);
      // Display specific Firebase error message for easier debugging
      const displayMsg = err.message ? `Failed to add expense: ${err.message}` : 'Failed to add expense. Please try again.';
      toast.error(displayMsg);
    } finally {
      setSubmitting(false);
    }
  };

  /**
   * Renders a form field with label, input, and optional error message.
   */
  const renderField = (name, label, icon, inputElement) => (
    <div>
      <label
        htmlFor={name}
        className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5"
      >
        {icon}
        {label}
      </label>
      {inputElement}
      {errors[name] && (
        <p className="mt-1.5 text-xs text-rose-500 flex items-center gap-1">
          <span className="w-1 h-1 rounded-full bg-rose-500" />
          {errors[name]}
        </p>
      )}
    </div>
  );

  const inputClasses = (fieldName) =>
    `glass-input ${
      errors[fieldName]
        ? 'border-rose-300 focus:ring-rose-500/20 focus:border-rose-400'
        : 'focus:ring-indigo-500/20 focus:border-indigo-400 bg-white/50'
    }`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Date field */}
        {renderField(
          'date',
          'Date',
          <Calendar className="w-4 h-4 text-slate-400" />,
          <input
            type="date"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className={inputClasses('date')}
          />
        )}

        {/* Category field */}
        {renderField(
          'category',
          'Category',
          <Tag className="w-4 h-4 text-slate-400" />,
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className={`${inputClasses('category')} cursor-pointer`}
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        )}

        {/* Amount field */}
        {renderField(
          'amount',
          'Amount (₹)',
          <IndianRupee className="w-4 h-4 text-slate-400" />,
          <input
            type="number"
            id="amount"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            placeholder="0.00"
            step="0.01"
            min="0"
            className={inputClasses('amount')}
          />
        )}
      </div>

      {/* Description field */}
      {renderField(
        'description',
        'Description',
        <FileText className="w-4 h-4 text-slate-400" />,
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          rows={3}
          placeholder="Enter expense description..."
          className={`${inputClasses('description')} resize-none`}
        />
      )}

      {/* Receipt upload */}
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-1.5">
          <Upload className="w-4 h-4 text-slate-400" />
          Receipt / Bill <span className="text-slate-400 font-normal">(optional in testing mode only  )</span>
        </label>

        {receiptFile ? (
          <div className="flex items-center gap-3 px-4 py-3 bg-indigo-50 border border-indigo-200 rounded-xl">
            <FileText className="w-5 h-5 text-indigo-500 shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-indigo-700 truncate">
                {truncateFileName(receiptFile.name)}
              </p>
              <p className="text-xs text-indigo-500">
                {(receiptFile.size / 1024).toFixed(1)} KB
              </p>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="p-1 text-indigo-400 hover:text-rose-500 hover:bg-white rounded-lg transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <label 
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`flex flex-col items-center justify-center px-4 py-6 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-300 group ${
              isDragging 
                ? 'border-indigo-400 bg-indigo-50/80 scale-[1.02]' 
                : 'border-slate-200 hover:border-indigo-300 hover:bg-white/50'
            }`}
          >
            <Upload className={`w-8 h-8 transition-colors ${isDragging ? 'text-indigo-500 animate-bounce' : 'text-slate-300 group-hover:text-indigo-400'}`} />
            <p className={`mt-2 text-sm ${isDragging ? 'text-indigo-600 font-medium' : 'text-slate-500 group-hover:text-indigo-500'}`}>
              {isDragging ? 'Drop receipt here!' : 'Click or drag receipt to upload'}
            </p>
            <p className="text-xs text-slate-400 mt-1">PNG, JPG, PDF up to 5MB</p>
            <input
              type="file"
              accept="image/*,.pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Submit button */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-500 to-violet-600 text-white text-sm font-semibold rounded-xl shadow-md shadow-indigo-200 hover:shadow-lg hover:shadow-indigo-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:-translate-y-0.5"
        >
          {submitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" />
              Add Expense
            </>
          )}
        </button>
      </div>
    </form>
  );
}
