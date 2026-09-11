import React, { useState, useMemo } from "react";
import { LessonPlanRequest } from "../types.ts";
import { PRESET_EXAMPLES } from "../data/presets.ts";
import {
  CURRICULUM_BOARDS,
  ALL_GRADES,
  MAJOR_SUBJECTS_BY_STAGE,
  ALL_COMMON_SUBJECTS,
  CURRICULUM_LANGUAGE_SUBJECTS,
  LanguageSubjectItem,
} from "../data/curriculumData.ts";
import {
  Sparkles,
  Wand2,
  RotateCcw,
  Clock,
  Users,
  ChevronDown,
  ChevronUp,
  GraduationCap,
  BookOpen,
  Layers,
  Languages,
} from "lucide-react";
import { TextbookChaptersDrawer } from "./TextbookChaptersDrawer.tsx";
import {
  TextbookChapter,
  getTextbookChapters,
} from "../data/textbookDatabase.ts";

export const INDIAN_LANGUAGES = [
  { value: "English", label: "English", native: "English", region: "All India Standard" },
  { value: "Tamil (தமிழ்)", label: "Tamil (தமிழ்)", native: "தமிழ்", region: "Tamil Nadu, Puducherry" },
  { value: "Kannada (ಕನ್ನಡ)", label: "Kannada (ಕನ್ನಡ)", native: "ಕನ್ನಡ", region: "Karnataka" },
  { value: "Malayalam (മലയാളം)", label: "Malayalam (മലയാളം)", native: "മലയാളം", region: "Kerala, Lakshadweep" },
  { value: "Telugu (తెలుగు)", label: "Telugu (తెలుగు)", native: "తెలుగు", region: "Andhra Pradesh, Telangana" },
  { value: "Hindi (हिन्दी)", label: "Hindi (हिन्दी)", native: "हिन्दी", region: "North & Central India" },
  { value: "Bengali (বাংলা)", label: "Bengali (বাংলা)", native: "বাংলা", region: "West Bengal, Tripura" },
  { value: "Marathi (मराठी)", label: "Marathi (मराठी)", native: "मराठी", region: "Maharashtra, Goa" },
  { value: "Gujarati (ગુજરાતી)", label: "Gujarati (ગુજરાતી)", native: "ગુજરાતી", region: "Gujarat" },
  { value: "Odia (ଓଡ଼ିଆ)", label: "Odia (ଓଡ଼ିଆ)", native: "ଓଡ଼ିଆ", region: "Odisha" },
  { value: "Punjabi (ਪੰਜਾਬੀ)", label: "Punjabi (ਪੰਜਾਬੀ)", native: "ਪੰਜਾਬੀ", region: "Punjab, Delhi, Haryana" },
  { value: "Assamese (অসমীয়া)", label: "Assamese (অসমীয়া)", native: "অসমীয়া", region: "Assam" },
  { value: "Urdu (اردو)", label: "Urdu (اردو)", native: "اردو", region: "All India" },
  { value: "Sanskrit (संस्कृतम्)", label: "Sanskrit (संस्कृतम्)", native: "संस्कृतम्", region: "Classical" },
  { value: "Bilingual (English + Regional)", label: "Bilingual (English + Regional)", native: "Bilingual", region: "Mixed Classroom" },
];

interface LessonFormProps {
  formData: LessonPlanRequest;
  onChange: (field: keyof LessonPlanRequest, value: any) => void;
  onSelectPreset: (preset: LessonPlanRequest) => void;
  onReset: () => void;
  onSubmit: () => void;
  isLoading: boolean;
  isPro?: boolean;
  onOpenUpgrade?: () => void;
}

