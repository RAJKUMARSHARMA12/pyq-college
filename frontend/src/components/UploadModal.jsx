import React, { useState } from 'react';
import { X, UploadCloud, CheckCircle, Paperclip, Check, Loader2 } from 'lucide-react';

export function UploadPaperModal({
  isOpen,
  onClose,
  uploadForm,
  setUploadForm,
  onSubmit,
  isSubmitting = false,
  courses = [],
  subjects = [],
  years = [],
  examTypes = [],
}) {
  const [submissionMode, setSubmissionMode] = useState('file'); // 'file' | 'url'

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploadForm({
        ...uploadForm,
        file: file,
        fileName: file.name,
        fileUrl: '', // reset URL when local file selected
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-modal border border-[#2c2824] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2c2824] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-stone-100">Upload Question Paper</h3>
              <p className="text-xs text-stone-400">Upload local PDF file or paste a Google Drive link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl bg-[#25221e] text-stone-400 hover:text-stone-100 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-stone-300 font-semibold mb-1">Paper Title *</label>
            <input
              type="text"
              required
              value={uploadForm.title}
              onChange={(e) => setUploadForm({ ...uploadForm, title: e.target.value })}
              placeholder="e.g. Data Structures & Algorithms End-Sem 2024"
              className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Course *</label>
              <select
                value={uploadForm.course}
                onChange={(e) => setUploadForm({ ...uploadForm, course: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 focus:outline-none focus:border-amber-500/80"
              >
                <option value="">Select Course</option>
                {courses.map((c) => (
                  <option key={c._id || c.code} value={c._id}>
                    {c.code} - {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Subject *</label>
              <select
                value={uploadForm.subject}
                onChange={(e) => setUploadForm({ ...uploadForm, subject: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 focus:outline-none focus:border-amber-500/80"
              >
                <option value="">Select Subject</option>
                {subjects.map((s) => (
                  <option key={s._id || s.code} value={s._id}>
                    {s.code} - {s.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Academic Year</label>
              <select
                value={uploadForm.academicYear}
                onChange={(e) => setUploadForm({ ...uploadForm, academicYear: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 focus:outline-none focus:border-amber-500/80"
              >
                {years.filter((y) => y !== 'All').map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-stone-300 font-semibold mb-1">Exam Type</label>
              <select
                value={uploadForm.examType}
                onChange={(e) => setUploadForm({ ...uploadForm, examType: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 focus:outline-none focus:border-amber-500/80"
              >
                {examTypes.filter((t) => t !== 'All').map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Dual Submission Mode Tabs */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-stone-300 font-semibold">Question Paper Attachment *</label>
              <div className="flex p-0.5 bg-[#161412] rounded-lg border border-[#2c2824] text-[10px]">
                <button
                  type="button"
                  onClick={() => setSubmissionMode('file')}
                  className={`px-2.5 py-1 rounded transition ${
                    submissionMode === 'file'
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Local PDF Upload
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionMode('url')}
                  className={`px-2.5 py-1 rounded transition ${
                    submissionMode === 'url'
                      ? 'bg-amber-600 text-stone-950 font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Drive / Web URL
                </button>
              </div>
            </div>

            {submissionMode === 'file' ? (
              <div className="relative border-2 border-dashed border-[#2c2824] hover:border-amber-500/50 rounded-xl p-4 bg-[#161412] text-center transition">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                  <Paperclip className="w-5 h-5 text-amber-400" />
                  {uploadForm.fileName ? (
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[280px]">{uploadForm.fileName}</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-stone-200">
                        Click to select PDF document
                      </span>
                      <span className="text-[10px] text-stone-500">Supports PDF files up to 15MB</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={uploadForm.fileUrl}
                  onChange={(e) =>
                    setUploadForm({ ...uploadForm, fileUrl: e.target.value, file: null, fileName: '' })
                  }
                  placeholder="https://drive.google.com/... or web PDF link"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Optional Solution URL / PDF Link</label>
            <input
              type="text"
              value={uploadForm.solutionUrl}
              onChange={(e) => setUploadForm({ ...uploadForm, solutionUrl: e.target.value })}
              placeholder="https://... (Optional solution link)"
              className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#2c2824]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#25221e] text-stone-300 hover:text-stone-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-stone-950 font-bold shadow flex items-center gap-1.5 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading PDF...</span>
                </>
              ) : (
                <span>Submit for Admin Review</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function UploadSolutionModal({
  isOpen,
  onClose,
  solutionForm,
  setSolutionForm,
  onSubmit,
  isSubmitting = false,
}) {
  const [submissionMode, setSubmissionMode] = useState('file');

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSolutionForm({
        ...solutionForm,
        file: file,
        fileName: file.name,
        solutionUrl: '',
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-lg rounded-2xl glass-modal border border-[#2c2824] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2c2824] pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
              <CheckCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading text-lg font-bold text-stone-100">Submit Verified Solution</h3>
              <p className="text-xs text-stone-400">Upload PDF file or paste solution link</p>
            </div>
          </div>
          <button
            onClick={onClose}
            disabled={isSubmitting}
            className="p-1.5 rounded-xl bg-[#25221e] text-stone-400 hover:text-stone-100 transition disabled:opacity-50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-stone-300 font-semibold">Solution File / Document *</label>
              <div className="flex p-0.5 bg-[#161412] rounded-lg border border-[#2c2824] text-[10px]">
                <button
                  type="button"
                  onClick={() => setSubmissionMode('file')}
                  className={`px-2.5 py-1 rounded transition ${
                    submissionMode === 'file'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Local PDF Upload
                </button>
                <button
                  type="button"
                  onClick={() => setSubmissionMode('url')}
                  className={`px-2.5 py-1 rounded transition ${
                    submissionMode === 'url'
                      ? 'bg-emerald-600 text-white font-bold'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  Drive / Web URL
                </button>
              </div>
            </div>

            {submissionMode === 'file' ? (
              <div className="relative border-2 border-dashed border-[#2c2824] hover:border-emerald-500/50 rounded-xl p-4 bg-[#161412] text-center transition">
                <input
                  type="file"
                  accept=".pdf,image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="flex flex-col items-center justify-center gap-1 pointer-events-none">
                  <Paperclip className="w-5 h-5 text-emerald-400" />
                  {solutionForm.fileName ? (
                    <div className="flex items-center gap-1.5 text-emerald-400 font-bold">
                      <Check className="w-3.5 h-3.5" />
                      <span className="truncate max-w-[280px]">{solutionForm.fileName}</span>
                    </div>
                  ) : (
                    <>
                      <span className="font-semibold text-stone-200">
                        Click to select solution PDF file
                      </span>
                      <span className="text-[10px] text-stone-500">Supports PDF files up to 15MB</span>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="relative flex items-center">
                <input
                  type="text"
                  value={solutionForm.solutionUrl}
                  onChange={(e) =>
                    setSolutionForm({ ...solutionForm, solutionUrl: e.target.value, file: null, fileName: '' })
                  }
                  placeholder="https://drive.google.com/... or PDF link"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Explanation Notes & Hints</label>
            <textarea
              rows={3}
              value={solutionForm.explanationText}
              onChange={(e) => setSolutionForm({ ...solutionForm, explanationText: e.target.value })}
              placeholder="Add key notes, formulas used, or question step guidance..."
              className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
            />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-[#2c2824]">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-xl bg-[#25221e] text-stone-300 hover:text-stone-100 transition disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold shadow flex items-center gap-1.5 transition"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Uploading...</span>
                </>
              ) : (
                <span>Submit Solution</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
