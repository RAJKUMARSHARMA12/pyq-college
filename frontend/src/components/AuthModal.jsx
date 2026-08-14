import React from 'react';
import { X, Lock, Mail, User, ShieldAlert } from 'lucide-react';

export default function AuthModal({
  isOpen,
  onClose,
  authMode,
  setAuthMode,
  authForm,
  setAuthForm,
  onSubmit,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md rounded-2xl glass-modal border border-[#2c2824] p-6 shadow-2xl space-y-6">
        <div className="flex items-center justify-between border-b border-[#2c2824] pb-4">
          <div>
            <h3 className="font-heading text-xl font-bold text-[#f5f5f4]">
              {authMode === 'login' ? 'Welcome Back' : 'Create Account'}
            </h3>
            <p className="text-xs text-stone-400">
              {authMode === 'login'
                ? 'Sign in to access your saved papers & submissions'
                : 'Join the ProRes academic portal community'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-[#25221e] text-stone-400 hover:text-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex p-1 bg-[#161412] rounded-xl border border-[#2c2824] text-xs font-semibold">
          <button
            type="button"
            onClick={() => setAuthMode('login')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMode === 'login'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => setAuthMode('register')}
            className={`flex-1 py-2 rounded-lg transition ${
              authMode === 'register'
                ? 'bg-amber-600 text-stone-950 font-bold'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Register
          </button>
        </div>

        <form onSubmit={onSubmit} className="space-y-4 text-xs">
          {authMode === 'register' && (
            <div>
              <label className="block text-stone-300 font-semibold mb-1">Full Name</label>
              <div className="relative flex items-center">
                <User className="absolute left-3.5 w-4 h-4 text-stone-400" />
                <input
                  type="text"
                  required
                  value={authForm.name}
                  onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                  placeholder="e.g. Alex Johnson"
                  className="w-full pl-10 pr-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-stone-300 font-semibold mb-1">University Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <input
                type="email"
                required
                value={authForm.email}
                onChange={(e) => setAuthForm({ ...authForm, email: e.target.value })}
                placeholder="student@university.edu"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>
          </div>

          <div>
            <label className="block text-stone-300 font-semibold mb-1">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-stone-400" />
              <input
                type="password"
                required
                value={authForm.password}
                onChange={(e) => setAuthForm({ ...authForm, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-10 pr-3.5 py-2.5 bg-[#161412] border border-[#2c2824] rounded-xl text-stone-100 placeholder-stone-500 focus:outline-none focus:border-amber-500/80"
              />
            </div>
          </div>

          {authMode === 'register' && (
            <div className="p-3 rounded-xl bg-[#161412] border border-[#2c2824] flex items-center gap-2 text-stone-400 text-[11px]">
              <ShieldAlert className="w-4 h-4 text-amber-400 shrink-0" />
              <span>Public accounts are registered with <strong>Student</strong> permissions. Admin moderator privileges are assigned by system administrators.</span>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-bold shadow transition active:scale-[0.98] mt-2"
          >
            {authMode === 'login' ? 'Sign In to Account' : 'Create Account'}
          </button>
        </form>
      </div>
    </div>
  );
}
