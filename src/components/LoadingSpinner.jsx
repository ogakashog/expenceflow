/**
 * LoadingSpinner Component
 * 
 * Animated loading indicator with optional message text.
 */
export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="relative">
        {/* Outer ring */}
        <div className="w-12 h-12 rounded-full border-4 border-indigo-100 animate-spin border-t-indigo-500" />
        {/* Inner glow */}
        <div className="absolute inset-0 w-12 h-12 rounded-full border-4 border-transparent animate-ping opacity-20 border-t-indigo-400" />
      </div>
      <p className="mt-4 text-sm text-slate-500 animate-pulse">{message}</p>
    </div>
  );
}
