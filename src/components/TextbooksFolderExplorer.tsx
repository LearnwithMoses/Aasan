import React, { useState, useMemo } from "react";
import {
  Folder,
  FolderOpen,
  FileText,
  BookOpen,
  Search,
  ExternalLink,
  Download,
  Sparkles,
  ArrowLeft,
  ChevronRight,
  GraduationCap,
  Layers,
  Printer,
  CheckCircle2,
  Filter,
  Info,
  Globe,
  Compass,
  FileSpreadsheet,
  FileCheck,
  Bookmark,
  Building,
  HelpCircle,
} from "lucide-react";
import {
  BoardFolder,
  ClassFolder,
  SubjectFolder,
  TextbookMaterial,
  MaterialType,
  MediumType,
  MATERIAL_TYPE_META,
  ALL_BOARD_FOLDERS,
  OTHER_STATE_BOARDS,
  OtherStateBoardItem,
  searchAllMaterials,
} from "../data/textbooksFolderData.ts";

interface TextbooksFolderExplorerProps {
  initialBoardId?: string;
  initialClassLevel?: number;
  onSelectMaterialForLesson?: (
    curriculum: string,
    grade: string,
    subject: string,
    topic: string,
    resources?: string
  ) => void;
  onOpenQuestionPaper?: () => void;
  embedded?: boolean;
}

