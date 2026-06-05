/**
 * StatsCard Component
 * 
 * Reusable dashboard summary card with icon, label, and value.
 * Features a gradient accent bar and hover animation.
 */
export default function StatsCard({ icon: Icon, label, value, accent = 'indigo', subValue }) {
  // Map accent name to Tailwind color classes
  const accentMap = {
    indigo: {
      gradient: 'from-indigo-500 to-indigo-600',
      iconBg: 'bg-indigo-50',
      iconText: 'text-indigo-500',
    },
    emerald: {
      gradient: 'from-emerald-500 to-emerald-600',
      iconBg: 'bg-emerald-50',
      iconText: 'text-emerald-500',
    },
    rose: {
      gradient: 'from-rose-500 to-rose-600',
      iconBg: 'bg-rose-50',
      iconText: 'text-rose-500',
    },
    amber: {
      gradient: 'from-amber-500 to-amber-600',
      iconBg: 'bg-amber-50',
      iconText: 'text-amber-500',
    },
    slate: {
      gradient: 'from-slate-500 to-slate-600',
      iconBg: 'bg-slate-50',
      iconText: 'text-slate-500',
    },
    violet: {
      gradient: 'from-violet-500 to-violet-600',
      iconBg: 'bg-violet-50',
      iconText: 'text-violet-500',
    },
  };

  const colors = accentMap[accent] || accentMap.indigo;

  return (
    <div className="group relative glass-panel rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-1">
      {/* Top gradient accent bar */}
      <div className={`h-1 bg-gradient-to-r ${colors.gradient}`} />

      <div className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-1.5 text-2xl font-bold text-slate-800">{value}</p>
            {subValue && (
              <p className="mt-1 text-xs text-slate-400">{subValue}</p>
            )}
          </div>
          <div className={`p-2.5 rounded-xl ${colors.iconBg} transition-transform duration-300 group-hover:scale-110`}>
            <Icon className={`w-5 h-5 ${colors.iconText}`} />
          </div>
        </div>
      </div>
    </div>
  );
}
