import React, { useState } from "react";
import {
  X,
  Printer,
  FileDown,
  Calendar,
  Layers,
  Clock,
  CheckCircle2,
  RefreshCw,
  BookOpen,
  Milestone,
  Lightbulb,
} from "lucide-react";
import { AcademicSyllabusPlanner, LessonPlan, LessonPlanRequest } from "../types.ts";
import { exportSyllabusPlannerToWordDoc } from "../data/storage.ts";

interface SyllabusPlannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan;
  formData: LessonPlanRequest;
  initialPlanner?: AcademicSyllabusPlanner | null;
  onSaveToVault?: (planner: AcademicSyllabusPlanner) => void;
}

export const SyllabusPlannerModal: React.FC<SyllabusPlannerModalProps> = ({
  isOpen,
  onClose,
  plan,
  formData,
  initialPlanner,
  onSaveToVault,
}) => {
  const [planner, setPlanner] = useState<AcademicSyllabusPlanner | null>(initialPlanner || null);
  const [academicYear, setAcademicYear] = useState("2025-2026");
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"units" | "milestones" | "pedagogy">("units");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Generate on mount if none
  React.useEffect(() => {
    if (isOpen && !planner && !isLoading) {
      handleGeneratePlanner();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  async function handleGeneratePlanner(yearToUse = academicYear) {
    setIsLoading(true);
    setSaveSuccess(false);
    try {
      const res = await fetch("/api/generate-syllabus-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          formData,
          academicYear: yearToUse,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.planner) {
          setPlanner(data.planner);
          if (onSaveToVault) {
            onSaveToVault(data.planner);
          }
        }
      }
    } catch (err) {
      console.error("Failed to generate syllabus plan:", err);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSaveClick() {
    if (planner && onSaveToVault) {
      onSaveToVault(planner);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/70 p-3 sm:p-5 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-4 sm:p-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Calendar className="w-6 h-6 text-blue-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-xl font-bold font-serif tracking-wide">
                  Yearly &amp; Term-Wise Syllabus Distribution Planner
                </h2>
                <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-500/30 text-blue-200 border border-blue-400/30">
                  30-Week Academic Blueprint
                </span>
              </div>
              <p className="text-xs sm:text-sm text-blue-100/90 mt-0.5">
                Instructional period allocation, exam milestones, and NEP 2020 pedagogical tracking
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

        {/* Action / Selector Bar */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-3 shrink-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Academic Session Selector */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Session:</span>
              <select
                value={academicYear}
                onChange={(e) => {
                  const newYear = e.target.value;
                  setAcademicYear(newYear);
                  handleGeneratePlanner(newYear);
                }}
                className="text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-1.5 text-slate-800 focus:ring-2 focus:ring-blue-500"
              >
                <option value="2025-2026">2025 - 2026 Academic Year</option>
                <option value="2026-2027">2026 - 2027 Academic Year</option>
                <option value="2024-2025">2024 - 2025 Academic Year</option>
              </select>

              {/* View Tabs */}
              <div className="hidden sm:flex items-center gap-1 ml-4 bg-slate-200/70 p-1 rounded-lg">
                {[
                  { id: "units", label: "Unit Breakdown" },
                  { id: "milestones", label: "Exam Milestones" },
                  { id: "pedagogy", label: "Pedagogical Guidelines" },
                ].map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTab(t.id as any)}
                    className={`px-3 py-1 text-xs rounded-md transition-all ${
                      activeTab === t.id
                        ? "bg-white text-blue-900 font-bold shadow-sm"
                        : "text-slate-600 hover:text-slate-900"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleGeneratePlanner()}
                disabled={isLoading}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? "animate-spin text-blue-600" : ""}`} />
                Regenerate
              </button>
              {planner && (
                <>
                  <button
                    onClick={() => exportSyllabusPlannerToWordDoc(planner)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-900 transition-colors shadow-sm"
                  >
                    <FileDown className="w-3.5 h-3.5" />
                    Export Word
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-blue-700 text-white hover:bg-blue-800 transition-colors shadow-sm"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    Print Plan
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
              <RefreshCw className="w-8 h-8 animate-spin text-blue-600 mb-3" />
              <p className="text-sm font-semibold text-slate-700">
                Synthesizing Annual Academic Syllabus Distribution...
              </p>
              <p className="text-xs text-slate-400 mt-1">
                Calculating theory periods, buffer weeks, and term weightages for {formData.grade} {formData.subject}
              </p>
            </div>
          ) : planner ? (
            <div className="space-y-6 max-w-4xl mx-auto bg-white p-6 sm:p-8 rounded-xl border border-slate-200 shadow-sm print:border-none print:shadow-none">
              {/* Top Overview Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-blue-50/80 border border-blue-200 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-blue-800 uppercase tracking-wider">Total Periods</div>
                  <div className="text-2xl font-bold font-serif text-blue-950 mt-0.5">
                    {planner.totalInstructionalPeriods}
                  </div>
                  <div className="text-[10px] text-blue-600 mt-0.5">~30 Teaching Weeks</div>
                </div>

                <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider">Theory Teaching</div>
                  <div className="text-2xl font-bold font-serif text-emerald-950 mt-0.5">
                    {planner.theoryPeriods}
                  </div>
                  <div className="text-[10px] text-emerald-600 mt-0.5">Core Content Delivery</div>
                </div>

                <div className="bg-amber-50/80 border border-amber-200 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-amber-800 uppercase tracking-wider">Revision &amp; Buffers</div>
                  <div className="text-2xl font-bold font-serif text-amber-950 mt-0.5">
                    {planner.revisionAndBufferPeriods}
                  </div>
                  <div className="text-[10px] text-amber-600 mt-0.5">Mock Tests &amp; Remedial</div>
                </div>

                <div className="bg-purple-50/80 border border-purple-200 rounded-xl p-3 text-center">
                  <div className="text-[11px] font-bold text-purple-800 uppercase tracking-wider">Evaluation Marks</div>
                  <div className="text-xl font-bold font-serif text-purple-950 mt-0.5">
                    80 <span className="text-xs font-normal">Th</span> + 20 <span className="text-xs font-normal">Int</span>
                  </div>
                  <div className="text-[10px] text-purple-600 mt-0.5">100 Marks Total</div>
                </div>
              </div>

              {/* Title & Subject Info */}
              <div className="border-b border-slate-200 pb-3 flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold font-serif text-slate-900">
                    Annual Curriculum Timeline: {planner.subject} ({planner.grade})
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Affiliated to {planner.curriculum} • Academic Session {planner.academicYear}
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-semibold">
                    Term 1: {planner.term1WeightageMarks}M
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                    Term 2: {planner.term2WeightageMarks}M
                  </span>
                </div>
              </div>

              {/* View 1: Unit Breakdown Table */}
              <div className={activeTab === "units" ? "block" : "hidden sm:block"}>
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-800 text-white font-serif">
                        <th className="p-2.5 w-12 text-center font-semibold border-r border-slate-700">Unit</th>
                        <th className="p-2.5 w-1/3 font-semibold border-r border-slate-700">Unit Title &amp; Chapters</th>
                        <th className="p-2.5 w-20 text-center font-semibold border-r border-slate-700">Term &amp; Month</th>
                        <th className="p-2.5 w-20 text-center font-semibold border-r border-slate-700">Periods</th>
                        <th className="p-2.5 w-24 text-center font-semibold border-r border-slate-700">Marks</th>
                        <th className="p-2.5 font-semibold">Key Competencies &amp; Assessment</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {planner.units.map((unit, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? "bg-white" : "bg-slate-50/70"}>
                          <td className="p-2.5 text-center font-bold text-slate-900 border-r border-slate-200 bg-slate-50/50">
                            {unit.unitNumber}
                          </td>
                          <td className="p-2.5 text-slate-800 border-r border-slate-200">
                            <div className="font-bold text-slate-900 text-xs">{unit.unitTitle}</div>
                            <div className="text-[11px] text-slate-500 mt-1">
                              {unit.chapters.join(" • ")}
                            </div>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200 whitespace-nowrap">
                            <span className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-800">
                              {unit.term}
                            </span>
                            <div className="text-[11px] text-slate-600 font-medium mt-1">{unit.scheduledMonth}</div>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <div className="font-bold text-slate-900">{unit.suggestedPeriods}</div>
                            <div className="text-[10px] text-slate-500">Periods</div>
                          </td>
                          <td className="p-2.5 text-center border-r border-slate-200">
                            <div className="font-bold text-blue-900">{unit.theoryMarks}M <span className="text-[10px] text-slate-500 font-normal">Th</span></div>
                            <div className="text-[10px] text-emerald-700 font-medium">+{unit.practicalOrInternalMarks}M Int</div>
                          </td>
                          <td className="p-2.5 text-slate-700">
                            <div className="inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-800 border border-blue-200 mb-1">
                              {unit.assessmentType}
                            </div>
                            <ul className="text-[10.5px] text-slate-600 space-y-0.5 list-disc list-inside">
                              {unit.keyCompetencies.map((comp, ci) => (
                                <li key={ci}>{comp}</li>
                              ))}
                            </ul>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* View 2: Scheduled Examination Milestones */}
              <div className={activeTab === "milestones" ? "block" : "hidden sm:block mt-6"}>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-3 text-slate-900 font-bold text-sm">
                    <Milestone className="w-4 h-4 text-indigo-700" />
                    Scheduled Examination Milestones &amp; Portion Breakdown
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {planner.examMilestones.map((milestone, idx) => (
                      <div key={idx} className="bg-white border border-slate-200 rounded-lg p-3 shadow-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-xs text-indigo-900">{milestone.examName}</span>
                          <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                            {milestone.month}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600 mt-2">
                          <strong className="text-slate-700">Portion:</strong> {milestone.portionCovered}
                        </div>
                        <div className="text-[10px] text-slate-500 mt-1 font-medium">
                          <strong>Weightage:</strong> {milestone.weightage}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* View 3: Pedagogical Guidelines */}
              <div className={activeTab === "pedagogy" ? "block" : "hidden sm:block mt-6"}>
                <div className="bg-amber-50/70 border border-amber-200 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2 text-amber-900 font-bold text-sm">
                    <Lightbulb className="w-4 h-4 text-amber-700" />
                    NEP 2020 Pedagogical &amp; Delivery Recommendations
                  </div>
                  <ul className="space-y-2 text-xs text-amber-950">
                    {planner.pedagogicalGuidelines.map((guide, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-amber-700 mt-0.5 shrink-0" />
                        <span>{guide}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Signatures for Official Record */}
              <div className="hidden print:grid grid-cols-2 pt-10 text-xs text-slate-700">
                <div>
                  <div className="border-t border-slate-400 w-48 pt-1">
                    Subject Teacher Signature &amp; Date
                  </div>
                </div>
                <div className="text-right">
                  <div className="border-t border-slate-400 w-48 pt-1 ml-auto">
                    Head of Department / Principal Approval
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              No planner generated. Click regenerate to create one.
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0">
          <div className="text-xs text-slate-500">
            {saveSuccess ? (
              <span className="text-emerald-600 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> Syllabus plan saved to your Vault!
              </span>
            ) : (
              "Structured around 30 academic weeks with mandatory buffer periods for board preparation."
            )}
          </div>
          <div className="flex items-center gap-2">
            {planner && onSaveToVault && (
              <button
                onClick={handleSaveClick}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-blue-50 text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
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
