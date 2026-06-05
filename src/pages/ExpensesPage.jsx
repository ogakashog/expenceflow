/**
 * ExpensesPage
 * 
 * Full expense list view with search, filter, sort, pagination,
 * and inline status management.
 */
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import ExpenseFilters from '../components/ExpenseFilters';
import ExpenseTable from '../components/ExpenseTable';
import Pagination from '../components/Pagination';
import LoadingSpinner from '../components/LoadingSpinner';
import { Download } from 'lucide-react';

export default function ExpensesPage() {
  const { user } = useAuth();
  const {
    expenses,
    filteredExpenses,
    loading,
    error,
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    sortOrder,
    setSortOrder,
    currentPage,
    setCurrentPage,
    totalPages,
    refetch,
  } = useExpenses(user?.uid);

  if (loading) {
    return <LoadingSpinner message="Loading expenses..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-rose-500">{error}</p>
        <button
          onClick={refetch}
          className="mt-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-xl transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  const handleExportCSV = () => {
    const headers = ['Date', 'Category', 'Amount', 'Status', 'Description'];
    const rows = filteredExpenses.map(exp => [
      exp.date,
      `"${exp.category}"`,
      exp.amount,
      exp.status,
      `"${exp.description?.replace(/"/g, '""') || ''}"`
    ]);
    
    const csvContent = [
      headers.join(','),
      ...rows.map(e => e.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expenses_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Expenses</h1>
          <p className="text-sm text-slate-500 mt-1">
            {filteredExpenses.length} expense{filteredExpenses.length !== 1 ? 's' : ''} found
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          disabled={filteredExpenses.length === 0}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white/60 backdrop-blur border border-indigo-100 text-indigo-600 rounded-xl text-sm font-semibold hover:bg-white transition-colors disabled:opacity-50"
        >
          <Download className="w-4 h-4" />
          Export to CSV
        </button>
      </div>

      {/* Filters */}
      <ExpenseFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        sortOrder={sortOrder}
        onSortChange={setSortOrder}
      />

      {/* Table */}
      <div className="glass-panel rounded-2xl">
        <ExpenseTable expenses={expenses} onRefresh={refetch} />
      </div>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
