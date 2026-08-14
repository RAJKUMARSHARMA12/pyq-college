import React from 'react';
import {
  Search,
  RefreshCw,
  BookOpen,
  GraduationCap,
  Calendar,
  X,
  Sparkles,
  CheckCircle2,
  Layers,
  Building2,
} from 'lucide-react';

export default function HeroFilter({
  searchQuery,
  setSearchQuery,
  selectedCourse,
  setSelectedCourse,
  selectedSubject,
  setSelectedSubject,
  selectedYear,
  setSelectedYear,
  courses = [],
  subjects = [],
  years = [],
  totalResults = 0,
  onResetFilters,
}) {
  const isFilterActive =
    searchQuery.trim() !== '' ||
    selectedCourse !== 'All' ||
    selectedSubject !== 'All' ||
    selectedYear !== 'All';

  const filteredSubjects =
    selectedCourse === 'All'
      ? subjects
      : subjects.filter(
          (s) =>
            s.course === selectedCourse ||
            s.course?._id === selectedCourse ||
            s.course?.code === selectedCourse
        );

  return (
    <section className="rounded-3xl glass-card border border-slate-800/90 p-6 md:p-8 mb-8 shadow-2xl space-y-6">
      {/* Bento Top Highlights & Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-800/80">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg tag-gold text-xs font-mono-tag mb-3 font-bold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Academic Vault • Previous Year Papers & Peer Solutions</span>
          </div>

          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-100 mb-2 leading-tight">
            Explore <span className="text-amber-400">Previous Year Exam Papers</span>
          </h2>
          <p className="text-slate-400 text-sm font-medium leading-relaxed">
            Search verified end-sem papers, midterm quizzes, and step-by-step student solution guides across university courses.
          </p>
        </div>

        {/* Quick Bento Stats Bar */}
        <div className="grid grid-cols-3 gap-3 shrink-0">
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="block font-heading text-xl font-bold text-amber-400">{totalResults}</span>
            <span className="text-[10px] text-slate-400 font-mono-tag uppercase">Papers</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="block font-heading text-xl font-bold text-emerald-400">98%</span>
            <span className="text-[10px] text-slate-400 font-mono-tag uppercase">Verified</span>
          </div>
          <div className="p-3.5 rounded-2xl bg-slate-900/90 border border-slate-800 text-center">
            <span className="block font-heading text-xl font-bold text-blue-400">{courses.length}</span>
            <span className="text-[10px] text-slate-400 font-mono-tag uppercase">Courses</span>
          </div>
        </div>
      </div>

      {/* Main Search Bar & Quick Filters */}
      <div className="space-y-4 max-w-5xl mx-auto">
        {/* Search Input Bar */}
        <div className="relative flex items-center">
          <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by course name, subject code (e.g. CS101, Math-II), or topic title..."
            className="w-full pl-11 pr-10 py-3.5 bg-slate-900/90 border border-slate-800 focus:border-amber-500/80 rounded-2xl text-sm text-slate-100 placeholder-slate-500 focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-4 text-slate-400 hover:text-slate-100 p-1 rounded transition"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Controls Row */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Course Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-mono-tag">
              <GraduationCap className="w-3.5 h-3.5 text-amber-400" />
              Degree / Course
            </label>
            <select
              value={selectedCourse}
              onChange={(e) => {
                setSelectedCourse(e.target.value);
                setSelectedSubject('All');
              }}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 font-medium transition cursor-pointer"
            >
              <option value="All">All Courses</option>
              {courses.map((c) => (
                <option key={c._id || c.code} value={c._id}>
                  {c.code} - {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Subject Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-mono-tag">
              <BookOpen className="w-3.5 h-3.5 text-amber-400" />
              Subject
            </label>
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 font-medium transition cursor-pointer"
            >
              <option value="All">All Subjects</option>
              {filteredSubjects.map((s) => (
                <option key={s._id || s.code} value={s._id}>
                  {s.code} - {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* Academic Year Select */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5 uppercase tracking-wider font-mono-tag">
              <Calendar className="w-3.5 h-3.5 text-amber-400" />
              Exam Year
            </label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-amber-500/80 font-medium transition cursor-pointer"
            >
              {years.map((y) => (
                <option key={y} value={y}>
                  {y === 'All' ? 'All Academic Years' : `Year ${y}`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Results Count & Reset CTA */}
        <div className="flex items-center justify-between pt-2 text-xs">
          <div className="flex items-center gap-2 text-slate-400 font-medium">
            <span>Showing <strong className="text-slate-100">{totalResults}</strong> published question papers</span>
          </div>

          {isFilterActive && (
            <button
              onClick={onResetFilters}
              className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/30 transition text-xs font-semibold"
            >
              <RefreshCw className="w-3 h-3" />
              Reset All Filters
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
