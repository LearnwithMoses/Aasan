import React, { useState, useEffect } from "react";
import {
  X,
  Printer,
  Copy,
  Check,
  Sparkles,
  Award,
  AlertTriangle,
  BookOpen,
  Layers,
  Flame,
  FileDown,
  GraduationCap,
  CheckCircle2,
  FolderHeart,
  HelpCircle,
  Clock,
  FileText,
  Search,
  Filter,
  Scissors,
  LayoutGrid,
} from "lucide-react";
import { QuestionPaper, LessonPlan, LessonPlanRequest, UserProfile } from "../types.ts";
import { PAST_BOARD_QUESTIONS_DATA } from "../data/pastBoardQuestionsData.ts";
import { exportQuestionPaperToWordDoc, savePlanToVault } from "../data/storage.ts";

interface QuestionPaperModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: LessonPlan | null;
  formData: LessonPlanRequest;
  userProfile: UserProfile | null;
  isPro: boolean;
  onOpenUpgrade: () => void;
  onSaveToVaultNotification?: () => void;
}

export const QuestionPaperModal: React.FC<QuestionPaperModalProps> = ({
  isOpen,
  onClose,
  plan,
  formData,
  userProfile,
  isPro,
  onOpenUpgrade,
  onSaveToVaultNotification,
}) => {
  const [activeTab, setActiveTab] = useState<"generator" | "past_bank">("generator");
  const [examType, setExamType] = useState<"slip_test_20" | "unit_test_40" | "term_exam_50" | "board_model_80">("slip_test_20");
  const [difficulty, setDifficulty] = useState<string>("Standard Board Level");
  const [schoolName, setSchoolName] = useState<string>(userProfile?.school || "St. Joseph's Model Secondary School");
  const [includePastBoardQuestions, setIncludePastBoardQuestions] = useState<boolean>(true);
  const [showAnswerKey, setShowAnswerKey] = useState<boolean>(false);
  const [showBlueprint, setShowBlueprint] = useState<boolean>(true);
  const [miniSlipMode, setMiniSlipMode] = useState<"standard" | "2_up" | "4_up">("standard");

  // Question paper state
  const [paper, setPaper] = useState<QuestionPaper | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [savedVault, setSavedVault] = useState<boolean>(false);

  // Past board bank filter state
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedPyqId, setCopiedPyqId] = useState<string | null>(null);

  useEffect(() => {
    if (userProfile?.school && (!schoolName || schoolName === "St. Joseph's Model Secondary School")) {
      setSchoolName(userProfile.school);
    }
  }, [userProfile]);

  // Set default subject filter when modal opens based on current subject
  useEffect(() => {
    if (formData.subject) {
      const s = formData.subject.toLowerCase();
      if (s.includes("tamil")) setSelectedSubjectFilter("Tamil (தமிழ்)");
      else if (s.includes("kannada")) setSelectedSubjectFilter("Kannada (ಕನ್ನಡ)");
      else if (s.includes("hindi")) setSelectedSubjectFilter("Hindi (हिन्दी)");
      else if (s.includes("malayalam")) setSelectedSubjectFilter("Malayalam (മലയാളം)");
      else if (s.includes("math")) setSelectedSubjectFilter("Mathematics");
      else if (s.includes("science") || s.includes("physics") || s.includes("chemistry") || s.includes("bio")) setSelectedSubjectFilter("Science (General)");
      else if (s.includes("social") || s.includes("history")) setSelectedSubjectFilter("Social Science");
      else if (s.includes("english")) setSelectedSubjectFilter("English Language & Literature");
      else setSelectedSubjectFilter("All");
    }
  }, [formData.subject, isOpen]);

  if (!isOpen) return null;

  const handleGeneratePaper = async () => {
    if (!isPro) {
      onOpenUpgrade();
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/generate-question-paper", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          formData,
          schoolName: schoolName.trim() || "School Examination Board",
          examType,
          difficulty,
          includePastBoardQuestions,
        }),
      });

      if (!res.ok) throw new Error("Failed to generate question paper.");
      const data = await res.json();
      if (data.paper) {
        setPaper(data.paper);
      } else {
        throw new Error("Invalid response format.");
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Error generating question paper";
      setError(msg);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportWord = () => {
    if (!paper) return;
    exportQuestionPaperToWordDoc(paper, showAnswerKey);
  };

  const handleCopyPaper = () => {
    if (!paper) return;

    let text = `${paper.schoolName.toUpperCase()}\n`;
    text += `${paper.examTypeName}\n`;
    text += `Class: ${paper.grade} | Subject: ${paper.subject} | Time: ${paper.durationMinutes} Mins | Max Marks: ${paper.totalMarks}\n`;
    text += `Topic / Portion: ${paper.topic}\n`;
    text += `\nGENERAL INSTRUCTIONS:\n`;
    paper.generalInstructions.forEach((ins, idx) => {
      text += `${idx + 1}. ${ins}\n`;
    });

    paper.sections.forEach((sec) => {
      text += `\n==============================\n${sec.sectionName.toUpperCase()}\n==============================\n`;
      if (sec.description) text += `(${sec.description})\n\n`;

      sec.questions.forEach((q) => {
        text += `${q.qNumber}. ${q.questionText} [${q.marks} Mark${q.marks > 1 ? "s" : ""}]\n`;
        if (q.isPastBoardQuestion) text += `   (Past Board Exam Question: ${q.pastBoardYears || "Repeated"})\n`;
        if (q.options && q.options.length > 0) {
          q.options.forEach((opt) => {
            text += `   ${opt}\n`;
          });
        }
        if (q.internalChoice) {
          text += `   --- (OR) ---\n   ${q.internalChoice}\n`;
        }
        if (showAnswerKey && q.answerKey) {
          text += `   [ANSWER KEY]: ${q.answerKey}\n`;
          if (q.stepMarking) text += `   [STEP MARKING]: ${q.stepMarking.join(" | ")}\n`;
        }
        text += `\n`;
      });
    });

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSaveToVault = () => {
    if (!paper || !plan) return;
    savePlanToVault(plan, formData, undefined, undefined, undefined, paper);
    setSavedVault(true);
    if (onSaveToVaultNotification) onSaveToVaultNotification();
    setTimeout(() => setSavedVault(false), 2500);
  };

  // Filtered past board questions
  const filteredPastQuestions = PAST_BOARD_QUESTIONS_DATA.filter((item) => {
    const matchesSubject =
      selectedSubjectFilter === "All" ||
      (selectedSubjectFilter === "Competitive Foundation" &&
        (item.category?.includes("Competitive") || item.grade === "Class 11" || item.grade === "Class 12")) ||
      (selectedSubjectFilter === "Physics (11/12)" && item.subject.toLowerCase().includes("physics")) ||
      (selectedSubjectFilter === "Chemistry (11/12)" && item.subject.toLowerCase().includes("chemistry")) ||
      (selectedSubjectFilter === "Biology (11/12)" && item.subject.toLowerCase().includes("biology")) ||
      (selectedSubjectFilter === "Maths (11/12)" &&
        item.subject.toLowerCase().includes("math") &&
        (item.grade === "Class 11" || item.grade === "Class 12")) ||
      item.subject.toLowerCase().includes(selectedSubjectFilter.toLowerCase()) ||
      selectedSubjectFilter.toLowerCase().includes(item.subject.toLowerCase());

    const matchesSearch =
      !searchQuery ||
      item.topic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.yearRepeated.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesSubject && matchesSearch;
  });

  // Render individual slip card for 2-up / 4-up printable layouts
  const renderSingleSlipCard = (copyIdx: number, totalCopies: number) => {
    const allQuestions = paper ? paper.sections.flatMap((s) => s.questions) : [];

    return (
      <div className="bg-white border-2 border-slate-800 rounded-lg p-3 sm:p-4 text-slate-900 flex flex-col justify-between text-xs print:p-2">
        <div>
          {/* Slip Header */}
          <div className="text-center border-b border-slate-800 pb-2 mb-2">
            <div className="text-xs sm:text-sm font-black uppercase tracking-wider text-slate-900">
              {paper?.schoolName}
            </div>
            <div className="text-[11px] font-bold text-slate-700">
              {paper?.examTypeName} • {paper?.grade} ({paper?.subject})
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              Topic: {paper?.topic} • Max Marks: {paper?.totalMarks}M • Time: {paper?.durationMinutes}m
            </div>
          </div>

          {/* Student Info */}
          <div className="flex flex-wrap justify-between items-center text-[10.5px] font-semibold text-slate-700 mb-2 border-b border-dashed border-slate-300 pb-1.5 gap-1">
            <span>Name: _______________________________</span>
            <span>Roll No: _________</span>
            <span>Date: __________</span>
          </div>

          {/* Teacher Correction & Marks Grid */}
          <div className="mb-2 bg-slate-50 border border-slate-300 rounded overflow-x-auto">
            <table className="w-full text-center text-[10px] border-collapse">
              <thead>
                <tr className="bg-slate-200 font-bold border-b border-slate-300 text-slate-800">
                  <th className="p-1 border-r border-slate-300 w-12">Q.No</th>
                  {allQuestions.slice(0, 8).map((q, idx) => (
                    <th key={idx} className="p-1 border-r border-slate-300">
                      Q{q.qNumber}
                    </th>
                  ))}
                  <th className="p-1 border-r border-slate-300 bg-purple-100 text-purple-900 w-16">
                    Total
                  </th>
                  <th className="p-1 w-20">Sign</th>
                </tr>
              </thead>
              <tbody>
                <tr className="h-6">
                  <td className="p-1 font-bold border-r border-slate-300 bg-slate-100 text-[9.5px]">
                    Marks
                  </td>
                  {allQuestions.slice(0, 8).map((_, idx) => (
                    <td key={idx} className="p-1 border-r border-slate-300"></td>
                  ))}
                  <td className="p-1 border-r border-slate-300 font-bold text-purple-900">
                    &nbsp;&nbsp;&nbsp;/{paper?.totalMarks}
                  </td>
                  <td className="p-1"></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Questions */}
          <div className="space-y-2 mt-2">
            {paper?.sections.map((sec, sIdx) => (
              <div key={sIdx} className="space-y-1">
                <div className="text-[10px] font-bold text-slate-700 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                  {sec.sectionName}
                </div>
                {sec.questions.map((q, qIdx) => (
                  <div key={qIdx} className="text-[10.5px] leading-tight flex items-start gap-1">
                    <span className="font-bold text-slate-900 shrink-0 w-4">{q.qNumber}.</span>
                    <div className="flex-1">
                      <span>{q.questionText}</span>
                      <span className="ml-1 text-[9.5px] font-bold text-purple-800">[{q.marks}M]</span>
                      {q.options && q.options.length > 0 && (
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-0.5 text-[9.5px] text-slate-700">
                          {q.options.map((opt, oIdx) => (
                            <div key={oIdx}>{opt}</div>
                          ))}
                        </div>
                      )}
                      {q.internalChoice && (
                        <div className="text-[9.5px] text-purple-700 italic mt-0.5">{q.internalChoice}</div>
                      )}
                      {showAnswerKey && (
                        <div className="mt-1 p-1 rounded bg-emerald-50 text-emerald-900 text-[9.5px]">
                          <strong>Key:</strong> {q.answerKey}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        <div className="text-[9px] text-slate-400 text-center mt-3 pt-1 border-t border-dashed border-slate-200">
          Slip Copy {copyIdx} of {totalCopies} • Official Academic Slip Test
        </div>
      </div>
    );
  };

  return (
    <div
      id="question-paper-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-xs overflow-y-auto"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[92vh] flex flex-col border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Modal Header */}
        <div className="bg-[#101827] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-400/30 flex items-center justify-center text-purple-300">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-extrabold tracking-tight text-white">
                  Board Exam Question Paper & Blueprint
                </h3>
                <span className="text-[10px] bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-black px-2 py-0.5 rounded-full uppercase tracking-wider">
                  PRO FEATURE
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Generate official Indian Board question papers (20/40/50/80 Marks) & access past 10-year repeated questions
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="bg-slate-50 border-b border-slate-200 px-4 sm:px-6 py-2 flex items-center justify-between gap-3 shrink-0 flex-wrap">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("generator")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "generator"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Question Paper Generator</span>
            </button>

            <button
              onClick={() => setActiveTab("past_bank")}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-bold transition ${
                activeTab === "past_bank"
                  ? "bg-purple-600 text-white shadow-xs"
                  : "bg-white text-slate-600 hover:bg-slate-100 border border-slate-200"
              }`}
            >
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Past 10 Years High-Yield Board Bank</span>
              <span className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0.2 rounded font-black">
                PYQ
              </span>
            </button>
          </div>

          {/* Quick Info Pill */}
          <div className="hidden sm:flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span>
              {formData.grade || "Class 10"} • {formData.subject || "Subject"}
            </span>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-4 sm:p-6 flex-1 space-y-6">
          {/* TAB 1: GENERATOR */}
          {activeTab === "generator" && (
            <div className="space-y-6">
              {/* Configuration Box */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 sm:p-5">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-purple-600" />
                  <span>Configure Examination Parameters</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                  {/* Exam Type */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Exam Type & Marks</label>
                    <select
                      value={examType}
                      onChange={(e) => setExamType(e.target.value as any)}
                      className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="slip_test_20">Slip Test / Class Test (20 Marks · 40m)</option>
                      <option value="unit_test_40">Periodic / Unit Test (40 Marks · 90m)</option>
                      <option value="term_exam_50">Mid-Term / Half-Yearly (50 Marks · 2h)</option>
                      <option value="board_model_80">Board Model Exam (80 Marks · 3h)</option>
                    </select>
                  </div>

                  {/* Difficulty Focus */}
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">Difficulty & Pattern</label>
                    <select
                      value={difficulty}
                      onChange={(e) => setDifficulty(e.target.value)}
                      className="w-full text-xs font-semibold bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="Standard Board Level">Standard Board Level (Balanced)</option>
                      <option value="Competency & Application (NEP 2020)">Competency & Real-Life (NEP 2020)</option>
                      <option value="Challenging / HOTS Board Level">Challenging / High-Scorer (HOTS)</option>
                      <option value="Remedial / Foundation Level">Remedial / Slow Learners Friendly</option>
                    </select>
                  </div>

                  {/* School Name */}
                  <div className="sm:col-span-2">
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">School / Institution Name (For Paper Header)</label>
                    <input
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      placeholder="e.g. St. Joseph's Higher Secondary School"
                      className="w-full text-xs font-medium bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-slate-800 focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                {/* Additional Checkbox & Generate Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-200">
                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-700 select-none">
                    <input
                      type="checkbox"
                      checked={includePastBoardQuestions}
                      onChange={(e) => setIncludePastBoardQuestions(e.target.checked)}
                      className="rounded text-purple-600 focus:ring-purple-500 w-4 h-4"
                    />
                    <span className="flex items-center gap-1">
                      <span>Prioritize Past 10-Year Repeated Board Questions</span>
                      <span className="text-[10px] bg-purple-100 text-purple-800 font-bold px-1 rounded">Recommended</span>
                    </span>
                  </label>

                  <button
                    onClick={handleGeneratePaper}
                    disabled={isLoading}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold shadow-md transition disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Crafting Official Paper & Blueprint...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4" />
                        <span>{paper ? "Regenerate Question Paper" : "Generate Question Paper"}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-medium flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Paper Output Container */}
              {paper ? (
                <div className="space-y-4">
                  {/* Action Bar */}
                  <div className="no-print flex items-center justify-between gap-2 flex-wrap bg-slate-100 p-2.5 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setShowAnswerKey(!showAnswerKey)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          showAnswerKey
                            ? "bg-emerald-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        }`}
                        title="Toggle teacher answer key & step marking"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{showAnswerKey ? "Hide Answer Key" : "Show Teacher's Answer Key"}</span>
                      </button>

                      <button
                        onClick={() => setShowBlueprint(!showBlueprint)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition ${
                          showBlueprint
                            ? "bg-indigo-600 text-white shadow-xs"
                            : "bg-white text-slate-700 border border-slate-300 hover:bg-slate-50"
                        }`}
                      >
                        <Award className="w-3.5 h-3.5" />
                        <span>{showBlueprint ? "Hide Blueprint" : "Show NEP Blueprint"}</span>
                      </button>
                    </div>

                    {/* Print Layout Selector */}
                    <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-slate-300 text-xs">
                      <span className="text-[10px] font-bold text-slate-500 px-1 uppercase tracking-wider">Layout:</span>
                      <button
                        onClick={() => setMiniSlipMode("standard")}
                        className={`px-2 py-1 rounded text-xs font-semibold transition ${
                          miniSlipMode === "standard"
                            ? "bg-slate-800 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                      >
                        Full A4
                      </button>
                      <button
                        onClick={() => setMiniSlipMode("2_up")}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition ${
                          miniSlipMode === "2_up"
                            ? "bg-purple-700 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Print 2 identical weekly slip-test papers on 1 A4 sheet to save school paper"
                      >
                        <Scissors className="w-3 h-3" />
                        <span>2-Up Slips</span>
                      </button>
                      <button
                        onClick={() => setMiniSlipMode("4_up")}
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-semibold transition ${
                          miniSlipMode === "4_up"
                            ? "bg-purple-700 text-white shadow-xs"
                            : "text-slate-600 hover:text-slate-900"
                        }`}
                        title="Print 4 compact mini slip tests in a 2x2 grid on 1 A4 sheet"
                      >
                        <LayoutGrid className="w-3 h-3" />
                        <span>4-Up Quad</span>
                      </button>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={handleCopyPaper}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                      >
                        {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        <span>{copied ? "Copied!" : "Copy Text"}</span>
                      </button>

                      <button
                        onClick={handleExportWord}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                        title="Export clean editable Microsoft Word document"
                      >
                        <FileDown className="w-3.5 h-3.5 text-blue-600" />
                        <span>Word (.doc)</span>
                      </button>

                      <button
                        onClick={handleSaveToVault}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-bold bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 transition"
                        title="Save to My Lesson Vault"
                      >
                        <FolderHeart className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{savedVault ? "Saved!" : "Save Vault"}</span>
                      </button>

                      <button
                        onClick={handlePrint}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-[#101827] text-white hover:bg-slate-800 transition shadow-xs"
                      >
                        <Printer className="w-3.5 h-3.5 text-purple-300" />
                        <span>Print A4</span>
                      </button>
                    </div>
                  </div>

                  {/* Printable Paper Area */}
                  <div
                    id="printable-question-paper"
                    className="bg-white border border-slate-300 rounded-xl p-4 sm:p-8 shadow-xs space-y-6 text-[#172033]"
                  >
                    {miniSlipMode === "2_up" ? (
                      <div className="space-y-6">
                        <div className="no-print p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                          <Scissors className="w-4 h-4 text-purple-700" />
                          <span>
                            <strong>2-Up Slip Test Mode:</strong> Two identical test copies are formatted on this A4 sheet. Includes student details and a teacher marks correction grid.
                          </span>
                        </div>
                        {renderSingleSlipCard(1, 2)}
                        <div className="py-2 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono font-bold select-none border-y-2 border-dashed border-slate-400 my-4">
                          <Scissors className="w-4 h-4" />
                          <span>- - - - - - - - - - - - - - - - - - CUT HERE (2-UP A4 TEST SLIPS) - - - - - - - - - - - - - - - - - -</span>
                          <Scissors className="w-4 h-4 rotate-180" />
                        </div>
                        {renderSingleSlipCard(2, 2)}
                      </div>
                    ) : miniSlipMode === "4_up" ? (
                      <div>
                        <div className="no-print mb-4 p-2 rounded-lg bg-purple-50 border border-purple-200 text-xs text-purple-900 flex items-center gap-2">
                          <LayoutGrid className="w-4 h-4 text-purple-700" />
                          <span>
                            <strong>4-Up Quad Mode:</strong> Four compact 20-mark weekly slip tests in 2x2 grid. Perfect for rapid diagnostic classroom checks.
                          </span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          {renderSingleSlipCard(1, 4)}
                          {renderSingleSlipCard(2, 4)}
                          <div className="col-span-full py-2 flex items-center justify-center gap-2 text-slate-500 text-xs font-mono font-bold select-none border-y-2 border-dashed border-slate-400">
                            <Scissors className="w-4 h-4" />
                            <span>- - - - - - - - - - - - - - - - - - CUT HORIZONTALLY - - - - - - - - - - - - - - - - - -</span>
                            <Scissors className="w-4 h-4 rotate-180" />
                          </div>
                          {renderSingleSlipCard(3, 4)}
                          {renderSingleSlipCard(4, 4)}
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Official Exam Header */}
                        <div className="text-center border-b-2 border-slate-800 pb-4">
                      <h2 className="text-lg sm:text-xl font-extrabold uppercase tracking-wide text-slate-900">
                        {paper.schoolName}
                      </h2>
                      <h3 className="text-sm font-bold text-slate-700 mt-0.5">{paper.examTypeName}</h3>

                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-4 text-xs text-left bg-slate-50 p-3 rounded-lg border border-slate-200">
                        <div>
                          <span className="font-bold text-slate-600">Class: </span>
                          <span className="font-semibold text-slate-900">{paper.grade}</span>
                        </div>
                        <div>
                          <span className="font-bold text-slate-600">Subject: </span>
                          <span className="font-semibold text-slate-900">{paper.subject}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="font-bold text-slate-600">Max Marks: </span>
                          <span className="font-bold text-purple-700">{paper.totalMarks} Marks</span>
                        </div>
                        <div className="col-span-2 sm:col-span-2">
                          <span className="font-bold text-slate-600">Portion / Topic: </span>
                          <span className="font-medium text-slate-800">{paper.topic}</span>
                        </div>
                        <div className="sm:text-right">
                          <span className="font-bold text-slate-600">Duration: </span>
                          <span className="font-medium text-slate-800">{paper.durationMinutes} Minutes</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs text-slate-500 mt-3 pt-2 border-t border-dashed border-slate-200">
                        <span>Candidate Name: ________________________________</span>
                        <span>Roll No: ________________</span>
                      </div>
                    </div>

                    {/* General Instructions */}
                    <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-xs text-amber-900 space-y-1">
                      <div className="font-bold text-amber-950 flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>General Instructions:</span>
                      </div>
                      <ol className="list-decimal list-inside space-y-0.5 text-slate-700 pl-1 text-[11.5px]">
                        {paper.generalInstructions.map((ins, idx) => (
                          <li key={idx}>{ins}</li>
                        ))}
                      </ol>
                    </div>

                    {/* Sections */}
                    {paper.sections.map((sec, sIdx) => (
                      <div key={sIdx} className="space-y-4 pt-2">
                        <div className="bg-slate-100 border border-slate-300 py-1.5 px-3 rounded-lg text-center">
                          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-800">
                            {sec.sectionName}
                          </h4>
                          {sec.description && (
                            <p className="text-[11px] text-slate-600 italic mt-0.5">({sec.description})</p>
                          )}
                        </div>

                        <div className="space-y-4 pl-1">
                          {sec.questions.map((q, qIdx) => (
                            <div key={qIdx} className="text-xs space-y-1.5">
                              <div className="flex items-start justify-between gap-2">
                                <div className="flex items-start gap-2 flex-1">
                                  <span className="font-bold text-slate-900 shrink-0 w-6">{q.qNumber}.</span>
                                  <div className="flex-1">
                                    {q.isPastBoardQuestion && (
                                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-purple-100 text-purple-900 border border-purple-200 px-1.5 py-0.2 rounded mr-1.5">
                                        <Award className="w-2.5 h-2.5 text-purple-700" />
                                        <span>Past Board ({q.pastBoardYears || "Repeated"})</span>
                                      </span>
                                    )}
                                    <span className="font-medium text-slate-900 leading-relaxed">
                                      {q.questionText}
                                    </span>
                                  </div>
                                </div>
                                <span className="font-bold text-slate-700 bg-slate-100 px-1.5 py-0.5 rounded text-[11px] shrink-0">
                                  [{q.marks} Mark{q.marks > 1 ? "s" : ""}]
                                </span>
                              </div>

                              {/* MCQ Options */}
                              {q.options && q.options.length > 0 && (
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 pl-8 pt-1">
                                  {q.options.map((opt, oIdx) => (
                                    <div
                                      key={oIdx}
                                      className="p-1.5 rounded bg-slate-50 border border-slate-200 text-slate-700 text-[11.5px]"
                                    >
                                      {opt}
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Internal Choice (OR) */}
                              {q.internalChoice && (
                                <div className="pl-8 pt-1 text-slate-600">
                                  <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 my-1 text-center">
                                    --- OR ---
                                  </div>
                                  <p className="italic bg-slate-50 p-2 rounded border border-slate-200 text-slate-800">
                                    {q.internalChoice}
                                  </p>
                                </div>
                              )}

                              {/* Teacher Answer Key Box */}
                              {showAnswerKey && q.answerKey && (
                                <div className="ml-8 mt-2 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-[11.5px] space-y-1">
                                  <div className="font-bold flex items-center gap-1 text-emerald-950">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                    <span>Teacher's Model Answer & Key:</span>
                                  </div>
                                  <p className="text-slate-800 leading-relaxed">{q.answerKey}</p>
                                  {q.stepMarking && q.stepMarking.length > 0 && (
                                    <div className="pt-1 text-[11px] text-emerald-800 border-t border-emerald-200/60 flex items-center gap-1.5 flex-wrap">
                                      <span className="font-bold">Step Marking:</span>
                                      {q.stepMarking.map((step, sIdx) => (
                                        <span key={sIdx} className="bg-emerald-100 px-1.5 py-0.2 rounded font-medium">
                                          {step}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* NEP 2020 Cognitive Blueprint Table */}
                    {showBlueprint && paper.blueprint && (
                      <div className="mt-8 pt-6 border-t-2 border-slate-300">
                        <div className="flex items-center gap-2 mb-3">
                          <Award className="w-4 h-4 text-purple-600" />
                          <h4 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900">
                            NEP 2020 Cognitive Weightage Blueprint Matrix
                          </h4>
                        </div>
                        <div className="overflow-x-auto border border-slate-300 rounded-lg">
                          <table className="w-full text-xs text-left border-collapse">
                            <thead>
                              <tr className="bg-slate-100 border-b border-slate-300 text-slate-700">
                                <th className="p-2.5 font-bold">Cognitive Level</th>
                                <th className="p-2.5 font-bold text-center">Marks Allocated</th>
                                <th className="p-2.5 font-bold text-center">Weightage (%)</th>
                                <th className="p-2.5 font-bold">Target Skill & Question Types</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 text-slate-800 text-[11.5px]">
                              <tr>
                                <td className="p-2.5 font-semibold">1. Remembering (Recall)</td>
                                <td className="p-2.5 text-center font-bold text-purple-700">{paper.blueprint.rememberingMarks} M</td>
                                <td className="p-2.5 text-center">{Math.round((paper.blueprint.rememberingMarks / paper.totalMarks) * 100)}%</td>
                                <td className="p-2.5 text-slate-600">Definitions, Formulas, Units, Objective MCQs</td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-semibold">2. Understanding (Comprehend)</td>
                                <td className="p-2.5 text-center font-bold text-purple-700">{paper.blueprint.understandingMarks} M</td>
                                <td className="p-2.5 text-center">{Math.round((paper.blueprint.understandingMarks / paper.totalMarks) * 100)}%</td>
                                <td className="p-2.5 text-slate-600">Explanations, Differentiations, Flowcharts, 2M/3M Short Answers</td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-semibold">3. Applying (Problem Solving)</td>
                                <td className="p-2.5 text-center font-bold text-purple-700">{paper.blueprint.applyingMarks} M</td>
                                <td className="p-2.5 text-center">{Math.round((paper.blueprint.applyingMarks / paper.totalMarks) * 100)}%</td>
                                <td className="p-2.5 text-slate-600">Calculations, Derivations, Grammar Rules, Proofs</td>
                              </tr>
                              <tr>
                                <td className="p-2.5 font-semibold">4. Analyzing & HOTS (Evaluate)</td>
                                <td className="p-2.5 text-center font-bold text-purple-700">{paper.blueprint.analyzingHotsMarks} M</td>
                                <td className="p-2.5 text-center">{Math.round((paper.blueprint.analyzingHotsMarks / paper.totalMarks) * 100)}%</td>
                                <td className="p-2.5 text-slate-600">Case Study, Real-world Application, Essay Questions</td>
                              </tr>
                              <tr className="bg-purple-50/80 font-bold border-t border-purple-200">
                                <td className="p-2.5 text-purple-950">Total Examination Portion</td>
                                <td className="p-2.5 text-center text-purple-950">{paper.totalMarks} Marks</td>
                                <td className="p-2.5 text-center text-purple-950">100%</td>
                                <td className="p-2.5 text-purple-900">Compliant with Board Blueprint Norms</td>
                              </tr>
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}

                    {/* Board Exam Examiner Tips & Traps */}
                    {paper.boardExamTips && (
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-xs space-y-3">
                        <div className="font-bold text-slate-800 flex items-center gap-1.5 text-xs uppercase tracking-wider">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span>Official Board Exam Scoring Insights & Marking Traps</span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11.5px]">
                          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-lg">
                            <span className="font-bold text-emerald-950 block mb-1">
                              ✓ High-Scoring Keywords (Evaluator Magnet):
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-emerald-900">
                              {paper.boardExamTips.highScorerKeywords.map((kw, kIdx) => (
                                <li key={kIdx}>{kw}</li>
                              ))}
                            </ul>
                          </div>

                          <div className="p-3 bg-red-50/70 border border-red-200 rounded-lg">
                            <span className="font-bold text-red-950 block mb-1">
                              ⚠ Common Traps Where Students Lose Marks:
                            </span>
                            <ul className="list-disc list-inside space-y-0.5 text-red-900">
                              {paper.boardExamTips.commonStudentMistakes.map((mis, mIdx) => (
                                <li key={mIdx}>{mis}</li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <p className="text-[11px] text-slate-600 italic pt-1 border-t border-slate-200">
                          <strong>Chief Examiner Advice:</strong> {paper.boardExamTips.examinerMarkingAdvice}
                        </p>
                      </div>
                    )}
                      </>
                    )}
                  </div>
                </div>
              ) : (
                /* Empty / Call to Action */
                <div className="text-center py-12 px-6 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50">
                  <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center mx-auto mb-3">
                    <GraduationCap className="w-6 h-6" />
                  </div>
                  <h4 className="text-base font-bold text-slate-800 mb-1">
                    Ready to Generate Your Board-Standard Question Paper
                  </h4>
                  <p className="text-xs text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                    Click the button above to generate an authentic question paper for{" "}
                    <strong>{formData.topic || "this topic"}</strong> ({formData.grade} {formData.subject}) formatted with official sections, teacher answer key, and NEP blueprint.
                  </p>
                  <button
                    onClick={handleGeneratePaper}
                    disabled={isLoading}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md transition"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Generate Question Paper Now</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PAST 10 YEARS HIGH-YIELD BOARD BANK */}
          {activeTab === "past_bank" && (
            <div className="space-y-5">
              {/* Header Info Banner */}
              <div className="bg-gradient-to-r from-amber-500/10 via-purple-500/10 to-indigo-500/10 border border-amber-300/40 rounded-xl p-4 flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <Flame className="w-4 h-4" />
                </div>
                <div className="text-xs">
                  <h4 className="font-extrabold text-slate-900 text-sm">
                    Past 10 Years Most Repeated Board Questions (PYQ Archive)
                  </h4>
                  <p className="text-slate-600 mt-0.5 leading-relaxed">
                    Curated from actual CBSE, Tamil Nadu SSLC/HSC, Karnataka SSLC, and Kerala State Board examinations. Each question includes official evaluator keywords and common student marking pitfalls.
                  </p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex items-center justify-between gap-3 flex-wrap bg-slate-50 p-3 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-bold text-slate-600 flex items-center gap-1">
                    <Filter className="w-3.5 h-3.5" />
                    <span>Subject:</span>
                  </span>
                  {[
                    "All",
                    "Tamil (தமிழ்)",
                    "Kannada (ಕನ್ನಡ)",
                    "Hindi (हिन्दी)",
                    "Malayalam (മലയാളം)",
                    "Mathematics",
                    "Science (General)",
                    "Social Science",
                    "English Language & Literature",
                    "Competitive Foundation",
                    "Physics (11/12)",
                    "Chemistry (11/12)",
                    "Biology (11/12)",
                    "Maths (11/12)",
                  ].map((sub) => (
                    <button
                      key={sub}
                      onClick={() => setSelectedSubjectFilter(sub)}
                      className={`text-[11px] px-2.5 py-1 rounded-lg font-bold transition ${
                        selectedSubjectFilter === sub
                          ? "bg-purple-600 text-white shadow-xs"
                          : "bg-white text-slate-700 border border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {sub.split("(")[0].trim()}
                    </button>
                  ))}
                </div>

                {/* Search Input */}
                <div className="relative w-full sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search questions or topics..."
                    className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-slate-800 focus:ring-2 focus:ring-purple-500"
                  />
                </div>
              </div>

              {/* List of High-Yield Questions */}
              <div className="space-y-4">
                {filteredPastQuestions.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs italic bg-slate-50 rounded-xl border border-slate-200">
                    No questions found matching your filter criteria. Try switching the subject filter to "All".
                  </div>
                ) : (
                  filteredPastQuestions.map((item) => (
                    <div
                      key={item.id}
                      className="bg-white border border-slate-200 hover:border-purple-300 rounded-xl p-4 sm:p-5 shadow-2xs hover:shadow-xs transition space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 text-[11px] font-extrabold bg-amber-100 text-amber-900 border border-amber-200 px-2 py-0.5 rounded-md">
                            <Flame className="w-3 h-3 text-amber-600" />
                            <span>{item.frequency}</span>
                          </span>

                          <span className="text-[11px] font-semibold bg-purple-50 text-purple-800 border border-purple-200 px-2 py-0.5 rounded-md">
                            {item.yearRepeated}
                          </span>

                          <span className="text-[11px] font-medium text-slate-500">
                            {item.grade} • {item.subject} • {item.curriculum}
                          </span>
                        </div>

                        <span className="text-xs font-extrabold bg-slate-900 text-white px-2 py-0.5 rounded-md">
                          {item.marks} Marks
                        </span>
                      </div>

                      {/* Question Text */}
                      <div className="text-xs sm:text-sm font-semibold text-slate-900 leading-relaxed">
                        <span className="text-purple-700 font-extrabold mr-1">Q.</span>
                        {item.question}
                      </div>

                      {/* Topic Tag */}
                      <div className="text-[11px] text-slate-500 font-medium">
                        <strong>Chapter / Topic:</strong> {item.topic}
                      </div>

                      {/* Insights Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] pt-1">
                        <div className="bg-emerald-50/80 border border-emerald-200 rounded-lg p-2.5 text-emerald-950">
                          <div className="font-bold flex items-center gap-1 mb-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Must-Include Scoring Keywords:</span>
                          </div>
                          <ul className="list-disc list-inside space-y-0.5 text-slate-800 text-[11px]">
                            {item.expectedKeywords.map((kw, idx) => (
                              <li key={idx}>{kw}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-rose-50/80 border border-rose-200 rounded-lg p-2.5 text-rose-950">
                          <div className="font-bold flex items-center gap-1 mb-1">
                            <AlertTriangle className="w-3 h-3 text-rose-600" />
                            <span>Examiner's Marking Trap:</span>
                          </div>
                          <p className="text-slate-800 text-[11px] leading-relaxed">{item.markingTrap}</p>
                        </div>
                      </div>

                      {/* Model Answer Snippet */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-[11.5px] text-slate-700">
                        <span className="font-bold text-slate-900">Standard Answer Snippet: </span>
                        <span className="italic">{item.sampleAnswerSnippet}</span>
                      </div>

                      {/* Quick Action Button */}
                      <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(
                              `[PAST BOARD QUESTION - ${item.yearRepeated} (${item.marks} Marks)]\n${item.question}\n\nKey Points: ${item.expectedKeywords.join(", ")}\n\nAnswer: ${item.sampleAnswerSnippet}`
                            );
                            setCopiedPyqId(item.id);
                            setTimeout(() => setCopiedPyqId(null), 2000);
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-lg transition"
                        >
                          {copiedPyqId === item.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-700">Copied!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3 text-slate-500" />
                              <span>Copy Question & Key</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 border-t border-slate-200 px-4 sm:px-6 py-3 flex items-center justify-between shrink-0 text-xs text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Compliant with CBSE, State Board & NEP 2020 Examination Standards</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg text-xs font-bold bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