export const TextbooksFolderExplorer: React.FC<TextbooksFolderExplorerProps> = ({
  initialBoardId = "tn-state-board",
  initialClassLevel = 10,
  onSelectMaterialForLesson,
  onOpenQuestionPaper,
  embedded = false,
}) => {
  // Navigation State
  const [selectedBoardId, setSelectedBoardId] = useState<string>(initialBoardId);
  const [selectedClassLevel, setSelectedClassLevel] = useState<number | null>(initialClassLevel);
  const [selectedSubjectId, setSelectedSubjectId] = useState<string | null>(null);
  const [selectedMedium, setSelectedMedium] = useState<MediumType | "all">("all");
  const [selectedMaterialType, setSelectedMaterialType] = useState<MaterialType | "all">("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"explorer" | "other_boards" | "portals">("explorer");

  // Selected Board
  const currentBoard = useMemo(() => {
    return ALL_BOARD_FOLDERS.find((b) => b.id === selectedBoardId) || ALL_BOARD_FOLDERS[0];
  }, [selectedBoardId]);

  // Selected Class
  const currentClass = useMemo(() => {
    if (!selectedClassLevel) return null;
    return currentBoard.classes.find((c) => c.gradeLevel === selectedClassLevel) || null;
  }, [currentBoard, selectedClassLevel]);

  // Selected Subject
  const currentSubject = useMemo(() => {
    if (!currentClass || !selectedSubjectId) return null;
    return currentClass.subjects.find((s) => s.id === selectedSubjectId) || null;
  }, [currentClass, selectedSubjectId]);

  // Search results
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return searchAllMaterials(
      searchQuery,
      undefined,
      selectedClassLevel || undefined,
      selectedMedium === "all" ? undefined : selectedMedium,
      selectedMaterialType === "all" ? undefined : selectedMaterialType
    );
  }, [searchQuery, selectedClassLevel, selectedMedium, selectedMaterialType]);

  // Handle drill down
  const handleSelectBoard = (boardId: string) => {
    setSelectedBoardId(boardId);
    setSelectedClassLevel(null);
    setSelectedSubjectId(null);
    setSearchQuery("");
  };

  const handleSelectClass = (gradeLevel: number) => {
    setSelectedClassLevel(gradeLevel);
    setSelectedSubjectId(null);
  };

  const handleSelectSubject = (subjectId: string) => {
    setSelectedSubjectId(subjectId);
  };

  const handleGoBack = () => {
    if (selectedSubjectId) {
      setSelectedSubjectId(null);
    } else if (selectedClassLevel !== null) {
      setSelectedClassLevel(null);
    }
  };

  const handleLaunchLessonPlanning = (
    mat: TextbookMaterial,
    subj: SubjectFolder,
    cls: ClassFolder,
    board: BoardFolder
  ) => {
    if (onSelectMaterialForLesson) {
      const topicName = mat.chaptersIncluded && mat.chaptersIncluded.length > 0
        ? mat.chaptersIncluded[0]
        : mat.title;
      const resourceText = `Official Textbook: ${mat.title} (${mat.sourceAuthority})`;
      onSelectMaterialForLesson(board.name, cls.gradeLabel, subj.name, topicName, resourceText);
    }
  };

  // Filter materials inside current subject
  const displayedMaterials = useMemo(() => {
    if (!currentSubject) return [];
    let list = currentSubject.materials;
    if (selectedMaterialType !== "all") {
      list = list.filter((m) => m.type === selectedMaterialType);
    }
    return list;
  }, [currentSubject, selectedMaterialType]);

  return (
    <div className={`flex flex-col bg-slate-50/70 ${embedded ? "rounded-3xl border border-slate-200/80 p-4 sm:p-6" : "h-full"}`}>
      {/* Top Header & Search Bar */}
      <div className="space-y-3 pb-4 border-b border-slate-200">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
                <FolderOpen className="w-4 h-4" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                பாடநூல் பெட்டகம் • All Textbooks &amp; Materials
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              Board-wise master repository: Tamil Nadu State Board (1-12), CBSE/NCERT, ICSE &amp; all mediums with official PDFs, solutions, worksheets &amp; model papers.
            </p>
          </div>

          {/* Quick Tab Switcher */}
          <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-200/70 self-start md:self-auto">
            <button
              onClick={() => setActiveTab("explorer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "explorer"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Folder className="w-3.5 h-3.5 text-blue-600" />
              <span>Classes 1 - 12 Folders</span>
            </button>
            <button
              onClick={() => setActiveTab("other_boards")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "other_boards"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>Other State Boards</span>
            </button>
            <button
              onClick={() => setActiveTab("portals")}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                activeTab === "portals"
                  ? "bg-white text-slate-900 shadow-xs"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <ExternalLink className="w-3.5 h-3.5 text-purple-600" />
              <span>Govt Portals</span>
            </button>
          </div>
        </div>

        {/* Global Search Toolbar */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search all textbooks, chapters, worksheets, model papers, or Tamil/English medium (e.g. 'Science 10', 'அன்னை மொழியே', 'PTA Model', 'Physics 12')..."
            className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-white border border-slate-200/90 text-xs sm:text-sm text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500 shadow-2xs transition"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400 hover:text-slate-600 px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
        </div>

        {/* Quick Board Switcher Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Boards:
          </span>
          {ALL_BOARD_FOLDERS.map((board) => {
            const isSelected = selectedBoardId === board.id;
            return (
              <button
                key={board.id}
                onClick={() => handleSelectBoard(board.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition flex items-center gap-1.5 border ${
                  isSelected
                    ? "bg-[#263B80] text-white border-[#263B80] shadow-xs"
                    : "bg-white text-slate-700 border-slate-200/90 hover:border-slate-300"
                }`}
              >
                <Building className="w-3.5 h-3.5 opacity-80" />
                <span>{board.shortName}</span>
                <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                  isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}>
                  1-12
                </span>
              </button>
            );
          })}
        </div>

        {/* Quick Class Selector Strip (1 to 12) */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-0.5">
          <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
            Classes:
          </span>
          <button
            onClick={() => {
              setSelectedClassLevel(null);
              setSelectedSubjectId(null);
            }}
            className={`px-2.5 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
              selectedClassLevel === null
                ? "bg-slate-900 text-white border-slate-900"
                : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
            }`}
          >
            All Classes (1-12)
          </button>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => {
            const isSelected = selectedClassLevel === num;
            return (
              <button
                key={num}
                onClick={() => handleSelectClass(num)}
                className={`min-w-[42px] px-2 py-1 rounded-xl text-xs font-bold transition text-center border ${
                  isSelected
                    ? "bg-blue-600 text-white border-blue-600 shadow-xs scale-105"
                    : "bg-white text-slate-700 border-slate-200/90 hover:border-blue-400"
                }`}
              >
                C{num}
              </button>
            );
          })}
        </div>
      </div>

      {/* SEARCH RESULTS VIEW (IF QUERY ACTIVE) */}
      {searchQuery.trim() ? (
        <div className="py-4 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">
              Found {searchResults.length} materials matching &ldquo;{searchQuery}&rdquo;
            </h3>
            <button
              onClick={() => setSearchQuery("")}
              className="text-xs text-blue-600 font-bold hover:underline"
            >
              Back to Folder View
            </button>
          </div>

          {searchResults.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-3xl border border-slate-200/80">
              <BookOpen className="w-8 h-8 text-slate-300 mx-auto mb-2" />
              <div className="text-sm font-bold text-slate-700">No materials found</div>
              <p className="text-xs text-slate-400 mt-1">
                Try searching for &quot;Maths&quot;, &quot;Tamil&quot;, &quot;PTA&quot;, &quot;Class 10&quot;, &quot;NCERT&quot;, or &quot;Science&quot;.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {searchResults.map(({ board, classFolder, subject, material }) => {
                const meta = MATERIAL_TYPE_META[material.type];
                return (
                  <div
                    key={material.id}
                    className="p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between"
                  >
                    <div>
                      {/* Breadcrumb pill */}
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                        <span>{board.shortName}</span>
                        <span>•</span>
                        <span className="text-blue-700">{classFolder.gradeLabel}</span>
                        <span>•</span>
                        <span>{subject.name}</span>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-black text-slate-900 leading-snug">
                          {material.title}
                        </h4>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full shrink-0 ${meta.badgeBg}`}>
                          {meta.label.split(" ")[0]}
                        </span>
                      </div>

                      {material.nativeTitle && (
                        <p className="text-xs font-medium text-amber-900 mt-0.5">
                          {material.nativeTitle}
                        </p>
                      )}

                      <p className="text-xs text-slate-600 mt-1.5 line-clamp-2">
                        {material.description}
                      </p>

                      <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
                        {material.fileSize && <span>💾 {material.fileSize}</span>}
                        {material.pagesCount && <span>📄 {material.pagesCount} pages</span>}
                        {material.term && <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">{material.term}</span>}
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                      <a
                        href={material.downloadUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Open PDF</span>
                      </a>

                      <button
                        onClick={() => handleLaunchLessonPlanning(material, subject, classFolder, board)}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shadow-blue-600/20"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Use in Plan</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : null}

      {/* TAB 2: OTHER STATE BOARDS DIRECTORY */}
      {activeTab === "other_boards" && !searchQuery.trim() && (
        <div className="py-4 space-y-4">
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 text-emerald-950 flex items-start gap-3">
            <Globe className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-900">
                All Indian State Boards &amp; SCERT Textbook Repositories
              </div>
              <p className="text-xs text-emerald-800/90 mt-0.5 leading-relaxed">
                Direct verified access to regional state boards, syllabus PDFs, and official digital portals in regional languages across Classes 1 to 12.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OTHER_STATE_BOARDS.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                        {b.state}
                      </span>
                      <h3 className="text-base font-black text-slate-900 mt-1">{b.name}</h3>
                      <div className="text-xs font-semibold text-slate-500 mt-0.5">{b.nativeName}</div>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 mt-2.5 leading-relaxed">
                    {b.portalDescription}
                  </p>

                  <div className="mt-3 space-y-1.5 text-xs text-slate-600">
                    <div>
                      <span className="font-bold text-slate-700">Classes: </span>
                      {b.classesCovered}
                    </div>
                    <div>
                      <span className="font-bold text-slate-700">Mediums: </span>
                      {b.mediums.join(", ")}
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {b.featuredSubjects.map((sub, i) => (
                        <span key={i} className="text-[11px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {sub}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <a
                    href={b.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shadow-emerald-600/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open Official SCERT Portal</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: VERIFIED GOVERNMENT PORTALS */}
      {activeTab === "portals" && !searchQuery.trim() && (
        <div className="py-4 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-700 flex items-center justify-center font-black mb-3">
                  TN
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  Tamil Nadu Textbook Corporation (TNTB &amp; ESC)
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Official state textbook portal for Classes 1 to 12 in Tamil &amp; English mediums.
                </p>
              </div>
              <a
                href="https://tnschools.gov.in/textbooks"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Visit tnschools.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-700 flex items-center justify-center font-black mb-3">
                  NCERT
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  NCERT E-Textbooks Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  National digital textbook repository for CBSE &amp; national curriculums (Classes 1-12).
                </p>
              </div>
              <a
                href="https://ncert.nic.in/textbook.php"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-3 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Visit ncert.nic.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <div className="p-5 rounded-3xl bg-white border border-slate-200/90 flex flex-col justify-between">
              <div>
                <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-700 flex items-center justify-center font-black mb-3">
                  DIKSHA
                </div>
                <h3 className="text-sm font-black text-slate-900">
                  DIKSHA National Education Portal
                </h3>
                <p className="text-xs text-slate-500 mt-1">
                  Ministry of Education digital learning platform with QR-coded lessons and worksheets.
                </p>
              </div>
              <a
                href="https://diksha.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 px-3 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition"
              >
                <span>Visit diksha.gov.in</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

      {/* TAB 1: INTERACTIVE FOLDER DIRECTORY (CLASSES 1 TO 12) */}
      {activeTab === "explorer" && !searchQuery.trim() && (
        <div className="py-3 space-y-4">
          {/* Breadcrumb Header Bar */}
          <div className="flex items-center justify-between flex-wrap gap-2 px-3 py-2.5 rounded-2xl bg-white border border-slate-200/90 shadow-2xs">
            <div className="flex items-center gap-1.5 text-xs text-slate-600 flex-wrap">
              <button
                onClick={() => {
                  setSelectedClassLevel(null);
                  setSelectedSubjectId(null);
                }}
                className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1"
              >
                <Folder className="w-3.5 h-3.5 text-blue-600" />
                <span>{currentBoard.shortName}</span>
              </button>

              {currentClass && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <button
                    onClick={() => setSelectedSubjectId(null)}
                    className="font-bold text-slate-800 hover:text-blue-600 flex items-center gap-1"
                  >
                    <Folder className="w-3.5 h-3.5 text-amber-500" />
                    <span>{currentClass.gradeLabel}</span>
                  </button>
                </>
              )}

              {currentSubject && (
                <>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300" />
                  <span className="font-extrabold text-blue-800 flex items-center gap-1">
                    <FileText className="w-3.5 h-3.5 text-blue-600" />
                    <span>{currentSubject.name}</span>
                  </span>
                </>
              )}
            </div>

            {/* Back Button if navigated inside */}
            {(selectedClassLevel !== null || selectedSubjectId !== null) && (
              <button
                onClick={handleGoBack}
                className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Up one folder</span>
              </button>
            )}
          </div>

          {/* LEVEL 1: CLASS FOLDER GRID (IF NO SPECIFIC CLASS SELECTED) */}
          {selectedClassLevel === null && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-black text-slate-900 tracking-tight flex items-center gap-2">
                    <span>{currentBoard.name}</span>
                    <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800">
                      12 Class Folders
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Click any class folder from Class 1 to Class 12 to open its subjects, textbook PDFs, worksheets &amp; guides
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {currentBoard.classes.map((cls) => {
                  const totalMaterials = cls.subjects.reduce((sum, s) => sum + s.materials.length, 0);
                  const stageColor =
                    cls.stage === "primary"
                      ? "border-emerald-200 bg-emerald-50/40 text-emerald-800"
                      : cls.stage === "middle"
                      ? "border-blue-200 bg-blue-50/40 text-blue-800"
                      : cls.stage === "secondary"
                      ? "border-purple-200 bg-purple-50/40 text-purple-800"
                      : "border-amber-200 bg-amber-50/40 text-amber-800";

                  return (
                    <div
                      key={cls.gradeLevel}
                      onClick={() => handleSelectClass(cls.gradeLevel)}
                      className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group text-left"
                    >
                      <div className="flex items-start justify-between">
                        <div className="w-10 h-10 rounded-2xl bg-amber-100/70 text-amber-700 flex items-center justify-center group-hover:scale-105 transition">
                          <Folder className="w-5 h-5 fill-amber-400 text-amber-600" />
                        </div>
                        <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${stageColor}`}>
                          {cls.stage.replace("_", " ")}
                        </span>
                      </div>

                      <div className="mt-3">
                        <div className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition">
                          {cls.gradeLabel}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium mt-0.5">
                          {cls.subjects.length} Subjects
                        </div>
                        <div className="text-[11px] font-bold text-blue-700 mt-1">
                          {totalMaterials} materials
                        </div>
                      </div>

                      <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-semibold">
                        <span>Mediums: {cls.mediumsAvailable.join(", ")}</span>
                        <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition text-slate-400" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 2: SUBJECTS INSIDE SELECTED CLASS */}
          {selectedClassLevel !== null && currentClass && !selectedSubjectId && (
            <div className="space-y-4">
              <div className="p-4 rounded-3xl bg-gradient-to-r from-blue-900 to-indigo-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md">
                <div>
                  <div className="text-xs font-bold text-blue-200 uppercase tracking-wide">
                    {currentBoard.name} • {currentClass.stage.toUpperCase()}
                  </div>
                  <h3 className="text-xl font-black mt-0.5">
                    {currentClass.gradeLabel} Textbook &amp; Learning Materials Folder
                  </h3>
                  <p className="text-xs text-blue-100/80 mt-1">
                    Select a subject folder below to access official full textbooks, solutions guides, worksheets &amp; model exam papers.
                  </p>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  <a
                    href={currentBoard.officialPortalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-xs transition border border-white/20"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Official Portal</span>
                  </a>
                </div>
              </div>

              {/* Subject Folders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                {currentClass.subjects.map((subj) => {
                  const tbCount = subj.materials.filter((m) => m.type === "textbook").length;
                  const guideCount = subj.materials.filter((m) => m.type === "guide").length;
                  const wsCount = subj.materials.filter((m) => m.type === "worksheet").length;
                  const modelCount = subj.materials.filter((m) => m.type === "model_paper").length;
                  const labCount = subj.materials.filter((m) => m.type === "lab_manual").length;

                  return (
                    <div
                      key={subj.id}
                      onClick={() => handleSelectSubject(subj.id)}
                      className="p-4 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group text-left"
                    >
                      <div>
                        <div className="flex items-start justify-between">
                          <div className="w-11 h-11 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center group-hover:scale-105 transition">
                            <Folder className="w-6 h-6 fill-blue-500/30 text-blue-600" />
                          </div>
                          <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                            {subj.category}
                          </span>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-base font-black text-slate-900 group-hover:text-blue-600 transition">
                            {subj.name}
                          </h4>
                          {subj.nativeName && (
                            <p className="text-xs font-semibold text-slate-500 mt-0.5">
                              {subj.nativeName}
                            </p>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap gap-1.5 text-[10px] font-semibold text-slate-600">
                          {tbCount > 0 && <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded">📘 {tbCount} Textbook</span>}
                          {guideCount > 0 && <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded">📗 {guideCount} Guide</span>}
                          {wsCount > 0 && <span className="bg-amber-50 text-amber-700 px-2 py-0.5 rounded">📝 {wsCount} Worksheets</span>}
                          {modelCount > 0 && <span className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded">📊 {modelCount} Papers</span>}
                          {labCount > 0 && <span className="bg-rose-50 text-rose-700 px-2 py-0.5 rounded">🔬 {labCount} Lab</span>}
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600 group-hover:text-blue-700">
                        <span>Open Folder ({subj.materials.length} files)</span>
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* LEVEL 3: MATERIALS INSIDE SELECTED SUBJECT */}
          {selectedClassLevel !== null && currentClass && selectedSubjectId && currentSubject && (
            <div className="space-y-4">
              {/* Subject Top Banner */}
              <div className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
                    <FolderOpen className="w-6 h-6 text-blue-700" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">
                      {currentBoard.shortName} • {currentClass.gradeLabel}
                    </div>
                    <h3 className="text-lg font-black text-slate-900">
                      {currentSubject.name} — {currentSubject.nativeName || "Learning Materials"}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {displayedMaterials.length} materials available • Official PDFs, Book Back Solutions, &amp; Question Papers
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleGoBack}
                    className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1 transition"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Subjects</span>
                  </button>
                </div>
              </div>

              {/* Material Type Filter Chips */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                  Filter:
                </span>
                <button
                  onClick={() => setSelectedMaterialType("all")}
                  className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border ${
                    selectedMaterialType === "all"
                      ? "bg-slate-900 text-white border-slate-900"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  All Materials ({currentSubject.materials.length})
                </button>
                {(["textbook", "guide", "worksheet", "model_paper", "lab_manual"] as MaterialType[]).map((type) => {
                  const count = currentSubject.materials.filter((m) => m.type === type).length;
                  if (count === 0) return null;
                  const meta = MATERIAL_TYPE_META[type];
                  const isSelected = selectedMaterialType === type;
                  return (
                    <button
                      key={type}
                      onClick={() => setSelectedMaterialType(type)}
                      className={`px-3 py-1 rounded-xl text-xs font-bold whitespace-nowrap transition border flex items-center gap-1.5 ${
                        isSelected
                          ? "bg-blue-600 text-white border-blue-600 shadow-xs"
                          : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <span>{meta.label}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                        isSelected ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
                      }`}>
                        {count}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Material Files Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {displayedMaterials.map((mat) => {
                  const meta = MATERIAL_TYPE_META[mat.type];
                  return (
                    <div
                      key={mat.id}
                      className="p-4 sm:p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-blue-500 hover:shadow-md transition flex flex-col justify-between"
                    >
                      <div>
                        {/* Type Badge & Format */}
                        <div className="flex items-center justify-between gap-2">
                          <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${meta.color}`}>
                            {meta.label}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {mat.format.toUpperCase()}
                          </span>
                        </div>

                        {/* Title */}
                        <h4 className="text-base font-black text-slate-900 mt-2 leading-snug">
                          {mat.title}
                        </h4>

                        {mat.nativeTitle && (
                          <div className="text-xs font-bold text-amber-900 mt-0.5">
                            {mat.nativeTitle}
                          </div>
                        )}

                        <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                          {mat.description}
                        </p>

                        {/* Chapter preview list if available */}
                        {mat.chaptersIncluded && mat.chaptersIncluded.length > 0 && (
                          <div className="mt-3 p-2.5 rounded-2xl bg-slate-50 border border-slate-100">
                            <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-500 mb-1">
                              Included Chapters:
                            </div>
                            <div className="space-y-0.5">
                              {mat.chaptersIncluded.slice(0, 4).map((ch, idx) => (
                                <div key={idx} className="text-[11px] font-medium text-slate-700 flex items-center gap-1.5">
                                  <span className="w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                                  <span className="truncate">{ch}</span>
                                </div>
                              ))}
                              {mat.chaptersIncluded.length > 4 && (
                                <div className="text-[10px] font-bold text-blue-600 pl-3">
                                  +{mat.chaptersIncluded.length - 4} more chapters
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Metadata pills */}
                        <div className="flex items-center gap-3 mt-3 text-[11px] text-slate-500 font-medium">
                          {mat.fileSize && <span>💾 {mat.fileSize}</span>}
                          {mat.pagesCount && <span>📄 {mat.pagesCount} pages</span>}
                          {mat.term && (
                            <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700 font-semibold">
                              {mat.term}
                            </span>
                          )}
                          {mat.boardExamYear && (
                            <span className="bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-bold">
                              Exam {mat.boardExamYear}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Action buttons */}
                      <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2">
                        <a
                          href={mat.downloadUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-300" />
                          <span>Download / Open PDF</span>
                        </a>

                        <div className="flex items-center gap-1.5">
                          {onOpenQuestionPaper && (mat.type === "model_paper" || mat.type === "worksheet") && (
                            <button
                              onClick={onOpenQuestionPaper}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition flex items-center gap-1"
                              title="Generate Question Paper from this Chapter"
                            >
                              <GraduationCap className="w-3.5 h-3.5" />
                              <span className="hidden sm:inline">Questions</span>
                            </button>
                          )}

                          <button
                            onClick={() => handleLaunchLessonPlanning(mat, currentSubject, currentClass, currentBoard)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-2xs shadow-blue-600/20"
                            title="Pre-fill and launch AI Lesson Studio with this book chapter"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            <span>Plan Lesson</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
