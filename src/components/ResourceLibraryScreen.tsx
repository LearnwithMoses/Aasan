import React, { useState } from "react";
import {
  Search,
  FolderArchive,
  BookOpen,
  FileText,
  GraduationCap,
  Layers,
  Sparkles,
  Download,
  Printer,
  ExternalLink,
  Star,
  ChevronRight,
  Filter,
  FolderOpen,
} from "lucide-react";
import { SavedLessonPlan, ClassroomActivityItem, VocabularyWord } from "../types.ts";
import { TextbooksFolderExplorer } from "./TextbooksFolderExplorer.tsx";

interface ResourceLibraryScreenProps {
  savedPlans: SavedLessonPlan[];
  activities: ClassroomActivityItem[];
  vocabulary: VocabularyWord[];
  onOpenTextbookDrawer: () => void;
  onOpenQuestionPaperModal: () => void;
  onOpenRubricModal: () => void;
  onOpenSyllabusPlannerModal: () => void;
  onSelectLesson: (plan: SavedLessonPlan) => void;
  onSelectActivity: (activity: ClassroomActivityItem) => void;
  onSelectWord: (word: VocabularyWord) => void;
  onSelectMaterialForLesson?: (
    curriculum: string,
    grade: string,
    subject: string,
    topic: string,
    resources?: string
  ) => void;
}

