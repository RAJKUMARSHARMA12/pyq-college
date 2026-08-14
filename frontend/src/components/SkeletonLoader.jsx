import React from 'react';

export default function SkeletonLoader({ count = 6 }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-2xl glass-card p-5 border border-slate-800 space-y-4 animate-pulse"
        >
          <div className="flex justify-between items-center">
            <div className="h-5 w-20 bg-slate-800 rounded-md animate-shimmer" />
            <div className="h-5 w-14 bg-slate-800 rounded-md animate-shimmer" />
          </div>

          <div className="space-y-2">
            <div className="h-6 w-4/5 bg-slate-800 rounded-lg animate-shimmer" />
            <div className="h-4 w-3/5 bg-slate-800/60 rounded-md animate-shimmer" />
          </div>

          <div className="pt-4 border-t border-slate-800/80 flex justify-between items-center">
            <div className="h-4 w-24 bg-slate-800/60 rounded-md animate-shimmer" />
            <div className="h-8 w-24 bg-slate-800 rounded-xl animate-shimmer" />
          </div>
        </div>
      ))}
    </div>
  );
}