export const LessonForm: React.FC<LessonFormProps> = ({
  formData,
  onChange,
  onSelectPreset,
  onReset,
  onSubmit,
  isLoading,
  isPro = false,
  onOpenUpgrade = () => {},
}) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [isCustomGrade, setIsCustomGrade] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [isTextbookDrawerOpen, setIsTextbookDrawerOpen] = useState(false);

  // Chapters matching the current curriculum, grade, and subject
  const matchingChapters = useMemo(() => {
    return getTextbookChapters(formData.curriculum, formData.grade, formData.subject);
  }, [formData.curriculum, formData.grade, formData.subject]);

  const handleSelectTextbookChapter = (chapter: TextbookChapter) => {
    onChange("topic", chapter.title);
    if (chapter.suggestedObjectives) {
      onChange("objectives", chapter.suggestedObjectives);
    }
    if (chapter.pdfSourceTitle) {
      const existing = formData.resources ? `${formData.resources}; ` : "";
      onChange("resources", `${existing}Official Textbook (${chapter.pdfSourceTitle})`);
    }
  };

  // Detect if current subject is an Indian Language Subject
  const selectedLangSubject = useMemo(() => {
    if (!formData.subject) return null;
    const s = formData.subject.toLowerCase();
    return (
      CURRICULUM_LANGUAGE_SUBJECTS.find(
        (l) =>
          s.includes(l.shortName.toLowerCase()) ||
          s.includes(l.id) ||
          s.includes(l.nativeName.toLowerCase()) ||
          l.name.toLowerCase().includes(s)
      ) || null
    );
  }, [formData.subject]);

  const handleSelectLanguageSubject = (lang: LanguageSubjectItem) => {
    onChange("subject", lang.name);
    // Auto-sync medium of instruction if default or empty
    if (!formData.language || formData.language === "English") {
      onChange("language", lang.name);
    }
  };

  // Determine current grade stage to offer tailored subject suggestions
  const currentStage = useMemo(() => {
    const g = (formData.grade || "").toLowerCase();
    if (g.includes("lkg") || g.includes("ukg") || g.includes("nursery") || g.includes("pre-kg")) {
      return "foundational";
    }
    if (g.includes("11") || g.includes("12")) {
      return "senior";
    }
    if (g.includes("9") || g.includes("10")) {
      return "secondary";
    }
    if (g.includes("6") || g.includes("7") || g.includes("8")) {
      return "middle";
    }
    if (g.includes("1") || g.includes("2") || g.includes("3") || g.includes("4") || g.includes("5")) {
      return "primary";
    }
    return "middle";
  }, [formData.grade]);

  const recommendedSubjects = MAJOR_SUBJECTS_BY_STAGE[currentStage] || MAJOR_SUBJECTS_BY_STAGE.middle;

  const handleGradeSelect = (val: string) => {
    if (val === "CUSTOM") {
      setIsCustomGrade(true);
      onChange("grade", "");
    } else {
      setIsCustomGrade(false);
      onChange("grade", val);
    }
  };

  return (
    <section
      id="form-section"
      className="card form form-sticky bg-white border border-rose-100/80 rounded-3xl p-5 sm:p-6 shadow-[0_8px_30px_rgba(225,29,72,0.05)] h-max"
    >
      <div className="flex items-center justify-between mb-1.5">
        <h2 className="text-lg sm:text-xl font-black text-slate-900 flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center font-black text-xs">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <span>Lesson Details</span>
            <span className="block text-[10px] font-bold text-rose-600/80 uppercase tracking-wider">
              பாடத் திட்ட அமைப்பு
            </span>
          </div>
        </h2>
        <button
          type="button"
          onClick={onReset}
          className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 transition px-2.5 py-1.5 rounded-xl hover:bg-slate-100 font-bold border border-slate-200/80"
          title="Reset form fields"
        >
          <RotateCcw className="w-3 h-3" />
          Reset
        </button>
      </div>

      <p className="text-xs text-slate-500 mb-4 leading-relaxed font-medium">
        Covers all classes from <strong>LKG to Class 12</strong> across all Indian &amp; International boards.
      </p>

      {/* Quick sample scenarios */}
      <div className="mb-4 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-[#d9ad57]" />
          <span>Quick Load Grade Scenarios (LKG - 12):</span>
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-32 overflow-y-auto pr-0.5">
          {PRESET_EXAMPLES.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => {
                setIsCustomGrade(false);
                onSelectPreset(preset.data);
              }}
              className="text-[11px] px-2 py-1 bg-white hover:bg-slate-100 border border-slate-200 rounded-md text-slate-700 font-medium transition flex items-center gap-1 text-left"
            >
              <span>{preset.name}</span>
              <span className="text-[9.5px] text-amber-800 bg-amber-50 px-1 rounded border border-amber-200">
                {preset.badge}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Pedagogical Planning Engine Selector */}
      <div className="mb-4 bg-slate-50 border border-slate-200/90 rounded-xl p-2.5">
        <div className="text-[11px] font-bold text-slate-700 mb-1.5 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-[#d9ad57]" />
            <span>Pedagogical Planning Engine:</span>
          </span>
          {!isPro ? (
            <button
              type="button"
              onClick={onOpenUpgrade}
              className="text-[10px] text-amber-800 bg-amber-50 hover:bg-amber-100 px-1.5 py-0.2 rounded font-bold border border-amber-200 transition"
            >
              Master Edition is Pro ★
            </button>
          ) : (
            <span className="text-[10px] text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded font-bold border border-emerald-200">
              Pro Unlocked
            </span>
          )}
        </div>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() => onChange("aiEngine", "gemini")}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              formData.aiEngine !== "chatgpt"
                ? "bg-[#0f172a] text-white border-[#0f172a] shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>Aasaan Core (ஆசான்)</span>
            <span className="text-[9px] bg-slate-700 text-slate-200 px-1 py-0.2 rounded">Fast</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (!isPro) {
                onOpenUpgrade();
              } else {
                onChange("aiEngine", "chatgpt");
              }
            }}
            className={`py-1.5 px-2.5 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
              formData.aiEngine === "chatgpt"
                ? "bg-amber-600 text-white border-amber-600 shadow-sm"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
            }`}
          >
            <span>Aasaan Master (மேதை)</span>
            <span className="text-[9px] bg-amber-100 text-amber-900 px-1 py-0.2 rounded font-extrabold border border-amber-300">
              PRO
            </span>
          </button>
        </div>
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {/* Board / Curriculum */}
        <label htmlFor="curriculum" className="block text-xs font-bold text-[#172033] mt-3 mb-1.5">
          Board / Curriculum
        </label>
        <select
          id="curriculum"
          value={formData.curriculum}
          onChange={(e) => onChange("curriculum", e.target.value)}
          className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-medium"
        >
          {CURRICULUM_BOARDS.map((grp) => (
            <optgroup key={grp.category} label={grp.category}>
              {grp.options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </optgroup>
          ))}
        </select>

        {/* Grade / Class (LKG to 12) */}
        <div className="mt-3">
          <label htmlFor="grade-select" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <GraduationCap className="w-3.5 h-3.5 text-slate-500" />
              Class / Grade (LKG – Class 12)
            </span>
            {isCustomGrade && (
              <button
                type="button"
                onClick={() => setIsCustomGrade(false)}
                className="text-[11px] text-blue-600 hover:underline font-normal"
              >
                Choose from list
              </button>
            )}
          </label>

          {!isCustomGrade ? (
            <select
              id="grade-select"
              value={formData.grade}
              onChange={(e) => handleGradeSelect(e.target.value)}
              className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-medium"
            >
              <option value="">-- Select Class / Grade --</option>
              {ALL_GRADES.map((grp) => (
                <optgroup key={grp.stage} label={grp.stage}>
                  {grp.grades.map((g) => (
                    <option key={g.value} value={g.value}>
                      {g.label}
                    </option>
                  ))}
                </optgroup>
              ))}
              <option value="CUSTOM">+ Custom Grade / Level...</option>
            </select>
          ) : (
            <input
              id="grade"
              type="text"
              placeholder="e.g. Nursery, LKG, UKG, Class 11 (Commerce)..."
              value={formData.grade}
              onChange={(e) => onChange("grade", e.target.value)}
              className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition"
              autoFocus
            />
          )}
        </div>

        {/* Subject with Dedicated Language Subjects & Stage Chips */}
        <div className="mt-3">
          <label htmlFor="subject" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5 text-slate-500" />
              Subject
            </span>
            <span className="text-[10px] text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded font-semibold border border-emerald-200">
              🇮🇳 All Language Subjects Included
            </span>
          </label>

          {/* DEDICATED INDIAN LANGUAGE SUBJECTS SELECTOR */}
          <div className="mb-2 bg-gradient-to-r from-amber-50/70 via-indigo-50/40 to-slate-50 border border-amber-200/80 rounded-xl p-2.5">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1">
                <Languages className="w-3 h-3 text-indigo-600" />
                Indian Language Subjects:
              </span>
              <button
                type="button"
                onClick={() => setShowMoreLanguages(!showMoreLanguages)}
                className="text-[10px] text-indigo-700 hover:text-indigo-900 font-semibold hover:underline"
              >
                {showMoreLanguages ? "Show Less" : "+ More Languages (Bengali, Marathi, Urdu...)"}
              </button>
            </div>

            {/* Primary Language Subject Buttons */}
            <div className="flex flex-wrap gap-1">
              {CURRICULUM_LANGUAGE_SUBJECTS.slice(0, 7).map((lang) => {
                const isSelected =
                  formData.subject?.toLowerCase().includes(lang.shortName.toLowerCase()) ||
                  formData.subject?.toLowerCase().includes(lang.name.toLowerCase());
                return (
                  <button
                    key={lang.id}
                    type="button"
                    onClick={() => handleSelectLanguageSubject(lang)}
                    className={`text-xs px-2.5 py-1 rounded-lg border font-semibold transition flex items-center gap-1.5 ${
                      isSelected
                        ? "bg-indigo-900 text-white border-indigo-900 shadow-xs"
                        : "bg-white text-slate-800 border-slate-200 hover:bg-slate-100 hover:border-slate-300"
                    }`}
                  >
                    <span>{lang.shortName}</span>
                    <span className={`text-[10px] ${isSelected ? "text-indigo-200" : "text-slate-500"}`}>
                      ({lang.nativeName.split(" ")[0]})
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Expanded Language Subject Buttons */}
            {showMoreLanguages && (
              <div className="mt-2 pt-2 border-t border-amber-200/60 flex flex-wrap gap-1 animate-in fade-in duration-150">
                {CURRICULUM_LANGUAGE_SUBJECTS.slice(7).map((lang) => {
                  const isSelected =
                    formData.subject?.toLowerCase().includes(lang.shortName.toLowerCase()) ||
                    formData.subject?.toLowerCase().includes(lang.name.toLowerCase());
                  return (
                    <button
                      key={lang.id}
                      type="button"
                      onClick={() => handleSelectLanguageSubject(lang)}
                      className={`text-[11px] px-2 py-0.5 rounded-md border font-medium transition ${
                        isSelected
                          ? "bg-indigo-900 text-white border-indigo-900 shadow-xs font-bold"
                          : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                      }`}
                    >
                      {lang.name}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <input
            id="subject"
            type="text"
            list="subject-suggestions"
            placeholder="e.g. Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Hindi (हिन्दी), Malayalam (മലയാളം), Math, Science..."
            value={formData.subject}
            onChange={(e) => onChange("subject", e.target.value)}
            className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-medium"
          />

          <datalist id="subject-suggestions">
            {ALL_COMMON_SUBJECTS.map((sub) => (
              <option key={sub} value={sub} />
            ))}
          </datalist>

          {/* Quick-select chips tailored to current stage */}
          <div className="mt-1.5 flex flex-wrap gap-1 items-center">
            <span className="text-[10px] uppercase font-bold text-slate-400 mr-0.5">Core / STEM:</span>
            {recommendedSubjects
              .filter(
                (sub) =>
                  !sub.includes("Tamil") &&
                  !sub.includes("Kannada") &&
                  !sub.includes("Hindi") &&
                  !sub.includes("Malayalam") &&
                  !sub.includes("Telugu")
              )
              .slice(0, 6)
              .map((sub) => (
                <button
                  key={sub}
                  type="button"
                  onClick={() => onChange("subject", sub)}
                  className={`text-[11px] px-1.5 py-0.5 rounded border transition ${
                    formData.subject === sub
                      ? "bg-[#101827] text-white border-[#101827]"
                      : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
                  }`}
                >
                  {sub}
                </button>
              ))}
          </div>

          {/* If a language subject is chosen, offer tailored domains & sample chapter topics */}
          {selectedLangSubject && (
            <div className="mt-2.5 bg-indigo-50/60 border border-indigo-200 rounded-xl p-2.5">
              <div className="text-[11px] font-bold text-indigo-950 mb-1 flex items-center justify-between">
                <span>
                  📚 {selectedLangSubject.name} Curriculum Topics &amp; Domains (Tap to insert):
                </span>
                <span className="text-[10px] text-indigo-700 bg-white px-1.5 py-0.2 rounded border border-indigo-200 font-medium">
                  {selectedLangSubject.region}
                </span>
              </div>

              {/* Domains: Grammar, Poetry, Prose... */}
              <div className="flex flex-wrap gap-1 mb-1.5">
                {selectedLangSubject.domains.map((dom) => (
                  <button
                    key={dom}
                    type="button"
                    onClick={() => onChange("topic", dom)}
                    className="text-[11px] px-2 py-0.5 bg-white hover:bg-indigo-100 border border-indigo-200 rounded-md text-indigo-900 font-medium transition text-left"
                  >
                    {dom}
                  </button>
                ))}
              </div>

              {/* Sample Chapters */}
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sample Textbook Chapters:
              </div>
              <div className="flex flex-wrap gap-1">
                {selectedLangSubject.sampleTopics.slice(0, 4).map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => onChange("topic", sample)}
                    className="text-[11px] px-2 py-0.5 bg-white hover:bg-amber-50 border border-amber-200 rounded-md text-slate-800 transition text-left"
                  >
                    • {sample}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Topic / Chapter with Textbook Lessons & PDF Drawer Trigger */}
        <div className="mt-3">
          <div className="flex items-center justify-between mb-1.5 flex-wrap gap-1">
            <label htmlFor="topic" className="block text-xs font-bold text-[#172033]">
              Topic / Chapter <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setIsTextbookDrawerOpen(true)}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-700 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 px-2.5 py-1 rounded-lg transition shadow-2xs"
              title="Open full textbook chapters drawer to browse complete syllabus and official PDFs"
            >
              <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
              <span>Browse Textbook Lessons &amp; PDFs</span>
              <span className="text-[10px] bg-indigo-600 text-white font-extrabold px-1.5 py-0.2 rounded-full">
                {matchingChapters.length > 0 ? `${matchingChapters.length} Chaps` : "Full Book"}
              </span>
            </button>
          </div>

          <input
            id="topic"
            type="text"
            required
            placeholder="e.g. Electric Dipole / Linear Equations / Parts of Plant..."
            value={formData.topic}
            onChange={(e) => onChange("topic", e.target.value)}
            className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-semibold"
          />

          {/* Quick Textbook Chapter Selection Carousel/Chips */}
          {matchingChapters.length > 0 && (
            <div className="mt-2 bg-slate-50 border border-slate-200/80 rounded-xl p-2.5">
              <div className="flex items-center justify-between text-[11px] font-bold text-slate-700 mb-1.5">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-600" />
                  <span>பாடப் புத்தக அத்தியாயங்கள் (Book Chapters — Tap to load):</span>
                </span>
                <button
                  type="button"
                  onClick={() => setIsTextbookDrawerOpen(true)}
                  className="text-indigo-600 hover:text-indigo-800 underline font-semibold"
                >
                  View all {matchingChapters.length} with PDFs →
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {matchingChapters.slice(0, 4).map((c) => (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => handleSelectTextbookChapter(c)}
                    className={`text-[11px] px-2 py-1 rounded-md border text-left transition font-medium ${
                      formData.topic === c.title
                        ? "bg-indigo-700 text-white border-indigo-700 shadow-2xs"
                        : "bg-white hover:bg-indigo-50 text-slate-800 border-slate-200"
                    }`}
                  >
                    {c.title.length > 35 ? c.title.slice(0, 35) + "..." : c.title}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Duration & Class Strength */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 mt-3">
          <div>
            <label htmlFor="duration" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-500" />
              Duration (minutes)
            </label>
            <input
              id="duration"
              type="number"
              value={formData.duration}
              min={15}
              max={180}
              step={5}
              onChange={(e) => onChange("duration", Number(e.target.value))}
              className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition"
            />
          </div>

          <div>
            <label htmlFor="classStrength" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center gap-1">
              <Users className="w-3 h-3 text-slate-500" />
              Class strength
            </label>
            <input
              id="classStrength"
              type="text"
              placeholder="e.g. 35"
              value={formData.classStrength}
              onChange={(e) => onChange("classStrength", e.target.value)}
              className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition"
            />
          </div>
        </div>

        {/* Lesson Model */}
        <div className="mt-3">
          <label htmlFor="lessonModel" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-500" />
            Instructional model
          </label>
          <select
            id="lessonModel"
            value={formData.lessonModel}
            onChange={(e) => onChange("lessonModel", e.target.value)}
            className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-medium"
          >
            <option value="5E">5E Model (Engage, Explore, Explain, Elaborate, Evaluate)</option>
            <option value="Gradual Release (I Do / We Do / You Do)">Gradual Release (I Do / We Do / You Do)</option>
            <option value="Direct Instruction">Direct Instruction (Explicit Modeling & Practice)</option>
            <option value="Inquiry-Based">Inquiry-Based Learning (Questioning & Investigation)</option>
            <option value="Play-Way / Activity-Based">Play-Way / Activity-Based (Foundational & Primary)</option>
            <option value="Project-Based">Project-Based Learning</option>
          </select>
        </div>

        {/* Medium of Instruction (All Indian Languages) */}
        <div className="mt-3">
          <label htmlFor="language-select" className="block text-xs font-bold text-[#172033] mb-1.5 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Languages className="w-3.5 h-3.5 text-indigo-600" />
              Medium of Instruction (All Indian Languages)
            </span>
            <span className="text-[10px] text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded font-semibold border border-indigo-200">
              Native Script Supported
            </span>
          </label>

          {/* Quick Language Tap Chips for fast one-tap selection */}
          <div className="flex flex-wrap gap-1 mb-2">
            {[
              { val: "English", label: "English" },
              { val: "Tamil (தமிழ்)", label: "தமிழ்" },
              { val: "Kannada (ಕನ್ನಡ)", label: "ಕನ್ನಡ" },
              { val: "Malayalam (മലയാളം)", label: "മലയാളം" },
              { val: "Telugu (తెలుగు)", label: "తెలుగు" },
              { val: "Hindi (हिन्दी)", label: "हिन्दी" },
              { val: "Bilingual (English + Regional)", label: "Bilingual" },
            ].map((lang) => {
              const active = formData.language === lang.val;
              return (
                <button
                  key={lang.val}
                  type="button"
                  onClick={() => onChange("language", lang.val)}
                  className={`px-2 py-0.5 rounded-md text-xs font-medium transition border ${
                    active
                      ? "bg-indigo-900 text-white border-indigo-900 shadow-2xs font-bold"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
                  }`}
                >
                  {lang.label}
                </button>
              );
            })}
          </div>

          <select
            id="language-select"
            value={formData.language}
            onChange={(e) => onChange("language", e.target.value)}
            className="w-full border border-[#d6dae1] rounded-lg p-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#101827] transition font-medium"
          >
            {INDIAN_LANGUAGES.map((l) => (
              <option key={l.value} value={l.value}>
                {l.label} — {l.region}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Advanced Pedagogical Context */}
        <div className="mt-4 pt-3 border-t border-slate-100">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="w-full flex items-center justify-between text-xs font-semibold text-slate-700 hover:text-[#101827] py-1 transition"
          >
            <span className="flex items-center gap-1.5">
              <span>{showAdvanced ? "Hide" : "Add"} Pedagogical Specifics (Optional)</span>
              <span className="text-[10px] text-slate-400 font-normal">Objectives, Aids, Differentiation</span>
            </span>
            {showAdvanced ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
          </button>

          {showAdvanced && (
            <div className="mt-2 space-y-3 bg-slate-50/70 p-3 rounded-xl border border-slate-200/70 text-xs">
              <div>
                <label htmlFor="objectives" className="block font-bold text-[#172033] mb-1">
                  Specific Learning Objectives
                </label>
                <textarea
                  id="objectives"
                  rows={2}
                  placeholder="What specific skills or concepts should students master?"
                  value={formData.objectives}
                  onChange={(e) => onChange("objectives", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition resize-y"
                />
              </div>

              <div>
                <label htmlFor="priorKnowledge" className="block font-bold text-[#172033] mb-1">
                  Prerequisites / Prior Knowledge
                </label>
                <textarea
                  id="priorKnowledge"
                  rows={2}
                  placeholder="What should students already know?"
                  value={formData.priorKnowledge}
                  onChange={(e) => onChange("priorKnowledge", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition resize-y"
                />
              </div>

              <div>
                <label htmlFor="language-custom" className="block font-bold text-[#172033] mb-1">
                  Custom Language / Regional Dialect Specification (Optional)
                </label>
                <input
                  id="language-custom"
                  type="text"
                  placeholder="e.g. Tamil with English scientific terms, Tanglish, Spoken Kannada..."
                  value={formData.language}
                  onChange={(e) => onChange("language", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition"
                />
              </div>

              <div>
                <label htmlFor="resources" className="block font-bold text-[#172033] mb-1">
                  Teaching Aids &amp; Resources Available
                </label>
                <textarea
                  id="resources"
                  rows={2}
                  placeholder="Blackboard, NCERT textbook, lab apparatus, smartboard, flashcards..."
                  value={formData.resources}
                  onChange={(e) => onChange("resources", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition resize-y"
                />
              </div>

              <div>
                <label htmlFor="differentiation" className="block font-bold text-[#172033] mb-1">
                  Differentiation Requirements
                </label>
                <textarea
                  id="differentiation"
                  rows={2}
                  placeholder="Support for struggling students, challenges for advanced learners..."
                  value={formData.differentiation}
                  onChange={(e) => onChange("differentiation", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition resize-y"
                />
              </div>

              <div>
                <label htmlFor="specialRequirements" className="block font-bold text-[#172033] mb-1">
                  Special Instructions / Focus
                </label>
                <textarea
                  id="specialRequirements"
                  rows={2}
                  placeholder="Board exam questions, practical experiment, quick exit ticket..."
                  value={formData.specialRequirements}
                  onChange={(e) => onChange("specialRequirements", e.target.value)}
                  className="w-full border border-[#d6dae1] rounded-lg p-2 text-xs bg-white focus:outline-none focus:ring-1 focus:ring-[#101827] transition resize-y"
                />
              </div>
            </div>
          )}
        </div>

        {/* Primary Generate button matching Blood Bridge vibrant primary action */}
        <button
          type="submit"
          id="generate"
          disabled={isLoading}
          className="primary w-full mt-5 py-3.5 px-5 rounded-2xl font-black text-white bg-gradient-to-r from-red-600 via-rose-600 to-rose-700 hover:from-red-500 hover:to-rose-600 disabled:opacity-75 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2.5 shadow-lg shadow-rose-200 hover:shadow-xl hover:shadow-rose-300 active:scale-[0.98]"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Generating Pedagogical Plan...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-amber-200" />
              <span>Generate Lesson Plan (பாடத் திட்டம்)</span>
            </>
          )}
        </button>
      </form>

      {/* Textbook Syllabus & Chapter Browser Drawer with Official PDFs */}
      <TextbookChaptersDrawer
        isOpen={isTextbookDrawerOpen}
        onClose={() => setIsTextbookDrawerOpen(false)}
        currentCurriculum={formData.curriculum}
        currentGrade={formData.grade}
        currentSubject={formData.subject}
        onSelectChapter={handleSelectTextbookChapter}
      />
    </section>
  );
};
