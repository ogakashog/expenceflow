/**
 * DashboardPage
 * 
 * Shows summary statistics for the user's expenses:
 * total count, total amount, approved/rejected/submitted/draft breakdowns.
 */
import { useAuth } from '../hooks/useAuth';
import { useExpenses } from '../hooks/useExpenses';
import StatsCard from '../components/StatsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency } from '../utils/helpers';
import {
  Receipt,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Clock,
  FileEdit,
} from 'lucide-react';

export default function DashboardPage() {
  const { user } = useAuth();
  const { stats, loading, error } = useExpenses(user?.uid);

  if (loading) {
    return <LoadingSpinner message="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="text-center py-16">
        <p className="text-rose-500">{error}</p>
      </div>
    );
  }

  const cards = [
    {
      icon: Receipt,
      label: 'Total Expenses',
      value: stats.total,
      accent: 'indigo',
      subValue: `${formatCurrency(stats.totalAmount)} total value`,
    },
    {
      icon: IndianRupee,
      label: 'Approved Amount',
      value: formatCurrency(stats.approvedAmount),
      accent: 'emerald',
      subValue: `${stats.approved} expense${stats.approved !== 1 ? 's' : ''} approved`,
    },
    {
      icon: CheckCircle2,
      label: 'Approved',
      value: stats.approved,
      accent: 'emerald',
    },
    {
      icon: XCircle,
      label: 'Rejected',
      value: stats.rejected,
      accent: 'rose',
    },
    {
      icon: Clock,
      label: 'Submitted',
      value: stats.submitted,
      accent: 'amber',
    },
    {
      icon: FileEdit,
      label: 'Drafts',
      value: stats.draft,
      accent: 'slate',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">
          Overview of your expense activity
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {cards.map((card) => (
          <StatsCard key={card.label} {...card} />
        ))}
      </div>

      {/* Quick tips */}
      <div className="glass-panel rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-indigo-700 mb-3">
          💡 Quick Tips
        </h2>
        <ul className="space-y-2 text-sm text-indigo-600">
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
            Submit expenses as <strong>Draft</strong> first, then change to{' '}
            <strong>Submitted</strong> when ready for review.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
            Attach receipts for faster approval — supported formats: PNG, JPG, PDF.
          </li>
          <li className="flex items-start gap-2">
            <span className="w-1 h-1 rounded-full bg-indigo-400 mt-2 shrink-0" />
            Use the <strong>Expenses</strong> page to search, filter, and manage all your entries.
          </li>
        </ul>
      </div>
    </div>
  );
}
