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
} from "./types.ts";
import {
  getUserProfile,
  isProUser,
  getProDaysRemaining,
  getSavedPlans,
  savePlanToVault,
  deleteSavedPlan,
} from "./data/storage.ts";
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
  subject: "Mathematics",
  topic: "Linear equations in one variable",
  duration: 40,
  classStrength: "38",
  lessonModel: "5E",
  objectives:
    "Solve linear equations with variables on one side, understand equation balancing, and verify solutions.",
  priorKnowledge:
    "Basic algebraic terms, arithmetic operations with integers, concept of equality.",
  language: "English",
  resources:
    "Blackboard, NCERT textbook Chapter 2, balance scale visual, student practice worksheets.",
  differentiation:
    "Step-by-step worked example cards for support; multi-step word problems for extension.",
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

  // Modals state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [isUpgradeOpen, setIsUpgradeOpen] = useState(false);
  const [isVaultOpen, setIsVaultOpen] = useState(false);
  const [isAndroidPublishOpen, setIsAndroidPublishOpen] = useState(false);
  const [isGlobalTextbookOpen, setIsGlobalTextbookOpen] = useState(false);
  const [isTeacherGuideOpen, setIsTeacherGuideOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [activeNavTab, setActiveNavTab] = useState<AppNavTab>("home");

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

  // Load profile and pro status on mount
  useEffect(() => {
    refreshProStatus();
    setSavedPlans(getSavedPlans());
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

    // If on mobile/tablet, switch to the plan tab immediately so the teacher sees progress
    if (window.innerWidth < 1024) {
      setActiveMobileTab("plan");
    }

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate plan");
      }

      if (data.plan) {
        setPlan(data.plan);
        // Clear cached auxiliary tools for new topic
        setWorksheet(null);
        setBlackboard(null);
        setScript(null);
        setRubric(null);
        setSyllabusPlanner(null);

        // Switch to plan view and scroll into view smoothly
        setActiveMobileTab("plan");
        setTimeout(() => {
          if (outputRef.current) {
            outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
          }
        }, 100);
      } else {
        throw new Error("Invalid response format received from server");
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Error generating lesson plan";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  // Generate Student Worksheet (Pro Feature)
  const handleGenerateWorksheet = async () => {
    if (!plan) return;
    setIsWorksheetOpen(true);
    if (worksheet) return; // Already generated for this plan

    setIsGeneratingWorksheet(true);
    try {
      const res = await fetch("/api/generate-worksheet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          plan,
          formData,
          schoolName: userProfile?.school || "School Model Academy",
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

  // Generate Blackboard Layout (Pro Feature)
  const handleGenerateBlackboard = async () => {
    if (!plan) return;
    setIsBlackboardOpen(true);
    if (blackboard) return; // Already generated for this plan

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

  // Generate Teacher Explanation Script (Pro Feature)
  const handleGenerateScript = async () => {
    if (!plan) return;
    setIsScriptOpen(true);
    if (script) return; // Already generated for this plan

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
    setActiveMobileTab("plan");
    setTimeout(() => {
      if (outputRef.current) {
        outputRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    }, 100);
  };

  // Delete Plan from Vault
  const handleDeleteSavedPlan = (id: string) => {
    deleteSavedPlan(id);
    setSavedPlans(getSavedPlans());
  };

  const handleGoToPlan = () => {
    setActiveMobileTab("plan");
    if (outputRef.current) {
      outputRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleGoToForm = () => {
    setActiveMobileTab("form");
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#faf7f7] flex flex-col antialiased text-[#172033] pb-24 lg:pb-0">
      <Header
        hasPlan={Boolean(plan)}
        onPrint={() => window.print()}
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
      />

      {/* Top Notification Announcement Banner */}
      {!dismissBanner && (
        <div className="no-print bg-gradient-to-r from-slate-900 via-[#101827] to-slate-900 text-white px-4 py-2 border-b border-slate-800 text-xs">
          <div className="max-w-[1250px] mx-auto flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              {isPro ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#d9ad57] flex-shrink-0" />
                  <span>
                    <strong>Aasaan Pro Active (ஆசான் புரோ):</strong> You have {proDaysRemaining} days of full
                    unlimited access to Aasaan Master Engine, Samacheer Kalvi &amp; Board Question Papers, Printable Worksheets, and Word export!
                  </span>
                </>
              ) : (
                <>
                  <Gift className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>
                    <strong>1st Month Free Trial:</strong> Provide your basic details to unlock 30 days
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

      {/* Mobile/Tablet Sticky Section Switcher */}
      <div className="lg:hidden no-print sticky top-0 z-30 bg-white border-b border-slate-200 px-4 py-2.5 shadow-xs">
        <div className="flex items-center gap-2 max-w-md mx-auto bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={handleGoToForm}
            className={`flex-1 py-2 text-xs font-bold rounded-lg transition flex items-center justify-center gap-1.5 ${
              activeMobileTab === "form"
                ? "bg-[#101827] text-white shadow-sm"
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
                ? "bg-[#101827] text-white shadow-sm"
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

      <main className="max-w-[1250px] w-full mx-auto my-4 lg:my-6 px-4 sm:px-6 grid grid-cols-1 lg:grid-cols-[390px_1fr] gap-6 flex-1 items-start">
        {/* Left Column: Lesson Form */}
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

        {/* Right Column: Output / Result */}
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
              <span className="font-semibold text-slate-700">ஆசான் (Aasaan)</span> — The Sovereign Pedagogy Suite for Tamil &amp; Indian Educators.
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
      {plan && activeMobileTab === "form" && (
        <div className="lg:hidden fixed bottom-5 right-4 z-40 no-print animate-bounce">
          <button
            type="button"
            onClick={handleGoToPlan}
            className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-[#101827] text-white text-xs font-bold shadow-xl border border-slate-700 hover:bg-slate-800"
          >
            <CheckCircle2 className="w-4 h-4 text-[#d9ad57]" />
            <span>View Generated Plan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* 1 Month Free Registration Modal */}
      <RegistrationModal
        isOpen={isRegistrationOpen}
        onClose={() => setIsRegistrationOpen(false)}
        onSuccess={(profile) => {
          refreshProStatus();
        }}
      />

      {/* Pro Upgrade & Direct UPI Modal */}
      <UpgradeModal
        isOpen={isUpgradeOpen}
        onClose={() => setIsUpgradeOpen(false)}
        onOpenRegistration={() => setIsRegistrationOpen(true)}
        onSubscriptionSuccess={() => {
          refreshProStatus();
        }}
      />

      {/* Print-Ready Student Worksheet Modal */}
      <WorksheetModal
        isOpen={isWorksheetOpen}
        onClose={() => setIsWorksheetOpen(false)}
        worksheet={worksheet}
        isLoading={isGeneratingWorksheet}
      />

      {/* 3-Panel Blackboard Layout Modal */}
      <BlackboardModal
        isOpen={isBlackboardOpen}
        onClose={() => setIsBlackboardOpen(false)}
        blackboard={blackboard}
        isLoading={isGeneratingBlackboard}
      />

      {/* Classroom Explanation Script & Easy Breakdown Modal */}
      <ScriptModal
        isOpen={isScriptOpen}
        onClose={() => setIsScriptOpen(false)}
        script={script}
        isLoading={isGeneratingScript}
      />

      {/* Board Exam Question Paper & Blueprint Modal (PRO) */}
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

      {/* 4-Level Internal Assessment & Practical Scoring Rubric (20 Marks CCE) Modal */}
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

      {/* 30-Week Academic Syllabus Distribution Planner Modal */}
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

      {/* Saved Plans Vault Drawer */}
      <SavedPlansDrawer
        isOpen={isVaultOpen}
        onClose={() => setIsVaultOpen(false)}
        savedPlans={savedPlans}
        onLoadPlan={handleLoadPlan}
        onDeletePlan={handleDeleteSavedPlan}
      />

      {/* Aasaan Brand Crest & Creed Showcase Modal */}
      <AasaanBrandModal
        isOpen={isBrandModalOpen}
        onClose={() => setIsBrandModalOpen(false)}
        onOpenQuestionPaper={() => setIsQuestionPaperOpen(true)}
        onOpenRubric={() => setIsRubricOpen(true)}
        onOpenSyllabusPlanner={() => setIsSyllabusOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onFocusForm={handleGoToForm}
      />

      {/* Android App & Google Play Store Publishing Modal */}
      <AndroidPublishModal
        isOpen={isAndroidPublishOpen}
        onClose={() => setIsAndroidPublishOpen(false)}
      />

      {/* Global Textbook Syllabus & Chapter Browser Drawer with Official PDFs */}
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

      {/* Offline Classroom Connectivity Indicator */}
      <OfflineIndicator />

      {/* Teacher 7-Step Pedagogical Guide Modal matching Blood Bridge */}
      <TeacherGuideModal
        isOpen={isTeacherGuideOpen}
        onClose={() => setIsTeacherGuideOpen(false)}
        onStartPlanning={handleGoToForm}
      />

      {/* Classroom & System Notifications Modal matching Blood Bridge */}
      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onOpenTextbooks={() => setIsGlobalTextbookOpen(true)}
        onOpenQuestionPapers={() => setIsQuestionPaperOpen(true)}
        onOpenVault={() => setIsVaultOpen(true)}
        onStartPlanning={handleGoToForm}
      />

      {/* Mobile-first Bottom Navigation Bar matching Blood Bridge */}
      <BottomNavBar
        activeTab={activeNavTab}
        onSelectTab={(tab) => {
          setActiveNavTab(tab);
          if (tab === "home") {
            setActiveMobileTab("plan");
            window.scrollTo({ top: 0, behavior: "smooth" });
          } else if (tab === "form") {
            handleGoToForm();
          } else if (tab === "textbooks") {
            setIsGlobalTextbookOpen(true);
          } else if (tab === "vault") {
            setIsVaultOpen(true);
          } else if (tab === "guide") {
            setIsTeacherGuideOpen(true);
          }
        }}
        savedPlansCount={savedPlans.length}
        hasPlan={Boolean(plan)}
      />
    </div>
  );
}
