import React, { useState, useRef, useEffect } from "react";
import { Header } from "./components/Header.tsx";
import { LessonForm } from "./components/LessonForm.tsx";
import { LessonOutput } from "./components/LessonOutput.tsx";
import { RegistrationModal } from "./components/RegistrationModal.tsx";
import { UpgradeModal } from "./components/UpgradeModal.tsx";
import { WorksheetModal } from "./components/WorksheetModal.tsx";
import { BlackboardModal } from "./components/BlackboardModal.tsx";
import { ScriptModal } from "./components/ScriptModal.tsx";
import { QuestionPaperModal } from "./components/QuestionPaperModal.tsx";
import { RubricModal } from "./components/RubricModal.tsx";
import { SyllabusPlannerModal } from "./components/SyllabusPlannerModal.tsx";
import { SavedPlansDrawer } from "./components/SavedPlansDrawer.tsx";
import { AasaanBrandModal } from "./components/AasaanBrandModal.tsx";
import { AasaanLogo } from "./components/AasaanLogo.tsx";
import { AndroidPublishModal } from "./components/AndroidPublishModal.tsx";
import { TextbookChaptersDrawer } from "./components/TextbookChaptersDrawer.tsx";
import { OfflineIndicator } from "./components/OfflineIndicator.tsx";
import { PWAInstallButton } from "./components/PWAInstallButton.tsx";
import { BottomNavBar, AppNavTab } from "./components/BottomNavBar.tsx";
import { TeacherGuideModal } from "./components/TeacherGuideModal.tsx";
import { NotificationsModal } from "./components/NotificationsModal.tsx";

// Teacher Companion Screens & Modals
import { HomeScreen } from "./components/HomeScreen.tsx";
import { LessonsScreen } from "./components/LessonsScreen.tsx";
import { TeachingNotesScreen } from "./components/TeachingNotesScreen.tsx";
import { ResourceLibraryScreen } from "./components/ResourceLibraryScreen.tsx";
import { MoreHubScreen } from "./components/MoreHubScreen.tsx";
import { ClassTeachingModal } from "./components/ClassTeachingModal.tsx";
import { QuickNoteModal } from "./components/QuickNoteModal.tsx";
import { GuidedLessonModal } from "./components/GuidedLessonModal.tsx";
import { LessonDetailModal } from "./components/LessonDetailModal.tsx";
import { GlobalSearchModal } from "./components/GlobalSearchModal.tsx";

import {
  LessonPlan,
  LessonPlanRequest,
  UserProfile,
  StudentWorksheet,
  BlackboardLayout,
  TeacherExplanationScript,
  SavedLessonPlan,
  InternalAssessmentRubric,
  AcademicSyllabusPlanner,
  ScheduledClass,
  TeachingNote,
  ClassroomActivityItem,
  VocabularyWord,
  AssessmentItem,
  TeacherClassRoster,
  StudentObservationItem,
  TeachingReminder,
} from "./types.ts";
import {
  getUserProfile,
  isProUser,
  getProDaysRemaining,
  getSavedPlans,
  savePlanToVault,
  deleteSavedPlan,
  toggleFavoritePlan,
} from "./data/storage.ts";
import {
  getScheduledClasses,
  saveScheduledClass,
  getTeachingNotes,
  saveTeachingNote,
  deleteTeachingNote,
  toggleFavoriteNote,
  getClassroomActivities,
  saveClassroomActivity,
  getVocabularyWords,
  saveVocabularyWord,
  getAssessments,
  getTeacherRosters,
  getStudentObservations,
  getTeachingReminders,
  toggleReminderCompleted,
} from "./data/teacherCompanionStore.ts";
import {
  SlidersHorizontal,
  FileText,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Gift,
  X,
} from "lucide-react";

