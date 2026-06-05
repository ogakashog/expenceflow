/**
 * ExpenseFilters Component
 * 
 * Search bar, status filter dropdown, and sort toggle for the expense list.
 */
import { Search, SlidersHorizontal, ArrowUpDown } from 'lucide-react';
import { STATUSES, STATUS_CONFIG } from '../utils/constants';

export default function ExpenseFilters({
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  sortOrder,
  onSortChange,
}) {
  return (
    <div className="flex flex-col sm:flex-row gap-3">
      {/* Search input */}
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search by category or description..."
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all"
        />
      </div>

      {/* Status filter */}
      <div className="relative">
        <SlidersHorizontal className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="appearance-none pl-10 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-400 transition-all cursor-pointer"
        >
          <option value="all">All Statuses</option>
          {STATUSES.map((status) => (
            <option key={status} value={status}>
              {STATUS_CONFIG[status].label}
            </option>
          ))}
        </select>
      </div>

      {/* Sort toggle */}
      <button
        onClick={() => onSortChange(sortOrder === 'desc' ? 'asc' : 'desc')}
        className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
        title={`Sort by date: ${sortOrder === 'desc' ? 'Newest first' : 'Oldest first'}`}
      >
        <ArrowUpDown className="w-4 h-4" />
        <span className="hidden sm:inline">
          {sortOrder === 'desc' ? 'Newest' : 'Oldest'}
        </span>
      </button>
    </div>
  );
}
