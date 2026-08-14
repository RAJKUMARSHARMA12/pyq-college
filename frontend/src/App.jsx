import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  FileCheck,
  Bookmark,
  FolderOpen,
} from 'lucide-react';

import Navbar from './components/Navbar';
import HeroFilter from './components/HeroFilter';
import PaperCard from './components/PaperCard';
import PaperReaderModal from './components/PaperReaderModal';
import { UploadPaperModal, UploadSolutionModal } from './components/UploadModal';
import AuthModal from './components/AuthModal';
import AdminDashboard from './components/AdminDashboard';
import Toast from './components/Toast';
import SkeletonLoader from './components/SkeletonLoader';

const EXAM_TYPES = ['All', 'End-Sem', 'Mid-Sem', 'Quiz', 'Model Paper'];
const YEARS = ['All', '2025', '2024', '2023', '2022', '2021', '2020'];

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState('browse');
  const [adminSubTab, setAdminSubTab] = useState('pyq-queue');

  // User Auth State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ name: '', email: '', password: '', role: 'student' });

  // Data States
  const [pyqs, setPyqs] = useState([]);
  const [pendingPyqs, setPendingPyqs] = useState([]);
  const [pendingSolutions, setPendingSolutions] = useState([]);
  const [mySubmissions, setMySubmissions] = useState([]);
  const [bookmarkedPyqs, setBookmarkedPyqs] = useState([]);
  const [adminStats, setAdminStats] = useState(null);
  const [courses, setCourses] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCourse, setSelectedCourse] = useState('All');
  const [selectedSubject, setSelectedSubject] = useState('All');
  const [selectedYear, setSelectedYear] = useState('All');

  // Modals & Reader
  const [readingPaper, setReadingPaper] = useState(null);
  const [paperSolutions, setPaperSolutions] = useState([]);
  const [paperComments, setPaperComments] = useState([]);
  const [commentInput, setCommentInput] = useState('');
  const [readerTab, setReaderTab] = useState('preview');

  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isUploadSolutionOpen, setIsUploadSolutionOpen] = useState(false);
  const [solutionForm, setSolutionForm] = useState({ solutionUrl: '', explanationText: '' });

  const [rejectingPaperId, setRejectingPaperId] = useState(null);
  const [rejectionReasonInput, setRejectionReasonInput] = useState('');

  // Catalog Form for Admin
  const [newCourseForm, setNewCourseForm] = useState({ name: '', code: '', degree: 'B.Tech', description: '' });
  const [newSubjectForm, setNewSubjectForm] = useState({ name: '', code: '', course: '', semester: '1' });

  // Upload Form Data
  const [uploadForm, setUploadForm] = useState({
    title: '',
    course: '',
    subject: '',
    academicYear: '2024',
    examType: 'End-Sem',
    fileUrl: '',
    solutionUrl: '',
  });

  // Toast System
  const [toast, setToast] = useState(null);
  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Auth Fetch Options
  const fetchOpts = (method = 'GET', body = null) => {
    const opts = {
      method,
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    };
    const token = localStorage.getItem('prores_token');
    if (token) {
      opts.headers['Authorization'] = `Bearer ${token}`;
    }
    if (body) opts.body = JSON.stringify(body);
    return opts;
  };

  // Fetch Current Auth Profile
  const fetchAuthUser = async () => {
    try {
      const res = await fetch('/api/v1/auth/me', fetchOpts());
      if (res.ok) {
        const data = await res.json();
        if (data.success) setCurrentUser(data.user);
      } else {
        // Token invalid or expired — clear stale token
        localStorage.removeItem('prores_token');
        setCurrentUser(null);
      }
    } catch {
      // Network error — remain unauthenticated
      setCurrentUser(null);
    }
  };

  // Fetch Catalog
  const fetchCatalog = async () => {
    try {
      const cRes = await fetch('/api/v1/catalog/courses');
      const cJson = await cRes.json();
      if (cJson.success) setCourses(cJson.data);

      const sRes = await fetch('/api/v1/catalog/subjects');
      const sJson = await sRes.json();
      if (sJson.success) setSubjects(sJson.data);
    } catch (e) {
      console.error('Catalog error:', e);
    }
  };

  // Fetch Approved PYQs
  const fetchApprovedPYQs = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (selectedCourse !== 'All') params.append('courseId', selectedCourse);
      if (selectedSubject !== 'All') params.append('subjectId', selectedSubject);
      if (selectedYear !== 'All') params.append('academicYear', selectedYear);

      const res = await fetch(`/api/v1/pyqs?${params.toString()}`);
      const json = await res.json();
      if (json.success) setPyqs(json.data);
    } catch {
      showToast('Failed to load question papers', 'error');
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);

  // Fetch Admin Moderation Queue & Users
  const fetchAdminData = async () => {
    if (currentUser?.role !== 'admin') return;
    try {
      const pRes = await fetch('/api/v1/admin/pyqs/pending', fetchOpts());
      const pJson = await pRes.json();
      if (pJson.success) setPendingPyqs(pJson.data);

      const sRes = await fetch('/api/v1/admin/solutions/pending', fetchOpts());
      const sJson = await sRes.json();
      if (sJson.success) setPendingSolutions(sJson.data);

      const uRes = await fetch('/api/v1/admin/users', fetchOpts());
      const uJson = await uRes.json();
      if (uJson.success) setUsers(uJson.data);

      const stRes = await fetch('/api/v1/admin/stats', fetchOpts());
      const stJson = await stRes.json();
      if (stJson.success) setAdminStats(stJson.data);
    } catch (e) {
      console.error('Admin data error:', e);
    }
  };

  // Fetch User Submissions & Bookmarks
  const fetchUserData = async () => {
    if (!currentUser) return;
    try {
      const subRes = await fetch('/api/v1/pyqs/my-submissions', fetchOpts());
      const subJson = await subRes.json();
      if (subJson.success) setMySubmissions(subJson.data);

      const bmRes = await fetch('/api/v1/pyqs/user/bookmarks', fetchOpts());
      const bmJson = await bmRes.json();
      if (bmJson.success) setBookmarkedPyqs(bmJson.data);
    } catch (e) {
      console.error('User data error:', e);
    }
  };

  useEffect(() => {
    fetchAuthUser();
    fetchCatalog();
  }, []);

  useEffect(() => {
    fetchApprovedPYQs();
    fetchUserData();
    fetchAdminData();
  }, [searchQuery, selectedCourse, selectedSubject, selectedYear, currentUser]);

  // Auth Handlers
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    const endpoint = authMode === 'login' ? '/api/v1/auth/login' : '/api/v1/auth/register';

    try {
      const res = await fetch(endpoint, fetchOpts('POST', authForm));
      const json = await res.json();

      if (json.success) {
        if (json.token) {
          localStorage.setItem('prores_token', json.token);
        }
        showToast(authMode === 'login' ? 'Logged in successfully!' : 'Account created successfully!', 'success');
        setCurrentUser(json.user);
        setIsAuthModalOpen(false);
        setAuthForm({ name: '', email: '', password: '', role: 'student' });
      } else {
        showToast(json.message || 'Authentication failed', 'error');
      }
    } catch {
      showToast('Network error during authentication', 'error');
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/v1/auth/logout', fetchOpts('POST'));
    } catch {
      // Ignored
    } finally {
      localStorage.removeItem('prores_token');
      setCurrentUser(null);
      showToast('Logged out successfully', 'success');
    }
  };

  const [isSubmittingPaper, setIsSubmittingPaper] = useState(false);
  const [isSubmittingSolution, setIsSubmittingSolution] = useState(false);

  // PYQ Upload Handler (Supports both Local PDF File Upload & Drive Link)
  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingPaper) return;

    if (!uploadForm.title.trim()) {
      showToast('Please provide paper title', 'error');
      return;
    }
    if (!uploadForm.file && !uploadForm.fileUrl.trim()) {
      showToast('Please attach a PDF file or provide a Drive link', 'error');
      return;
    }

    setIsSubmittingPaper(true);
    try {
      let res;
      if (uploadForm.file) {
        const formData = new FormData();
        formData.append('file', uploadForm.file);
        formData.append('title', uploadForm.title);
        formData.append('course', uploadForm.course || (courses[0]?._id ?? 'crs_1'));
        formData.append('subject', uploadForm.subject || (subjects[0]?._id ?? 'sub_1'));
        formData.append('academicYear', uploadForm.academicYear);
        formData.append('examType', uploadForm.examType);
        if (uploadForm.solutionUrl) formData.append('solutionUrl', uploadForm.solutionUrl);

        const uploadToken = localStorage.getItem('prores_token');
        res = await fetch('/api/v1/pyqs/upload', {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            ...(uploadToken ? { Authorization: `Bearer ${uploadToken}` } : {})
          }
        });
      } else {
        res = await fetch('/api/v1/pyqs/upload', fetchOpts('POST', {
          ...uploadForm,
          course: uploadForm.course || (courses[0]?._id ?? 'crs_1'),
          subject: uploadForm.subject || (subjects[0]?._id ?? 'sub_1'),
        }));
      }

      const json = await res.json();
      if (json.success) {
        showToast('Question Paper submitted! Pending admin review.', 'success');
        setIsUploadModalOpen(false);
        setUploadForm({
          title: '',
          course: '',
          subject: '',
          academicYear: '2024',
          examType: 'End-Sem',
          fileUrl: '',
          solutionUrl: '',
          file: null,
          fileName: '',
        });
        fetchUserData();
        if (currentUser?.role === 'admin') fetchAdminData();
      } else {
        showToast(json.message || 'Error submitting paper', 'error');
      }
    } catch {
      showToast('Network error submitting paper', 'error');
    } finally {
      setIsSubmittingPaper(false);
    }
  };

  // Admin Approve / Reject Handlers
  const handleApprovePaper = async (id) => {
    try {
      const res = await fetch(`/api/v1/admin/pyqs/${id}/approve`, fetchOpts('PUT'));
      const json = await res.json();
      if (json.success) {
        showToast('Question Paper approved and published!', 'success');
        fetchAdminData();
        fetchApprovedPYQs();
      } else {
        showToast(json.message || 'Error approving paper', 'error');
      }
    } catch {
      showToast('Network error approving paper', 'error');
    }
  };

  const handleRejectPaperSubmit = async (e) => {
    e.preventDefault();
    if (!rejectionReasonInput.trim()) {
      showToast('Please provide rejection reason', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/v1/admin/pyqs/${rejectingPaperId}/reject`, fetchOpts('PUT', { reason: rejectionReasonInput }));
      const json = await res.json();
      if (json.success) {
        showToast('Question Paper rejected with feedback provided', 'success');
        setRejectingPaperId(null);
        setRejectionReasonInput('');
        fetchAdminData();
      } else {
        showToast(json.message || 'Error rejecting paper', 'error');
      }
    } catch {
      showToast('Network error rejecting paper', 'error');
    }
  };

  // Solution Handlers (Supports both Local Solution PDF & Drive Link)
  const fetchPaperSolutions = async (paperId) => {
    try {
      const res = await fetch(`/api/v1/pyqs/${paperId}/solutions`);
      const json = await res.json();
      if (json.success) setPaperSolutions(json.data);
    } catch (e) {
      console.error('Solutions error:', e);
    }
  };

  const handleUploadSolutionSubmit = async (e) => {
    e.preventDefault();
    if (isSubmittingSolution) return;

    if (!solutionForm.file && !solutionForm.solutionUrl.trim()) {
      showToast('Please attach a solution PDF file or provide a Drive link', 'error');
      return;
    }

    setIsSubmittingSolution(true);
    try {
      let res;
      if (solutionForm.file) {
        const formData = new FormData();
        formData.append('file', solutionForm.file);
        if (solutionForm.explanationText) formData.append('explanationText', solutionForm.explanationText);

        const solToken = localStorage.getItem('prores_token');
        res = await fetch(`/api/v1/pyqs/${readingPaper._id}/solutions`, {
          method: 'POST',
          body: formData,
          credentials: 'include',
          headers: {
            ...(solToken ? { Authorization: `Bearer ${solToken}` } : {})
          }
        });
      } else {
        res = await fetch(`/api/v1/pyqs/${readingPaper._id}/solutions`, fetchOpts('POST', solutionForm));
      }

      const json = await res.json();
      if (json.success) {
        showToast('Solution submitted! Sent for admin review.', 'success');
        setIsUploadSolutionOpen(false);
        setSolutionForm({ solutionUrl: '', explanationText: '', file: null, fileName: '' });
        fetchPaperSolutions(readingPaper._id);
      } else {
        showToast(json.message || 'Error submitting solution', 'error');
      }
    } catch {
      showToast('Network error submitting solution', 'error');
    } finally {
      setIsSubmittingSolution(false);
    }
  };

  const handleUpvoteSolution = async (solutionId) => {
    if (!currentUser) {
      showToast('Please log in to upvote solutions', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/v1/solutions/${solutionId}/upvote`, fetchOpts('POST'));
      const json = await res.json();
      if (json.success) {
        showToast(json.hasUpvoted ? 'Upvoted solution!' : 'Removed upvote', 'success');
        fetchPaperSolutions(readingPaper._id);
      }
    } catch {
      showToast('Error toggling upvote', 'error');
    }
  };

  const handleApproveSolution = async (solutionId) => {
    try {
      const res = await fetch(`/api/v1/admin/solutions/${solutionId}/status`, fetchOpts('PUT', { status: 'approved' }));
      const json = await res.json();
      if (json.success) {
        showToast('Solution approved & published!', 'success');
        fetchAdminData();
      }
    } catch {
      showToast('Error approving solution', 'error');
    }
  };

  // Comment Handlers
  const fetchPaperComments = async (paperId) => {
    try {
      const res = await fetch(`/api/v1/pyqs/${paperId}/comments`);
      const json = await res.json();
      if (json.success) setPaperComments(json.data);
    } catch (e) {
      console.error('Comments error:', e);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    if (!currentUser) {
      showToast('Please log in to post comments', 'error');
      return;
    }

    try {
      const res = await fetch(`/api/v1/pyqs/${readingPaper._id}/comments`, fetchOpts('POST', { content: commentInput }));
      const json = await res.json();
      if (json.success) {
        setCommentInput('');
        fetchPaperComments(readingPaper._id);
        showToast('Comment posted', 'success');
      }
    } catch {
      showToast('Error posting comment', 'error');
    }
  };

  // Open Paper Reader
  const handleOpenReader = (paper) => {
    setReadingPaper(paper);
    setReaderTab('preview');
    fetchPaperSolutions(paper._id);
    fetchPaperComments(paper._id);
    fetch(`/api/v1/pyqs/${paper._id}`);
  };

  // Bookmark Toggle Handler
  const handleToggleBookmark = async (paperId) => {
    if (!currentUser) {
      showToast('Please log in to bookmark papers', 'error');
      return;
    }
    try {
      const res = await fetch(`/api/v1/pyqs/${paperId}/bookmark`, fetchOpts('POST'));
      const json = await res.json();
      if (json.success) {
        showToast(json.message, 'success');
        fetchUserData();
      }
    } catch {
      showToast('Error toggling bookmark', 'error');
    }
  };

  // Download Track Handler
  const handleDownloadTrack = async (paperId, fileUrl) => {
    try {
      await fetch(`/api/v1/pyqs/${paperId}/download`, { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    window.open(fileUrl, '_blank');
  };

  // Catalog Creation Handlers
  const handleCreateCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/catalog/courses', fetchOpts('POST', newCourseForm));
      const json = await res.json();
      if (json.success) {
        showToast(`Course ${json.data.code} created!`, 'success');
        setNewCourseForm({ name: '', code: '', degree: 'B.Tech', description: '' });
        fetchCatalog();
      }
    } catch {
      showToast('Error creating course', 'error');
    }
  };

  const handleCreateSubject = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/v1/catalog/subjects', fetchOpts('POST', {
        ...newSubjectForm,
        course: newSubjectForm.course || (courses[0]?._id ?? 'crs_1'),
      }));
      const json = await res.json();
      if (json.success) {
        showToast(`Subject ${json.data.code} created!`, 'success');
        setNewSubjectForm({ name: '', code: '', course: '', semester: '1' });
        fetchCatalog();
      }
    } catch {
      showToast('Error creating subject', 'error');
    }
  };

  const handleToggleUserRole = async (userId, newRole) => {
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}/role`, fetchOpts('PUT', { role: newRole }));
      const json = await res.json();
      if (json.success) {
        showToast(json.message || `User role updated to ${newRole}`, 'success');
        fetchAdminData();
      } else {
        showToast(json.message || 'Failed to update user role', 'error');
      }
    } catch {
      showToast('Error updating user role', 'error');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user account '${userName}'?`)) return;
    try {
      const res = await fetch(`/api/v1/admin/users/${userId}`, fetchOpts('DELETE'));
      const json = await res.json();
      if (json.success) {
        showToast(json.message || 'User account deleted', 'success');
        fetchAdminData();
      } else {
        showToast(json.message || 'Failed to delete user', 'error');
      }
    } catch {
      showToast('Error deleting user account', 'error');
    }
  };

  const isPaperBookmarked = (paperId) => {
    return bookmarkedPyqs.some((b) => b.questionPaper === paperId || b.questionPaper?._id === paperId);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCourse('All');
    setSelectedSubject('All');
    setSelectedYear('All');
  };

  return (
    <div className="min-h-screen pb-16 bg-[#121110] text-[#f5f5f4] font-['Plus_Jakarta_Sans',sans-serif]">
      {/* Toast Notification */}
      <Toast toast={toast} onClose={() => setToast(null)} />

      {/* Main Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        pendingCount={(pendingPyqs.length || 0) + (pendingSolutions.length || 0)}
        bookmarkedCount={bookmarkedPyqs.length}
        onOpenUpload={() => setIsUploadModalOpen(true)}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-6">
        {/* Browse Papers View */}
        {activeTab === 'browse' && (
          <div>
            <HeroFilter
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
              selectedSubject={selectedSubject}
              setSelectedSubject={setSelectedSubject}
              selectedYear={selectedYear}
              setSelectedYear={setSelectedYear}
              courses={courses}
              subjects={subjects}
              years={YEARS}
              totalResults={pyqs.length}
              onResetFilters={resetFilters}
            />

            {/* Paper Cards Grid */}
            {loading ? (
              <SkeletonLoader count={6} />
            ) : pyqs.length === 0 ? (
              <div className="text-center py-16 px-6 glass-card rounded-2xl border border-[#2c2824] max-w-lg mx-auto">
                <FolderOpen className="w-16 h-16 text-stone-600 mx-auto mb-4" />
                <h3 className="font-heading text-lg font-bold text-stone-200">
                  No Question Papers Found
                </h3>
                <p className="text-xs text-stone-400 mt-1 mb-6 leading-relaxed">
                  We couldn't find any published exam papers matching your search criteria or selected filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
                >
                  Clear Search & Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pyqs.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    isBookmarked={isPaperBookmarked(paper._id)}
                    onOpenReader={handleOpenReader}
                    onToggleBookmark={handleToggleBookmark}
                    onDownloadTrack={handleDownloadTrack}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* My Submissions Tab */}
        {activeTab === 'my-submissions' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold text-[#f5f5f4] flex items-center gap-2">
                  <FileCheck className="w-6 h-6 text-amber-400" />
                  My Paper Submissions
                </h2>
                <p className="text-xs text-stone-400">
                  Track status and feedback for question papers you uploaded.
                </p>
              </div>
              <button
                onClick={() => setIsUploadModalOpen(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs shadow transition"
              >
                Upload New Paper
              </button>
            </div>

            {mySubmissions.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl border border-[#2c2824]">
                <FileCheck className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-300">No paper submissions yet</p>
                <p className="text-xs text-stone-500 mt-1">Upload previous year papers to earn contributor credits.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mySubmissions.map((paper) => (
                  <PaperCard
                    key={paper._id}
                    paper={paper}
                    showStatus={true}
                    onOpenReader={handleOpenReader}
                    onToggleBookmark={handleToggleBookmark}
                    onDownloadTrack={handleDownloadTrack}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved / Bookmarked Papers Tab */}
        {activeTab === 'bookmarks' && (
          <div className="space-y-6">
            <div>
              <h2 className="font-heading text-2xl font-bold text-[#f5f5f4] flex items-center gap-2">
                <Bookmark className="w-6 h-6 text-amber-400" />
                Saved Question Papers ({bookmarkedPyqs.length})
              </h2>
              <p className="text-xs text-stone-400">
                Your personal library of bookmarked exam papers for quick reference.
              </p>
            </div>

            {bookmarkedPyqs.length === 0 ? (
              <div className="text-center py-16 glass-card rounded-2xl border border-[#2c2824]">
                <Bookmark className="w-12 h-12 text-stone-600 mx-auto mb-3" />
                <p className="text-sm font-semibold text-stone-300">No saved papers</p>
                <p className="text-xs text-slate-500 mt-1">Click the bookmark icon on any paper to save it here.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {bookmarkedPyqs.map((bm) => {
                  const paper = bm.questionPaper || bm;
                  return (
                    <PaperCard
                      key={paper._id || bm._id}
                      paper={paper}
                      isBookmarked={true}
                      onOpenReader={handleOpenReader}
                      onToggleBookmark={handleToggleBookmark}
                      onDownloadTrack={handleDownloadTrack}
                    />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Admin Dashboard Tab */}
        {activeTab === 'admin-dashboard' && currentUser?.role === 'admin' && (
          <AdminDashboard
            adminSubTab={adminSubTab}
            setAdminSubTab={setAdminSubTab}
            pendingPyqs={pendingPyqs}
            pendingSolutions={pendingSolutions}
            adminStats={adminStats}
            courses={courses}
            subjects={subjects}
            users={users}
            onApprovePaper={handleApprovePaper}
            rejectingPaperId={rejectingPaperId}
            setRejectingPaperId={setRejectingPaperId}
            rejectionReasonInput={rejectionReasonInput}
            setRejectionReasonInput={setRejectionReasonInput}
            onRejectPaperSubmit={handleRejectPaperSubmit}
            onApproveSolution={handleApproveSolution}
            newCourseForm={newCourseForm}
            setNewCourseForm={setNewCourseForm}
            onCreateCourse={handleCreateCourse}
            newSubjectForm={newSubjectForm}
            setNewSubjectForm={setNewSubjectForm}
            onCreateSubject={handleCreateSubject}
            onToggleUserRole={handleToggleUserRole}
            onDeleteUser={handleDeleteUser}
            currentUser={currentUser}
          />
        )}
      </main>

      {/* Reader Modal */}
      {readingPaper && (
        <PaperReaderModal
          paper={readingPaper}
          onClose={() => setReadingPaper(null)}
          readerTab={readerTab}
          setReaderTab={setReaderTab}
          solutions={paperSolutions}
          comments={paperComments}
          commentInput={commentInput}
          setCommentInput={setCommentInput}
          onAddComment={handleAddComment}
          onUpvoteSolution={handleUpvoteSolution}
          onOpenUploadSolution={() => setIsUploadSolutionOpen(true)}
          currentUser={currentUser}
        />
      )}

      {/* Upload Paper Modal */}
      <UploadPaperModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        uploadForm={uploadForm}
        setUploadForm={setUploadForm}
        onSubmit={handleUploadSubmit}
        isSubmitting={isSubmittingPaper}
        courses={courses}
        subjects={subjects}
        years={YEARS}
        examTypes={EXAM_TYPES}
      />

      {/* Upload Solution Modal */}
      <UploadSolutionModal
        isOpen={isUploadSolutionOpen}
        onClose={() => setIsUploadSolutionOpen(false)}
        solutionForm={solutionForm}
        setSolutionForm={setSolutionForm}
        onSubmit={handleUploadSolutionSubmit}
        isSubmitting={isSubmittingSolution}
      />

      {/* Auth Login/Register Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        authMode={authMode}
        setAuthMode={setAuthMode}
        authForm={authForm}
        setAuthForm={setAuthForm}
        onSubmit={handleAuthSubmit}
      />

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 mt-16 pt-8 border-t border-[#2c2824] flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span className="font-heading font-semibold text-stone-300">ProRes Vault</span>
          <span>© 2026 Academic Resource System</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="badge-gold px-2.5 py-0.5 rounded text-[10px] font-mono-tag">Warm Obsidian Edition</span>
        </div>
      </footer>
    </div>
  );
}
