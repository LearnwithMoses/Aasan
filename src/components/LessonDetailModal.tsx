import React from "react";
import { SavedLessonPlan } from "../types.ts";
import { exportToWordDoc } from "../data/storage.ts";
import {
  X,
  Printer,
  Copy,
  Download,
  Trash2,
  Clock,
  BookOpen,
  CheckCircle2,
  Sparkles,
  Share2,
  FileText,
  Star,
  Users,
} from "lucide-react";

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedPlan: SavedLessonPlan | null;
  onDuplicatePlan: (plan: SavedLessonPlan) => void;
  onDeletePlan: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
  onOpenWorksheet?: () => void;
  onOpenBlackboard?: () => void;
  onOpenScript?: () => void;
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  isOpen,
  onClose,
  savedPlan,
  onDuplicatePlan,
  onDeletePlan,
  onToggleFavorite,
  onOpenWorksheet,
  onOpenBlackboard,
  onOpenScript,
}) => {
  if (!isOpen || !savedPlan) return null;

  const plan = savedPlan.plan;
  const form = savedPlan.formData;

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    exportToWordDoc(plan, form);
  };

  const handleShare = async () => {
    const text = `Lesson Plan: ${plan.title} (${savedPlan.grade} - ${savedPlan.subject})\nObjectives: ${plan.learning_objectives.join(", ")}`;
    if (navigator.share) {
      try {
        await navigator.share({
          title: plan.title,
          text,
        });
      } catch (err) {
        console.log("Share dismissed");
      }
    } else {
      navigator.clipboard.writeText(text);
      alert("Lesson summary copied to clipboard!");
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-[#263B80] text-white p-5 sm:p-6 relative no-print">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#F28B70] text-white text-[11px] font-extrabold tracking-wide">
                {savedPlan.grade} • {savedPlan.subject}
              </span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-xs text-white/80">
                {savedPlan.curriculum || "General"}
              </span>
              <span className="text-white/60 text-xs">•</span>
              <span className="text-xs text-white/80 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {form.duration || 45} min
              </span>
            </div>

            <div className="flex items-center gap-2">
              {onToggleFavorite && (
                <button
                  type="button"
                  onClick={() => onToggleFavorite(savedPlan.id)}
                  className={`p-2 rounded-full transition ${
                    savedPlan.isFavorite
                      ? "text-amber-400 bg-white/10"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                  title="Favorite"
                >
                  <Star className={`w-4 h-4 ${savedPlan.isFavorite ? "fill-amber-400" : ""}`} />
                </button>
              )}
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-white mt-2 leading-snug">
            {plan.title || savedPlan.title}
          </h2>

          {/* Action Bar */}
          <div className="mt-4 pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => onDuplicatePlan(savedPlan)}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
                title="Duplicate & Reuse"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Duplicate</span>
              </button>
              <button
                onClick={handlePrint}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>
              <button
                onClick={handleExportWord}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Word (.doc)</span>
              </button>
              <button
                onClick={handleShare}
                className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition"
              >
                <Share2 className="w-3.5 h-3.5" />
                <span>Share</span>
              </button>
            </div>

            <button
              onClick={() => {
                if (confirm(`Delete "${savedPlan.title}"?`)) {
                  onDeletePlan(savedPlan.id);
                  onClose();
                }
              }}
              className="px-2.5 py-1.5 rounded-xl text-rose-300 hover:text-rose-100 hover:bg-rose-500/20 text-xs font-semibold flex items-center gap-1 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        </div>

        {/* Plan Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6 text-slate-800 text-sm">
          {/* Learning Objectives */}
          <div className="border-b border-slate-100 pb-4">
            <h3 className="text-xs font-bold text-[#263B80] uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              Learning Objectives
            </h3>
            <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
              {plan.learning_objectives.map((obj, i) => (
                <li key={i} className="leading-relaxed">{obj}</li>
              ))}
            </ul>
          </div>

          {/* Success Criteria */}
          {plan.success_criteria && plan.success_criteria.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Success Criteria
              </h3>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-700">
                {plan.success_criteria.map((sc, i) => (
                  <li key={i}>{sc}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Teaching Content & Key Explanations */}
          {plan.key_explanation && plan.key_explanation.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-[#263B80] uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-blue-600" />
                Key Concept Explanation &amp; Definitions
              </h3>
              <div className="space-y-2 text-slate-700">
                {plan.key_explanation.map((exp, i) => (
                  <p key={i} className="leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-100">
                    {exp}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Lesson Flow Stages Table */}
          {plan.lesson_flow && plan.lesson_flow.length > 0 && (
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Step-by-Step Lesson Flow
              </h3>
              <div className="overflow-x-auto rounded-2xl border border-slate-200">
                <table className="w-full text-xs text-left border-collapse">
                  <thead className="bg-slate-100 text-slate-800 font-bold">
                    <tr>
                      <th className="p-2.5 border-b border-slate-200">Phase</th>
                      <th className="p-2.5 border-b border-slate-200">Time</th>
                      <th className="p-2.5 border-b border-slate-200">Teacher Actions</th>
                      <th className="p-2.5 border-b border-slate-200">Student Actions</th>
                      <th className="p-2.5 border-b border-slate-200">Formative Check</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {plan.lesson_flow.map((stage, i) => (
                      <tr key={i} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">{stage.stage}</td>
                        <td className="p-2.5 font-semibold text-slate-600 whitespace-nowrap">{stage.minutes}m</td>
                        <td className="p-2.5 text-slate-700">
                          {Array.isArray(stage.teacher_actions)
                            ? stage.teacher_actions.join("; ")
                            : stage.teacher_actions}
                        </td>
                        <td className="p-2.5 text-slate-700">
                          {Array.isArray(stage.student_actions)
                            ? stage.student_actions.join("; ")
                            : stage.student_actions}
                        </td>
                        <td className="p-2.5 text-emerald-700 font-medium">
                          {stage.assessment_check}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Differentiation & Support */}
          {plan.differentiation && (
            <div className="border-b border-slate-100 pb-4">
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                Differentiation &amp; Inclusivity
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-100">
                  <div className="font-bold text-[#263B80] mb-1">Support &amp; Scaffolding</div>
                  <p className="text-slate-700">{plan.differentiation.support?.join("; ") || "Sentence starters & peer buddy."}</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <div className="font-bold text-slate-900 mb-1">Core Mastery</div>
                  <p className="text-slate-700">{plan.differentiation.core?.join("; ") || "Standard activity completion."}</p>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/60 border border-amber-100">
                  <div className="font-bold text-amber-800 mb-1">Extension &amp; Challenge</div>
                  <p className="text-slate-700">{plan.differentiation.extension?.join("; ") || "Higher-order analysis."}</p>
                </div>
              </div>
            </div>
          )}

          {/* Materials & Assessment */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-slate-100 pb-4">
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Materials &amp; Equipment
              </h3>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {plan.materials.map((m, i) => (
                  <li key={i}>{m}</li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Assessment &amp; Exit Ticket
              </h3>
              <div className="text-xs text-slate-700 space-y-1 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100">
                {plan.assessment.exit_ticket && (
                  <div>
                    <strong>Exit Ticket:</strong> {plan.assessment.exit_ticket.join("; ")}
                  </div>
                )}
                {plan.assessment.homework && (
                  <div>
                    <strong>Homework:</strong> {plan.assessment.homework.join("; ")}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Teacher Notes & Reflection Prompts */}
          {plan.teacher_notes && plan.teacher_notes.length > 0 && (
            <div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Teacher Notes
              </h3>
              <ul className="list-disc pl-5 text-xs text-slate-700 space-y-1">
                {plan.teacher_notes.map((tn, i) => (
                  <li key={i}>{tn}</li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between no-print">
          <div className="text-xs text-slate-500">
            Created on {new Date(savedPlan.savedAt).toLocaleDateString()}
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#263B80] text-white text-xs font-bold hover:bg-[#1e2e65] shadow-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
