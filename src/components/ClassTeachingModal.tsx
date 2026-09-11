import React, { useState } from "react";
import {
  ScheduledClass,
} from "../types.ts";
import {
  X,
  Clock,
  BookOpen,
  CheckCircle2,
  PlayCircle,
  FileText,
  Smile,
  Meh,
  Frown,
  Sparkles,
  ArrowRight,
  MessageSquare,
  AlertCircle,
  ChevronRight,
} from "lucide-react";

interface ClassTeachingModalProps {
  isOpen: boolean;
  onClose: () => void;
  scheduledClass: ScheduledClass | null;
  onUpdateStatus: (id: string, status: ScheduledClass["status"]) => void;
  onSaveReflection: (
    id: string,
    reflection: NonNullable<ScheduledClass["reflection"]>
  ) => void;
  onOpenLessonPlan?: (lessonPlanId?: string) => void;
  onCreateNoteForClass?: (scheduledClass: ScheduledClass) => void;
}

export const ClassTeachingModal: React.FC<ClassTeachingModalProps> = ({
  isOpen,
  onClose,
  scheduledClass,
  onUpdateStatus,
  onSaveReflection,
  onOpenLessonPlan,
  onCreateNoteForClass,
}) => {
  if (!isOpen || !scheduledClass) return null;

  const [rating, setRating] = useState<"excellent" | "good" | "average" | "needs_work">(
    scheduledClass.reflection?.rating || "good"
  );
  const [whatWorked, setWhatWorked] = useState(scheduledClass.reflection?.whatWorked || "");
  const [whatToChange, setWhatToChange] = useState(scheduledClass.reflection?.whatToChange || "");
  const [studentFollowUps, setStudentFollowUps] = useState(
    scheduledClass.reflection?.studentFollowUps || ""
  );
  const [showReflectionForm, setShowReflectionForm] = useState(false);

  const handleSaveReflection = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveReflection(scheduledClass.id, {
      rating,
      whatWorked,
      whatToChange,
      studentFollowUps,
    });
    setShowReflectionForm(false);
  };

  const getStatusBadge = () => {
    switch (scheduledClass.status) {
      case "in_progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 animate-pulse">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            In Progress
          </span>
        );
      case "completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Completed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-[#263B80] border border-blue-200">
            <Clock className="w-3.5 h-3.5" />
            Upcoming
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header banner inspired by the Blood Bridge reference design */}
        <div className="bg-gradient-to-r from-[#263B80] via-[#1E2E65] to-[#263B80] text-white p-5 sm:p-6 relative overflow-hidden">
          {/* Subtle soft background curve */}
          <div className="absolute -right-8 -bottom-10 w-36 h-36 rounded-full bg-white/5 pointer-events-none" />
          <div className="absolute right-12 -top-8 w-24 h-24 rounded-full bg-white/5 pointer-events-none" />

          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-white/20 text-white text-[11px] font-bold tracking-wide">
                {scheduledClass.time} ({scheduledClass.duration} min)
              </span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-xs text-white/90 font-medium">
                {scheduledClass.room || "Main Classroom"}
              </span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <div className="mt-3 relative z-10">
            <div className="text-[12px] font-semibold text-rose-200/90 tracking-wide uppercase">
              {scheduledClass.grade} • {scheduledClass.section} • {scheduledClass.subject}
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-white mt-1 leading-snug">
              {scheduledClass.topic}
            </h2>
          </div>

          <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/15 relative z-10">
            {getStatusBadge()}
            <div className="flex items-center gap-2">
              {scheduledClass.status !== "in_progress" && scheduledClass.status !== "completed" && (
                <button
                  onClick={() => onUpdateStatus(scheduledClass.id, "in_progress")}
                  className="px-3 py-1.5 rounded-xl bg-white text-[#263B80] text-xs font-bold hover:bg-slate-100 flex items-center gap-1.5 shadow-sm transition"
                >
                  <PlayCircle className="w-4 h-4 text-[#F28B70]" />
                  <span>Start Teaching</span>
                </button>
              )}
              {scheduledClass.status === "in_progress" && (
                <button
                  onClick={() => {
                    onUpdateStatus(scheduledClass.id, "completed");
                    setShowReflectionForm(true);
                  }}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500 text-white text-xs font-bold hover:bg-emerald-600 flex items-center gap-1.5 shadow-sm transition"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Mark Done & Reflect</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-slate-700">
          {/* Teacher Instructions & Quick Notes */}
          {scheduledClass.notes && (
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-100">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center gap-1.5 mb-1">
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                Teacher Reminder
              </div>
              <p className="text-sm text-amber-900 leading-relaxed font-medium">
                {scheduledClass.notes}
              </p>
            </div>
          )}

          {/* Connected Lesson Plan Action Card */}
          <div className="p-4 rounded-2xl bg-[#F8FAFD] border border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-[#263B80] flex items-center justify-center">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xs text-slate-500 font-medium">Lesson Plan Connected</div>
                <div className="text-sm font-bold text-slate-900">
                  {scheduledClass.topic}
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onOpenLessonPlan) onOpenLessonPlan(scheduledClass.lessonPlanId);
              }}
              className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-[#263B80] hover:bg-slate-50 shadow-xs flex items-center gap-1"
            >
              <span>View Plan</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Quick Note Action */}
          <div className="p-4 rounded-2xl bg-white border border-slate-100 shadow-xs flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-orange-50 text-[#F28B70] flex items-center justify-center">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-bold text-slate-900">Classroom Notes & Observation</div>
                <div className="text-xs text-slate-500">
                  Record what happened during this session
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                onClose();
                if (onCreateNoteForClass) onCreateNoteForClass(scheduledClass);
              }}
              className="px-3 py-1.5 rounded-xl bg-[#F28B70] text-white text-xs font-bold hover:bg-[#e07559] shadow-xs flex items-center gap-1"
            >
              <span>Add Note</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Section 24: Classroom Reflection */}
          <div className="border-t border-slate-100 pt-4">
            <div className="flex items-center justify-between mb-3">
              <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Classroom Reflection</span>
              </div>
              <button
                type="button"
                onClick={() => setShowReflectionForm(!showReflectionForm)}
                className="text-xs font-bold text-[#263B80] hover:underline"
              >
                {showReflectionForm ? "Collapse" : scheduledClass.reflection ? "Edit Reflection" : "+ Add Reflection"}
              </button>
            </div>

            {scheduledClass.reflection && !showReflectionForm && (
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-500">Rating:</span>
                  <span className="text-xs font-semibold capitalize px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                    {scheduledClass.reflection.rating === "excellent" && "😊 Excellent"}
                    {scheduledClass.reflection.rating === "good" && "🙂 Good"}
                    {scheduledClass.reflection.rating === "average" && "😐 Average"}
                    {scheduledClass.reflection.rating === "needs_work" && "🙁 Needs Work"}
                  </span>
                </div>
                {scheduledClass.reflection.whatWorked && (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">What worked:</strong> {scheduledClass.reflection.whatWorked}
                  </p>
                )}
                {scheduledClass.reflection.whatToChange && (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Next time:</strong> {scheduledClass.reflection.whatToChange}
                  </p>
                )}
                {scheduledClass.reflection.studentFollowUps && (
                  <p className="text-xs text-slate-700 leading-relaxed">
                    <strong className="text-slate-900">Student follow-up:</strong> {scheduledClass.reflection.studentFollowUps}
                  </p>
                )}
              </div>
            )}

            {showReflectionForm && (
              <form onSubmit={handleSaveReflection} className="p-4 rounded-2xl bg-[#F8FAFD] border border-slate-200 space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1.5">
                    How did the lesson go?
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: "excellent", label: "Excellent", icon: "😊", color: "hover:border-emerald-400" },
                      { id: "good", label: "Good", icon: "🙂", color: "hover:border-blue-400" },
                      { id: "average", label: "Average", icon: "😐", color: "hover:border-amber-400" },
                      { id: "needs_work", label: "Needs Work", icon: "🙁", color: "hover:border-rose-400" },
                    ].map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setRating(item.id as any)}
                        className={`p-2 rounded-xl text-center border transition-all ${
                          rating === item.id
                            ? "bg-white border-[#263B80] shadow-sm ring-2 ring-[#263B80]/20"
                            : "bg-white/70 border-slate-200 " + item.color
                        }`}
                      >
                        <div className="text-lg">{item.icon}</div>
                        <div className="text-[10px] font-bold text-slate-700 mt-0.5">{item.label}</div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    What worked well?
                  </label>
                  <textarea
                    rows={2}
                    value={whatWorked}
                    onChange={(e) => setWhatWorked(e.target.value)}
                    placeholder="e.g. Student participation in role-play, clear grasp of key terms..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#263B80]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    What will I change next time?
                  </label>
                  <textarea
                    rows={2}
                    value={whatToChange}
                    onChange={(e) => setWhatToChange(e.target.value)}
                    placeholder="e.g. Allocate 5 more minutes for debrief..."
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#263B80]/20"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Which students need follow-up?
                  </label>
                  <input
                    type="text"
                    value={studentFollowUps}
                    onChange={(e) => setStudentFollowUps(e.target.value)}
                    placeholder="e.g. Rahul (pace modulation), Priya (lead summary)"
                    className="w-full text-xs p-2.5 rounded-xl border border-slate-200 bg-white focus:outline-hidden focus:ring-2 focus:ring-[#263B80]/20"
                  />
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowReflectionForm(false)}
                    className="px-3 py-1.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-xl bg-[#263B80] text-white text-xs font-bold hover:bg-[#1e2e65] shadow-sm"
                  >
                    Save Reflection
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <div className="text-xs text-slate-500 font-medium">
            Session status: <span className="font-bold text-slate-800 capitalize">{scheduledClass.status}</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[#263B80] text-white text-xs font-bold hover:bg-[#1e2e65] shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