const INITIAL_FORM: LessonPlanRequest = {
  curriculum: "CBSE / NCERT",
  grade: "Class 8",
  subject: "English",
  topic: "Active and Passive Voice in Context",
  duration: 45,
  classStrength: "38",
  lessonModel: "5E",
  objectives:
    "Identify active vs passive constructions in newspaper articles, convert active sentences to passive, and understand stylistic reasons for using passive voice.",
  priorKnowledge:
    "Subject-verb-object syntax, transitive vs intransitive verbs, past participles.",
  language: "English",
  resources:
    "Blackboard, NCERT reader, newspaper clippings, student practice worksheets.",
  differentiation:
    "Sentence starter scaffolds for struggling learners; editorial writing prompt for advanced learners.",
  specialRequirements:
    "Include a 5-minute exit ticket to verify individual mastery before class ends.",
  aiEngine: "gemini",
};

export default function App() {
  const [formData, setFormData] = useState<LessonPlanRequest>(INITIAL_FORM);
  const [plan, setPlan] = useState<LessonPlan | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMobileTab, setActiveMobileTab] = useState<"form" | "plan">("form");

  // Pro & User profile state
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [isPro, setIsPro] = useState<boolean>(false);
  const [proDaysRemaining, setProDaysRemaining] = useState<number>(0);
  const [savedPlans, setSavedPlans] = useState<SavedLessonPlan[]>([]);
  const [dismissBanner, setDismissBanner] = useState<boolean>(false);

  // Active Navigation Tab: "home" | "lessons" | "notes" | "resources" | "more"
  const [activeNavTab, setActiveNavTab] = useState<AppNavTab>("home");
  const [showAIGeneratorView, setShowAIGeneratorView] = useState<boolean>(false);

  // Teacher Companion Entity States
  const [classes, setClasses] = useState<ScheduledClass[]>([]);
  const [notes, setNotes] = useState<TeachingNote[]>([]);
  const [activities, setActivities] = useState<ClassroomActivityItem[]>([]);
  const [vocabulary, setVocabulary] = useState<VocabularyWord[]>([]);
  const [assessments, setAssessments] = useState<AssessmentItem[]>([]);
  const [rosters, setRosters] = useState<TeacherClassRoster[]>([]);
  const [observations, setObservations] = useState<StudentObservationItem[]>([]);
  const [reminders, setReminders] = useState<TeachingReminder[]>([]);

  // Modals state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAndroidPublishOpen, setIsAndroidPublishOpen] = useState(false);
  const [isGlobalTextbookOpen, setIsGlobalTextbookOpen] = useState(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);

  // Teacher Companion Specific Modals
  const [selectedClassForTeaching, setSelectedClassForTeaching] = useState<ScheduledClass | null>(null);
  const [isQuickNoteOpen, setIsQuickNoteOpen] = useState(false);
  const [noteToEdit, setNoteToEdit] = useState<TeachingNote | null>(null);
  const [isGuidedLessonOpen, setIsGuidedLessonOpen] = useState(false);
  const [selectedLessonForDetail, setSelectedLessonForDetail] = useState<SavedLessonPlan | null>(null);
  const [isGlobalSearchOpen, setIsGlobalSearchOpen] = useState(false);

  // Pro features state
  const [isWorksheetOpen, setIsWorksheetOpen] = useState(false);
  const [worksheet, setWorksheet] = useState<StudentWorksheet | null>(null);
  const [isGeneratingWorksheet, setIsGeneratingWorksheet] = useState(false);

  const [isBlackboardOpen, setIsBlackboardOpen] = useState(false);
  const [blackboard, setBlackboard] = useState<BlackboardLayout | null>(null);
  const [isGeneratingBlackboard, setIsGeneratingBlackboard] = useState(false);

  const [isScriptOpen, setIsScriptOpen] = useState(false);
  const [script, setScript] = useState<TeacherExplanationScript | null>(null);
  const [isGeneratingScript, setIsGeneratingScript] = useState(false);

  const [isQuestionPaperOpen, setIsQuestionPaperOpen] = useState(false);

  const [isRubricOpen, setIsRubricOpen] = useState(false);
  const [rubric, setRubric] = useState<InternalAssessmentRubric | null>(null);

  const [isSyllabusOpen, setIsSyllabusOpen] = useState(false);
  const [syllabusPlanner, setSyllabusPlanner] = useState<AcademicSyllabusPlanner | null>(null);

  const [isBrandModalOpen, setIsBrandModalOpen] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLDivElement>(null);

  // Load all data on mount
  useEffect(() => {
    refreshProStatus();
    setSavedPlans(getSavedPlans());
    setClasses(getScheduledClasses());
    setNotes(getTeachingNotes());
    setActivities(getClassroomActivities());
    setVocabulary(getVocabularyWords());
    setAssessments(getAssessments());
    setRosters(getTeacherRosters());
    setObservations(getStudentObservations());
    setReminders(getTeachingReminders());
  }, []);

  const refreshProStatus = () => {
    const profile = getUserProfile();
    setUserProfile(profile);
    const active = isProUser();
    setIsPro(active);
    setProDaysRemaining(getProDaysRemaining());
  };

  const handleFieldChange = (field: keyof LessonPlanRequest, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectPreset = (preset: LessonPlanRequest) => {
    setFormData(preset);
    setError(null);
  };

  const handleReset = () => {
    setFormData({
      curriculum: "CBSE / NCERT",
      grade: "",
      subject: "",
      topic: "",
      duration: 40,
      classStrength: "",
      lessonModel: "5E",
      objectives: "",
      priorKnowledge: "",
      language: "English",
      resources: "",
      differentiation: "",
      specialRequirements: "",
      aiEngine: "gemini",
    });
    setPlan(null);
    setWorksheet(null);
    setBlackboard(null);
    setScript(null);
    setRubric(null);
    setSyllabusPlanner(null);
    setError(null);
    setActiveMobileTab("form");
  };

  const handleGenerate = async () => {
    if (!formData.topic.trim()) {
      setError("Please specify a Topic or Chapter before generating.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-lesson-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate lesson plan");
      }

      setPlan(data.plan);
      setWorksheet(null);
      setBlackboard(null);
      setScript(null);
      setRubric(null);
      setSyllabusPlanner(null);
      setActiveMobileTab("plan");

      // Auto save generated plan to vault
      savePlanToVault(data.plan, formData);
      setSavedPlans(getSavedPlans());

      setTimeout(() => {
        if (outputRef.current) {
          outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, 100);
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred while generating the plan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Print-Ready Student Worksheet
  const handleGenerateWorksheet = async () => {
    if (!plan) return;
    setIsWorksheetOpen(true);
    if (worksheet) return;

    setIsGeneratingWorksheet(true);
    try {
      const res = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          formData,
          schoolName: userProfile?.school || "National Model Academy",
        }),
      });
      const data = await res.json();
      if (data.worksheet) {
        setWorksheet(data.worksheet);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingWorksheet(false);
    }
  };

  // Generate Blackboard Layout
  const handleGenerateBlackboard = async () => {
    if (!plan) return;
    setIsBlackboardOpen(true);
    if (blackboard) return;

    setIsGeneratingBlackboard(true);
    try {
      const res = await fetch("/api/generate-blackboard", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, formData }),
      });
      const data = await res.json();
      if (data.blackboard) {
        setBlackboard(data.blackboard);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingBlackboard(false);
    }
  };

  // Generate Teacher Explanation Script
  const handleGenerateScript = async () => {
    if (!plan) return;
    setIsScriptOpen(true);
    if (script) return;

    setIsGeneratingScript(true);
    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, formData }),
      });
      const data = await res.json();
      if (data.script) {
        setScript(data.script);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsGeneratingScript(false);
    }
  };

  // Save Plan to Vault
  const handleSaveToVault = (currentPlan: LessonPlan) => {
    savePlanToVault(
      currentPlan,
      formData,
      worksheet || undefined,
      blackboard || undefined,
      script || undefined,
      undefined,
      rubric || undefined,
      syllabusPlanner || undefined
    );
    setSavedPlans(getSavedPlans());
  };

  // Load Plan from Vault
  const handleLoadPlan = (saved: SavedLessonPlan) => {
    setPlan(saved.plan);
    setFormData(saved.formData);
    if (saved.worksheet) setWorksheet(saved.worksheet);
    if (saved.blackboard) setBlackboard(saved.blackboard);
    if (saved.script) setScript(saved.script);
    if (saved.rubric) setRubric(saved.rubric);
    if (saved.syllabusPlanner) setSyllabusPlanner(saved.syllabusPlanner);
    setSelectedLessonForDetail(saved);
  };

  // Duplicate Plan
  const handleDuplicatePlan = (saved: SavedLessonPlan) => {
    const duplicatedPlan: LessonPlan = {
      ...saved.plan,
      title: `${saved.plan.title} (Copy)`,
    };
    savePlanToVault(duplicatedPlan, {
      ...saved.formData,
      topic: `${saved.formData.topic} (Copy)`,
    });
    setSavedPlans(getSavedPlans());
  };

  // Delete Plan
  const handleDeleteSavedPlan = (id: string) => {
    deleteSavedPlan(id);
    setSavedPlans(getSavedPlans());
  };

  // Toggle Favorite Plan
  const handleToggleFavoritePlan = (id: string) => {
    toggleFavoritePlan(id);
    setSavedPlans(getSavedPlans());
    if (selectedLessonForDetail && selectedLessonForDetail.id === id) {
      setSelectedLessonForDetail({
        ...selectedLessonForDetail,
        isFavorite: !selectedLessonForDetail.isFavorite,
      });
    }
  };

  // Save Guided Lesson from Wizard
  const handleSaveGuidedLesson = (newPlan: SavedLessonPlan) => {
    savePlanToVault(newPlan.plan, newPlan.formData);
    setSavedPlans(getSavedPlans());
    setPlan(newPlan.plan);
    setFormData(newPlan.formData);
    setSelectedLessonForDetail(newPlan);
  };

  // Scheduled Class Actions
  const handleSaveClass = (updated: ScheduledClass) => {
    saveScheduledClass(updated);
    setClasses(getScheduledClasses());
  };

  // Teaching Note Actions
  const handleSaveNote = (note: TeachingNote) => {
    saveTeachingNote(note);
    setNotes(getTeachingNotes());
  };

  const handleDeleteNote = (id: string) => {
    deleteTeachingNote(id);
    setNotes(getTeachingNotes());
  };

  const handleToggleFavoriteNote = (id: string) => {
    toggleFavoriteNote(id);
    setNotes(getTeachingNotes());
  };

  // Reminder toggle
  const handleToggleReminder = (id: string) => {
    toggleReminderCompleted(id);
    setReminders(getTeachingReminders());
  };

  const handleGoToForm = () => {
    setActiveNavTab("lessons");
    setShowAIGeneratorView(true);
    setActiveMobileTab("form");
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoToPlan = () => {
    setActiveNavTab("lessons");
    setShowAIGeneratorView(true);
    setActiveMobileTab("plan");
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] text-slate-900 selection:bg-[#263B80] selection:text-white pb-14 sm:pb-0">
      {/* Top Main Navigation Header */}
      <Header
        isPro={isPro}
        proDaysRemaining={proDaysRemaining}
        userProfile={userProfile}
        savedPlansCount={savedPlans.length}
        onOpenVault={() => setIsVaultOpen(true)}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onOpenQuestionPaper={() => setIsQuestionPaperOpen(true)}
        onOpenBrandModal={() => setIsBrandModalOpen(true)}
        onOpenAndroidPublish={() => setIsAndroidPublishOpen(true)}
        onOpenTextbookDrawer={() => setIsGlobalTextbookOpen(true)}
        onOpenNotifications={() => setIsNotificationsOpen(true)}
        onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
        hasPlan={Boolean(plan)}
        onPrint={() => window.print()}
      />

      {/* Trial / Active Pro Promotion Banner */}
      {!dismissBanner && (
        <div className="no-print bg-[#263B80] text-white px-4 py-2.5 text-xs">
          <div className="max-w-[1250px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isPro ? (
                <>
                  <Sparkles className="w-4 h-4 text-amber-300 shrink-0" />
                  <span>
                    <strong>Aasan Pro Active (ஆசான் புரோ):</strong> You have {proDaysRemaining} days of full
                    unlimited access to all lesson generators, board papers, and printable worksheets!
                  </span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>
                    <strong>1st Month Free Trial:</strong> Complete your basic teacher details to unlock 30 days
                    of all Pro features free. Subsequent months are just ₹50/mo.
                  </span>
                  <button
                    onClick={() => setIsRegistrationOpen(true)}
                    className="ml-2 underline font-bold text-amber-300 hover:text-amber-200"
                  >
                    Activate Now →
                  </button>
                </>
              )}
            </div>
            <button
              onClick={() => setDismissBanner(true)}
              className="text-slate-400 hover:text-white p-0.5 rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA BY ACTIVE TAB */}
      <main className="max-w-[1250px] w-full mx-auto my-3 sm:my-5 px-4 sm:px-6 flex-1">
        {/* TAB 1: HOME SCREEN (Dashboard, Today's Classes, Quick Actions, Reminders) */}
        {activeNavTab === "home" && (
          <HomeScreen
            userProfile={userProfile}
            classes={classes}
            recentLessons={savedPlans}
            recentNotes={notes}
            reminders={reminders}
            onOpenClass={(cls) => setSelectedClassForTeaching(cls)}
            onNavigateTab={(tab) => {
              setActiveNavTab(tab);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onOpenCreateLesson={() => setIsGuidedLessonOpen(true)}
            onOpenQuickNote={() => {
              setNoteToEdit(null);
              setIsQuickNoteOpen(true);
            }}
            onToggleReminder={handleToggleReminder}
            onOpenSearch={() => setIsGlobalSearchOpen(true)}
            onOpenNotifications={() => setIsNotificationsOpen(true)}
          />
        )}

        {/* TAB 2: LESSONS (Lesson Library OR AI Studio Generator) */}
        {activeNavTab === "lessons" && (
          <div>
            {showAIGeneratorView ? (
              <div className="space-y-4">
                {/* Back to library banner */}
                <div className="flex items-center justify-between bg-white p-3 rounded-2xl border border-slate-200/80">
                  <button
                    onClick={() => setShowAIGeneratorView(false)}
                    className="text-xs font-bold text-[#263B80] hover:underline flex items-center gap-1.5"
                  >
                    ← Back to Lesson Plans Library
                  </button>
                  <span className="text-xs font-extrabold text-slate-700">
                    Aasan AI Lesson Studio
                  </span>
                </div>

                {/* Mobile/Tablet Sticky Section Switcher for Generator */}
                <div className="lg:hidden no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5 rounded-2xl shadow-xs">
                  <div className="flex items-center gap-2 max-w-md mx-auto bg-slate-100 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={handleGoToForm}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                        activeMobileTab === "form"
                          ? "bg-[#263B80] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5" />
                      <span>1. Lesson Details</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleGoToPlan}
                      className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
                        activeMobileTab === "plan"
                          ? "bg-[#263B80] text-white shadow-xs"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>2. Generated Plan</span>
                      {plan && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-semibold ml-1">
                          Ready
                        </span>
                      )}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-6 items-start">
                  <div
                    ref={formRef}
                    className={`w-full ${activeMobileTab === "form" ? "block" : "hidden lg:block"}`}
                  >
                    <LessonForm
                      formData={formData}
                      onChange={handleFieldChange}
                      onSelectPreset={handleSelectPreset}
                      onReset={handleReset}
                      onSubmit={handleGenerate}
                      isLoading={isLoading}
                      isPro={isPro}
                      onOpenUpgrade={() => setIsUpgradeOpen(true)}
                    />
                  </div>

                  <div
                    ref={outputRef}
                    className={`w-full min-w-0 ${activeMobileTab === "plan" ? "block" : "hidden lg:block"}`}
                  >
                    <LessonOutput
                      plan={plan}
                      formData={formData}
                      isLoading={isLoading}
                      error={error}
                      isPro={isPro}
                      onRetry={handleGenerate}
                      onEditDetails={handleGoToForm}
                      onOpenWorksheet={handleGenerateWorksheet}
                      onOpenBlackboard={handleGenerateBlackboard}
                      onOpenScript={handleGenerateScript}
                      onOpenQuestionPaper={() => setIsQuestionPaperOpen(true)}
                      onOpenRubric={() => setIsRubricOpen(true)}
                      onOpenSyllabusPlanner={() => setIsSyllabusOpen(true)}
                      onSaveToVault={handleSaveToVault}
                      onOpenUpgrade={() => setIsUpgradeOpen(true)}
                      onOpenTextbooks={() => setIsGlobalTextbookOpen(true)}
                      onOpenVault={() => setIsVaultOpen(true)}
                      onOpenTeacherGuide={() => setIsTeacherGuideOpen(true)}
                      onOpenAndroidPublish={() => setIsAndroidPublishOpen(true)}
                    />
                  </div>
                </div>
              </div>
            ) : (
              <LessonsScreen
                savedPlans={savedPlans}
                onOpenPlanDetail={(p) => setSelectedLessonForDetail(p)}
                onOpenCreateLesson={() => setIsGuidedLessonOpen(true)}
                onOpenAIGenerator={() => setShowAIGeneratorView(true)}
                onDuplicatePlan={handleDuplicatePlan}
                onToggleFavorite={handleToggleFavoritePlan}
              />
            )}
          </div>
        )}

        {/* TAB 3: NOTES (Teaching Notes, Key Points, Next-Class Actions) */}
        {activeNavTab === "notes" && (
          <TeachingNotesScreen
            notes={notes}
            onOpenNewNote={() => {
              setNoteToEdit(null);
              setIsQuickNoteOpen(true);
            }}
            onEditNote={(n) => {
              setNoteToEdit(n);
              setIsQuickNoteOpen(true);
            }}
            onDeleteNote={handleDeleteNote}
            onToggleFavorite={handleToggleFavoriteNote}
          />
        )}

        {/* TAB 4: RESOURCES (Official Textbooks, Worksheets, Activities, Rubrics) */}
        {activeNavTab === "resources" && (
          <ResourceLibraryScreen
            savedPlans={savedPlans}
            activities={activities}
            vocabulary={vocabulary}
            onOpenTextbookDrawer={() => setIsGlobalTextbookOpen(true)}
            onOpenQuestionPaperModal={() => setIsQuestionPaperOpen(true)}
            onOpenRubricModal={() => setIsRubricOpen(true)}
            onOpenSyllabusPlannerModal={() => setIsSyllabusOpen(true)}
            onSelectLesson={(p) => setSelectedLessonForDetail(p)}
            onSelectActivity={() => {
              setActiveNavTab("more");
            }}
            onSelectWord={() => {
              setActiveNavTab("more");
            }}
            onSelectMaterialForLesson={(curriculum, grade, subject, topic, resources) => {
              setFormData((prev) => ({
                ...prev,
                curriculum,
                grade,
                subject,
                topic,
                resources: resources ? `${prev.resources ? prev.resources + "; " : ""}${resources}` : prev.resources,
              }));
              handleGoToForm();
            }}
          />
        )}

        {/* TAB 5: MORE (Schedule, Activities, Vocabulary, Assessments, Classes, Observations, Favorites, Settings) */}
        {activeNavTab === "more" && (
          <MoreHubScreen
            userProfile={userProfile}
            activities={activities}
            vocabulary={vocabulary}
            assessments={assessments}
            rosters={rosters}
            observations={observations}
            savedPlans={savedPlans}
            notes={notes}
            classes={classes}
            onOpenQuestionPaperModal={() => setIsQuestionPaperOpen(true)}
            onOpenRubricModal={() => setIsRubricOpen(true)}
            onOpenSyllabusPlannerModal={() => setIsSyllabusOpen(true)}
            onOpenBrandModal={() => setIsBrandModalOpen(true)}
            onOpenUpgradeModal={() => setIsUpgradeOpen(true)}
            onOpenRegistrationModal={() => setIsRegistrationOpen(true)}
            onSelectLesson={(p) => setSelectedLessonForDetail(p)}
            onSelectNote={(n) => {
              setNoteToEdit(n);
              setIsQuickNoteOpen(true);
            }}
            onAddActivity={(a) => {
              saveClassroomActivity(a);
              setActivities(getClassroomActivities());
            }}
            onAddWord={(w) => {
              saveVocabularyWord(w);
              setVocabulary(getVocabularyWords());
            }}
          />
        )}
      </main>

      {/* Aasaan Studio Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-5 px-4 sm:px-6">
        <div className="max-w-[1250px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <AasaanLogo
              size="sm"
              showTagline={false}
              interactive={true}
              onClick={() => setIsBrandModalOpen(true)}
            />
            <div className="text-xs text-slate-500">
              <span className="font-semibold text-slate-700">ஆசான் (Aasaan)</span> — The Sovereign Pedagogy Suite for Teachers &amp; Educators.
            </div>
          </div>

          <div className="flex items-center gap-3 text-xs text-slate-600 flex-wrap justify-center">
            <button
              onClick={() => setIsBrandModalOpen(true)}
              className="text-amber-700 font-bold hover:underline flex items-center gap-1"
            >
              <span>ஆசான் மரபு (Aasaan Heritage)</span>
              <Sparkles className="w-3 h-3 text-amber-500" />
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsQuestionPaperOpen(true)}
              className="hover:text-purple-700 font-medium transition"
            >
              Question Papers
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsRubricOpen(true)}
              className="hover:text-emerald-700 font-medium transition"
            >
              CCE Rubrics
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsSyllabusOpen(true)}
              className="hover:text-sky-700 font-medium transition"
            >
              Syllabus Planner
            </button>
            <span className="text-slate-300">•</span>
            <button
              onClick={() => setIsVaultOpen(true)}
              className="hover:text-slate-900 font-medium transition"
            >
              My Vault ({savedPlans.length})
            </button>
            <span className="text-slate-300">•</span>
            <PWAInstallButton
              onOpenAndroidPublish={() => setIsAndroidPublishOpen(true)}
              variant="footer"
            />
          </div>
        </div>
      </footer>

      {/* Floating jump button on mobile when viewing form but plan exists */}
      {plan && activeMobileTab === "form" && showAIGeneratorView && (
        <div className="lg:hidden fixed bottom-16 right-4 z-40 no-print animate-bounce">
          <button
            type="button"
            onClick={handleGoToPlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#263B80] text-white text-xs font-bold shadow-xl border border-slate-700 hover:bg-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-[#F28B70]" />
            <span>View Generated Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* TEACHER COMPANION MODALS */}
      {/* 1. Class Teaching Mode Modal */}
      <ClassTeachingModal
        isOpen={Boolean(selectedClassForTeaching)}
        onClose={() => setSelectedClassForTeaching(null)}
        scheduledClass={selectedClassForTeaching}
        onSaveClass={handleSaveClass}
        onOpenPlan={(planId) => {
          const matched = savedPlans.find((p) => p.id === planId);
          if (matched) setSelectedLessonForDetail(matched);
        }}
        onOpenQuickNote={() => {
          setNoteToEdit(null);
          setIsQuickNoteOpen(true);
        }}
      />

      {/* 2. Quick Note Modal */}
      <QuickNoteModal
        isOpen={isQuickNoteOpen}
        onClose={() => {
          setIsQuickNoteOpen(false);
          setNoteToEdit(null);
        }}
        onSaveNote={handleSaveNote}
        existingNote={noteToEdit}
      />

      {/* 3. 8-Step Guided Lesson Planning Modal */}
      <GuidedLessonModal
        isOpen={isGuidedLessonOpen}
        onClose={() => setIsGuidedLessonOpen(false)}
        onSavePlan={handleSaveGuidedLesson}
      />

      {/* 4. Lesson Plan Detail Modal (Print, Duplicate, Export Word) */}
      <LessonDetailModal
        isOpen={Boolean(selectedLessonForDetail)}
        onClose={() => setSelectedLessonForDetail(null)}
        savedPlan={selectedLessonForDetail}
        onDuplicatePlan={handleDuplicatePlan}
        onDeletePlan={handleDeleteSavedPlan}
        onToggleFavorite={handleToggleFavoritePlan}
      />

      {/* 5. Global Search Everywhere Modal */}
      <GlobalSearchModal
        isOpen={isGlobalSearchOpen}
        onClose={() => setIsGlobalSearchOpen(false)}
        lessons={savedPlans}
        notes={notes}
        activities={activities}
        vocabulary={vocabulary}
        assessments={assessments}
        onSelectLesson={(l) => setSelectedLessonForDetail(l)}
        onSelectNote={(n) => {
          setNoteToEdit(n);
          setIsQuickNoteOpen(true);
        }}
        onSelectActivity={() => {
          setActiveNavTab("more");
        }}
        onSelectWord={() => {
          setActiveNavTab("more");
        }}
      />

      {/* Standard Modals & Drawers */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={() => {
          refreshProStatus();
        }}
      />

      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onSubscriptionSuccess={() => {
          refreshProStatus();
        }}
      />

      <WorksheetModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        worksheet={worksheet}
        isLoading={isGeneratingWorksheet}
      />

      <BlackboardModal
        isOpen={isBlackboardOpen}
        onClose={() => setIsBlackboardOpen(false)}
        blackboard={blackboard}
        isLoading={isGeneratingBlackboard}
      />

      <ScriptModal
        isOpen={isScriptOpen}
        onClose={() => setIsScriptOpen(false)}
        script={script}
        isLoading={isGeneratingScript}
      />

      <QuestionPaperModal
        isOpen={isQuestionPaperOpen}
        onClose={() => setIsQuestionPaperOpen(false)}
        plan={plan}
        formData={formData}
        userProfile={userProfile}
        isPro={isPro}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onSaveToVaultNotification={() => setSavedPlans(getSavedPlans())}
      />

      <RubricModal
        isOpen={isRubricOpen}
        onClose={() => setIsRubricOpen(false)}
        plan={plan}
        formData={formData}
        userProfile={userProfile}
        isPro={isPro}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onSaveToVaultNotification={() => setSavedPlans(getSavedPlans())}
      />

      <SyllabusPlannerModal
        isOpen={isSyllabusOpen}
        onClose={() => setIsSyllabusOpen(false)}
        plan={plan}
        formData={formData}
        userProfile={userProfile}
        isPro={isPro}
        onOpenUpgrade={() => setIsUpgradeOpen(true)}
        onSaveToVaultNotification={() => setSavedPlans(getSavedPlans())}
      />

      <SavedPlansDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeleteSavedPlan}
      />

      <AasaanBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onOpenQuestionPaper={() => setIsQuestionPaperOpen(true)}
        onOpenRubric={() => setIsRubricOpen(true)}
        onOpenSyllabusPlanner={() => setIsSyllabusOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onFocusForm={handleGoToForm}
      />

      <AndroidPublishModal
        isOpen={isAndroidPublishOpen}
        onClose={() => setIsAndroidPublishOpen(false)}
      />

      <TextbookChaptersDrawer
        isOpen={isGlobalTextbookOpen}
        onClose={() => setIsGlobalTextbookOpen(false)}
        currentCurriculum={formData.curriculum}
        currentGrade={formData.grade}
        currentSubject={formData.subject}
        onSelectChapter={(chapter) => {
          setFormData((prev) => ({
            ...prev,
            topic: chapter.title,
            objectives: chapter.suggestedObjectives || prev.objectives,
            resources: chapter.pdfSourceTitle
              ? `${prev.resources ? prev.resources + "; " : ""}Official Textbook (${chapter.pdfSourceTitle})`
              : prev.resources,
          }));
          handleGoToForm();
        }}
      />

      <OfflineIndicator />

      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onStartPlanning={handleGoToForm}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenTextbooks={() => setIsGlobalTextbookOpen(true)}
        onOpenQuestionPapers={() => setIsQuestionPaperOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onStartPlanning={handleGoToForm}
      />

      {/* 5-Tab Mobile-first Bottom Navigation Bar */}
      <BottomNavBar
        activeTab={activeNavTab}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          setShowAIGeneratorView(false);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        savedPlansCount={savedPlans.length}
        hasPlan={Boolean(plan)}
      />
    </div>
  );
}
