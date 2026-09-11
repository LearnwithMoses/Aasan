import React, { useState } from "react";
import {
  X,
  Printer,
  FileDown,
  Sparkles,
  CheckCircle2,
  Award,
  BookOpen,
  ClipboardList,
  AlertCircle,
  HelpCircle,
  RefreshCw,
} from "lucide-react";
import { InternalAssessmentRubric, LessonPlan, LessonPlanRequest } from "../types.ts";
import { exportRubricToWordDoc } from "../data/storage.ts";

interface RubricModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
  formData: LessonPlanRequest;
  initialRubric?: InternalAssessmentRubric | null;
  onSaveToVault?: (rubric: InternalAssessmentRubric) => void;
}

export const RubricModal: React.FC<RubricModalProps> = ({
  isOpen,
  onClose,
  plan,
  formData,
  initialRubric,
  onSaveToVault,
}) => {
  const [rubric, setRubric] = useState<InternalAssessmentRubric | null>(initialRubric || null);
  const [componentType, setComponentType] = useState<
    "subject_enrichment_lab" | "portfolio_notebook" | "periodic_assessment" | "asl_oral_listening" | "project_work"
  >("subject_enrichment_lab");
  const [isLoading, setIsLoading] = useState(false);
  const [checkedItems, setCheckedItems] = useState<Record<number, boolean>>({});
  const [saveSuccess, setSaveSuccess] = useState(false);

  // If no rubric yet, generate on mount
  React.useEffect(() => {
    if (isOpen && !rubric && !isLoading) {
      handleGenerateRubric();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGenerateRubric(typeToUse = componentType) {
    setIsLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/generate-rubric", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          formData,
          componentType: typeToUse,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.rubric) {
          setRubric(data.rubric);
          if (onSaveToVault) {
            onSaveToVault(data.rubric);
          }
        }
      }
    } catch (err) {
      console.error("Failed to generate rubric:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function toggleCheck(idx: number) {
    setCheckedItems((prev) => ({ ...prev, [idx]: !prev[idx] }));
  }

  function handleSaveClick() {
    if (rubric && onSaveToVault) {
      onSaveToVault(rubric);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-800 to-teal-900 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Award className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wide">
                  Internal Assessment & Practical Scoring Rubric
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/30 text-emerald-200 border border-emerald-400/30">
                  CBSE / State Board 20-Mark Scheme
                </span>
              </div>
              <p className="text-xs sm:text-sm text-emerald-100/90 mt-0.5">
                NEP 2020 Continuous & Comprehensive Evaluation (CCE) 4-Level Performance Matrix
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Component Selector Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs font-bold text-slate-500 mr-1 uppercase tracking-wider">
                Assessment Component:
              </span>
              {[
                { id: "subject_enrichment_lab", label: "Lab Practical / Subject Enrichment" },
                { id: "portfolio_notebook", label: "Notebook & Student Portfolio" },
                { id: "periodic_assessment", label: "Periodic Test & Quizzes" },
                { id: "asl_oral_listening", label: "ASL / Oral Viva" },
                { id: "project_work", label: "Interdisciplinary Project" },
              ].map((comp) => (
                <button
                  key={comp.id}
                  onClick={() => {
                    const nextType = comp.id as any;
                    setComponentType(nextType);
                    handleGenerateRubric(nextType);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    componentType === comp.id
                      ? "bg-emerald-700 text-white shadow-sm font-semibold"
                      : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-100"
                  }`}
                >
                  {comp.label}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGenerateRubric()}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-emerald-600" : ""}`} />
                Regenerate
              </button>
              {rubric && (
                <>
                  <button
                    onClick={() => exportRubricToWordDoc(rubric)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Export Word
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-700 text-white hover:bg-emerald-800 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Rubric
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100 print:bg-white print:p-0">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <RefreshCw className="w-8 h-8 animate-spin text-emerald-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Generating Board-Compliant Assessment Rubric...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Aligning 4 performance tiers to CBSE CCE guidelines for {formData.grade} {formData.subject}
              </p>
            </div>
          ) : rubric ? (
            <div className="space-y-6 max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
              {/* Header Box */}
              <div className="border-b border-slate-200 pb-5 text-center sm:text-left sm:flex sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-xl font-bold font-serif text-slate-900">
                    {rubric.componentTitle}
                  </h3>
                  <div className="flex flex-wrap items-center gap-2 mt-2 text-xs text-slate-600">
                    <span className="font-semibold text-slate-800">Grade:</span> {rubric.grade}
                    <span>•</span>
                    <span className="font-semibold text-slate-800">Subject:</span> {rubric.subject}
                    <span>•</span>
                    <span className="font-semibold text-slate-800">Chapter:</span> {rubric.chapter}
                    <span>•</span>
                    <span className="font-semibold text-slate-800">Board:</span> {rubric.curriculum}
                  </div>
                </div>
                <div className="mt-3 sm:mt-0 text-center sm:text-right bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-2 shrink-0">
                  <div className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">Total Score</div>
                  <div className="text-2xl font-bold font-serif text-emerald-900">
                    {rubric.maxMarks} <span className="text-xs font-sans text-emerald-700">Marks</span>
                  </div>
                </div>
              </div>

              {/* 4-Tier Matrix Table */}
              <div className="overflow-x-auto rounded-xl border border-slate-200">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-800 text-white font-serif">
                      <th className="p-3 w-1/4 font-semibold border-r border-slate-700">
                        Evaluation Criterion
                      </th>
                      <th className="p-3 w-[18.75%] font-semibold border-r border-slate-700 bg-emerald-900/60">
                        Exemplary (90-100%)
                      </th>
                      <th className="p-3 w-[18.75%] font-semibold border-r border-slate-700 bg-blue-900/60">
                        Proficient (75-89%)
                      </th>
                      <th className="p-3 w-[18.75%] font-semibold border-r border-slate-700 bg-amber-900/60">
                        Developing (50-74%)
                      </th>
                      <th className="p-3 w-[18.75%] font-semibold bg-rose-900/60">
                        Beginning (&lt;50%)
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {rubric.criteria.map((crit, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                        <td className="p-3 font-semibold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                          <div className="text-sm font-bold text-slate-800">{crit.criterionName}</div>
                          <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-100 text-emerald-800">
                            {crit.marksAllocated} Marks
                          </span>
                        </td>
                        <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed bg-emerald-50/20">
                          {crit.exemplary}
                        </td>
                        <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed bg-blue-50/20">
                          {crit.proficient}
                        </td>
                        <td className="p-3 text-slate-700 border-r border-slate-200 leading-relaxed bg-amber-50/20">
                          {crit.developing}
                        </td>
                        <td className="p-3 text-slate-700 leading-relaxed bg-rose-50/20">
                          {crit.beginning}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Suggested Activities */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-emerald-900 font-bold text-sm">
                    <BookOpen className="w-4 h-4 text-emerald-700" />
                    Recommended Classroom Tasks & Lab Practical
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {rubric.suggestedActivities.map((act, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded-full bg-emerald-200 text-emerald-900 flex items-center justify-center font-bold text-[10px] shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span>{act}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Teacher Observation Checklist */}
                <div className="bg-blue-50/60 border border-blue-200/80 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-blue-900 font-bold text-sm">
                    <ClipboardList className="w-4 h-4 text-blue-700" />
                    Teacher Practical Record & Portfolio Checklist
                  </div>
                  <ul className="space-y-2 text-xs text-slate-700">
                    {rubric.teacherObservationChecklist.map((item, i) => (
                      <li
                        key={i}
                        onClick={() => toggleCheck(i)}
                        className="flex items-start gap-2 cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          checked={!!checkedItems[i]}
                          onChange={() => toggleCheck(i)}
                          className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                        />
                        <span className={checkedItems[i] ? "line-through text-slate-400" : "text-slate-700"}>
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* CBSE Guidelines Note */}
              <div className="p-3.5 rounded-xl bg-amber-50/80 border border-amber-200 flex items-start gap-3">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-900 leading-relaxed">
                  <strong className="font-semibold">Board Compliance: </strong>
                  {rubric.cbseGuidelinesNote}
                </p>
              </div>

              {/* Signatures for Official Record */}
              <div className="hidden print:grid grid-cols-2 pt-10 text-xs text-slate-700">
                <div>
                  <div className="border-t border-slate-400 w-48 pt-1">
                    Subject Teacher Signature & Date
                  </div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-400 w-48 pt-1 ml-auto">
                    Principal / External Examiner Signature
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No rubric generated. Click regenerate to create one.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Rubric saved to your Vault!
              </span>
            ) : (
              "Internal Assessment scores are verifiable by Board inspection teams."
            )}
          </div>
          <div className="flex items-center gap-2">
            {rubric && onSaveToVault && (
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100 transition-colors"
              >
                Save to Lesson Vault
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-800 text-white hover:bg-slate-900 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
