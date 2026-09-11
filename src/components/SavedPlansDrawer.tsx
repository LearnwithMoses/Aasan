import React, { useState } from "react";
import { SavedLessonPlan } from "../types.ts";
import { FolderHeart, Search, Trash2, ArrowRight, X, Calendar, BookOpen, Clock, GraduationCap, Award } from "lucide-react";

interface SavedPlansDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlans: SavedLessonPlan[];
  onLoadPlan: (plan: SavedLessonPlan) => void;
  onDeletePlan: (id: string) => void;
}

export const SavedPlansDrawer: React.FC<SavedPlansDrawerProps> = ({
  isOpen,
  onClose,
  savedPlans,
  onLoadPlan,
  onDeletePlan,
}) => {
  const [search, setSearch] = useState("");

  if (!isOpen) return null;

  const filtered = savedPlans.filter((p) => {
    const q = search.toLowerCase();
    return (
      p.title.toLowerCase().includes(q) ||
      p.grade.toLowerCase().includes(q) ||
      p.subject.toLowerCase().includes(q) ||
      p.topic.toLowerCase().includes(q)
    );
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end bg-black/50 backdrop-blur-xs p-0 sm:p-4">
      <div className="bg-white w-full sm:max-w-md h-full sm:h-[94vh] sm:rounded-2xl shadow-2xl flex flex-col border border-slate-200">
        <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center">
              <FolderHeart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">My Lesson Vault</h3>
              <p className="text-xs text-slate-500">{savedPlans.length} Saved Plans</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1.5 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-slate-100">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search by topic, class, or subject..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* List of saved plans */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {savedPlans.length === 0 ? (
            <div className="py-16 text-center text-slate-400 space-y-2">
              <FolderHeart className="w-10 h-10 mx-auto text-slate-300 stroke-1" />
              <div className="text-sm font-semibold text-slate-600">Your Vault is Empty</div>
              <p className="text-xs max-w-xs mx-auto">
                Generate any lesson plan and click <strong>"Save to Vault"</strong> to keep it here forever for quick recall.
              </p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400">
              No saved plans match "{search}".
            </div>
          ) : (
            filtered.map((item) => (
              <div
                key={item.id}
                className="bg-slate-50 hover:bg-slate-100/80 border border-slate-200 rounded-xl p-3.5 transition group"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="font-bold text-slate-900 text-xs line-clamp-1">{item.title}</h4>
                    <div className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1.5 flex-wrap">
                      <span className="font-medium text-slate-700">{item.grade}</span>
                      <span>·</span>
                      <span>{item.subject}</span>
                      <span>·</span>
                      <span className="text-[10px] text-slate-400">{item.curriculum}</span>
                    </div>

                    {/* Facility Tags */}
                    <div className="flex items-center gap-1 mt-1.5 flex-wrap">
                      {item.questionPaper && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-purple-100 text-purple-800 font-bold text-[9.5px]">
                          <GraduationCap className="w-2.5 h-2.5" />
                          <span>Question Paper</span>
                        </span>
                      )}
                      {item.worksheet && (
                        <span className="px-1.5 py-0.2 rounded bg-indigo-100 text-indigo-800 font-medium text-[9.5px]">
                          Worksheet
                        </span>
                      )}
                      {item.blackboard && (
                        <span className="px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-medium text-[9.5px]">
                          Blackboard
                        </span>
                      )}
                      {item.script && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-100 text-amber-800 font-medium text-[9.5px]">
                          Script
                        </span>
                      )}
                      {item.rubric && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-teal-100 text-teal-800 font-bold text-[9.5px]">
                          <Award className="w-2.5 h-2.5" />
                          <span>CCE Rubric</span>
                        </span>
                      )}
                      {item.syllabusPlanner && (
                        <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 font-bold text-[9.5px]">
                          <Calendar className="w-2.5 h-2.5" />
                          <span>30W Plan</span>
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => onDeletePlan(item.id)}
                    className="text-slate-400 hover:text-rose-600 p-1 rounded transition opacity-60 group-hover:opacity-100"
                    title="Delete saved plan"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/70 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {new Date(item.savedAt).toLocaleDateString()}
                  </span>
                  <button
                    onClick={() => {
                      onLoadPlan(item);
                      onClose();
                    }}
                    className="font-bold text-slate-900 hover:text-blue-600 inline-flex items-center gap-1"
                  >
                    <span>Load Plan</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
