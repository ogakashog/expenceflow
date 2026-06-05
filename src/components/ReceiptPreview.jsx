/**
 * ReceiptPreview Component
 * 
 * Modal overlay that displays a receipt image in a lightbox.
 * Closes on backdrop click, close button, or Escape key.
 */
import { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function ReceiptPreview({ url, onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!url) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in"
      onClick={onClose}
    >
      <div
        className="relative max-w-3xl max-h-[85vh] mx-4 bg-white rounded-2xl shadow-2xl overflow-hidden animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
          <h3 className="text-sm font-semibold text-slate-700">Receipt Preview</h3>
          <div className="flex items-center gap-2">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 text-slate-400 hover:text-indigo-500 rounded-lg hover:bg-indigo-50 transition-colors"
              title="Open in new tab"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Image */}
        <div className="p-4 flex items-center justify-center bg-slate-100">
          <img
            src={url}
            alt="Receipt"
            className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-sm"
          />
        </div>
      </div>
    </div>
  );
}
