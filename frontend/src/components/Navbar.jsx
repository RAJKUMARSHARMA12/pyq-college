import React from 'react';
import {
  BookOpen,
  UploadCloud,
  FileCheck,
  Bookmark,
  ShieldCheck,
  LogIn,
  LogOut,
} from 'lucide-react';

export default function Navbar({
  activeTab,
  setActiveTab,
  currentUser,
  pendingCount,
  bookmarkedCount,
  onOpenUpload,
  onOpenAuth,
  onLogout,
}) {
  return (
    <header className="sticky top-0 z-40 glass-header px-4 sm:px-6 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Brand Logo & Title */}
        <div className="flex items-center justify-between">
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-9 h-9 rounded-xl bg-amber-600 flex items-center justify-center text-stone-950 font-bold shadow-md group-hover:bg-amber-500 transition-colors">
              <BookOpen className="w-5 h-5 text-stone-950" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-heading text-lg font-bold tracking-tight text-[#f5f5f4] group-hover:text-amber-400 transition-colors">
                  ProRes
                </span>
                <span className="text-[10px] font-mono-tag px-2 py-0.5 rounded badge-gold font-semibold">
                  Vault
                </span>
              </div>
              <p className="text-[11px] text-stone-400 font-medium">Academic Papers & Peer Solutions</p>
            </div>
          </div>

          {/* Mobile Auth Button */}
          <div className="md:hidden flex items-center gap-2">
            {!currentUser ? (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-600 text-stone-950 font-bold text-xs hover:bg-amber-500 transition"
              >
                <LogIn className="w-3.5 h-3.5" />
                Sign In
              </button>
            ) : (
              <button
                onClick={onLogout}
                className="p-2 rounded-lg bg-[#2c2824] text-stone-300 hover:text-[#f5f5f4] transition"
                title="Log Out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center flex-wrap justify-between sm:justify-end gap-2">
          <nav className="flex items-center p-1 bg-[#161412] rounded-xl border border-[#2c2824] text-xs font-medium">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                activeTab === 'browse'
                  ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                  : 'text-stone-400 hover:text-[#f5f5f4] hover:bg-[#25221e]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Browse PYQs</span>
            </button>

            {currentUser && (
              <>
                <button
                  onClick={() => setActiveTab('my-submissions')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                    activeTab === 'my-submissions'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-[#f5f5f4] hover:bg-[#25221e]'
                  }`}
                >
                  <FileCheck className="w-3.5 h-3.5" />
                  <span>My Submissions</span>
                </button>

                <button
                  onClick={() => setActiveTab('bookmarks')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                    activeTab === 'bookmarks'
                      ? 'bg-amber-600 text-stone-950 font-bold shadow-sm'
                      : 'text-stone-400 hover:text-[#f5f5f4] hover:bg-[#25221e]'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-400" />
                  <span>Saved ({bookmarkedCount})</span>
                </button>
              </>
            )}

            {currentUser?.role === 'admin' && (
              <button
                onClick={() => setActiveTab('admin-dashboard')}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all duration-150 ${
                  activeTab === 'admin-dashboard'
                    ? 'bg-emerald-700 text-stone-950 font-bold shadow-sm'
                    : 'text-emerald-400 hover:text-emerald-300 hover:bg-[#25221e]'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin Portal</span>
                {pendingCount > 0 && (
                  <span className="w-4 h-4 rounded bg-rose-600 text-stone-950 text-[10px] flex items-center justify-center font-bold">
                    {pendingCount}
                  </span>
                )}
              </button>
            )}
          </nav>

          {/* Action CTAs & Profile */}
          <div className="flex items-center gap-2">
            <button
              onClick={onOpenUpload}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold text-xs border border-amber-500/50 shadow-sm transition-all duration-150"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Submit Paper</span>
            </button>

            <div className="hidden md:flex items-center">
              {!currentUser ? (
                <button
                  onClick={onOpenAuth}
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#25221e] hover:bg-[#2c2824] text-stone-200 text-xs font-semibold border border-[#38332e] transition-all duration-150"
                >
                  <LogIn className="w-3.5 h-3.5 text-amber-400" />
                  <span>Sign In</span>
                </button>
              ) : (
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#161412] border border-[#2c2824] text-xs">
                  <div className="w-6 h-6 rounded bg-amber-600/20 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-[10px]">
                    {currentUser.name ? currentUser.name[0].toUpperCase() : 'U'}
                  </div>
                  <div className="flex flex-col">
                    <span className="font-semibold text-stone-200 leading-tight">
                      {currentUser.name}
                    </span>
                    <span className="text-[10px] text-stone-400 capitalize">
                      {currentUser.role}
                    </span>
                  </div>
                  <button
                    onClick={onLogout}
                    className="ml-1 p-1 text-stone-400 hover:text-rose-400 transition"
                    title="Log Out"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
