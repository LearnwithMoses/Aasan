import React, { useState, useMemo } from "react";
import {
  X,
  BookOpen,
  Search,
  ExternalLink,
  CheckCircle2,
  BookmarkCheck,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Filter,
  FileText,
  Building2,
  Compass,
  Folder,
  FolderOpen,
} from "lucide-react";
import {
  TextbookChapter,
  TEXTBOOK_CHAPTERS,
  getTextbookChapters,
} from "../data/textbookDatabase.ts";
import { CURRICULUM_BOARDS, ALL_GRADES } from "../data/curriculumData.ts";
import { TextbooksFolderExplorer } from "./TextbooksFolderExplorer.tsx";

interface TextbookChaptersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  currentCurriculum: string;
  currentGrade: string;
  currentSubject: string;
  onSelectChapter: (chapter: TextbookChapter) => void;
}

export const TextbookChaptersDrawer: React.FC<TextbookChaptersDrawerProps> = ({
  isOpen,
  onClose,
  currentCurriculum,
  currentGrade,
  currentSubject,
  onSelectChapter,
}) => {
  const [viewMode, setViewMode] = useState<"folders" | "picker">("folders");
  const [selectedCurriculum, setSelectedCurriculum] = useState<string>(currentCurriculum);
  const [selectedGrade, setSelectedGrade] = useState<string>(currentGrade);
  const [selectedSubject, setSelectedSubject] = useState<string>(currentSubject);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedUnitFilter, setSelectedUnitFilter] = useState<string>("all");
  const [selectedChapterId, setSelectedChapterId] = useState<string | null>(null);

  // Sync with props when opened
  React.useEffect(() => {
    if (isOpen) {
      setSelectedCurriculum(currentCurriculum);
      setSelectedGrade(currentGrade);
      setSelectedSubject(currentSubject);
      setSearchQuery("");
      setSelectedUnitFilter("all");
    }
  }, [isOpen, currentCurriculum, currentGrade, currentSubject]);

  // Filtered chapters list
  const chapters = useMemo(() => {
    let list = getTextbookChapters(
      selectedCurriculum,
      selectedGrade,
      selectedSubject,
      searchQuery
    );

    if (selectedUnitFilter !== "all") {
      list = list.filter((c) => c.unitOrTerm.toLowerCase().includes(selectedUnitFilter.toLowerCase()));
    }

    // If query returned 0 due to restrictive curriculum/grade, fallback to general search so user always sees relevant books
    if (list.length === 0 && searchQuery.trim()) {
      list = TEXTBOOK_CHAPTERS.filter(
        (c) =>
          c.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (c.nativeTitle && c.nativeTitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
          c.keySubtopics.some((s) => s.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    return list;
  }, [selectedCurriculum, selectedGrade, selectedSubject, searchQuery, selectedUnitFilter]);

  // Distinct units for filter chips
  const distinctUnits = useMemo(() => {
    const allUnits = new Set<string>();
    chapters.forEach((c) => allUnits.add(c.unitOrTerm));
    return Array.from(allUnits);
  }, [chapters]);

  if (!isOpen) return null;

  const handleApplyChapter = (chap: TextbookChapter) => {
    setSelectedChapterId(chap.id);
    onSelectChapter(chap);
    setTimeout(() => {
      onClose();
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-xs flex justify-end transition-opacity duration-300"
      onClick={onClose}
    >
      <div
        className={`w-full ${viewMode === "folders" ? "max-w-4xl" : "max-w-2xl"} bg-white h-full shadow-2xl flex flex-col transform transition-all duration-300 ease-out`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="bg-[#0f172a] text-white p-4 border-b border-slate-800 flex items-start justify-between relative">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300 flex-shrink-0 mt-0.5">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold">
                  பாடநூல் பெட்டகம் • Textbooks &amp; Materials Library
                </h2>
                <span className="text-[10px] bg-amber-500 text-slate-950 font-black px-1.5 py-0.5 rounded">
                  ஆசான் 1-12
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5">
                Browse board-wise folders (Classes 1-12), mediums, official government PDFs, worksheets &amp; model question papers.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
            title="Close Drawer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* View Mode Switcher Tab */}
        <div className="bg-slate-900 px-4 py-2 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-1 p-1 rounded-xl bg-slate-800">
            <button
              onClick={() => setViewMode("folders")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "folders"
                  ? "bg-amber-400 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Classes 1 - 12 Folders (All Boards)</span>
            </button>
            <button
              onClick={() => setViewMode("picker")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center gap-1.5 ${
                viewMode === "picker"
                  ? "bg-amber-400 text-slate-950 shadow-xs"
                  : "text-slate-300 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Chapter Picker</span>
            </button>
          </div>
          <span className="text-[11px] text-slate-400 hidden sm:inline">
            TN Board • CBSE • ICSE
          </span>
        </div>

        {viewMode === "folders" ? (
          <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-slate-50">
            <TextbooksFolderExplorer
              embedded={false}
              onSelectMaterialForLesson={(curriculum, grade, subject, topic, resources) => {
                onSelectChapter({
                  id: `chap-${Date.now()}`,
                  curriculum,
                  grade,
                  subject,
                  unitOrTerm: "Term 1",
                  title: topic,
                  suggestedObjectives: `Master core syllabus competencies in ${topic} for ${grade} ${subject}.`,
                  pdfSourceTitle: resources || `${curriculum} Official Textbook`,
                  pdfSourceUrl: "https://tnschools.gov.in/textbooks",
                  isVerifiedGovtPdf: true,
                  keySubtopics: [topic],
                });
                onClose();
              }}
            />
          </div>
        ) : (
          <>
            {/* Filter Controls Row */}
            <div className="p-3.5 bg-slate-50 border-b border-slate-200 space-y-2.5">
          {/* Active selection selectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                பாடத்திட்டம் (Curriculum)
              </label>
              <select
                value={selectedCurriculum}
                onChange={(e) => setSelectedCurriculum(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900"
              >
                {CURRICULUM_BOARDS.flatMap((g) => g.options).map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                வகுப்பு (Grade)
              </label>
              <select
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900"
              >
                {ALL_GRADES.flatMap((g) => g.grades).map((gr) => (
                  <option key={gr.value} value={gr.value}>
                    {gr.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-0.5">
                பாடம் (Subject)
              </label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full bg-white border border-slate-300 rounded-md p-1.5 text-xs font-semibold focus:ring-1 focus:ring-slate-900"
              >
                <option value="Tamil">தமிழ் (Tamil)</option>
                <option value="Science">Science (அறிவியல்)</option>
                <option value="Mathematics">Mathematics (கணிதம்)</option>
                <option value="Social Science">Social Science (சமூக அறிவியல்)</option>
                <option value="Physics">Physics (இயற்பியல்)</option>
                <option value="Chemistry">Chemistry (வேதியியல்)</option>
                <option value="Biology">Biology (உயிரியல்)</option>
                <option value="English">English Language</option>
              </select>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapter title, sub-topic (e.g. திருக்குறள், Newton, Light, Acids, Cell)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-8 py-2 bg-white border border-slate-300 rounded-lg text-xs placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Unit / Theme Quick Filter Pills */}
          {distinctUnits.length > 1 && (
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px]">
              <span className="text-slate-500 font-bold flex items-center gap-1 flex-shrink-0">
                <Filter className="w-3 h-3" /> Units:
              </span>
              <button
                type="button"
                onClick={() => setSelectedUnitFilter("all")}
                className={`px-2 py-0.5 rounded-md border font-medium whitespace-nowrap transition ${
                  selectedUnitFilter === "all"
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                All Chapters ({chapters.length})
              </button>
              {distinctUnits.map((u) => (
                <button
                  key={u}
                  type="button"
                  onClick={() => setSelectedUnitFilter(u)}
                  className={`px-2 py-0.5 rounded-md border font-medium whitespace-nowrap transition ${
                    selectedUnitFilter === u
                      ? "bg-indigo-700 text-white border-indigo-700"
                      : "bg-white text-slate-700 border-slate-200 hover:bg-slate-100"
                  }`}
                >
                  {u}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Chapters Content List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3.5 divide-y divide-slate-100">
          {chapters.length === 0 ? (
            <div className="text-center py-12 px-4">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 mx-auto mb-3">
                <Compass className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800 mb-1">
                No chapters matched your exact filter
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-3">
                Try switching curriculum, selecting Class 10/12/9, or clearing the search keyword.
              </p>
              <button
                onClick={() => {
                  setSelectedCurriculum("Tamil Nadu State Board");
                  setSelectedGrade("Class 10");
                  setSelectedSubject("Tamil");
                  setSearchQuery("");
                }}
                className="px-3 py-1.5 bg-indigo-50 border border-indigo-200 text-indigo-700 rounded-lg text-xs font-bold hover:bg-indigo-100"
              >
                Reset to Class 10 Tamil (Samacheer Kalvi)
              </button>
            </div>
          ) : (
            chapters.map((chap) => {
              const isSelected = selectedChapterId === chap.id;
              return (
                <div
                  key={chap.id}
                  className={`pt-3 first:pt-0 transition rounded-xl p-3 border ${
                    isSelected
                      ? "bg-emerald-50/80 border-emerald-300 ring-1 ring-emerald-400"
                      : "bg-white border-slate-200 hover:border-indigo-300 hover:shadow-xs"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-200">
                          {chap.unitOrTerm}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                          {chap.grade} • {chap.curriculum}
                        </span>
                        {chap.pageRange && (
                          <span className="text-[10px] text-slate-500 flex items-center gap-0.5">
                            <FileText className="w-2.5 h-2.5" />
                            {chap.pageRange}
                          </span>
                        )}
                      </div>

                      <h3 className="text-sm sm:text-base font-bold text-slate-900">
                        {chap.title}
                      </h3>

                      {chap.nativeTitle && chap.nativeTitle !== chap.title && (
                        <p className="text-xs text-indigo-900 font-medium mt-0.5">
                          {chap.nativeTitle}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        type="button"
                        onClick={() => handleApplyChapter(chap)}
                        className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition shadow-xs ${
                          isSelected
                            ? "bg-emerald-600 text-white"
                            : "bg-[#0f172a] hover:bg-slate-800 text-white"
                        }`}
                      >
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-300" />
                            <span>Selected!</span>
                          </>
                        ) : (
                          <>
                            <BookmarkCheck className="w-3.5 h-3.5 text-amber-400" />
                            <span>Select for Plan</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Subtopics List */}
                  <div className="mt-2.5 bg-slate-50 border border-slate-100 rounded-lg p-2.5">
                    <div className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1 flex items-center justify-between">
                      <span>பாடத்தின் உட்பிரிவுகள் (Key Subtopics):</span>
                      <span className="text-[10px] text-slate-400 font-normal">
                        {chap.keySubtopics.length} Sections
                      </span>
                    </div>
                    <ul className="grid grid-cols-1 gap-1">
                      {chap.keySubtopics.map((sub, idx) => (
                        <li
                          key={idx}
                          className="text-xs text-slate-700 flex items-start gap-1.5"
                        >
                          <span className="text-indigo-500 font-bold mt-0.5">•</span>
                          <span>{sub}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Learning Outcomes Preview */}
                  {chap.learningOutcomes.length > 0 && (
                    <div className="mt-2 text-[11px] text-slate-600 flex items-start gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <strong>கற்றல் விளைவுகள் (Expected Outcomes): </strong>
                        {chap.learningOutcomes.join(" • ")}
                      </div>
                    </div>
                  )}

                  {/* PDF Link Button & Actions */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between gap-2 flex-wrap">
                    <a
                      href={chap.pdfSourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-2.5 py-1 rounded-md transition"
                      title="Open official textbook PDF in new tab"
                    >
                      <FileText className="w-3.5 h-3.5 text-rose-600" />
                      <span>அரசு பாடப்புத்தகம் PDF (Open Official Textbook)</span>
                      <ExternalLink className="w-3 h-3 text-rose-500" />
                    </a>

                    <span className="text-[11px] text-slate-400 italic">
                      Source: {chap.pdfSourceTitle}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Official Portals Footer */}
        <div className="p-3 bg-slate-900 text-slate-300 border-t border-slate-800 text-xs">
          <div className="flex items-center justify-between gap-2 flex-wrap">
            <div className="flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-amber-400" />
              <span className="font-semibold text-white">Official Government Textbook Portals:</span>
            </div>
            <div className="flex items-center gap-2 text-[11px]">
              <a
                href="https://tnschools.gov.in/textbooks"
                target="_blank"
                rel="noopener noreferrer"
                className="text-amber-300 hover:underline flex items-center gap-0.5"
              >
                TN Schools Textbooks <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="text-sky-300 hover:underline flex items-center gap-0.5"
              >
                NCERT Online Portal <ExternalLink className="w-2.5 h-2.5" />
              </a>
              <span className="text-slate-600">•</span>
              <a
                href="https://diksha.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="text-emerald-300 hover:underline flex items-center gap-0.5"
              >
                DIKSHA National Portal <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      </>
    )}
  </div>
</div>
  );
};
