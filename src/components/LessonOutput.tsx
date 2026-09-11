import React, { useState, useEffect } from "react";
import { LessonPlan, LessonPlanRequest } from "../types.ts";
import {
  Printer,
  Copy,
  Check,
  Download,
  FileText,
  AlertCircle,
  Lightbulb,
  Sparkles,
  Layout,
  Edit3,
  Save,
  FolderHeart,
  FileDown,
  Volume2,
  GraduationCap,
  Flame,
  Award,
  Calendar,
} from "lucide-react";
import { exportToWordDoc } from "../data/storage.ts";
import { AasaanDashboardHero } from "./AasaanDashboardHero.tsx";

interface LessonOutputProps {
  plan: LessonPlan | null;
  formData: LessonPlanRequest;
  isLoading: boolean;
  error: string | null;
  isPro: boolean;
  onRetry?: () => void;
  onEditDetails?: () => void;
  onOpenWorksheet: () => void;
  onOpenBlackboard: () => void;
  onOpenScript: () => void;
  onOpenQuestionPaper: () => void;
  onOpenRubric?: () => void;
  onOpenSyllabusPlanner?: () => void;
  onSaveToVault: (currentPlan: LessonPlan) => void;
  onOpenUpgrade: () => void;
  onOpenTextbooks?: () => void;
  onOpenVault?: () => void;
  onOpenTeacherGuide?: () => void;
  onOpenAndroidPublish?: () => void;
}

