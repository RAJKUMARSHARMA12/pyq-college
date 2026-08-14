import React from 'react';
import {
  FileText,
  Eye,
  Download,
  Bookmark,
  BookmarkCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  Calendar,
  Sparkles,
  UserCheck,
} from 'lucide-react';

export default function PaperCard({
  paper,
  isBookmarked = false,
  onOpenReader,
  onToggleBookmark,
  onDownloadTrack,
  showStatus = false,
}) {
  const getExamTypeBadge = (type) => {
    switch (type) {
      case 'End-Sem':
        return 'tag-gold';
      case 'Mid-Sem':
        return 'tag-blue';
      case 'Quiz':
        return 'tag-amber';
      default:
        return 'tag-gold';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="tag-emerald px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Published
          </span>
        );
      case 'pending':
        return (
          <span className="tag-gold px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> In Review
          </span>
        );
      case 'rejected':
        return (
          <span className="tag-rose px-2.5 py-1 rounded text-xs font-semibold flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" /> Rejected
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="group relative rounded-2xl glass-card glass-card-interactive p-5 flex flex-col justify-between h-full border border-slate-800/80 transition-all duration-200">
      <div>
        {/* Top Header Row: Exam Type Tag, Year, and Bookmark Toggle */}
        <div className="flex items-center justify-between gap-2 mb-3.5">
          <div className="flex items-center flex-wrap gap-1.5">
            <span
              className={`text-[11px] font-mono-tag font-bold px-2.5 py-0.5 rounded-lg ${getExamTypeBadge(
                paper.examType
              )}`}
            >
              {paper.examType || 'Exam'} {paper.academicYear || '2024'}
            </span>

            <span className="text-[11px] font-mono-tag px-2.5 py-0.5 rounded-lg tag-blue font-semibold">
              {paper.course?.code || 'CRS'}
            </span>
          </div>

          <div className="flex items-center gap-1">
            {showStatus ? (
              getStatusBadge(paper.status)
            ) : (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleBookmark(paper._id);
                }}
                className={`p-1.5 rounded-xl border transition-all ${
                  isBookmarked
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-slate-900/80 border-slate-800 text-slate-400 hover:text-white'
                }`}
                title={isBookmarked ? 'Remove Bookmark' : 'Bookmark Paper'}
              >
                {isBookmarked ? (
                  <BookmarkCheck className="w-4 h-4 text-amber-400 fill-amber-400/20" />
                ) : (
                  <Bookmark className="w-4 h-4" />
                )}
              </button>
            )}
          </div>
        </div>

        {/* Paper Title */}
        <h3
          onClick={() => onOpenReader(paper)}
          className="font-heading text-base font-bold text-slate-100 group-hover:text-amber-400 cursor-pointer transition-colors line-clamp-2 mb-3 leading-snug"
        >
          {paper.title}
        </h3>

        {/* Course & Subject Metadata */}
        <div className="space-y-1.5 mb-4 text-xs font-medium">
          <div className="flex items-center gap-2 text-slate-300">
            <Building2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="truncate">{paper.course?.name || 'General Course'}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <FileText className="w-3.5 h-3.5 text-slate-500 shrink-0" />
            <span className="font-mono-tag font-semibold text-slate-300">{paper.subject?.code || 'SUB'}</span>
            <span className="text-slate-600">•</span>
            <span className="truncate">{paper.subject?.name || 'Subject'}</span>
          </div>
        </div>

        {/* Rejection Reason feedback display if rejected */}
        {paper.status === 'rejected' && paper.rejectionReason && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-xs text-rose-300">
            <p className="font-semibold mb-0.5 flex items-center gap-1">
              <AlertTriangle className="w-3.5 h-3.5" /> Rejection Feedback:
            </p>
            <p className="text-slate-300 italic">{paper.rejectionReason}</p>
          </div>
        )}
      </div>

      {/* Footer Row: Solution Tag & Action Buttons */}
      <div className="pt-3.5 border-t border-slate-800/80 flex items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          {paper.solutionsCount > 0 ? (
            <span className="tag-emerald px-2 py-0.5 rounded-md text-[10px] font-mono-tag font-semibold flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              {paper.solutionsCount} Solved
            </span>
          ) : (
            <span className="tag-slate px-2 py-0.5 rounded-md text-[10px] font-mono-tag font-medium">
              Unsolved
            </span>
          )}

          <span className="text-slate-400 text-[11px] flex items-center gap-1">
            <Download className="w-3 h-3 text-slate-500" />
            {paper.downloads || 0}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => onDownloadTrack(paper._id, paper.fileUrl)}
            className="p-2 rounded-xl bg-slate-800/90 hover:bg-slate-700 text-slate-300 border border-slate-700/60 transition"
            title="Download PDF"
          >
            <Download className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={() => onOpenReader(paper)}
            className="flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-sm transition active:scale-[0.98]"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Read Paper</span>
          </button>
        </div>
      </div>
    </div>
  );
}
