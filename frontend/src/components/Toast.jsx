import React from 'react';
import { CheckCircle, XCircle, AlertCircle, X } from 'lucide-react';

export default function Toast({ toast, onClose }) {
  if (!toast) return null;

  return (
    <div className="fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl transition-all duration-300 backdrop-blur-xl border border-slate-700/50 bg-slate-900/90 text-white animate-slideIn">
      {toast.type === 'error' ? (
        <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
      ) : (
        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0" />
      )}
      <span className="text-xs font-semibold text-slate-100">{toast.message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-2 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