export const LessonOutput: React.FC<LessonOutputProps> = ({
  plan,
  formData,
  isLoading,
  error,
  isPro,
  onRetry,
  onEditDetails,
  onOpenWorksheet,
  onOpenBlackboard,
  onOpenScript,
  onOpenQuestionPaper,
  onOpenRubric,
  onOpenSyllabusPlanner,
  onSaveToVault,
  onOpenUpgrade,
  onOpenTextbooks,
  onOpenVault,
  onOpenTeacherGuide,
  onOpenAndroidPublish,
}) => {
  const [copied, setCopied] = useState(false);
  const [savedToVaultSuccess, setSavedToVaultSuccess] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editablePlan, setEditablePlan] = useState<LessonPlan | null>(null);

  useEffect(() => {
    if (plan) {
      setEditablePlan(JSON.parse(JSON.stringify(plan)));
      setIsEditing(false);
      setSavedToVaultSuccess(false);
    }
  }, [plan]);

  const activePlan = editablePlan || plan;

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    if (!activePlan) return;

    const md = `
# ${activePlan.title}
*${formData.grade} · ${formData.subject} · ${formData.topic} · ${formData.duration} minutes · ${formData.curriculum}*

## Learning Objectives
${activePlan.learning_objectives.map((o) => `- ${o}`).join("\n")}

## Success Criteria
${activePlan.success_criteria.map((c) => `- ${c}`).join("\n")}

## Prior Knowledge & Materials
### Prior Knowledge
${activePlan.prior_knowledge.map((p) => `- ${p}`).join("\n")}

### Materials
${activePlan.materials.map((m) => `- ${m}`).join("\n")}

### Key Explanation
${activePlan.key_explanation.map((k) => `- ${k}`).join("\n")}

## Detailed Lesson Flow
${activePlan.lesson_flow
  .map(
    (s) =>
      `### ${s.stage} (${s.minutes} mins)\n**Teacher:** ${s.teacher_actions.join(
        ", "
      )}\n**Student:** ${s.student_actions.join(
        ", "
      )}\n**Assessment Check:** ${s.assessment_check}`
  )
  .join("\n\n")}

## Differentiation
- Support: ${activePlan.differentiation.support.join("; ")}
- Core: ${activePlan.differentiation.core.join("; ")}
- Extension: ${activePlan.differentiation.extension.join("; ")}

## Assessment
- Formative: ${activePlan.assessment.formative.join("; ")}
- Exit Ticket: ${activePlan.assessment.exit_ticket.join("; ")}
- Homework: ${activePlan.assessment.homework.join("; ")}

## Misconceptions & Teacher Notes
- Misconceptions: ${activePlan.common_misconceptions.join("; ")}
- Notes: ${activePlan.teacher_notes.join("; ")}
- Reflection: ${activePlan.reflection.join("; ")}
    `.trim();

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExportWord = () => {
    if (!activePlan) return;
    if (!isPro) {
      onOpenUpgrade();
      return;
    }
    exportToWordDoc(activePlan, formData);
  };

  const handleSaveVault = () => {
    if (!activePlan) return;
    onSaveToVault(activePlan);
    setSavedToVaultSuccess(true);
    setTimeout(() => setSavedToVaultSuccess(false), 2500);
  };

  const renderList = (items: string[] | undefined) => {
    if (!items || items.length === 0) {
      return <li className="text-slate-400 italic">None specified</li>;
    }
    return items.map((item, idx) => <li key={idx}>{item}</li>);
  };

  return (
    <section id="output-section" className="output-panel w-full">
      {/* Empty State / Welcome Dashboard matching Blood Bridge */}
      {!isLoading && !error && !plan && (
        <AasaanDashboardHero
          onStartLessonPlanning={onEditDetails || (() => {})}
          onOpenTextbooks={onOpenTextbooks || (() => {})}
          onOpenQuestionPapers={onOpenQuestionPaper}
          onOpenWorksheets={onOpenWorksheet}
          onOpenVault={onOpenVault || (() => {})}
          onOpenTeacherGuide={onOpenTeacherGuide || (() => {})}
          onOpenAndroidPublish={onOpenAndroidPublish}
        />
      )}

      {/* Loading Skeleton */}
      {isLoading && (
        <div className="card loading-state bg-white border border-[#e5e7eb] rounded-2xl p-8 sm:p-12 text-center">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4 text-[#101827]">
            <Sparkles className="w-6 h-6 text-[#d9ad57] animate-pulse" />
          </div>
          <div className="spinner w-8 h-8 border-3 border-[#101827]/20 border-t-[#101827] rounded-full animate-spin mx-auto mb-4"></div>
          <h3 className="text-lg font-bold text-[#172033] mb-1">
            Synthesizing Pedagogical Plan...
          </h3>
          <p className="text-sm text-[#697386] max-w-md mx-auto">
            Structuring learning objectives (Bloom's taxonomy), scaffolding teacher/student
            actions, differentiated tasks, and formative assessment checks.
          </p>
          <div className="mt-6 max-w-sm mx-auto space-y-2">
            <div className="h-2.5 bg-slate-100 rounded-full animate-pulse"></div>
            <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-5/6 mx-auto"></div>
            <div className="h-2.5 bg-slate-100 rounded-full animate-pulse w-4/6 mx-auto"></div>
          </div>
        </div>
      )}

      {/* Error state */}
      {error && !isLoading && (
        <div className="card error-state bg-white border border-rose-200 rounded-2xl p-6 sm:p-8 text-center">
          <div className="w-10 h-10 rounded-full bg-rose-50 flex items-center justify-center mx-auto mb-3 text-rose-600">
            <AlertCircle className="w-5 h-5" />
          </div>
          <h3 className="text-base font-bold text-slate-900 mb-1">Unable to generate plan</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto mb-4">{error}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-lg bg-[#101827] text-white hover:bg-slate-800 transition"
            >
              Try Again
            </button>
          )}
        </div>
      )}

      {/* Rendered plan */}
      {!isLoading && !error && activePlan && (
        <>
          {/* Main Action Bar */}
          <div className="toolbar no-print flex items-center justify-between gap-2 flex-wrap mb-4 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
            {onEditDetails && (
              <button
                type="button"
                onClick={onEditDetails}
                className="lg:hidden inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-bold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                <span>← Edit Details</span>
              </button>
            )}

            {/* Pro Facility Action Buttons */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Student Worksheet Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) onOpenUpgrade();
                  else onOpenWorksheet();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-indigo-50 text-indigo-800 border border-indigo-200 hover:bg-indigo-100 transition shadow-2xs"
                title="Generate print-ready student worksheet"
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Student Worksheet</span>
                {!isPro && (
                  <span className="text-[9px] bg-indigo-200 text-indigo-900 px-1 py-0.2 rounded font-extrabold">
                    PRO
                  </span>
                )}
              </button>

              {/* Blackboard Organizer Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) onOpenUpgrade();
                  else onOpenBlackboard();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 hover:bg-emerald-100 transition shadow-2xs"
                title="View 3-panel chalkboard layout"
              >
                <Layout className="w-3.5 h-3.5 text-emerald-600" />
                <span>Blackboard Plan</span>
                {!isPro && (
                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 py-0.2 rounded font-extrabold">
                    PRO
                  </span>
                )}
              </button>

              {/* Classroom Explanation Script Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) onOpenUpgrade();
                  else onOpenScript();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition shadow-2xs"
                title="Word-for-word teacher explanation script, analogies, and easy concept breakdowns"
              >
                <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                <span>Explanation Script</span>
                {!isPro ? (
                  <span className="text-[9px] bg-amber-200 text-amber-950 px-1 py-0.2 rounded font-extrabold">
                    PRO
                  </span>
                ) : (
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1 py-0.2 rounded font-bold">
                    NEW
                  </span>
                )}
              </button>

              {/* Board Question Paper & Blueprint Button */}
              <button
                type="button"
                onClick={() => {
                  if (!isPro) onOpenUpgrade();
                  else onOpenQuestionPaper();
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-purple-50 text-purple-900 border border-purple-300 hover:bg-purple-100 transition shadow-2xs"
                title="Generate Board Exam Question Paper (20/40/50/80 Marks) & NEP Blueprint"
              >
                <GraduationCap className="w-3.5 h-3.5 text-purple-700" />
                <span>Question Paper</span>
                {!isPro ? (
                  <span className="text-[9px] bg-purple-200 text-purple-950 px-1 py-0.2 rounded font-extrabold">
                    PRO
                  </span>
                ) : (
                  <span className="text-[9px] bg-purple-600 text-white px-1 py-0.2 rounded font-extrabold">
                    HOT
                  </span>
                )}
              </button>

              {/* Internal Assessment Rubric (20 Marks CCE) Button */}
              {onOpenRubric && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isPro) onOpenUpgrade();
                    else onOpenRubric();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-teal-50 text-teal-900 border border-teal-300 hover:bg-teal-100 transition shadow-2xs"
                  title="Generate 4-Level Internal Assessment & Practical Scoring Rubric (20-Mark Board Scheme)"
                >
                  <Award className="w-3.5 h-3.5 text-teal-700" />
                  <span>CCE Rubric</span>
                  <span className="text-[9px] bg-teal-200 text-teal-900 px-1 py-0.2 rounded font-bold">
                    20M
                  </span>
                </button>
              )}

              {/* 30-Week Syllabus Planner Button */}
              {onOpenSyllabusPlanner && (
                <button
                  type="button"
                  onClick={() => {
                    if (!isPro) onOpenUpgrade();
                    else onOpenSyllabusPlanner();
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-blue-50 text-blue-900 border border-blue-300 hover:bg-blue-100 transition shadow-2xs"
                  title="View 30-Week Yearly & Term-Wise Syllabus Distribution Planner"
                >
                  <Calendar className="w-3.5 h-3.5 text-blue-700" />
                  <span>Syllabus Planner</span>
                  <span className="text-[9px] bg-blue-200 text-blue-900 px-1 py-0.2 rounded font-bold">
                    30W
                  </span>
                </button>
              )}

              {/* Edit Plan Toggle Button */}
              <button
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition ${
                  isEditing
                    ? "bg-amber-100 text-amber-900 border-amber-300 font-bold"
                    : "bg-white text-slate-700 border-slate-300 hover:bg-slate-50"
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>{isEditing ? "Done Editing" : "Edit Plan"}</span>
              </button>

              {/* Save to Vault */}
              <button
                type="button"
                onClick={handleSaveVault}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
              >
                {savedToVaultSuccess ? (
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                ) : (
                  <FolderHeart className="w-3.5 h-3.5 text-rose-500" />
                )}
                <span>{savedToVaultSuccess ? "Saved to Vault!" : "Save to Vault"}</span>
              </button>
            </div>

            {/* Right-aligned Output Actions */}
            <div className="flex items-center gap-2 ml-auto flex-wrap">
              {/* Word Export (.doc) */}
              <button
                type="button"
                onClick={handleExportWord}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 text-blue-800 border border-blue-200 hover:bg-blue-100 transition"
                title="Export as Microsoft Word document"
              >
                <FileDown className="w-3.5 h-3.5 text-blue-600" />
                <span>Word (.doc)</span>
                {!isPro && (
                  <span className="text-[9px] bg-blue-200 text-blue-900 px-1 py-0.2 rounded font-extrabold">
                    PRO
                  </span>
                )}
              </button>

              <button
                onClick={handleCopyMarkdown}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#eef1f5] text-[#172033] hover:bg-slate-200 transition"
                title="Copy markdown text"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? "Copied!" : "Copy Text"}</span>
              </button>

              <button
                className="secondary inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-bold rounded-lg bg-[#101827] text-white hover:bg-slate-800 transition shadow-2xs"
                onClick={handlePrint}
              >
                <Printer className="w-3.5 h-3.5 text-[#d9ad57]" />
                <span>Print / PDF</span>
              </button>
            </div>
          </div>

          <article className="plan bg-white rounded-2xl p-6 sm:p-8 shadow-xs border border-slate-200 relative">
            {/* Engine Tag */}
            {activePlan.aiEngineUsed && (
              <div className="no-print absolute top-4 right-4 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[10px] font-bold border border-slate-200">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>{activePlan.aiEngineUsed}</span>
              </div>
            )}

            {isEditing ? (
              <div className="mb-4">
                <label className="block text-xs font-bold text-slate-700 mb-1">Lesson Title:</label>
                <input
                  type="text"
                  value={activePlan.title}
                  onChange={(e) =>
                    setEditablePlan({ ...activePlan, title: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-base font-bold"
                />
              </div>
            ) : (
              <h1>{activePlan.title}</h1>
            )}

            <div className="meta text-xs text-slate-500 font-medium mb-5 pb-3 border-b border-slate-200">
              {formData.grade || "Class 8"} · {formData.subject || "Mathematics"} ·{" "}
              {formData.topic || "Linear equations"} · {formData.duration || 40} minutes
              {formData.curriculum && ` · ${formData.curriculum}`}
            </div>

            {/* Learning objectives & Success criteria */}
            <div className="section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Learning objectives (Bloom's Taxonomy)
              </h3>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={activePlan.learning_objectives.join("\n")}
                  onChange={(e) =>
                    setEditablePlan({
                      ...activePlan,
                      learning_objectives: e.target.value.split("\n"),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-sans mb-3"
                />
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800">
                  {renderList(activePlan.learning_objectives)}
                </ul>
              )}

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mt-4 mb-2">
                Success criteria
              </h3>
              {isEditing ? (
                <textarea
                  rows={3}
                  value={activePlan.success_criteria.join("\n")}
                  onChange={(e) =>
                    setEditablePlan({
                      ...activePlan,
                      success_criteria: e.target.value.split("\n"),
                    })
                  }
                  className="w-full border border-slate-300 rounded-lg p-2 text-xs font-sans"
                />
              ) : (
                <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800">
                  {renderList(activePlan.success_criteria)}
                </ul>
              )}
            </div>

            {/* Prior knowledge & Materials */}
            <div className="section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Prior knowledge, materials &amp; key concepts
              </h3>
              <div className="cols grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Prior knowledge</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.prior_knowledge)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Materials</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.materials)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Key explanation</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.key_explanation)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Lesson flow */}
            <div className="section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Lesson flow ({formData.duration} Minutes)
              </h3>
              <div className="overflow-x-auto">
                <table className="flow w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800 text-xs">
                      <th className="p-2 border border-slate-200" style={{ width: "20%" }}>
                        Stage / time
                      </th>
                      <th className="p-2 border border-slate-200" style={{ width: "35%" }}>
                        Teacher actions
                      </th>
                      <th className="p-2 border border-slate-200" style={{ width: "30%" }}>
                        Student actions
                      </th>
                      <th className="p-2 border border-slate-200" style={{ width: "15%" }}>
                        Assessment
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(activePlan.lesson_flow || []).map((stage, idx) => (
                      <tr key={idx} className="border-b border-slate-200">
                        <td className="p-2 border border-slate-200 bg-slate-50/50">
                          <b className="text-xs text-slate-900">{stage.stage}</b>
                          <br />
                          <span className="text-[11px] text-slate-500 font-medium">
                            {stage.minutes} min
                          </span>
                        </td>
                        <td className="p-2 border border-slate-200 text-xs">
                          <ul className="pl-4 list-disc space-y-1 text-slate-800">
                            {renderList(stage.teacher_actions)}
                          </ul>
                        </td>
                        <td className="p-2 border border-slate-200 text-xs">
                          <ul className="pl-4 list-disc space-y-1 text-slate-800">
                            {renderList(stage.student_actions)}
                          </ul>
                        </td>
                        <td className="p-2 border border-slate-200 text-slate-700 text-xs">
                          {stage.assessment_check || "Informal observation"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Differentiation */}
            <div className="section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Differentiation
              </h3>
              <div className="cols grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Support</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.differentiation?.support)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Core</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.differentiation?.core)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Extension</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.differentiation?.extension)}
                  </ul>
                </div>
              </div>
            </div>

            {/* Assessment & homework */}
            <div className="section mb-6">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Assessment &amp; homework
              </h3>
              <div className="cols grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Formative</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.assessment?.formative)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Exit ticket</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.assessment?.exit_ticket)}
                  </ul>
                </div>
                <div className="mini bg-slate-50 p-3 rounded-lg border border-slate-200">
                  <b className="text-xs text-slate-900 block mb-1">Homework</b>
                  <ul className="list-disc pl-4 text-xs space-y-1 text-slate-700">
                    {renderList(activePlan.assessment?.homework)}
                  </ul>
                </div>
              </div>

              {/* Question Paper Quick Callout */}
              <div className="mt-3 p-3 bg-purple-50 border border-purple-200 rounded-xl flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-purple-200 text-purple-800 flex items-center justify-center shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-purple-950">
                      Need an official test paper for this chapter?
                    </h4>
                    <p className="text-[11px] text-purple-700">
                      Generate a 20M, 40M, 50M, or 80M Board Model Paper with Teacher&apos;s Answer Key, Step Marking &amp; NEP Blueprint.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    if (!isPro) onOpenUpgrade();
                    else onOpenQuestionPaper();
                  }}
                  className="px-3 py-1.5 rounded-lg bg-purple-700 hover:bg-purple-800 text-white text-xs font-bold transition shadow-xs"
                >
                  Generate Test Paper &rarr;
                </button>
              </div>
            </div>

            {/* Common misconceptions, Teacher notes, Reflection */}
            <div className="section">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mb-2">
                Common misconceptions &amp; corrections
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800 mb-4">
                {renderList(activePlan.common_misconceptions)}
              </ul>

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mt-4 mb-2">
                Teacher practical notes
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800 mb-4">
                {renderList(activePlan.teacher_notes)}
              </ul>

              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 mt-4 mb-2">
                Post-lesson reflection
              </h3>
              <ul className="list-disc pl-5 space-y-1 text-xs text-slate-800">
                {renderList(activePlan.reflection)}
              </ul>
            </div>
          </article>
        </>
      )}
    </section>
  );
};