export const ResourceLibraryScreen: React.FC<ResourceLibraryScreenProps> = ({
  savedPlans,
  activities,
  vocabulary,
  onOpenTextbookDrawer,
  onOpenQuestionPaperModal,
  onOpenRubricModal,
  onOpenSyllabusPlannerModal,
  onSelectLesson,
  onSelectActivity,
  onSelectWord,
  onSelectMaterialForLesson,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const categories = [
    { id: "all", label: "All Resources", count: savedPlans.length + activities.length + vocabulary.length + 80 },
    { id: "textbooks", label: "பாடநூல் பெட்டகம் (1-12)", icon: FolderOpen, count: "All 1-12" },
    { id: "worksheets", label: "Worksheets & Practice", icon: FileText, count: savedPlans.length },
    { id: "activities", label: "Classroom Activities", icon: Sparkles, count: activities.length },
    { id: "assessments", label: "Assessments & Rubrics", icon: GraduationCap, count: 6 },
    { id: "vocabulary", label: "Vocabulary Bank", icon: Layers, count: vocabulary.length },
  ];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Screen Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
            <span>Resource Library</span>
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
              Curated Hub
            </span>
          </h1>
          <p className="text-xs text-slate-500">
            Official NCERT textbooks, student worksheets, activities &amp; printable materials
          </p>
        </div>

        <button
          onClick={onOpenTextbookDrawer}
          className="px-4 py-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/15 transition w-fit"
        >
          <BookOpen className="w-4 h-4" />
          <span>Browse Official Textbooks</span>
        </button>
      </div>

      {/* Category Cards (3-column visual grid inspired by Blood Bridge) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {categories.map((cat) => (
          <button
            key={cat.id}
            type="button"
            onClick={() => setActiveCategory(cat.id)}
            className={`p-3.5 rounded-2xl border text-left transition flex flex-col justify-between ${
              activeCategory === cat.id
                ? "bg-[#263B80] text-white border-[#263B80] shadow-md shadow-[#263B80]/15"
                : "bg-white border-slate-200/80 text-slate-800 hover:border-slate-300"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                activeCategory === cat.id ? "bg-white/20 text-white" : "bg-slate-100 text-slate-600"
              }`}>
                {cat.count}
              </span>
            </div>
            <div className="mt-3">
              <div className="text-xs font-extrabold leading-tight">{cat.label}</div>
            </div>
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search worksheets, textbook chapters, activities..."
          className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200/80 text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-500/20 focus:outline-hidden"
        />
      </div>

      {/* If Textbooks Category is selected, embed the Full Board-Wise 1-12 Folder Explorer */}
      {activeCategory === "textbooks" ? (
        <div className="space-y-4">
          <TextbooksFolderExplorer
            embedded={true}
            onSelectMaterialForLesson={onSelectMaterialForLesson}
            onOpenQuestionPaper={onOpenQuestionPaperModal}
          />
        </div>
      ) : (
        <>
          {/* Prominent Textbooks & Materials Folder Banner */}
          <div
            onClick={() => setActiveCategory("textbooks")}
            className="p-5 rounded-3xl bg-gradient-to-r from-[#263B80] via-[#1e2f69] to-[#0f172a] text-white cursor-pointer hover:shadow-xl transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-blue-900/40"
          >
            <div className="flex items-start sm:items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300 shrink-0">
                <FolderOpen className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-slate-950">
                    Master Folder
                  </span>
                  <span className="text-xs text-blue-200 font-bold">
                    Classes 1 - 12 • All Mediums
                  </span>
                </div>
                <h3 className="text-base sm:text-lg font-black mt-1 text-white">
                  பாடநூல் பெட்டகம் • All Textbooks &amp; Materials Folder
                </h3>
                <p className="text-xs text-blue-200/80 mt-0.5 max-w-xl leading-relaxed">
                  Tamil Nadu State Board (Samacheer Kalvi), CBSE/NCERT &amp; ICSE. Official textbook PDFs, guides, worksheets, PTA model papers, and lab manuals organized class-wise.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setActiveCategory("textbooks");
              }}
              className="px-4 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold flex items-center gap-1.5 transition self-start sm:self-auto shrink-0 shadow-md"
            >
              <FolderOpen className="w-3.5 h-3.5" />
              <span>Explore All Folders</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Featured Quick Tool Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Banner 1: Question Papers */}
            <div
              onClick={onOpenQuestionPaperModal}
              className="p-4 rounded-3xl bg-gradient-to-br from-purple-900 to-indigo-900 text-white cursor-pointer hover:shadow-lg transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Board Blueprint
                </span>
                <div className="text-sm font-black mt-1">Question Papers</div>
                <div className="text-[11px] text-purple-200 mt-0.5">
                  Unit tests, slip tests &amp; 80-mark board papers
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-purple-200 group-hover:text-purple-900 flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Banner 2: 20-Mark CCE Rubrics */}
            <div
              onClick={onOpenRubricModal}
              className="p-4 rounded-3xl bg-gradient-to-br from-emerald-900 to-teal-900 text-white cursor-pointer hover:shadow-lg transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  CCE Internal
                </span>
                <div className="text-sm font-black mt-1">Scoring Rubrics</div>
                <div className="text-[11px] text-emerald-200 mt-0.5">
                  4-level criteria for notebook &amp; labs
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-emerald-200 group-hover:text-emerald-900 flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            {/* Banner 3: Academic Syllabus Planner */}
            <div
              onClick={onOpenSyllabusPlannerModal}
              className="p-4 rounded-3xl bg-gradient-to-br from-sky-900 to-blue-950 text-white cursor-pointer hover:shadow-lg transition flex items-center justify-between group"
            >
              <div>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-white/20 text-white">
                  Yearly Scheme
                </span>
                <div className="text-sm font-black mt-1">Syllabus Planner</div>
                <div className="text-[11px] text-sky-200 mt-0.5">
                  30-week term distribution &amp; exam portions
                </div>
              </div>
              <div className="w-8 h-8 rounded-full bg-white/20 group-hover:bg-white text-sky-200 group-hover:text-sky-950 flex items-center justify-center transition">
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Resource Cards Section */}
          <div className="space-y-4">
            <h2 className="text-base font-black text-slate-900 tracking-tight">
              Available Teaching Materials
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {/* Worksheets from lesson plans */}
              {savedPlans.map((plan) => (
                <div
                  key={`ws-${plan.id}`}
                  onClick={() => onSelectLesson(plan)}
                  className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                        Worksheet &amp; Plan
                      </span>
                      <span className="text-[11px] text-slate-400">{plan.grade}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-emerald-700 transition leading-snug">
                      {plan.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                      Complete classroom exercises, exit ticket questions, and discussion prompts.
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-emerald-700 font-bold">
                    <span>View &amp; Print Material</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}

              {/* Activities */}
              {activities.map((act) => (
                <div
                  key={`act-${act.id}`}
                  onClick={() => onSelectActivity(act)}
                  className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-blue-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
                >
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-50 text-[#263B80] border border-blue-200">
                        {act.category}
                      </span>
                      <span className="text-[11px] text-slate-400">{act.duration}</span>
                    </div>
                    <h3 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-[#263B80] transition leading-snug">
                      {act.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2">{act.purpose}</p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#263B80] font-bold">
                    <span>Classroom Instructions</span>
                    <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}

              {/* Official Textbook Quick Card */}
              <div
                onClick={() => setActiveCategory("textbooks")}
                className="p-4 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-500 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      Official Textbooks
                    </span>
                    <span className="text-[11px] text-slate-400">All 1-12 Boards</span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mt-2 group-hover:text-purple-700 transition leading-snug">
                    Tamil Nadu &amp; NCERT Classes 1 to 12
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                    Official Government PDFs, book back solutions, PTA model papers and Tamil/English medium books.
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-purple-700 font-bold">
                  <span>Open Folders (Classes 1 - 12)</span>
                  <ChevronRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
