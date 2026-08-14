import React from 'react';
import {
  ShieldCheck,
  FileCheck,
  CheckCircle,
  XCircle,
  Building2,
  BookOpen,
  TrendingUp,
  Clock,
  Layers,
  ExternalLink,
  Users,
  UserCheck,
  UserX,
  Trash2,
  Mail,
  Calendar,
} from 'lucide-react';

export default function AdminDashboard({
  adminSubTab,
  setAdminSubTab,
  pendingPyqs = [],
  pendingSolutions = [],
  adminStats,
  courses = [],
  subjects = [],
  users = [],
  onApprovePaper,
  rejectingPaperId,
  setRejectingPaperId,
  rejectionReasonInput,
  setRejectionReasonInput,
  onRejectPaperSubmit,
  onApproveSolution,
  newCourseForm,
  setNewCourseForm,
  onCreateCourse,
  newSubjectForm,
  setNewSubjectForm,
  onCreateSubject,
  onToggleUserRole,
  onDeleteUser,
  currentUser,
}) {
  return (
    <div className="space-y-8">
      {/* Top Banner & Stats */}
      <div className="rounded-2xl glass-card border border-[#2c2824] p-6 md:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-5 h-5 text-amber-400" />
              <span className="font-heading text-xl font-bold text-[#f5f5f4]">
                Admin Control Center & Moderation Panel
              </span>
            </div>
            <p className="text-xs text-stone-400">
              Review student submissions, manage user roles, catalog courses, and publish verified solutions.
            </p>
          </div>

          {/* Sub-tab Navigation */}
          <div className="flex items-center flex-wrap p-1 bg-[#161412] rounded-xl border border-[#2c2824] text-xs font-semibold gap-1">
            <button
              onClick={() => setAdminSubTab('pyq-queue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                adminSubTab === 'pyq-queue'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <FileCheck className="w-4 h-4" />
              <span>Pending Papers ({pendingPyqs.length})</span>
            </button>

            <button
              onClick={() => setAdminSubTab('solution-queue')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                adminSubTab === 'solution-queue'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <CheckCircle className="w-4 h-4" />
              <span>Solutions ({pendingSolutions.length})</span>
            </button>

            <button
              onClick={() => setAdminSubTab('users')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                adminSubTab === 'users'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>User Accounts ({users.length})</span>
            </button>

            <button
              onClick={() => setAdminSubTab('manage-catalog')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg transition ${
                adminSubTab === 'manage-catalog'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Layers className="w-4 h-4" />
              <span>Catalog Management</span>
            </button>
          </div>
        </div>

        {/* Live Admin Metric Cards */}
        {adminStats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#161412] border border-[#2c2824]">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">Published Papers</span>
                <BookOpen className="w-4 h-4 text-amber-400" />
              </div>
              <p className="font-heading text-2xl font-bold text-[#f5f5f4]">
                {adminStats.totalApprovedPYQs || 0}
              </p>
              <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1 font-medium">
                <TrendingUp className="w-3 h-3" /> Live & Searchable
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#161412] border border-[#2c2824]">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">Pending Moderation</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="font-heading text-2xl font-bold text-amber-400">
                {(pendingPyqs.length || 0) + (pendingSolutions.length || 0)}
              </p>
              <span className="text-[10px] text-amber-400/80 mt-1 block font-medium">
                Requires Review
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#161412] border border-[#2c2824]">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">Registered Users</span>
                <Users className="w-4 h-4 text-amber-400" />
              </div>
              <p className="font-heading text-2xl font-bold text-[#f5f5f4]">
                {users.length}
              </p>
              <span className="text-[10px] text-stone-400 mt-1 block font-medium">
                Students & Admins
              </span>
            </div>

            <div className="p-4 rounded-xl bg-[#161412] border border-[#2c2824]">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">Active Courses</span>
                <Building2 className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="font-heading text-2xl font-bold text-[#f5f5f4]">
                {courses.length}
              </p>
              <span className="text-[10px] text-stone-400 mt-1 block font-medium">
                Academic Programs
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Sub-tab 1: Pending PYQs Queue */}
      {adminSubTab === 'pyq-queue' && (
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-[#f5f5f4] flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            Pending Paper Approvals ({pendingPyqs.length})
          </h3>

          {pendingPyqs.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-card border border-[#2c2824]">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-300">All submissions reviewed!</p>
              <p className="text-xs text-stone-500 mt-1">There are no pending question papers in the queue.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingPyqs.map((paper) => (
                <div
                  key={paper._id}
                  className="p-5 rounded-xl glass-card border border-[#2c2824] space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <span className="font-mono-tag font-semibold badge-amber px-2.5 py-0.5 rounded">
                        {paper.examType} ({paper.academicYear})
                      </span>
                      <span className="text-stone-400">
                        Uploaded by: <strong className="text-stone-200">{paper.uploadedBy?.name || 'Student'}</strong>
                      </span>
                    </div>

                    <h4 className="font-heading text-base font-bold text-[#f5f5f4]">
                      {paper.title}
                    </h4>

                    <div className="text-xs text-stone-400 flex items-center gap-2">
                      <span>Course ID: {paper.course?.code || paper.course}</span>
                      <span>•</span>
                      <span>Subject ID: {paper.subject?.code || paper.subject}</span>
                    </div>

                    <a
                      href={paper.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold pt-1"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Inspect PDF File
                    </a>
                  </div>

                  {/* Rejection Form Modal Overlay if currently rejecting */}
                  {rejectingPaperId === paper._id ? (
                    <form onSubmit={onRejectPaperSubmit} className="space-y-3 pt-3 border-t border-[#2c2824]">
                      <label className="block text-xs font-semibold text-rose-300">
                        Provide Rejection Feedback Reason *
                      </label>
                      <input
                        type="text"
                        required
                        value={rejectionReasonInput}
                        onChange={(e) => setRejectionReasonInput(e.target.value)}
                        placeholder="e.g. Blurry scan, incorrect subject tags, duplicate paper"
                        className="w-full px-3 py-2 bg-[#161412] border border-[#2c2824] rounded-xl text-xs text-stone-100 placeholder-stone-500 focus:outline-none focus:border-rose-500"
                      />
                      <div className="flex justify-end gap-2 text-xs">
                        <button
                          type="button"
                          onClick={() => setRejectingPaperId(null)}
                          className="px-3 py-1.5 rounded-lg bg-[#25221e] text-stone-300 hover:text-stone-100 transition"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-semibold transition"
                        >
                          Confirm Rejection
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2c2824] text-xs">
                      <button
                        onClick={() => setRejectingPaperId(paper._id)}
                        className="flex items-center gap-1 px-3.5 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-300 border border-rose-500/30 font-semibold transition"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        Reject Paper
                      </button>

                      <button
                        onClick={() => onApprovePaper(paper._id)}
                        className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition active:scale-[0.98]"
                      >
                        <CheckCircle className="w-3.5 h-3.5" />
                        Approve & Publish
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 2: Pending Solutions Queue */}
      {adminSubTab === 'solution-queue' && (
        <div className="space-y-4">
          <h3 className="font-heading text-lg font-bold text-[#f5f5f4] flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-emerald-400" />
            Pending Solution Approvals ({pendingSolutions.length})
          </h3>

          {pendingSolutions.length === 0 ? (
            <div className="p-12 text-center rounded-2xl glass-card border border-[#2c2824]">
              <CheckCircle className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-stone-300">No pending solutions</p>
              <p className="text-xs text-stone-500 mt-1">All submitted paper solutions have been reviewed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {pendingSolutions.map((sol) => (
                <div
                  key={sol._id}
                  className="p-5 rounded-xl glass-card border border-[#2c2824] space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs text-stone-400">
                      <span>Submitted by: <strong className="text-stone-200">{sol.submittedBy?.name || 'Contributor'}</strong></span>
                      <span className="badge-amber px-2 py-0.5 rounded text-[10px] font-mono-tag">Pending Review</span>
                    </div>

                    {sol.explanationText && (
                      <p className="text-xs text-stone-300 bg-[#161412] p-3 rounded-lg border border-[#2c2824]">
                        {sol.explanationText}
                      </p>
                    )}

                    <a
                      href={sol.solutionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 font-semibold"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      Inspect Solution Document
                    </a>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#2c2824] text-xs">
                    <button
                      onClick={() => onApproveSolution(sol._id)}
                      className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold transition"
                    >
                      <CheckCircle className="w-3.5 h-3.5" />
                      Approve & Publish Solution
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Sub-tab 3: User Management */}
      {adminSubTab === 'users' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-[#f5f5f4] flex items-center gap-2">
              <Users className="w-5 h-5 text-amber-400" />
              Registered User Accounts ({users.length})
            </h3>
          </div>

          <div className="rounded-2xl glass-card border border-[#2c2824] overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-[#161412] border-b border-[#2c2824] text-stone-400 font-semibold font-mono-tag uppercase tracking-wider">
                    <th className="p-4">User</th>
                    <th className="p-4">Role</th>
                    <th className="p-4">Email</th>
                    <th className="p-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#2c2824]">
                  {users.map((u) => (
                    <tr key={u._id} className="hover:bg-[#1a1815] transition">
                      <td className="p-4 font-semibold text-stone-200">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center border border-amber-500/20">
                            {u.name ? u.name[0].toUpperCase() : 'U'}
                          </div>
                          <div>
                            <span className="block text-stone-100 font-bold">{u.name}</span>
                            {currentUser?._id === u._id && (
                              <span className="text-[10px] text-amber-400 font-mono-tag">( You )</span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        {u.role === 'admin' ? (
                          <span className="badge-gold px-2.5 py-1 rounded-md text-[10px] font-mono-tag font-bold inline-flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-amber-400" />
                            Admin Moderator
                          </span>
                        ) : (
                          <span className="badge-stone px-2.5 py-1 rounded-md text-[10px] font-mono-tag font-semibold">
                            Student
                          </span>
                        )}
                      </td>

                      <td className="p-4 text-stone-300 font-mono-tag">
                        <div className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-500" />
                          <span>{u.email}</span>
                        </div>
                      </td>

                      <td className="p-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {u.role === 'student' ? (
                            <button
                              onClick={() => onToggleUserRole(u._id, 'admin')}
                              className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-semibold transition flex items-center gap-1"
                              title="Promote to Admin Moderator"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Promote to Admin</span>
                            </button>
                          ) : (
                            <button
                              onClick={() => onToggleUserRole(u._id, 'student')}
                              disabled={currentUser?._id === u._id}
                              className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 font-semibold transition flex items-center gap-1 disabled:opacity-50"
                              title="Demote to Student"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Demote to Student</span>
                            </button>
                          )}

                          <button
                            onClick={() => onDeleteUser(u._id, u.name)}
                            disabled={currentUser?._id === u._id}
                            className="p-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition disabled:opacity-50"
                            title="Delete User Account"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Sub-tab 4: Catalog Management Forms */}
      {adminSubTab === 'manage-catalog' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Create Course Form */}
          <div className="p-6 rounded-2xl glass-card border border-[#2c2824] space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading text-base font-bold text-[#f5f5f4]">Add New Course / Degree</h3>
            </div>

            <form onSubmit={onCreateCourse} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Course Code *</label>
                <input
                  type="text"
                  required
                  value={newCourseForm.code}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, code: e.target.value })}
                  placeholder="e.g. BTECH-CSE"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Course Name *</label>
                <input
                  type="text"
                  required
                  value={newCourseForm.name}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, name: e.target.value })}
                  placeholder="e.g. B.Tech Computer Science & Engineering"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Degree Type</label>
                <input
                  type="text"
                  value={newCourseForm.degree}
                  onChange={(e) => setNewCourseForm({ ...newCourseForm, degree: e.target.value })}
                  placeholder="B.Tech / M.Tech / BCA"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition"
              >
                Create Course
              </button>
            </form>
          </div>

          {/* Create Subject Form */}
          <div className="p-6 rounded-2xl glass-card border border-[#2c2824] space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-400" />
              <h3 className="font-heading text-base font-bold text-[#f5f5f4]">Add New Subject</h3>
            </div>

            <form onSubmit={onCreateSubject} className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-300 font-semibold mb-1">Select Course *</label>
                <select
                  value={newSubjectForm.course}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, course: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 focus:outline-none focus:border-amber-500/80"
                >
                  <option value="">Select Target Course</option>
                  {courses.map((c) => (
                    <option key={c._id || c.code} value={c._id}>
                      {c.code} - {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Subject Code *</label>
                <input
                  type="text"
                  required
                  value={newSubjectForm.code}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, code: e.target.value })}
                  placeholder="e.g. CS201"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <div>
                <label className="block text-stone-300 font-semibold mb-1">Subject Name *</label>
                <input
                  type="text"
                  required
                  value={newSubjectForm.name}
                  onChange={(e) => setNewSubjectForm({ ...newSubjectForm, name: e.target.value })}
                  placeholder="e.g. Data Structures & Algorithms"
                  className="w-full px-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold transition"
              >
                Create Subject
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
