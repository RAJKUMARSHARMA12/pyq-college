import React from 'react';
import {
  X,
  FileText,
  CheckCircle2,
  MessageSquare,
  ThumbsUp,
  ExternalLink,
  Plus,
  Send,
} from 'lucide-react';

export default function PaperReaderModal({
  paper,
  onClose,
  readerTab,
  setReaderTab,
  solutions = [],
  comments = [],
  commentInput,
  setCommentInput,
  onAddComment,
  onUpvoteSolution,
  onOpenUploadSolution,
  currentUser,
}) {
  if (!paper) return null;

  const getPdfIframeUrl = (url) => {
    if (!url) return '';
    if (url.includes('drive.google.com') && !url.includes('/preview')) {
      const fileIdMatch = url.match(/\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
      if (fileIdMatch && fileIdMatch[1]) {
        return `https://drive.google.com/file/d/${fileIdMatch[1]}/preview`;
      }
    }
    return url;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl h-[90vh] flex flex-col rounded-2xl glass-modal border border-[#2c2824] overflow-hidden shadow-2xl">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#2c2824] bg-[#161412]">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-mono-tag text-xs font-semibold px-2 py-0.5 rounded badge-gold">
                {paper.course?.code || 'CRS'} - {paper.subject?.code || 'SUB'}
              </span>
              <span className="text-xs text-stone-400 font-mono-tag">{paper.examType} ({paper.academicYear})</span>
            </div>
            <h3 className="font-heading text-lg sm:text-xl font-bold text-[#f5f5f4] line-clamp-1">
              {paper.title}
            </h3>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-[#25221e] text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection Bar */}
        <div className="flex items-center justify-between px-6 py-2.5 border-b border-[#2c2824] bg-[#1a1714] text-xs font-medium">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setReaderTab('preview')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                readerTab === 'preview'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#25221e]'
              }`}
            >
              <FileText className="w-4 h-4" />
              <span>Paper Preview</span>
            </button>

            <button
              onClick={() => setReaderTab('solutions')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                readerTab === 'solutions'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#25221e]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Solutions ({solutions.length})</span>
            </button>

            <button
              onClick={() => setReaderTab('discussion')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl transition ${
                readerTab === 'discussion'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200 hover:bg-[#25221e]'
              }`}
            >
              <MessageSquare className="w-4 h-4 text-amber-400" />
              <span>Discussion ({comments.length})</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={paper.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[#25221e] hover:bg-[#2c2824] text-stone-200 border border-[#38332e] transition font-semibold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Open Document File</span>
            </a>
          </div>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#121110]">
          {readerTab === 'preview' && (
            <div className="w-full h-full flex flex-col items-center justify-center min-h-[450px]">
              {paper.fileUrl && (paper.fileUrl.startsWith('/uploads/') || paper.fileUrl.startsWith('http://localhost')) ? (
                <iframe
                  src={paper.fileUrl}
                  title={paper.title}
                  className="w-full h-full min-h-[500px] rounded-xl border border-[#2c2824] bg-stone-900"
                />
              ) : paper.fileUrl ? (
                <iframe
                  src={getPdfIframeUrl(paper.fileUrl)}
                  title={paper.title}
                  className="w-full h-full min-h-[500px] rounded-xl border border-[#2c2824] bg-stone-900"
                />
              ) : (
                <div className="text-center p-8 rounded-2xl glass-card max-w-md border border-[#2c2824]">
                  <div className="w-14 h-14 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto mb-4 border border-amber-500/20">
                    <FileText className="w-7 h-7" />
                  </div>
                  <h4 className="font-heading text-lg font-bold text-stone-100 mb-2">
                    Document Ready for Viewing
                  </h4>
                  <p className="text-xs text-stone-400 mb-6 leading-relaxed">
                    Click below to open the question paper document in a secure full-screen window.
                  </p>
                  <a
                    href={paper.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Open Document
                  </a>
                </div>
              )}
            </div>
          )}

          {readerTab === 'solutions' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between bg-[#161412] p-4 rounded-xl border border-[#2c2824]">
                <div>
                  <h4 className="font-heading text-sm font-bold text-stone-100">
                    Verified Paper Solutions
                  </h4>
                  <p className="text-xs text-stone-400">
                    Peer-contributed answers and step-by-step paper solutions.
                  </p>
                </div>
                <button
                  onClick={onOpenUploadSolution}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow transition"
                >
                  <Plus className="w-4 h-4" />
                  Submit Solution
                </button>
              </div>

              {solutions.length === 0 ? (
                <div className="text-center py-12 glass-card rounded-xl border border-[#2c2824]">
                  <CheckCircle2 className="w-10 h-10 text-stone-600 mx-auto mb-3" />
                  <p className="text-sm font-semibold text-stone-300">No verified solutions uploaded yet</p>
                  <p className="text-xs text-stone-500 mt-1">Be the first student to upload a solution for this paper!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {solutions.map((sol) => (
                    <div
                      key={sol._id}
                      className="p-4 rounded-xl glass-card border border-[#2c2824] flex flex-col md:flex-row md:items-center justify-between gap-4"
                    >
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-stone-400">
                          <span className="font-semibold text-amber-400">
                            By {sol.submittedBy?.name || 'Contributor'}
                          </span>
                          <span>•</span>
                          <span className="badge-emerald px-2 py-0.5 rounded text-[10px] font-mono-tag font-semibold">
                            {sol.status || 'Verified'}
                          </span>
                        </div>
                        {sol.explanationText && (
                          <p className="text-xs text-stone-200 bg-[#161412] p-3 rounded-lg border border-[#2c2824]">
                            {sol.explanationText}
                          </p>
                        )}
                        <a
                          href={getPdfIframeUrl(sol.solutionUrl)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View Full PDF Solution
                        </a>
                      </div>

                      <div className="flex items-center gap-3 self-end md:self-center">
                        <button
                          onClick={() => onUpvoteSolution(sol._id)}
                          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-semibold transition"
                        >
                          <ThumbsUp className="w-3.5 h-3.5" />
                          <span>Upvote ({sol.upvotes || 0})</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {readerTab === 'discussion' && (
            <div className="space-y-6">
              {/* Comment Post Input Form */}
              <form onSubmit={onAddComment} className="flex gap-2">
                <input
                  type="text"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                  placeholder={
                    currentUser
                      ? "Ask a question about this paper or share hints..."
                      : "Log in to post comments..."
                  }
                  disabled={!currentUser}
                  className="flex-1 px-4 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
                <button
                  type="submit"
                  disabled={!currentUser || !commentInput.trim()}
                  className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold disabled:opacity-50 text-xs flex items-center gap-1.5 transition"
                >
                  <Send className="w-3.5 h-3.5" />
                  Post
                </button>
              </form>

              {/* Discussion List */}
              <div className="space-y-3">
                {comments.length === 0 ? (
                  <div className="text-center py-10 text-xs text-stone-500 italic">
                    No comments yet. Start the academic discussion!
                  </div>
                ) : (
                  comments.map((c) => (
                    <div
                      key={c._id}
                      className="p-4 rounded-xl glass-card border border-[#2c2824] space-y-1.5"
                    >
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-amber-600/20 text-amber-400 font-bold text-[10px] flex items-center justify-center border border-amber-500/30">
                            {c.user?.name ? c.user.name[0].toUpperCase() : 'U'}
                          </div>
                          <span className="font-semibold text-stone-200">
                            {c.user?.name || 'Student'}
                          </span>
                        </div>
                        <span className="text-[10px] text-stone-500 font-mono-tag">
                          {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Recent'}
                        </span>
                      </div>
                      <p className="text-xs text-stone-300 pl-8 leading-relaxed">
                        {c.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
