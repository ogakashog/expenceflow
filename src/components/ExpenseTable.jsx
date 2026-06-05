/**
 * ExpenseTable Component
 * 
 * Displays expenses in a responsive table (desktop) / card list (mobile).
 * Supports status updates, deletion, and receipt preview.
 */
import { useState } from 'react';
import StatusBadge from './StatusBadge';
import ReceiptPreview from './ReceiptPreview';
import { formatCurrency, formatDate } from '../utils/helpers';
import { updateExpenseStatus, deleteExpense } from '../services/expenseService';
import { STATUSES, STATUS_CONFIG } from '../utils/constants';
import toast from 'react-hot-toast';
import {
  MoreVertical,
  Trash2,
  Eye,
  ArrowRight,
  FileImage,
  Inbox,
} from 'lucide-react';

export default function ExpenseTable({ expenses, onRefresh }) {
  const [previewUrl, setPreviewUrl] = useState(null);
  const [actionMenuId, setActionMenuId] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);

  /**
   * Changes the status of an expense and refreshes the list.
   */
  const handleStatusChange = async (expenseId, newStatus) => {
    setUpdatingId(expenseId);
    try {
      await updateExpenseStatus(expenseId, newStatus);
      toast.success(`Status updated to ${STATUS_CONFIG[newStatus].label}`);
      onRefresh();
    } catch (err) {
      console.error('Error updating status:', err);
      toast.error('Failed to update status');
    } finally {
      setUpdatingId(null);
      setActionMenuId(null);
    }
  };

  /**
   * Deletes an expense after confirmation.
   */
  const handleDelete = async (expenseId) => {
    if (!window.confirm('Are you sure you want to delete this expense?')) return;

    try {
      await deleteExpense(expenseId);
      toast.success('Expense deleted');
      onRefresh();
    } catch (err) {
      console.error('Error deleting expense:', err);
      toast.error('Failed to delete expense');
    }
    setActionMenuId(null);
  };

  /**
   * Returns the list of statuses an expense can transition to.
   */
  const getNextStatuses = (currentStatus) => {
    return STATUSES.filter((s) => s !== currentStatus);
  };

  if (expenses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="p-4 bg-slate-100 rounded-2xl mb-4">
          <Inbox className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-600">No expenses found</h3>
        <p className="text-sm text-slate-400 mt-1">
          Add your first expense or adjust your filters.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Desktop table */}
      <div className="hidden md:block">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Date
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Category
              </th>
              <th className="text-left py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Description
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Receipt
              </th>
              <th className="text-center py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Status
              </th>
              <th className="text-right py-3 px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {expenses.map((expense) => (
              <tr
                key={expense.id}
                className="group hover:bg-slate-50/80 transition-colors"
              >
                <td className="py-3.5 px-4 text-sm text-slate-700">
                  {formatDate(expense.date)}
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center px-2.5 py-1 bg-slate-100 rounded-lg text-xs font-medium text-slate-600">
                    {expense.category}
                  </span>
                </td>
                <td className="py-3.5 px-4 text-sm text-slate-600 max-w-[200px] truncate">
                  {expense.description}
                </td>
                <td className="py-3.5 px-4 text-sm font-semibold text-slate-800 text-right">
                  {formatCurrency(expense.amount)}
                </td>
                <td className="py-3.5 px-4 text-center">
                  {expense.receiptUrl ? (
                    <button
                      onClick={() => setPreviewUrl(expense.receiptUrl)}
                      className="inline-flex items-center gap-1 px-2 py-1 text-xs text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      View
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400">—</span>
                  )}
                </td>
                <td className="py-3.5 px-4 text-center">
                  <StatusBadge status={expense.status} />
                </td>
                <td className="py-3.5 px-4 text-right">
                  <div className="relative inline-block">
                    <button
                      onClick={() =>
                        setActionMenuId(
                          actionMenuId === expense.id ? null : expense.id
                        )
                      }
                      disabled={updatingId === expense.id}
                      className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
                    >
                      <MoreVertical className="w-4 h-4" />
                    </button>

                    {/* Action dropdown */}
                    {actionMenuId === expense.id && (
                      <div className="absolute right-0 top-full mt-1 w-44 glass-panel rounded-xl z-20 py-1 animate-fade-in">
                        <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase">
                          Change Status
                        </p>
                        {getNextStatuses(expense.status).map((status) => (
                          <button
                            key={status}
                            onClick={() =>
                              handleStatusChange(expense.id, status)
                            }
                            className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                          >
                            <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                            {STATUS_CONFIG[status].label}
                          </button>
                        ))}
                        <div className="border-t border-slate-100 my-1" />
                        <button
                          onClick={() => handleDelete(expense.id)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="md:hidden space-y-3">
        {expenses.map((expense) => (
          <div
            key={expense.id}
            className="glass-panel rounded-2xl p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="text-sm font-semibold text-slate-800">
                  {expense.category}
                </p>
                <p className="text-xs text-slate-500 mt-0.5">
                  {formatDate(expense.date)}
                </p>
              </div>
              <StatusBadge status={expense.status} />
            </div>

            <p className="text-sm text-slate-600 mb-3 line-clamp-2">
              {expense.description}
            </p>

            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <span className="text-lg font-bold text-slate-800">
                {formatCurrency(expense.amount)}
              </span>

              <div className="flex items-center gap-2">
                {expense.receiptUrl && (
                  <button
                    onClick={() => setPreviewUrl(expense.receiptUrl)}
                    className="p-2 text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors"
                  >
                    <FileImage className="w-4 h-4" />
                  </button>
                )}

                <div className="relative">
                  <button
                    onClick={() =>
                      setActionMenuId(
                        actionMenuId === expense.id ? null : expense.id
                      )
                    }
                    className="p-2 text-slate-400 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {actionMenuId === expense.id && (
                    <div className="absolute right-0 bottom-full mb-1 w-44 glass-panel rounded-xl z-20 py-1 animate-fade-in">
                      <p className="px-3 py-1.5 text-xs font-semibold text-slate-400 uppercase">
                        Change Status
                      </p>
                      {getNextStatuses(expense.status).map((status) => (
                        <button
                          key={status}
                          onClick={() =>
                            handleStatusChange(expense.id, status)
                          }
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
                        >
                          <ArrowRight className="w-3.5 h-3.5 text-slate-400" />
                          {STATUS_CONFIG[status].label}
                        </button>
                      ))}
                      <div className="border-t border-slate-100 my-1" />
                      <button
                        onClick={() => handleDelete(expense.id)}
                        className="flex items-center gap-2 w-full px-3 py-2 text-sm text-rose-600 hover:bg-rose-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Receipt preview modal */}
      {previewUrl && (
        <ReceiptPreview url={previewUrl} onClose={() => setPreviewUrl(null)} />
      )}
    </>
  );
}
