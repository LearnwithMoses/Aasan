import React, { useState } from "react";
import {
  Calendar as CalendarIcon,
  Sparkles,
  Layers,
  GraduationCap,
  Users,
  Eye,
  Star,
  Settings,
  ChevronRight,
  Plus,
  BookOpen,
  FileEdit,
  Clock,
  CheckCircle2,
  Download,
  Trash2,
  X,
  Volume2,
} from "lucide-react";
import {
  ClassroomActivityItem,
  VocabularyWord,
  AssessmentItem,
  TeacherClassRoster,
  StudentObservationItem,
  UserProfile,
  SavedLessonPlan,
  TeachingNote,
  ScheduledClass,
} from "../types.ts";

interface MoreHubScreenProps {
  userProfile: UserProfile | null;
  activities: ClassroomActivityItem[];
  vocabulary: VocabularyWord[];
  assessments: AssessmentItem[];
  rosters: TeacherClassRoster[];
  observations: StudentObservationItem[];
  savedPlans: SavedLessonPlan[];
  notes: TeachingNote[];
  classes: ScheduledClass[];
  onOpenQuestionPaperModal: () => void;
  onOpenRubricModal: () => void;
  onOpenSyllabusPlannerModal: () => void;
  onOpenBrandModal: () => void;
  onOpenUpgradeModal: () => void;
  onOpenRegistrationModal: () => void;
  onSelectLesson: (plan: SavedLessonPlan) => void;
  onSelectNote: (note: TeachingNote) => void;
  onAddActivity: (activity: ClassroomActivityItem) => void;
  onAddWord: (word: VocabularyWord) => void;
}

type SubTool =
  | "overview"
  | "calendar"
  | "activities"
  | "vocabulary"
  | "assessments"
  | "classes"
  | "observations"
  | "favorites"
  | "settings";

