import React, { useState } from "react";
import { SavedLessonPlan, LessonPlanRequest } from "../types.ts";
import {
  Search,
  Plus,
  BookOpen,
  Filter,
  Clock,
  CheckCircle2,
  ChevronRight,
  Star,
  Copy,
  Printer,
  Sparkles,
  Layers,
} from "lucide-react";

interface LessonsScreenProps {
  savedPlans: SavedLessonPlan[];
  onOpenPlanDetail: (plan: SavedLessonPlan) => void;
  onOpenCreateLesson: () => void;
  onOpenAIGenerator: () => void;
  onDuplicatePlan: (plan: SavedLessonPlan) => void;
  onToggleFavorite: (id: string) => void;
}

export const LessonsScreen: React.FC<LessonsScreenProps> = ({
  savedPlans,
  onOpenPlanDetail,
  onOpenCreateLesson,
  onOpenAIGenerator,
  onDuplicatePlan,
  onToggleFavorite,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("All");

  const filterOptions = [
    "All",
    "Grade 8",
    "Grade 9",
    "Grade 10",
    "English",
    "Psychology",
    "Ready",
    "Favorites",
  ];

  const filtered = savedPlans.filter((plan) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery =
      !q ||
      plan.title.toLowerCase().includes(q) ||
      plan.grade.toLowerCase().includes(q) ||
      plan.subject.toLowerCase().includes(q) ||
      plan.topic.toLowerCase().includes(q);

    if (!matchesQuery) return false;

    if (selectedFilter === "All") return true;
    if (selectedFilter === "Favorites") return plan.isFavorite;
    if (selectedFilter === "Ready") return plan.status !== "Draft";
    if (selectedFilter === "Grade 8") return plan.grade.includes("8");
    if (selectedFilter === "Grade 9") return plan.grade.includes("9");
    if (selectedFilter === "Grade 10") return plan.grade.includes("10");
    if (selectedFilter === "English") return plan.subject.toLowerCase().includes("english");
    if (selectedFilter === "Psychology") return plan.subject.toLowerCase().includes("psychology");

    return true;
  });

  return (
    <div className="space-y-5 pb-20 sm:pb-8">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Lesson Plans</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-[#263B80]">
              {savedPlans.length} Total
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Structured 8-step teaching plans, pedagogical methods &amp; curriculum guides
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onOpenAIGenerator}
            className="px-3.5 py-2 rounded-2xl bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-900 text-xs font-extrabold flex items-center gap-1.5 transition shadow-xs"
            title="Instant AI Generation"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden sm:inline">AI Studio</span>
          </button>
          <button
            onClick={onOpenCreateLesson}
            className="px-4 py-2 rounded-2xl bg-[#263B80] hover:bg-[#1e2e65] text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-[#263B80]/15 transition"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Lesson</span>
          </button>
        </div>
      </div>

      {/* Search & Filter bar */}
      <div className="space-y-3">
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by topic, grade, subject, or learning objectives..."
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-[#263B80]/20 focus:outline-hidden"
          />
        </div>

        {/* Filter chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {filterOptions.map((filter) => (
            <button
              key={filter}
              onClick={() => setSelectedFilter(filter)}
              className={`px-3 py-1.5 rounded-full font-bold transition whitespace-nowrap ${
                selectedFilter === filter
                  ? "bg-[#263B80] text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-50"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Lesson Plans List */}
      {filtered.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-slate-200/80 space-y-3">
          <BookOpen className="w-12 h-12 mx-auto text-slate-300" />
          <h3 className="text-base font-bold text-slate-800">No lesson plans found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {searchQuery
              ? `No lessons matched "${searchQuery}". Try changing filters.`
              : "Create your first guided 8-step lesson plan or generate one with AI."}
          </p>
          <button
            onClick={onOpenCreateLesson}
            className="px-4 py-2 rounded-2xl bg-[#263B80] text-white text-xs font-bold shadow-xs hover:bg-[#1e2e65]"
          >
            + Create Lesson Plan
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {filtered.map((plan) => {
            const firstObjective =
              plan.plan.learning_objectives && plan.plan.learning_objectives.length > 0
                ? plan.plan.learning_objectives[0]
                : "Comprehensive pedagogical lesson unit";

            return (
              <div
                key={plan.id}
                onClick={() => onOpenPlanDetail(plan)}
                className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-[#263B80] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-orange-50 text-[#F28B70] text-[10px] font-black tracking-wide uppercase border border-orange-100">
                        {plan.grade} • {plan.subject}
                      </span>
                      <span className="text-slate-300 text-xs">•</span>
                      <span className="text-[11px] text-slate-500 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {plan.formData.duration || 45} min
                      </span>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleFavorite(plan.id);
                        }}
                        className="p-1 text-slate-400 hover:text-amber-500 transition"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            plan.isFavorite ? "fill-amber-400 text-amber-500" : ""
                          }`}
                        />
                      </button>
                      <span
                        className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                          plan.status === "Draft"
                            ? "bg-slate-100 text-slate-600"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        }`}
                      >
                        {plan.status || "Ready"}
                      </span>
                    </div>
                  </div>

                  <h3 className="text-base font-black text-slate-900 mt-2 group-hover:text-[#263B80] transition leading-snug">
                    {plan.title}
                  </h3>

                  <p className="text-xs text-slate-600 mt-1.5 line-clamp-2 leading-relaxed font-normal">
                    {firstObjective}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDuplicatePlan(plan);
                      }}
                      className="px-2 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-[11px] flex items-center gap-1 transition"
                      title="1-Tap Duplicate"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Clone</span>
                    </button>
                    <span className="text-[11px] text-slate-400">
                      {plan.formData.curriculum || "General"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[#263B80] font-bold text-xs group-hover:translate-x-0.5 transition">
                    <span>View Plan</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
