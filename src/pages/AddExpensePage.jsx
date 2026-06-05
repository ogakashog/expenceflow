/**
 * AddExpensePage
 * 
 * Wrapper page for the ExpenseForm component.
 * Provides a clean card layout for the form.
 */
import ExpenseForm from '../components/ExpenseForm';
import { PlusCircle } from 'lucide-react';

export default function AddExpensePage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-xl shadow-md shadow-indigo-200">
          <PlusCircle className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Add Expense</h1>
          <p className="text-sm text-slate-500 mt-0.5">
            Fill in the details below to create a new expense entry
          </p>
        </div>
      </div>

      {/* Form card */}
      <div className="glass-panel rounded-2xl p-6 sm:p-8">
        <ExpenseForm />
      </div>
    </div>
  );
}