export const MoreHubScreen: React.FC<MoreHubScreenProps> = ({
  userProfile,
  activities,
  vocabulary,
  assessments,
  rosters,
  observations,
  savedPlans,
  notes,
  classes,
  onOpenQuestionPaperModal,
  onOpenRubricModal,
  onOpenSyllabusPlannerModal,
  onOpenBrandModal,
  onOpenUpgradeModal,
  onOpenRegistrationModal,
  onSelectLesson,
  onSelectNote,
  onAddActivity,
  onAddWord,
}) => {
  const [activeTool, setActiveTool] = useState<SubTool>("overview");
  const [selectedActivity, setSelectedActivity] = useState<ClassroomActivityItem | null>(null);
  const [selectedWord, setSelectedWord] = useState<VocabularyWord | null>(null);

  // New word form state
  const [showNewWordModal, setShowNewWordModal] = useState(false);
  const [newWord, setNewWord] = useState("");
  const [newPronunciation, setNewPronunciation] = useState("");
  const [newMeaning, setNewMeaning] = useState("");
  const [newExample, setNewExample] = useState("");
  const [newWordType, setNewWordType] = useState("Noun");

  const handleSaveWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim()) return;
    const wordObj: VocabularyWord = {
      id: `voc_${Date.now()}`,
      word: newWord.trim(),
      pronunciation: newPronunciation.trim() || `/${newWord.toLowerCase()}/`,
      wordType: newWordType,
      meaning: newMeaning.trim(),
      exampleSentence: newExample.trim(),
      synonyms: [],
      antonyms: [],
      subject: "English",
      topic: "Vocabulary",
      grade: "Grade 8",
      isFavorite: false,
    };
    onAddWord(wordObj);
    setShowNewWordModal(false);
    setNewWord("");
    setNewPronunciation("");
    setNewMeaning("");
    setNewExample("");
  };

  const toolCards = [
    {
      id: "calendar" as SubTool,
      title: "Teaching Schedule & Calendar",
      desc: "Daily timetable, periods, assessments & reminders",
      icon: CalendarIcon,
      color: "text-blue-600 bg-blue-50 border-blue-100",
      badge: `${classes.length} Today`,
    },
    {
      id: "activities" as SubTool,
      title: "Classroom Activities",
      desc: "Icebreakers, debates, role plays & revision games",
      icon: Sparkles,
      color: "text-amber-600 bg-amber-50 border-amber-100",
      badge: `${activities.length} Ready`,
    },
    {
      id: "vocabulary" as SubTool,
      title: "Vocabulary Manager",
      desc: "Word definitions, articulation, examples & usage",
      icon: Layers,
      color: "text-purple-600 bg-purple-50 border-purple-100",
      badge: `${vocabulary.length} Words`,
    },
    {
      id: "assessments" as SubTool,
      title: "Assessments & Rubrics",
      desc: "Quizzes, slip tests, CCE scoring & question papers",
      icon: GraduationCap,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
      badge: "Full Suite",
    },
    {
      id: "classes" as SubTool,
      title: "Classes & Student Roster",
      desc: "Grade 8, 9 & 10 sections, student attendance & notes",
      icon: Users,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
      badge: `${rosters.length} Classes`,
    },
    {
      id: "observations" as SubTool,
      title: "Student Observations",
      desc: "Educational notes, strengths & follow-up actions",
      icon: Eye,
      color: "text-rose-600 bg-rose-50 border-rose-100",
      badge: `${observations.length} Logs`,
    },
    {
      id: "favorites" as SubTool,
      title: "Saved Favourites",
      desc: "Quick access to starred lessons, notes & words",
      icon: Star,
      color: "text-amber-500 bg-amber-50 border-amber-100",
      badge: "Starred",
    },
    {
      id: "settings" as SubTool,
      title: "Settings & Teacher Profile",
      desc: "School info, backup & JSON export, about Aasan",
      icon: Settings,
      color: "text-slate-600 bg-slate-50 border-slate-200",
      badge: "Moses",
    },
  ];

  return (
    <div className="space-y-6 pb-20 sm:pb-8">
      {/* Top Header */}
      <div className="flex items-center justify-between pt-1">
        <div className="flex items-center gap-3">
          {activeTool !== "overview" && (
            <button
              onClick={() => setActiveTool("overview")}
              className="p-2 rounded-2xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-bold transition"
            >
              ← All Tools
            </button>
          )}
          <div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">
              {activeTool === "overview" && "Teacher Companion Suite"}
              {activeTool === "calendar" && "Classroom Schedule & Periods"}
              {activeTool === "activities" && "Classroom Activities Library"}
              {activeTool === "vocabulary" && "Vocabulary & Articulation Bank"}
              {activeTool === "assessments" && "Assessments, Rubrics & Blueprints"}
              {activeTool === "classes" && "Classes & Student Rosters"}
              {activeTool === "observations" && "Student Observations & Notes"}
              {activeTool === "favorites" && "Starred Favourites"}
              {activeTool === "settings" && "Settings & Teacher Profile"}
            </h1>
            <p className="text-xs text-slate-500">
              {activeTool === "overview" && "Pedagogical tools for your daily teaching workflow"}
              {activeTool !== "overview" && "Aasan Educational Management Hub"}
            </p>
          </div>
        </div>
      </div>

      {/* OVERVIEW GRID */}
      {activeTool === "overview" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {toolCards.map((tool) => {
            const Icon = tool.icon;
            return (
              <div
                key={tool.id}
                onClick={() => setActiveTool(tool.id)}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-[#263B80] hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center border ${tool.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
                      {tool.badge}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-3 group-hover:text-[#263B80] transition leading-snug">
                    {tool.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {tool.desc}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-[#263B80]">
                  <span>Open Tool</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CALENDAR TOOL */}
      {activeTool === "calendar" && (
        <div className="space-y-4">
          <div className="bg-white rounded-3xl border border-slate-200/80 p-5 space-y-4">
            <h2 className="text-base font-black text-slate-900">Today&apos;s Class Timeline</h2>
            <div className="space-y-3">
              {classes.map((c, i) => (
                <div key={c.id} className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-[#263B80] text-white text-xs font-black flex items-center justify-center">
                      P{i + 1}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#F28B70]">
                        {c.time} • {c.duration} min • {c.room}
                      </div>
                      <div className="text-sm font-bold text-slate-900">{c.topic}</div>
                      <div className="text-xs text-slate-500">{c.grade} • {c.subject}</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-white border border-slate-200 text-slate-700 capitalize">
                    {c.status.replace("_", " ")}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ACTIVITIES TOOL */}
      {activeTool === "activities" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {activities.map((act) => (
              <div
                key={act.id}
                onClick={() => setSelectedActivity(act)}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-amber-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      {act.category}
                    </span>
                    <span className="text-xs font-semibold text-slate-400">{act.duration}</span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 mt-2.5 group-hover:text-amber-700 transition">
                    {act.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed line-clamp-2">
                    {act.purpose}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-amber-700">
                  <span>View Instructions ({act.grouping})</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VOCABULARY TOOL */}
      {activeTool === "vocabulary" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-xs text-slate-500">
              Vocabulary words with pronunciation, meaning, and classroom examples
            </p>
            <button
              onClick={() => setShowNewWordModal(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#263B80] text-white text-xs font-bold flex items-center gap-1 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>+ Add Word</span>
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {vocabulary.map((w) => (
              <div
                key={w.id}
                onClick={() => setSelectedWord(w)}
                className="p-5 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-400 hover:shadow-md transition cursor-pointer flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                      {w.wordType}
                    </span>
                    <span className="text-xs font-semibold text-purple-600/80">{w.pronunciation}</span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 mt-2 group-hover:text-purple-700 transition">
                    {w.word}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed line-clamp-2">
                    {w.meaning}
                  </p>
                  <p className="text-xs italic text-slate-500 mt-2 bg-slate-50 p-2 rounded-xl border border-slate-100 line-clamp-2">
                    &ldquo;{w.exampleSentence}&rdquo;
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-purple-700">
                  <span>{w.subject} • {w.grade}</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ASSESSMENTS TOOL */}
      {activeTool === "assessments" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div
              onClick={onOpenQuestionPaperModal}
              className="p-5 rounded-3xl bg-white border border-purple-200 hover:border-purple-600 hover:shadow-md cursor-pointer transition"
            >
              <div className="text-xs font-bold text-purple-700 uppercase">Board Model Exam</div>
              <div className="text-base font-black text-slate-900 mt-1">Question Papers &amp; Blueprint</div>
              <p className="text-xs text-slate-500 mt-1">
                20-mark slip tests, 40-mark unit exams, 80-mark board papers with answer keys.
              </p>
              <div className="mt-3 text-xs font-bold text-purple-700 flex items-center gap-1">
                <span>Launch Question Generator</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={onOpenRubricModal}
              className="p-5 rounded-3xl bg-white border border-emerald-200 hover:border-emerald-600 hover:shadow-md cursor-pointer transition"
            >
              <div className="text-xs font-bold text-emerald-700 uppercase">CCE Internal 20 Marks</div>
              <div className="text-base font-black text-slate-900 mt-1">4-Level Scoring Rubrics</div>
              <p className="text-xs text-slate-500 mt-1">
                Portfolio, notebook maintenance, subject enrichment labs &amp; oral tests.
              </p>
              <div className="mt-3 text-xs font-bold text-emerald-700 flex items-center gap-1">
                <span>Open Rubric Suite</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            <div
              onClick={onOpenSyllabusPlannerModal}
              className="p-5 rounded-3xl bg-white border border-sky-200 hover:border-sky-600 hover:shadow-md cursor-pointer transition"
            >
              <div className="text-xs font-bold text-sky-700 uppercase">Annual Distribution</div>
              <div className="text-base font-black text-slate-900 mt-1">30-Week Syllabus Scheme</div>
              <p className="text-xs text-slate-500 mt-1">
                Term 1 and Term 2 weekly periods, examination milestones and internal weightage.
              </p>
              <div className="mt-3 text-xs font-bold text-sky-700 flex items-center gap-1">
                <span>Open Syllabus Scheme</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CLASSES & STUDENT ROSTERS TOOL */}
      {activeTool === "classes" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {rosters.map((roster) => (
              <div key={roster.id} className="p-5 rounded-3xl bg-white border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold px-2.5 py-1 rounded-full bg-blue-50 text-[#263B80]">
                    {roster.room}
                  </span>
                  <span className="text-xs text-slate-500 font-bold">
                    {roster.studentCount} Students
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900">
                  {roster.grade} • {roster.section}
                </h3>
                <div className="text-xs text-slate-500 font-medium">Subject: {roster.subject}</div>

                <div className="pt-2 border-t border-slate-100 space-y-2">
                  <div className="text-xs font-bold text-slate-700">Enrolled Students:</div>
                  {roster.students.map((st) => (
                    <div key={st.id} className="p-2 rounded-xl bg-slate-50 text-xs flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">{st.name}</div>
                        <div className="text-[10px] text-slate-500">Roll: {st.rollNumber} • {st.attendanceRate}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* STUDENT OBSERVATIONS TOOL */}
      {activeTool === "observations" && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {observations.map((obs) => (
              <div key={obs.id} className="p-5 rounded-3xl bg-white border border-slate-200 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-[#F28B70]">
                    {obs.grade} {obs.section} • {obs.date}
                  </span>
                  <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {obs.participationLevel}
                  </span>
                </div>
                <h3 className="text-base font-black text-slate-900">{obs.studentName}</h3>
                <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-3 rounded-2xl">
                  {obs.observation}
                </p>
                <div className="text-xs text-slate-600 space-y-1">
                  <div><strong>Strength:</strong> {obs.strength}</div>
                  <div><strong>Growth:</strong> {obs.areaForImprovement}</div>
                  <div className="text-[#263B80]"><strong>Action:</strong> {obs.followUpAction}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* FAVORITES TOOL */}
      {activeTool === "favorites" && (
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-slate-800">Starred Lesson Plans &amp; Notes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {savedPlans.filter((p) => p.isFavorite).map((p) => (
              <div
                key={p.id}
                onClick={() => onSelectLesson(p)}
                className="p-4 rounded-2xl bg-white border border-amber-200 cursor-pointer hover:shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-700">{p.grade} • {p.subject}</div>
                  <div className="text-sm font-bold text-slate-900">{p.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </div>
            ))}

            {notes.filter((n) => n.isFavorite).map((n) => (
              <div
                key={n.id}
                onClick={() => onSelectNote(n)}
                className="p-4 rounded-2xl bg-white border border-amber-200 cursor-pointer hover:shadow-xs flex items-center justify-between"
              >
                <div>
                  <div className="text-xs font-bold text-amber-700">{n.grade} • {n.subject}</div>
                  <div className="text-sm font-bold text-slate-900">{n.title}</div>
                </div>
                <ChevronRight className="w-4 h-4 text-amber-600" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SETTINGS TOOL */}
      {activeTool === "settings" && (
        <div className="space-y-4 max-w-xl">
          <div className="p-5 rounded-3xl bg-white border border-slate-200 space-y-4">
            <h2 className="text-base font-black text-slate-900">Teacher Profile</h2>
            <div className="space-y-2 text-xs text-slate-700">
              <div><strong>Name:</strong> {userProfile?.name || "Moses"}</div>
              <div><strong>School:</strong> {userProfile?.school || "National Model Academy"}</div>
              <div><strong>Subjects:</strong> English, Psychology</div>
              <div><strong>Classes:</strong> Grade 8, Grade 9, Grade 10</div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex flex-wrap gap-2">
              <button
                onClick={onOpenBrandModal}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-xs font-bold text-slate-800"
              >
                About Aasan (ஆசான்)
              </button>
              <button
                onClick={onOpenUpgradeModal}
                className="px-3.5 py-2 rounded-xl bg-[#F28B70] text-white text-xs font-bold hover:bg-[#e07559]"
              >
                Pro Subscription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                {selectedActivity.category} • {selectedActivity.duration}
              </span>
              <button onClick={() => setSelectedActivity(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <h3 className="text-lg font-black text-slate-900">{selectedActivity.title}</h3>
            <p className="text-xs text-slate-600">{selectedActivity.purpose}</p>

            <div>
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">Classroom Instructions</h4>
              <ol className="list-decimal pl-5 text-xs text-slate-700 space-y-1.5">
                {selectedActivity.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ol>
            </div>

            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900">
              <strong>Learning Outcome:</strong> {selectedActivity.learningOutcome}
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 rounded-xl bg-[#263B80] text-white text-xs font-bold"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Word Detail Modal */}
      {selectedWord && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200">
                {selectedWord.wordType} • {selectedWord.grade}
              </span>
              <button onClick={() => setSelectedWord(null)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-2xl font-black text-slate-900">{selectedWord.word}</h3>
              <div className="text-xs font-bold text-purple-600 mt-0.5">{selectedWord.pronunciation}</div>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 text-xs text-slate-800 leading-relaxed">
              <strong>Meaning:</strong> {selectedWord.meaning}
            </div>

            <div className="p-3.5 rounded-2xl bg-purple-50/50 border border-purple-100 text-xs text-purple-950 italic">
              <strong>Example:</strong> &ldquo;{selectedWord.exampleSentence}&rdquo;
            </div>

            {selectedWord.synonyms.length > 0 && (
              <div className="text-xs text-slate-600">
                <strong>Synonyms:</strong> {selectedWord.synonyms.join(", ")}
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedWord(null)}
                className="px-4 py-2 rounded-xl bg-[#263B80] text-white text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Word Modal */}
      {showNewWordModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-black text-slate-900">Add Vocabulary Word</h3>
              <button onClick={() => setShowNewWordModal(false)} className="p-1 text-slate-400 hover:text-slate-700">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveWord} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Word *</label>
                <input
                  type="text"
                  required
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  placeholder="e.g. Articulation, Resilience"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Pronunciation (IPA)</label>
                <input
                  type="text"
                  value={newPronunciation}
                  onChange={(e) => setNewPronunciation(e.target.value)}
                  placeholder="/ɑːrˌtɪk.jəˈleɪ.ʃən/"
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Meaning / Definition *</label>
                <textarea
                  rows={2}
                  required
                  value={newMeaning}
                  onChange={(e) => setNewMeaning(e.target.value)}
                  placeholder="Clear definition of the word..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  placeholder="In a sentence..."
                  className="w-full p-2.5 rounded-xl border border-slate-200"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowNewWordModal(false)}
                  className="px-3.5 py-2 rounded-xl border border-slate-200 text-slate-600 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#263B80] text-white font-bold"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
