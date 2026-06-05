/**
 * StatusBadge Component
 * 
 * Renders a colored badge indicating the expense status.
 * Uses the STATUS_CONFIG for consistent styling.
 */
import { STATUS_CONFIG } from '../utils/constants';

export default function StatusBadge({ status }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG.draft;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${config.bgClass}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dotClass}`} />
      {config.label}
    </span>
  );
}
