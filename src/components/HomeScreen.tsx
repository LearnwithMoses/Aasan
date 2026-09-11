import React from "react";
import {
  ScheduledClass,
  TeachingNote,
  SavedLessonPlan,
  TeachingReminder,
  UserProfile,
} from "../types.ts";
import {
  BookOpen,
  FileEdit,
  FolderArchive,
  GraduationCap,
  Clock,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  AlertCircle,
  Plus,
  ArrowRight,
  Smile,
  Search,
  Bell,
} from "lucide-react";

interface HomeScreenProps {
  userProfile: UserProfile | null;
  classes: ScheduledClass[];
  recentLessons: SavedLessonPlan[];
  recentNotes: TeachingNote[];
  reminders: TeachingReminder[];
  onOpenClass: (cls: ScheduledClass) => void;
  onNavigateTab: (tab: "lessons" | "notes" | "resources" | "more") => void;
  onOpenCreateLesson: () => void;
  onOpenQuickNote: () => void;
  onToggleReminder: (id: string) => void;
  onOpenSearch: () => void;
  onOpenNotifications: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  userProfile,
  classes,
  recentLessons,
  recentNotes,
  reminders,
  onOpenClass,
  onNavigateTab,
  onOpenCreateLesson,
  onOpenQuickNote,
  onToggleReminder,
  onOpenSearch,
  onOpenNotifications,
}) => {
  const teacherName = userProfile?.name || "Moses";
  const schoolName = userProfile?.school || "National Model Academy";

  // Today's formatted date
  const todayDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const activeOrNextClass = classes.find((c) => c.status === "in_progress") || classes.find((c) => c.status === "upcoming");

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Mobile Bar with Teacher Profile & Search */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-[#263B80] to-[#1a2958] text-white font-black text-base flex items-center justify-center shadow-md shadow-[#263B80]/15">
            {teacherName.charAt(0)}
          </div>
          <div>
            <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">
              {schoolName}
            </div>
            <div className="text-base sm:text-lg font-black text-slate-900 leading-tight">
              Teacher {teacherName}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenSearch}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 hover:border-[#263B80] flex items-center justify-center text-slate-600 shadow-xs transition"
            title="Search everywhere"
          >
            <Search className="w-4 h-4" />
          </button>
          <button
            onClick={onOpenNotifications}
            className="w-10 h-10 rounded-2xl bg-white border border-slate-200/80 hover:border-[#263B80] flex items-center justify-center text-slate-600 shadow-xs transition relative"
            title="Classroom Reminders"
          >
            <Bell className="w-4 h-4" />
            {reminders.some((r) => !r.completed) && (
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#F28B70]" />
            )}
          </button>
        </div>
      </div>

      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#263B80] via-[#213370] to-[#1B295B] text-white p-6 sm:p-8 shadow-xl shadow-[#263B80]/10">
        {/* Subtle decorative vector curves */}
        <div className="absolute -right-12 -bottom-16 w-52 h-52 rounded-full bg-white/5 pointer-events-none" />
        <div className="absolute right-20 -top-12 w-32 h-32 rounded-full bg-[#F28B70]/10 pointer-events-none" />

        <div className="relative z-10 max-w-xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/90 text-xs font-semibold backdrop-blur-xs mb-3">
            <Calendar className="w-3.5 h-3.5 text-[#F28B70]" />
            <span>{todayDate}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-black tracking-tight leading-tight">
            Good Morning, {teacherName} 👋
          </h1>
          <p className="text-sm sm:text-base text-rose-100/90 mt-1.5 font-normal leading-relaxed">
            Ready for today&apos;s classes? You have{" "}
            <span className="font-bold text-white">{classes.length} class periods</span> scheduled today.
          </p>

          {/* Quick Active Class Snippet if in progress */}
          {activeOrNextClass && (
            <div className="mt-5 p-3.5 rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <Clock className="w-4 h-4 text-white" />
                </div>
                <div className="text-left">
                  <div className="text-[11px] font-bold text-rose-200 tracking-wide uppercase">
                    {activeOrNextClass.status === "in_progress" ? "Class In Progress" : "Next Class Period"} • {activeOrNextClass.time}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-white line-clamp-1">
                    {activeOrNextClass.grade} {activeOrNextClass.subject}: {activeOrNextClass.topic}
                  </div>
                </div>
              </div>
              <button
                onClick={() => onOpenClass(activeOrNextClass)}
                className="px-3 py-1.5 rounded-xl bg-[#F28B70] hover:bg-[#e07559] text-white text-xs font-bold transition flex items-center gap-1 shrink-0 ml-2"
              >
                <span>{activeOrNextClass.status === "in_progress" ? "Teach" : "Open"}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Inspirational Pedagogy Quote Banner */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-50/80 via-orange-50/50 to-rose-50/60 border border-amber-200/60 flex items-start gap-3.5">
        <div className="w-9 h-9 rounded-xl bg-amber-100/80 text-amber-700 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4" />
        </div>
        <div>
          <div className="text-[11px] font-extrabold text-amber-800 uppercase tracking-wider">
            Daily Pedagogical Focus
          </div>
          <p className="text-xs sm:text-sm text-amber-950 font-medium italic mt-0.5 leading-relaxed">
            &ldquo;Teaching is lighting a flame, not filling a vessel.&rdquo;
          </p>
          <div className="text-[11px] text-amber-800/80 mt-1 font-semibold">
            — Socrates • Encourage active student inquiry &amp; questions in today&apos;s sessions.
          </div>
        </div>
      </div>

      {/* SECTION 9: TODAY'S TEACHING (Scheduled Classes) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Today&apos;s Teaching</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-[#263B80]">
                {classes.length} Classes
              </span>
            </h2>
            <p className="text-xs text-slate-500">Tap any class period to view plan, teach, or reflect</p>
          </div>
          <button
            onClick={() => onNavigateTab("more")}
            className="text-xs font-bold text-[#263B80] hover:underline flex items-center gap-1"
          >
            <span>Full Schedule</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {classes.map((c) => {
            const isDone = c.status === "completed";
            const isInProg = c.status === "in_progress";

            return (
              <div
                key={c.id}
                onClick={() => onOpenClass(c)}
                className={`p-4 sm:p-5 rounded-3xl border transition-all cursor-pointer relative overflow-hidden group hover:shadow-md ${
                  isInProg
                    ? "bg-amber-50/60 border-amber-300 ring-2 ring-amber-400/20"
                    : isDone
                    ? "bg-slate-50/80 border-slate-200"
                    : "bg-white border-slate-200/80 hover:border-[#263B80]"
                }`}
              >
                {/* Status indicator bar */}
                <div
                  className={`absolute top-0 left-0 bottom-0 w-1.5 ${
                    isInProg
                      ? "bg-amber-500"
                      : isDone
                      ? "bg-emerald-500"
                      : "bg-[#263B80]"
                  }`}
                />

                <div className="pl-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-500" />
                        {c.time}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-slate-500">
                        {c.duration} min
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-500">{c.room || "Room 204"}</span>
                    </div>

                    {/* Status badge */}
                    {isInProg && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 animate-pulse">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
                        In Progress
                      </span>
                    )}
                    {isDone && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                        Completed
                      </span>
                    )}
                    {!isInProg && !isDone && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-[#263B80] border border-blue-100">
                        Upcoming
                      </span>
                    )}
                  </div>

                  <div className="mt-2.5">
                    <div className="text-[11px] font-bold text-[#F28B70] uppercase tracking-wide">
                      {c.grade} • {c.section} • {c.subject}
                    </div>
                    <div className="text-base font-extrabold text-slate-900 mt-0.5 group-hover:text-[#263B80] transition leading-snug">
                      {c.topic}
                    </div>
                  </div>

                  {/* Teacher reflection snippet if completed */}
                  {c.reflection && (
                    <div className="mt-2 text-xs text-emerald-800 bg-emerald-50/70 p-2 rounded-xl flex items-center gap-1.5">
                      <Smile className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span className="line-clamp-1 italic">
                        &ldquo;{c.reflection.whatWorked}&rdquo;
                      </span>
                    </div>
                  )}

                  {/* Footer card action */}
                  <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 font-medium">
                      {isDone ? "View Class Reflection" : "Open Teaching Mode & Plan"}
                    </span>
                    <div className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 group-hover:bg-[#263B80] group-hover:text-white flex items-center justify-center transition">
                      <ChevronRight className="w-3.5 h-3.5" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 10: QUICK ACTIONS (Matching Blood Bridge layout: 2-column cards with rounded icons and > arrow) */}
      <div className="space-y-3">
        <h2 className="text-lg font-black text-slate-900 tracking-tight">
          Quick Actions
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Action 1: Create Lesson */}
          <div
            onClick={onOpenCreateLesson}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-[#263B80] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-blue-50 text-[#263B80] flex items-center justify-center group-hover:scale-105 transition">
                <BookOpen className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 group-hover:bg-[#263B80] group-hover:text-white flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#263B80] transition leading-tight">
                Create Lesson
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                8-step wizard or instant AI generation
              </p>
            </div>
          </div>

          {/* Action 2: Quick Note */}
          <div
            onClick={onOpenQuickNote}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-[#F28B70] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-orange-50 text-[#F28B70] flex items-center justify-center group-hover:scale-105 transition">
                <FileEdit className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 group-hover:bg-[#F28B70] group-hover:text-white flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-extrabold text-slate-900 group-hover:text-[#F28B70] transition leading-tight">
                Quick Note
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Auto-saved classroom observations &amp; key points
              </p>
            </div>
          </div>

          {/* Action 3: Add Resource */}
          <div
            onClick={() => onNavigateTab("resources")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition">
                <FolderArchive className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 group-hover:bg-emerald-600 group-hover:text-white flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-extrabold text-slate-900 group-hover:text-emerald-700 transition leading-tight">
                Resource Library
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Worksheets, official textbooks &amp; printables
              </p>
            </div>
          </div>

          {/* Action 4: Assessments & Rubrics */}
          <div
            onClick={() => onNavigateTab("more")}
            className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-600 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
          >
            <div className="flex items-start justify-between">
              <div className="w-11 h-11 rounded-2xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-105 transition">
                <GraduationCap className="w-5 h-5 stroke-[2.2]" />
              </div>
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-500 group-hover:bg-purple-600 group-hover:text-white flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-4">
              <div className="text-sm font-extrabold text-slate-900 group-hover:text-purple-700 transition leading-tight">
                Assessments
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                Quizzes, 20-mark CCE rubrics &amp; question papers
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 11 & 12: RECENT ACTIVITY & UPCOMING REMINDERS (Side by Side on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Recent Activity
            </h2>
            <button
              onClick={() => onNavigateTab("lessons")}
              className="text-xs font-bold text-[#263B80] hover:underline"
            >
              View All
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 divide-y divide-slate-100 space-y-3 shadow-xs">
            {recentLessons.slice(0, 2).map((lesson) => (
              <div
                key={lesson.id}
                onClick={() => onNavigateTab("lessons")}
                className="pt-2 first:pt-0 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 p-2 rounded-2xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-blue-50 text-[#263B80] flex items-center justify-center shrink-0">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {lesson.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Lesson Plan • {lesson.grade} • {lesson.subject}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Ready
                </span>
              </div>
            ))}

            {recentNotes.slice(0, 2).map((note) => (
              <div
                key={note.id}
                onClick={() => onNavigateTab("notes")}
                className="pt-2 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 p-2 rounded-2xl transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-orange-50 text-[#F28B70] flex items-center justify-center shrink-0">
                    <FileEdit className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 line-clamp-1">
                      {note.title}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Teaching Note • {note.grade} • {note.date}
                    </div>
                  </div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">
                  {note.updatedAt}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Reminders */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>Teaching Reminders</span>
              <span className="text-xs font-bold text-[#F28B70]">
                ({reminders.filter((r) => !r.completed).length} pending)
              </span>
            </h2>
          </div>

          <div className="bg-white rounded-3xl border border-slate-200/80 p-4 space-y-2.5 shadow-xs">
            {reminders.map((rem) => (
              <div
                key={rem.id}
                onClick={() => onToggleReminder(rem.id)}
                className={`p-3 rounded-2xl border transition-all cursor-pointer flex items-center justify-between ${
                  rem.completed
                    ? "bg-slate-50 border-slate-200/60 opacity-60 line-through"
                    : rem.priority === "urgent"
                    ? "bg-rose-50/50 border-rose-200"
                    : "bg-white border-slate-200/80 hover:border-slate-300"
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={rem.completed}
                    onChange={() => onToggleReminder(rem.id)}
                    className="w-4 h-4 rounded text-[#263B80] focus:ring-0 cursor-pointer"
                  />
                  <div>
                    <div
                      className={`text-xs font-bold ${
                        rem.completed ? "text-slate-400 line-through" : "text-slate-900"
                      }`}
                    >
                      {rem.title}
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      {rem.dueTime}
                    </div>
                  </div>
                </div>

                {rem.priority === "urgent" && !rem.completed && (
                  <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-rose-100 text-rose-700">
                    Urgent
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
